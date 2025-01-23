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

  return (
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
  );
};