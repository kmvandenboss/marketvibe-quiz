// /src/components/dashboard/QuizSelector.tsx
'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { Quiz } from '@/types/dashboard';

interface QuizSelectorProps {
  quizzes: Quiz[];
  selectedQuizId?: string;
}

export function QuizSelector({ quizzes, selectedQuizId }: QuizSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleQuizChange = (quizId: string) => {
    if (quizId === 'overview') {
      router.push('/dashboard/overview');
    } else {
      router.push(`/dashboard/${quizId}`);
    }
  };

  return (
    <div className="mb-6">
      <select
        value={selectedQuizId || 'overview'}
        onChange={(e) => handleQuizChange(e.target.value)}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      >
        <option value="overview">All Quizzes Overview</option>
        {quizzes.map((quiz) => (
          <option key={quiz.id} value={quiz.id}>
            {quiz.title}
          </option>
        ))}
      </select>
    </div>
  );
}