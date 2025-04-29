'use client';

import { createContext, ReactNode, useContext, useState } from 'react';
import { DateRange } from 'react-day-picker';

interface IDashboardContext {
  dateRange: { from: Date | undefined; to: Date | undefined };
  setDateRange: (range: DateRange | undefined) => void;
  resetDateRange: () => void;
}

const DashboardContext = createContext<IDashboardContext | undefined>(
  undefined,
);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [dateRange, setDateRangeState] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const setDateRange = (range: DateRange | undefined) => {
    setDateRangeState({
      from: range?.from || undefined,
      to: range?.to || undefined,
    });
  };

  const resetDateRange = () => {
    setDateRangeState({ from: undefined, to: undefined });
  };

  return (
    <DashboardContext.Provider
      value={{ dateRange, setDateRange, resetDateRange }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = (): IDashboardContext => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
