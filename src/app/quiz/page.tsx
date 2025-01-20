// src/app/quiz/page.tsx
'use client';

import { useState, useEffect } from 'react';
import QuizContainer from '@/components/quiz/QuizContainer';
import type { Question } from '@/types/quiz';

// Sample questions matching the database schema with tags and weights
const sampleQuestions: Question[] = [
  {
    id: '1',
    text: 'What is your primary investment goal?',
    type: 'single',
    order: 1,
    options: [
      { id: '1a', text: 'Growth - I want to grow my wealth over time', tags: ['growth_focused', 'appreciation'], weight: 1 },
      { id: '1b', text: 'Income - I want regular returns from my investments', tags: ['income_focused', 'distributions'], weight: 1 },
      { id: '1c', text: 'Preservation - I want to protect my existing wealth', tags: ['conservative', 'low_risk'], weight: 1 },
    ],
  },
  {
    id: '2',
    text: 'How comfortable are you with investment risk?',
    type: 'single',
    order: 2,
    options: [
      { id: '2a', text: 'Very comfortable - I can handle market volatility', tags: ['high_risk', 'growth_focused'], weight: 1 },
      { id: '2b', text: 'Somewhat comfortable - I prefer moderate risks', tags: ['moderate_risk', 'balanced'], weight: 1 },
      { id: '2c', text: 'Not comfortable - I prefer safer investments', tags: ['low_risk', 'conservative'], weight: 1 },
    ],
  },
  {
    id: '3',
    text: 'What is your investment time horizon?',
    type: 'single',
    order: 3,
    options: [
      { id: '3a', text: 'Short-term (Less than 2 years)', tags: ['short_term', 'high_liquidity'], weight: 1 },
      { id: '3b', text: 'Medium-term (2-5 years)', tags: ['medium_term', 'moderate_liquidity'], weight: 1 },
      { id: '3c', text: 'Long-term (5+ years)', tags: ['long_term', 'illiquid_okay'], weight: 1 },
    ],
  },
  {
    id: '4',
    text: 'What is your current investment experience?',
    type: 'single',
    order: 4,
    options: [
      { id: '4a', text: 'Beginner - New to investing', tags: ['beginner', 'conservative'], weight: 1 },
      { id: '4b', text: 'Intermediate - Some investment experience', tags: ['intermediate', 'balanced'], weight: 1 },
      { id: '4c', text: 'Advanced - Experienced investor', tags: ['advanced', 'growth_focused'], weight: 1 },
    ],
  },
  {
    id: '5',
    text: 'How much capital do you plan to invest?',
    type: 'single',
    order: 5,
    options: [
      { id: '5a', text: '$1,000 - $10,000', tags: ['small_cap', 'retail'], weight: 1 },
      { id: '5b', text: '$10,000 - $50,000', tags: ['medium_cap', 'retail'], weight: 1 },
      { id: '5c', text: '$50,000+', tags: ['large_cap', 'accredited'], weight: 1 },
    ],
  },
  {
    id: '6',
    text: 'What is your preferred investment style?',
    type: 'single',
    order: 6,
    options: [
      { id: '6a', text: 'Hands-off - I prefer automated or managed solutions', tags: ['passive', 'managed'], weight: 1 },
      { id: '6b', text: 'Hybrid - I want some control but also guidance', tags: ['hybrid', 'balanced'], weight: 1 },
      { id: '6c', text: 'Active - I want full control over my investments', tags: ['active', 'self_directed'], weight: 1 },
    ],
  }
];

export default function QuizPage() {
  const [questions, setQuestions] = useState<Question[]>(sampleQuestions);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/questions');
      if (!response.ok) throw new Error('Failed to fetch questions');
      
      const data = await response.json();
      setQuestions(data.questions);
    } catch (err) {
      console.error('Error fetching questions:', err);
      // Fallback to sample questions if fetch fails
      setQuestions(sampleQuestions);
      setError('Failed to load questions from server, using sample questions instead');
    } finally {
      setLoading(false);
    }
  };

  const handleQuizComplete = async (answers: Record<string, string>, email: string) => {
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          responses: answers,
          score: calculateScore(answers), // We'll implement this function later
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit quiz');
      }

      const data = await response.json();
      console.log('Quiz submitted successfully:', data);
      
      // You can add success handling here (e.g., show results, redirect, etc.)
    } catch (error) {
      console.error('Error submitting quiz:', error);
      // You can add error handling here (e.g., show error message)
    }
  };

  // For now, return a placeholder score calculation
  const calculateScore = (answers: Record<string, string>) => {
    return Object.keys(answers).reduce((acc, key) => ({
      ...acc,
      [key]: 1,
    }), {});
  };

  if (error) {
    console.warn(error); // We'll implement proper error handling later
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center mb-8">
          Find Your High-Yield Investment Path
        </h1>
        {!loading && (
          <QuizContainer
            questions={questions}
            onComplete={handleQuizComplete}
          />
        )}
      </div>
    </main>
  );
}