'use client';

import Dashboard from '@user-management-app/dashboard/dashboard';
import { DashboardProvider } from '@user-management-app/dashboard/dashboard-context';

export default function HomePage() {
  return (
    <DashboardProvider>
      <Dashboard />
    </DashboardProvider>
  );
}
