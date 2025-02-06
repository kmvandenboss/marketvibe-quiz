// /src/components/dashboard/QuizOverview.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { QuizOverviewMetrics } from '@/types/dashboard';

export function QuizOverview() {
  const [metrics, setMetrics] = useState<QuizOverviewMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOverviewData() {
      try {
        const response = await fetch('/api/dashboard/overview');
        if (!response.ok) throw new Error('Failed to fetch overview data');
        const data = await response.json();
        setMetrics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchOverviewData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold text-gray-900 mb-8">Quizzes Overview</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {metrics.map((quizMetrics) => (
          <Card key={quizMetrics.quizId}>
            <CardHeader>
              <CardTitle>{quizMetrics.quizTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm text-gray-500">Total Leads</dt>
                  <dd className="text-2xl font-semibold">{quizMetrics.totalLeads}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Completion Rate</dt>
                  <dd className="text-2xl font-semibold">
                    {quizMetrics.completionRate.toFixed(1)}%
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Last Submission</dt>
                  <dd className="text-sm">
                    {quizMetrics.lastSubmission 
                      ? new Date(quizMetrics.lastSubmission).toLocaleDateString()
                      : 'No submissions yet'}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}