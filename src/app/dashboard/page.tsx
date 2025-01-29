// /src/app/dashboard/page.tsx
import { getDashboardMetrics, getLeadsList } from '../../db/queries';
import { DashboardMetrics } from '../../components/dashboard/DashboardMetrics';
import { LeadsTable } from '../../components/dashboard/LeadsTable';
import type { Lead, DashboardMetrics as DashboardMetricsType } from '../../types/dashboard';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardPage() {
  const metrics: DashboardMetricsType = await getDashboardMetrics();
  const leads: Lead[] = await getLeadsList();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-8">Analytics Dashboard</h1>
        
        <DashboardMetrics metrics={metrics} />
        
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Recent Leads</h2>
          <LeadsTable leads={leads} />
        </div>
      </div>
    </div>
  );
}