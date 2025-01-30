// src/components/quiz/QuizContainer.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, MotionProps } from 'framer-motion';
import { Question, InvestmentOption } from '@/types/quiz';
import QuestionCard from './QuestionCard';
import { ProgressIndicator } from './ProgressIndicator';
import EmailCaptureForm from './EmailCaptureForm';
import ResultsCard from './ResultsCard';
import LoadingSpinner from './LoadingSpinner';
import Button, { MotionButton } from '@/components/ui/button';
import { calculateQuizScore } from '@/utils/quiz-utils';
import { defaultQuizQuestions } from '@/lib/quiz-data';

interface QuizContainerProps {
  questions?: Question[];
  onComplete?: (answers: Record<string, string>, email: string) => Promise<void>;
  onStart?: () => void;
}

interface QuizContainerState {
  currentQuestionIndex: number;
  answers: Record<string, string>;
  isComplete: boolean;
  isLastQuestionAnswered: boolean;
  calculatedScore?: Record<string, number>; // Added to store score
}

interface SubmissionState {
  isLoading: boolean;
  error: string | null;
  leadId: string | null;
  investmentOptions: InvestmentOption[];
  matchedOptionsCount: number;
}

type MotionDivProps = MotionProps & React.ComponentProps<'div'>;
const MotionDiv = motion.div as React.FC<MotionDivProps>;

export const QuizContainer: React.FC<QuizContainerProps> = ({ 
  questions = defaultQuizQuestions,
  onComplete,
  onStart
}) => {
  const [quizState, setQuizState] = useState<QuizContainerState>({
    currentQuestionIndex: 0,
    answers: {},
    isComplete: false,
    isLastQuestionAnswered: false
  });

  const [submissionState, setSubmissionState] = useState<SubmissionState>({
    isLoading: false,
    error: null,
    leadId: null,
    investmentOptions: [],
    matchedOptionsCount: 0
  });

  const handleAnswer = async (questionId: string, optionId: string) => {
    // If this is the first answer, trigger onStart and track quiz start
    if (Object.keys(quizState.answers).length === 0) {
      if (onStart) {
        onStart();
      }
      
      // Log quiz start
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'QUIZ_START',
          questionIndex: 0
        })
      });
    }
  
    // Track question answer
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'QUESTION_ANSWERED',
        questionId,
        questionIndex: quizState.currentQuestionIndex,
        data: { answer: optionId }
      })
    });
  
    const isLastQuestion = quizState.currentQuestionIndex === questions.length - 1;
    
    // Update answers first
    setQuizState(prev => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: optionId },
      isLastQuestionAnswered: isLastQuestion
    }));
  
    if (!isLastQuestion) {
      // Handle non-last questions with delay
      setTimeout(() => {
        setQuizState(prev => ({
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1
        }));
      }, 400);
    }
  };

  // Use useEffect to handle the last question calculations
  useEffect(() => {
    const calculateOptions = async () => {
      if (!quizState.isLastQuestionAnswered) return;

      try {
        setSubmissionState(prev => ({ ...prev, isLoading: true }));
        
        // Calculate score once and store it
        const calculatedScore = calculateQuizScore(questions, quizState.answers);
        
        const response = await fetch('/api/investment-options', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ score: calculatedScore }),
        });

        if (!response.ok) throw new Error('Failed to fetch investment options');
        const { options } = await response.json();

        // Store the calculated score in state
        setQuizState(prev => ({
          ...prev,
          calculatedScore,
          isComplete: true
        }));

        setSubmissionState(prev => ({
          ...prev,
          isLoading: false,
          matchedOptionsCount: options.length,
          investmentOptions: options,
        }));

      } catch (error) {
        console.error('Error calculating investment options:', error);
        setSubmissionState(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'An unexpected error occurred',
        }));
      }
    };

    calculateOptions();
  }, [quizState.isLastQuestionAnswered, questions]);

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
        isComplete: false,
        isLastQuestionAnswered: false,
        calculatedScore: undefined // Clear the calculated score when going back
      };
    });
  };

  const handleEmailSubmit = async (email: string) => {
    if (!quizState.calculatedScore) {
      // If somehow we don't have a score yet, calculate it now
      const score = calculateQuizScore(questions, quizState.answers);
      setQuizState(prev => ({
        ...prev,
        calculatedScore: score
      }));
    }

    setSubmissionState(prev => ({ ...prev, isLoading: true, error: null }));
    
    if (onComplete) {
      await onComplete(quizState.answers, email);
    }

    try {
      // Ensure we're using the calculated score
      const score = quizState.calculatedScore || calculateQuizScore(questions, quizState.answers);
      
      const submitResponse = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          responses: quizState.answers,
          score
        }),
      });

      if (!submitResponse.ok) {
        throw new Error('Failed to submit quiz response');
      }

      const { leadId } = await submitResponse.json();

      setSubmissionState(prev => ({
        ...prev,
        isLoading: false,
        leadId,
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

      {quizState.currentQuestionIndex === 0 && (
        <MotionDiv
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: 0.5,
            duration: 0.6,
          }}
          className="text-center mb-8 bg-green-50 rounded-lg p-4 border border-green-100 shadow-sm"
        >
          <MotionDiv
            animate={{ 
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
            className="font-semibold text-lg text-green-800"
          >
            Select an answer below to begin 👇
          </MotionDiv>
        </MotionDiv>
      )}

      <AnimatePresence mode="wait">
        <MotionDiv
          key={quizState.currentQuestionIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="relative mt-8"
        >
          {quizState.isLastQuestionAnswered && submissionState.isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <LoadingSpinner size={50} />
              <p className="mt-4 text-gray-600">Analyzing your responses...</p>
            </div>
          ) : !quizState.isComplete ? (
            <QuestionCard
              question={questions[quizState.currentQuestionIndex]}
              onAnswer={handleAnswer}
              selectedOption={quizState.answers[questions[quizState.currentQuestionIndex].id]}
            />
          ) : submissionState.leadId ? (
            <ResultsCard
              leadId={submissionState.leadId}
              options={submissionState.investmentOptions}
              error={submissionState.error || undefined}
            />
          ) : (
            <EmailCaptureForm 
              onSubmit={handleEmailSubmit}
              matchedOptionsCount={submissionState.matchedOptionsCount}
            />
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