// /src/components/dashboard/DashboardMetrics.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { DashboardMetrics as DashboardMetricsType } from '@/types/dashboard';

export interface DashboardMetricsProps {
  metrics: DashboardMetricsType;
}

export const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ metrics }) => {
  const metricsData = [
    {
      title: 'Total Leads',
      value: metrics.totalLeads,
      description: 'Total number of quiz completions'
    },
    {
      title: 'Accredited Investors',
      value: metrics.accreditedLeads,
      description: `${metrics.conversionRate}% of total leads`
    },
    {
      title: 'Link Engagement',
      value: metrics.leadsWithClicks,
      description: `${metrics.clickThroughRate.toFixed(1)}% click-through rate`
    }
  ];

  const calculateDropoff = (current: number, previous: number) => {
    if (previous === 0) return '0%';
    return `${((previous - current) / previous * 100).toFixed(1)}% drop`;
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        {metricsData.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">
                {metric.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quiz Funnel Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium">Quiz Starts</h3>
                <p className="text-2xl font-bold">{metrics.quizStarts}</p>
              </div>
              <div>
                <h3 className="font-medium">Completion Rate</h3>
                <p className="text-2xl font-bold">{metrics.quizCompletionRate.toFixed(1)}%</p>
              </div>
            </div>

            <div className="space-y-2">
              {metrics.questionAnswers.map((count, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="font-medium">Question {index + 1}</span>
                  <div className="text-right">
                    <span className="font-bold">{count}</span>
                    <span className="ml-2 text-sm text-gray-500">
                      {calculateDropoff(count, index === 0 ? metrics.quizStarts : metrics.questionAnswers[index - 1])}
                    </span>
                  </div>
                </div>
              ))}
              
              <div className="flex justify-between items-center">
                <span className="font-medium">Email Submissions</span>
                <div className="text-right">
                  <span className="font-bold">{metrics.emailSubmissions}</span>
                  <span className="ml-2 text-sm text-gray-500">
                    {calculateDropoff(metrics.emailSubmissions, metrics.questionAnswers[metrics.questionAnswers.length - 1])}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};