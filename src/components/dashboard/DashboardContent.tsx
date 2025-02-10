// /src/components/dashboard/DashboardContent.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { DashboardMetrics } from './DashboardMetrics';
import { LeadsTable } from './LeadsTable';
import type { Lead, DashboardMetrics as DashboardMetricsType, QuizOverviewMetrics } from '../../types/dashboard';

interface DashboardContentProps {
  quizId: string;
}

export function DashboardContent({ quizId }: DashboardContentProps) {
  const [metrics, setMetrics] = useState<DashboardMetricsType | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [quizData, setQuizData] = useState<QuizOverviewMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [metricsResponse, leadsResponse, overviewResponse] = await Promise.all([
          fetch(`/api/dashboard/metrics?quizId=${quizId}`),
          fetch(`/api/dashboard/leads?quizId=${quizId}`),
          fetch(`/api/dashboard/overview?quizId=${quizId}`)
        ]);

        if (!metricsResponse.ok || !leadsResponse.ok || !overviewResponse.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const [metricsData, leadsData, overviewData] = await Promise.all([
          metricsResponse.json(),
          leadsResponse.json(),
          overviewResponse.json()
        ]);

        // Find the overview data for this specific quiz
        const thisQuizOverview = Array.isArray(overviewData) 
          ? overviewData.find((quiz: QuizOverviewMetrics) => quiz.quizId === quizId)
          : overviewData;

        setMetrics(metricsData);
        setLeads(leadsData);
        setQuizData(thisQuizOverview || null);
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

  if (!metrics || !quizData) {
    return <div>No data available</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold text-gray-900 mb-8">
        {quizData.quizTitle} - Analytics Dashboard
      </h1>
      
      <DashboardMetrics metrics={metrics} />
      
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Recent Leads</h2>
        <LeadsTable leads={leads} />
      </div>
    </div>
  );
}