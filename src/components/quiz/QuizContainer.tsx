import React, { useState } from 'react';
import { motion, AnimatePresence, MotionProps } from 'framer-motion';
import { Question, QuizState, InvestmentOption } from '@/types/quiz';
import QuestionCard from './QuestionCard';
import { ProgressIndicator } from './ProgressIndicator';
import EmailCaptureForm from './EmailCaptureForm';
import ResultsCard from './ResultsCard';
import LoadingSpinner from './LoadingSpinner';
import Button, { MotionButton } from '@/components/ui/button';
import { calculateQuizScore, findMatchingInvestments } from '@/utils/quiz-utils';

interface QuizContainerProps {
  questions: Question[];
  onComplete?: (answers: Record<string, string>, email: string) => Promise<void>;
}

interface SubmissionState {
  isLoading: boolean;
  error: string | null;
  leadId: string | null;
  investmentOptions: InvestmentOption[];
}

type MotionDivProps = MotionProps & React.ComponentProps<'div'>;
const MotionDiv = motion.div as React.FC<MotionDivProps>;

export const QuizContainer: React.FC<QuizContainerProps> = ({ questions, onComplete }) => {
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    answers: {},
    isComplete: false,
  });

  const [submissionState, setSubmissionState] = useState<SubmissionState>({
    isLoading: false,
    error: null,
    leadId: null,
    investmentOptions: [],
  });

  const handleAnswer = (questionId: string, optionId: string) => {
    // First update the answers immediately
    setQuizState(prev => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: optionId }
    }));
  
    // Then update the question index after a delay
    setTimeout(() => {
      setQuizState(prev => {
        const nextIndex = prev.currentQuestionIndex + 1;
        return {
          ...prev,
          currentQuestionIndex: nextIndex,
          isComplete: nextIndex >= questions.length
        };
      });
    }, 500); // 500ms delay
  };

  const handleBack = () => {
    setQuizState(prev => {
      if (prev.currentQuestionIndex <= 0) return prev;
      
      const prevIndex = prev.currentQuestionIndex - 1;
      const currentQuestionId = questions[prev.currentQuestionIndex].id;
      
      // Remove the current question's answer when going back
      const { [currentQuestionId]: removedAnswer, ...remainingAnswers } = prev.answers;
      
      return {
        ...prev,
        currentQuestionIndex: prevIndex,
        answers: remainingAnswers,
        isComplete: false
      };
    });
  };

  const handleEmailSubmit = async (email: string) => {
    setSubmissionState(prev => ({ ...prev, isLoading: true, error: null }));
    
    if (onComplete) {
      await onComplete(quizState.answers, email);
    }

    try {
      const score = calculateQuizScore(questions, quizState.answers);

      const submitResponse = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          responses: quizState.answers,
          score,
        }),
      });

      if (!submitResponse.ok) {
        throw new Error('Failed to submit quiz response');
      }

      const { leadId } = await submitResponse.json();

      const optionsResponse = await fetch('/api/investment-options', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ score }),
      });

      if (!optionsResponse.ok) {
        throw new Error('Failed to fetch investment options');
      }

      const { options } = await optionsResponse.json();
      const matchedOptions = findMatchingInvestments(score, options);

      setSubmissionState(prev => ({
        ...prev,
        isLoading: false,
        leadId,
        investmentOptions: matchedOptions,
      }));

    } catch (error) {
      console.error('Error in quiz submission:', error);
      setSubmissionState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      }));
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      {!quizState.isComplete && (
        <div className="mb-8">
          <ProgressIndicator 
            current={quizState.currentQuestionIndex} 
            total={questions.length} 
          />
        </div>
      )}

      <AnimatePresence mode="wait">
        <MotionDiv
          key={quizState.currentQuestionIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="relative mt-8"
        >
          {!quizState.isComplete ? (
            <QuestionCard
              question={questions[quizState.currentQuestionIndex]}
              onAnswer={handleAnswer}
              selectedOption={quizState.answers[questions[quizState.currentQuestionIndex].id]}
            />
          ) : submissionState.isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <LoadingSpinner size={50} />
              <p className="mt-4 text-gray-600">Analyzing your responses...</p>
            </div>
          ) : submissionState.leadId ? (
            <ResultsCard
              leadId={submissionState.leadId}
              options={submissionState.investmentOptions}
              error={submissionState.error || undefined}
            />
          ) : (
            <EmailCaptureForm onSubmit={handleEmailSubmit} />
          )}
        </MotionDiv>
      </AnimatePresence>

      {!quizState.isComplete && quizState.currentQuestionIndex > 0 && (
        <MotionButton
          variant="back"
          onClick={handleBack}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4"
        >
          Back
        </MotionButton>
      )}

      {submissionState.error && !submissionState.isLoading && (
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-4 bg-red-50 rounded-lg text-red-800"
        >
          <p>{submissionState.error}</p>
          <Button
            variant="secondary"
            onClick={() => setSubmissionState(prev => ({ ...prev, error: null }))}
            size="sm"
            className="mt-2"
          >
            Try Again
          </Button>
        </MotionDiv>
      )}
    </div>
  );
};

export default QuizContainer;
