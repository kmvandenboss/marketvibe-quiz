'use client';

import React, { useEffect, useState } from 'react';
import { DashboardMetrics } from './DashboardMetrics';
import { LeadsTable } from './LeadsTable';
import type { Lead, DashboardMetrics as DashboardMetricsType } from '../../types/dashboard';

export function DashboardContent() {
  const [metrics, setMetrics] = useState<DashboardMetricsType | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [metricsResponse, leadsResponse] = await Promise.all([
          fetch('/api/dashboard/metrics'),
          fetch('/api/dashboard/leads')
        ]);

        if (!metricsResponse.ok || !leadsResponse.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const [metricsData, leadsData] = await Promise.all([
          metricsResponse.json(),
          leadsResponse.json()
        ]);

        setMetrics(metricsData);
        setLeads(leadsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600">Error: {error}</div>;
  }

  if (!metrics) {
    return <div>No data available</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold text-gray-900 mb-8">Analytics Dashboard</h1>
      
      <DashboardMetrics metrics={metrics} />
      
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Recent Leads</h2>
        <LeadsTable leads={leads} />
      </div>
    </div>
  );
}