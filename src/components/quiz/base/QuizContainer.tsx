// src/components/quiz/base/QuizContainer.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, MotionProps } from 'framer-motion';
import type { Quiz, Question, QuizState, SubmissionState } from '@/lib/quiz/types';
import QuestionCard from './QuestionCard';
import { ProgressIndicator } from './ProgressIndicator';
import EmailCaptureForm from './EmailCaptureForm';
import ResultsCardContainer from './ResultsCardContainer';
import LoadingSpinner from './LoadingSpinner';
import Button, { MotionButton } from '@/components/ui/button';
import { calculateQuizScore } from '@/utils/quiz-utils';

interface QuizContainerProps {
  quiz: Quiz;
  questions: Question[];
  onStart?: () => void;
}

type MotionDivProps = MotionProps & React.ComponentProps<'div'>;
const MotionDiv = motion.div as React.FC<MotionDivProps>;

export const QuizContainer: React.FC<QuizContainerProps> = ({ 
  quiz,
  questions,
  onStart
}) => {
  const [quizState, setQuizState] = useState<QuizState>({
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
    matchedOptionsCount: 0,
    resultsConfig: undefined,
    personalityResult: undefined
  });

  const handleAnswer = (questionId: string, optionId: string) => {
    // If this is the first answer, trigger onStart
    if (Object.keys(quizState.answers).length === 0 && onStart) {
      onStart();
    }
  
    // Track analytics in the background without blocking
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'QUESTION_ANSWERED',
        questionId,
        questionIndex: quizState.currentQuestionIndex,
        quizId: quiz.id,
        data: { 
          answer: optionId,
          quizSlug: quiz.slug
        }
      })
    }).catch(console.error); // Handle any errors silently
  
    const isLastQuestion = quizState.currentQuestionIndex === questions.length - 1;
    
    setQuizState(prev => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: optionId },
      isLastQuestionAnswered: isLastQuestion
    }));
  
    if (!isLastQuestion) {
      setTimeout(() => {
        setQuizState(prev => ({
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1
        }));
      }, 400);
    }
  };

  // Track quiz start separately when first answer is selected
  useEffect(() => {
    if (Object.keys(quizState.answers).length === 1) {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'QUIZ_START',
          questionIndex: 0,
          quizId: quiz.id,
          data: {
            quizSlug: quiz.slug
          }
        })
      }).catch(console.error);
    }
  }, [quizState.answers, quiz.id, quiz.slug]);

  useEffect(() => {
    const calculateOptions = async () => {
      if (!quizState.isLastQuestionAnswered) return;

      try {
        setSubmissionState(prev => ({ ...prev, isLoading: true }));
        
        const calculatedScore = calculateQuizScore(questions, quizState.answers);
        
        const response = await fetch('/api/investment-options', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            score: calculatedScore,
            quizId: quiz.id 
          }),
        });

        if (!response.ok) throw new Error('Failed to fetch investment options');
        const { options } = await response.json();

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

        // Track recommendations generated
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventType: 'RECOMMENDATIONS_GENERATED',
            quizId: quiz.id,
            data: { 
              matchedOptionsCount: options.length,
              quizSlug: quiz.slug
            }
          })
        });

      } catch (error) {
        console.error('Error calculating investment options:', error);
        setSubmissionState(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'An unexpected error occurred',
        }));

        // Track recommendation error
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventType: 'RECOMMENDATIONS_ERROR',
            quizId: quiz.id,
            data: { 
              error: error instanceof Error ? error.message : 'Unknown error',
              quizSlug: quiz.slug
            }
          })
        });
      }
    };

    calculateOptions();
  }, [quizState.isLastQuestionAnswered, questions, quiz.id, quiz.slug]);

  const handleBack = () => {
    if (!quiz.navigationSettings?.allowBack) return;
    
    setQuizState(prev => {
      if (prev.currentQuestionIndex <= 0) return prev;
      
      const prevIndex = prev.currentQuestionIndex - 1;
      const currentQuestionId = questions[prev.currentQuestionIndex].id;
      const { [currentQuestionId]: removedAnswer, ...remainingAnswers } = prev.answers;
      
      return {
        ...prev,
        currentQuestionIndex: prevIndex,
        answers: remainingAnswers,
        isComplete: false,
        isLastQuestionAnswered: false,
        calculatedScore: undefined
      };
    });
  };

  const handleEmailSubmit = async (email: string) => {
    if (!quizState.calculatedScore) {
      const score = calculateQuizScore(questions, quizState.answers);
      setQuizState(prev => ({
        ...prev,
        calculatedScore: score
      }));
    }

    setSubmissionState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const score = quizState.calculatedScore || calculateQuizScore(questions, quizState.answers);
      
      const submitResponse = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          responses: quizState.answers,
          score,
          quizId: quiz.id
        }),
      });

      if (!submitResponse.ok) {
        throw new Error('Failed to submit quiz response');
      }

      const { leadId, resultsConfig, personalityResult } = await submitResponse.json();

      setSubmissionState(prev => ({
        ...prev,
        isLoading: false,
        leadId,
        resultsConfig,
        personalityResult
      }));

      // Track successful email submission
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'EMAIL_SUBMITTED',
          quizId: quiz.id,
          data: { 
            matchedOptionsCount: submissionState.matchedOptionsCount,
            quizSlug: quiz.slug
          }
        })
      });

    } catch (error) {
      console.error('Error in quiz submission:', error);
      setSubmissionState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      }));

      // Track email submission error
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'EMAIL_SUBMISSION_ERROR',
          quizId: quiz.id,
          data: { 
            error: error instanceof Error ? error.message : 'Unknown error',
            quizSlug: quiz.slug
          }
        })
      });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      {!quizState.isComplete && quiz.navigationSettings?.showProgressBar && (
        <div className="mb-8">
          <ProgressIndicator 
            current={quizState.currentQuestionIndex} 
            total={questions.length} 
          />
        </div>
      )}

      {quizState.currentQuestionIndex === 0 && quiz.navigationSettings?.showStartPrompt && (
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
            <ResultsCardContainer
              leadId={submissionState.leadId}
              quizId={quiz.id}
              investmentOptions={submissionState.investmentOptions}
              resultsConfig={submissionState.resultsConfig}
              personalityResult={submissionState.personalityResult}
              isLoading={submissionState.isLoading}
              error={submissionState.error || undefined}
            />
          ) : (
            <EmailCaptureForm 
              onSubmit={handleEmailSubmit}
              matchedOptionsCount={submissionState.matchedOptionsCount}
              emailCaptureMessage={quiz.emailCaptureMessage}
              heading_text={quiz.heading_text}
            />
          )}
        </MotionDiv>
      </AnimatePresence>

      {!quizState.isComplete && 
       quizState.currentQuestionIndex > 0 && 
       quiz.navigationSettings?.allowBack && (
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
