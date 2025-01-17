// src/components/quiz/QuizContainer.tsx
import React, { useState, useEffect } from 'react';
import { motion, MotionProps, AnimatePresence } from 'framer-motion';
import { Question, QuizResponse, UserResponse, QuizResults } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { QuestionCard } from '@/components/quiz/QuestionCard';
import { EmailCapture } from '@/components/quiz/EmailCapture';
import { ProgressIndicator } from '@/components/quiz/ProgressIndicator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useClickTracking } from '@/hooks/useClickTracking';
import { LoadingSpinner } from './LoadingSpinner';
import { feedbackVariants } from '@/components/ui/animations';

interface QuizContainerProps {
  questions: Question[];
  onComplete: (responses: QuizResponse) => Promise<void>;
}

interface MotionDivProps extends MotionProps {
  className?: string;
  children?: React.ReactNode;
  key?: string;
  custom?: number;
  onClick?: (e: React.MouseEvent) => void;
}

const MotionDiv = motion.div as React.FC<MotionDivProps>;

export function QuizContainer({
  questions, 
  onComplete 
}: QuizContainerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<UserResponse[]>([]);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quizResults, setQuizResults] = useState<QuizResults | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [leadId, setLeadId] = useState<string>('');
  const [direction, setDirection] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('Total questions:', questions.length);
    console.log('Questions:', questions);
    console.log('Current step:', currentStep);
  }, [questions, currentStep]);

  const totalSteps = questions.length + 1; // +1 for email step
  const isLastQuestion = currentStep === questions.length;
  const isEmailStep = currentStep === questions.length;

  const { trackClick, isTracking } = useClickTracking({
    leadId,
    onError: (error) => setError(error),
  });

  const handleLinkClick = async (link: string, e: React.MouseEvent) => {
    e.preventDefault();
    await trackClick(link);
  };

  const handleOptionSelect = (questionId: string, optionIds: string[]) => {
    setResponses(prev => {
      const existing = prev.findIndex(r => r.questionId === questionId);
      if (existing !== -1) {
        const updated = [...prev];
        updated[existing] = { questionId, selectedOptionIds: optionIds };
        return updated;
      }
      return [...prev, { questionId, selectedOptionIds: optionIds }];
    });
  };

  const handleQuestionTransitionComplete = () => {
    if (!isEmailStep) {
      setDirection(1);
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setError(null);
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleStartOver = () => {
    setCurrentStep(0);
    setResponses([]);
    setEmail('');
    setName('');
    setError(null);
    setQuizResults(null);
    setQuizCompleted(false);
    setLeadId('');
    setDirection(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setIsLoading(true);

    try {
      const quizResponse: QuizResponse = {
        id: '', // Will be set by server
        email,
        name: name || undefined,
        responses,
        clickedLinks: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quizResponse),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to submit quiz');
      }

      setQuizResults(data.results);
      setLeadId(data.leadId);
      setQuizCompleted(true);
      await onComplete(quizResponse);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      setError('Failed to submit quiz. Please try again.');
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  const renderResults = () => (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Your Recommended Investment Strategies</CardTitle>
          <CardDescription>
            Based on your responses, here are your personalized investment recommendations:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {quizResults?.recommendedInvestments.map((investment, index) => (
              <MotionDiv
                key={investment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 border rounded-lg hover:border-blue-500 transition-colors"
              >
                <h3 className="text-lg font-semibold mb-2">{investment.title}</h3>
                <p className="text-gray-600 mb-4">{investment.description}</p>
                <button
                  onClick={(e) => handleLinkClick(investment.link, e)}
                  disabled={isTracking}
                  className="text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isTracking ? 'Opening...' : 'Learn More →'}
                </button>
              </MotionDiv>
            ))}
            
            <MotionDiv 
              className="mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button onClick={handleStartOver} variant="outline" className="w-full">
                Start New Quiz
              </Button>
            </MotionDiv>
          </div>
        </CardContent>
      </Card>
    </MotionDiv>
  );

  if (isLoading) {
    return <LoadingSpinner variant="skeleton" />;
  }

  if (quizCompleted && quizResults) {
    return renderResults();
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <ProgressIndicator 
          currentStep={currentStep}
          totalSteps={totalSteps}
        />
      </div>

      <AnimatePresence initial={false} mode="wait">
        {error && (
          <MotionDiv
            variants={feedbackVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="mb-4"
          >
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </MotionDiv>
        )}
      </AnimatePresence>

      <div role="form" aria-label="Investment Quiz">
        {isEmailStep ? (
          <EmailCapture
            email={email}
            setEmail={setEmail}
            name={name}
            setName={setName}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        ) : (
          <QuestionCard
            question={questions[currentStep]}
            selectedOptionIds={
              responses.find(r => r.questionId === questions[currentStep].id)
                ?.selectedOptionIds || []
            }
            onOptionSelect={handleOptionSelect}
            onAnimationComplete={handleQuestionTransitionComplete}
            direction={direction}
          />
        )}

        <MotionDiv 
          className="mt-8 flex justify-start"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            onClick={handleBack}
            disabled={currentStep === 0}
            variant="secondary"
            type="button"
            aria-label="Go back to previous question"
          >
            Back
          </Button>
        </MotionDiv>
      </div>
    </div>
  );
}
