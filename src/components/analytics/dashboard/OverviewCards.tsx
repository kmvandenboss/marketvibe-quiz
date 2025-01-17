'use client';

// src/components/analytics/dashboard/OverviewCards.tsx
interface OverviewMetric {
    title: string;
    value: number;
    delta: number;
    unit?: string;
  }
  
  interface OverviewCardsProps {
    metrics: {
      totalStarts: number;
      startsDelta: number;
      totalCompletions: number;
      completionsDelta: number;
      conversionRate: number;
      conversionDelta: number;
      avgCompletionTime: number;
      timeDelta: number;
    };
  }
  
  export function OverviewCards({ metrics }: OverviewCardsProps) {
    const overviewMetrics: OverviewMetric[] = [
      {
        title: "Total Starts",
        value: metrics.totalStarts,
        delta: metrics.startsDelta,
      },
      {
        title: "Completions",
        value: metrics.totalCompletions,
        delta: metrics.completionsDelta,
      },
      {
        title: "Conversion Rate",
        value: metrics.conversionRate,
        delta: metrics.conversionDelta,
        unit: "%",
      },
      {
        title: "Avg. Completion Time",
        value: metrics.avgCompletionTime,
        delta: metrics.timeDelta,
        unit: "s",
      },
    ];
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewMetrics.map((metric, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-sm font-medium text-gray-600 mb-2">
              {metric.title}
            </div>
            <div className="text-2xl font-bold">
              {metric.value}
              {metric.unit}
            </div>
            <p className="text-xs text-gray-500">
              {metric.delta > 0 ? "+" : ""}
              {metric.delta}
              {metric.unit} from previous period
            </p>
          </div>
        ))}
      </div>
    );
  }