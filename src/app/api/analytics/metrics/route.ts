// src/app/api/analytics/metrics/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../db';
import { analyticsMetrics } from '../../../../../db/schema';
import { and, gte, eq, sql } from 'drizzle-orm';
import { subDays } from 'date-fns';

type MetricTotals = {
  starts: number;
  completions: number;
  conversionRate: number | null;
  avgTime: number | null;
};

interface ProcessedMetrics {
  overview: {
    totalStarts: number;
    startsDelta: number;
    totalCompletions: number;
    completionsDelta: number;
    conversionRate: number;
    conversionDelta: number;
    avgCompletionTime: number;
    timeDelta: number;
  };
  trends: Array<{
    date: string;
    starts: number;
    completions: number;
    conversionRate: number;
  }>;
  dropoffs: Array<{
    step: string;
    count: number;
  }>;
  funnel: Array<{
    stage: string;
    value: number;
  }>;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const range = searchParams.get('range') || '7d';
    
    const daysToSubtract = range === '90d' ? 90 : range === '30d' ? 30 : 7;
    const startDate = subDays(new Date(), daysToSubtract);
    
    // Get metrics for the current period
    const metrics = await db
      .select()
      .from(analyticsMetrics)
      .where(
        gte(
          analyticsMetrics.metricDate,
          sql`${startDate}`
        )
      )
      .orderBy(analyticsMetrics.metricDate);

    // Calculate previous period metrics for comparison
    const previousStartDate = subDays(startDate, daysToSubtract);
    const previousMetrics = await db
      .select()
      .from(analyticsMetrics)
      .where(
        and(
          gte(analyticsMetrics.metricDate, sql`${previousStartDate}`),
          gte(sql`${startDate}`, analyticsMetrics.metricDate)
        )
      );

    // Calculate trends data
    const trends = metrics.map(metric => ({
      date: metric.metricDate.toISOString().split('T')[0],
      starts: metric.quizStarts,
      completions: metric.quizCompletions,
      conversionRate: metric.conversionRate ?? 0
    }));

    // Calculate totals for current period
    const currentTotals: MetricTotals = {
      starts: 0,
      completions: 0,
      conversionRate: 0,
      avgTime: 0
    };

    metrics.forEach(metric => {
      currentTotals.starts += metric.quizStarts;
      currentTotals.completions += metric.quizCompletions;
      currentTotals.conversionRate = metric.conversionRate;
      currentTotals.avgTime = metric.averageCompletionTime;
    });

    // Calculate totals for previous period
    const previousTotals: MetricTotals = {
      starts: 0,
      completions: 0,
      conversionRate: 0,
      avgTime: 0
    };

    previousMetrics.forEach(metric => {
      previousTotals.starts += metric.quizStarts;
      previousTotals.completions += metric.quizCompletions;
      previousTotals.conversionRate = metric.conversionRate;
      previousTotals.avgTime = metric.averageCompletionTime;
    });

    // Calculate deltas
    const calculateDelta = (current: number, previous: number): number => 
      previous === 0 ? 0 : Math.round(((current - previous) / previous) * 100);

    // Get drop-off data from the most recent metric
    const lastMetric = metrics[metrics.length - 1];
    const dropoffs = lastMetric?.dropOffCounts 
      ? Object.entries(lastMetric.dropOffCounts).map(([step, count]) => ({
          step: `Step ${step}`,
          count: count as number
        }))
      : [];

    // Sort dropoffs by step number
    dropoffs.sort((a, b) => {
      const stepA = parseInt(a.step.split(' ')[1]);
      const stepB = parseInt(b.step.split(' ')[1]);
      return stepA - stepB;
    });

    // Prepare conversion funnel data
    const funnel = [
      { stage: 'Quiz Starts', value: currentTotals.starts },
      { stage: 'Email Submitted', value: metrics.reduce((sum, m) => sum + m.emailSubmissions, 0) },
      { stage: 'Quiz Completed', value: currentTotals.completions },
      { stage: 'Links Clicked', value: metrics.reduce((sum, m) => sum + m.linkClicks, 0) }
    ];

    const processedMetrics: ProcessedMetrics = {
      overview: {
        totalStarts: currentTotals.starts,
        startsDelta: calculateDelta(currentTotals.starts, previousTotals.starts),
        totalCompletions: currentTotals.completions,
        completionsDelta: calculateDelta(currentTotals.completions, previousTotals.completions),
        conversionRate: currentTotals.conversionRate ?? 0,
        conversionDelta: calculateDelta(
          currentTotals.conversionRate ?? 0, 
          previousTotals.conversionRate ?? 0
        ),
        avgCompletionTime: currentTotals.avgTime ?? 0,
        timeDelta: (currentTotals.avgTime ?? 0) - (previousTotals.avgTime ?? 0)
      },
      trends,
      dropoffs,
      funnel
    };

    return NextResponse.json(processedMetrics);
  } catch (error) {
    console.error('Error fetching analytics metrics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}