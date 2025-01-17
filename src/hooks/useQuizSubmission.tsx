// src/hooks/useQuizSubmission.tsx
import { useState } from 'react';
import { QuizResponse, QuizResults } from '@/types/quiz';

interface UseQuizSubmissionReturn {
  isLoading: boolean;
  error: string | null;
  results: QuizResults | null;
  leadId: string | null;
  submitQuiz: (data: QuizResponse) => Promise<void>;
  trackLinkClick: (leadId: string, link: string) => Promise<void>;
}

export function useQuizSubmission(): UseQuizSubmissionReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<QuizResults | null>(null);
  const [leadId, setLeadId] = useState<string | null>(null);

  const submitQuiz = async (data: QuizResponse) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit quiz');
      }

      const result = await response.json();
      setResults(result.score);
      setLeadId(result.leadId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const trackLinkClick = async (leadId: string, link: string) => {
    try {
      const response = await fetch('/api/track-click', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ leadId, link }),
      });

      if (!response.ok) {
        throw new Error('Failed to track link click');
      }
    } catch (err) {
      console.error('Error tracking link click:', err);
      // Don't throw - we don't want to prevent the user from visiting the link
    }
  };

  return {
    isLoading,
    error,
    results,
    leadId,
    submitQuiz,
    trackLinkClick,
  };
}