'use client';
// src/components/analytics/dashboard/index.tsx
import { useState, useEffect } from 'react';
import { OverviewCards } from './OverviewCards';
import { TrendsChart } from './TrendsChart';
import { DropoffChart } from './DropoffChart';
import { ConversionChart } from './ConversionChart';

interface AnalyticsMetrics {
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

export function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState('7d');
  const [activeTab, setActiveTab] = useState('trends');

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch(`/api/analytics/metrics?range=${dateRange}`);
        const data = await response.json();
        if (response.ok) {
          setMetrics(data);
        } else {
          throw new Error(data.error);
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [dateRange]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-200 rounded bg-red-50 text-red-600">
        Error: {error}
      </div>
    );
  }

  if (!metrics) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-2 border rounded-md bg-white"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </select>
      </div>

      <OverviewCards metrics={metrics.overview} />

      <div className="w-full">
        <div className="flex space-x-4 mb-4 border-b">
          <button
            className={`px-4 py-2 ${activeTab === 'trends' ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab('trends')}
          >
            Trends
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'dropoffs' ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab('dropoffs')}
          >
            Drop-offs
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'conversion' ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab('conversion')}
          >
            Conversion
          </button>
        </div>

        <div className="mt-4">
          {activeTab === 'trends' && <TrendsChart data={metrics.trends} />}
          {activeTab === 'dropoffs' && <DropoffChart data={metrics.dropoffs} />}
          {activeTab === 'conversion' && <ConversionChart data={metrics.funnel} />}
        </div>
      </div>
    </div>
  );
}