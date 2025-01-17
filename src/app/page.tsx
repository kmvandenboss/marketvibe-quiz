// src/app/page.tsx
'use client';

import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { Question, QuizResponse } from '@/types/quiz';
import { LoadingSpinner } from '@/components/quiz/LoadingSpinner';

const QuizContainer = dynamic(() => import('../../components/quiz/QuizContainer'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/api/questions');
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch questions');
        }

        setQuestions(data.questions);
      } catch (error) {
        console.error('Error fetching questions:', error);
        setError('Failed to load quiz questions. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleQuizComplete = async (responses: QuizResponse) => {
    console.log('Quiz completed:', responses);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          Find Your High-Yield Investment Path
        </h1>
        <QuizContainer 
          questions={questions} 
          onComplete={handleQuizComplete} 
        />
      </div>
    </main>
  );
}
