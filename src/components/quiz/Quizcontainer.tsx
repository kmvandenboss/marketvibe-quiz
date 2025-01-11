// src/components/quiz/QuizContainer.tsx
import React, { useState } from 'react';
import { Question, QuizResponse, UserResponse } from '@/types/quiz';
import { Progress } from '@/components/ui/progress';

interface QuizContainerProps {
  questions: Question[];
  onComplete: (responses: QuizResponse) => Promise<void>;
}

export default function QuizContainer({ 
  questions, 
  onComplete 
}: QuizContainerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<UserResponse[]>([]);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const progress = ((currentStep) / (questions.length + 1)) * 100;
  const isLastQuestion = currentStep === questions.length - 1;
  const isEmailStep = currentStep === questions.length;

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

  const canProceed = () => {
    if (isEmailStep) return true;
    const currentResponse = responses.find(
      r => r.questionId === questions[currentStep].id
    );
    return !!currentResponse && currentResponse.selectedOptionIds.length > 0;
  };

  const handleNext = () => {
    if (currentStep < questions.length && !canProceed()) {
      setError('Please select an option to continue');
      return;
    }
    setError(null);
    if (currentStep < questions.length + 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setError(null);
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setError(null);

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

      await onComplete(quizResponse);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      setError('Failed to submit quiz. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderEmailStep = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Enter your email to see results"
        />
      </div>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name (Optional)
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Your name"
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting || !email}
        className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isSubmitting ? 'Submitting...' : 'Get My Results'}
      </button>
    </form>
  );

  const renderQuestion = () => {
    const question = questions[currentStep];
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{question.text}</h2>
        <div className="space-y-2">
          {question.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleOptionSelect(question.id, [option.id])}
              className={`w-full p-4 text-left border rounded-lg transition-colors ${
                responses.some(r => 
                  r.questionId === question.id && 
                  r.selectedOptionIds.includes(option.id)
                )
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-500'
              }`}
            >
              {option.text}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-gray-500 mt-2">
          Question {currentStep + 1} of {questions.length + 1}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {isEmailStep ? renderEmailStep() : renderQuestion()}

      <div className="mt-8 flex justify-between">
        <button
          onClick={handleBack}
          disabled={currentStep === 0}
          className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
        >
          Back
        </button>
        {!isEmailStep && (
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLastQuestion ? 'Continue to Results' : 'Next'}
          </button>
        )}
      </div>
    </div>
  );
}