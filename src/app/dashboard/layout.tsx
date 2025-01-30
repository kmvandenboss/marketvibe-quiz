import React from 'react';
import { DashboardNav } from '@/components/dashboard/DashboardNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      <main className="py-8">
        {children}
      </main>
    </div>
  );
}