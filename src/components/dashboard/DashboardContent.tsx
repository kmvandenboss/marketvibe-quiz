// /src/components/dashboard/DashboardContent.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { DashboardMetrics } from './DashboardMetrics';
import { LeadsTable } from './LeadsTable';
import type { Lead, DashboardMetrics as DashboardMetricsType, Quiz } from '../../types/dashboard';

interface DashboardContentProps {
  quizId: string;
}

export function DashboardContent({ quizId }: DashboardContentProps) {
  const [metrics, setMetrics] = useState<DashboardMetricsType | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [metricsResponse, leadsResponse, quizResponse] = await Promise.all([
          fetch(`/api/dashboard/metrics?quizId=${quizId}`),
          fetch(`/api/dashboard/leads?quizId=${quizId}`),
          fetch(`/api/quizzes/${quizId}`)
        ]);

        if (!metricsResponse.ok || !leadsResponse.ok || !quizResponse.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const [metricsData, leadsData, quizData] = await Promise.all([
          metricsResponse.json(),
          leadsResponse.json(),
          quizResponse.json()
        ]);

        setMetrics(metricsData);
        setLeads(leadsData);
        setQuiz(quizData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [quizId]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600">Error: {error}</div>;
  }

  if (!metrics || !quiz) {
    return <div>No data available</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold text-gray-900 mb-8">
        {quiz.title} - Analytics Dashboard
      </h1>
      
      <DashboardMetrics metrics={metrics} />
      
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Recent Leads</h2>
        <LeadsTable leads={leads} />
      </div>
    </div>
  );
}