'use client';

import Dashboard from './dashboard/dashboard';
import { DashboardProvider } from './dashboard/dashboard-context';

export default function HomePage() {
  return (
    <DashboardProvider>
      <Dashboard />
    </DashboardProvider>
  );
}
