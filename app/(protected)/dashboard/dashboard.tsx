'use client';

// import { useEffect, useMemo, useState } from 'react';
// import { endOfMonth, format, startOfMonth } from 'date-fns';
// import { Calendar as CalendarIcon } from 'lucide-react';
// import { DateRange } from 'react-day-picker';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Calendar } from '@/components/ui/calendar';
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from '@/components/ui/popover';
import { Container } from '@/app/components/common/container';
// import {
//   Toolbar,
//   ToolbarActions,
//   ToolbarHeading,
//   ToolbarTitle,
// } from '@/app/components/common/toolbar';
// import { useDashboard } from './dashboard-context';
// import PopularCategories from './popular-categories';
// import RecentOrders from './recent-orders';
// import Statistics from './statistics';

export default function Dashboard() {
  // const { dateRange, setDateRange, resetDateRange } = useDashboard();

  // const dates = useMemo(
  //   () => ({
  //     defaultEndDate: endOfMonth(new Date()),
  //     defaultStartDate: startOfMonth(new Date()),
  //   }),
  //   [],
  // );

  // Initialize date range once on mount
  // useEffect(() => {
  //   if (!dateRange?.from && !dateRange?.to) {
  //     setDateRange({ from: dates.defaultStartDate, to: dates.defaultEndDate });
  //   }
  // }, [dateRange?.from, dateRange?.to, dates, setDateRange]);

  // // Set default date range
  // const [tempDateRange, setTempDateRange] = useState<DateRange | undefined>({
  //   from: dateRange?.from || dates.defaultStartDate,
  //   to: dateRange?.to || dates.defaultEndDate,
  // });
  // const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // const handleDateRangeApply = () => {
  //   setDateRange(tempDateRange);
  //   setIsPopoverOpen(false);
  // };

  // const handleDateRangeReset = () => {
  //   resetDateRange();
  //   setTempDateRange(undefined);
  //   setIsPopoverOpen(false);
  // };

  return (
    <>
      <Container>
        {/* <Toolbar>
          <ToolbarHeading>
            <ToolbarTitle>Dashboard</ToolbarTitle>
            <div className="flex items-center flex-wrap gap-1.5">
              <h3 className="text-muted-foreground text-sm">Latest updates</h3>
              <div className="flex items-center gap-1.5">
                <Badge variant="info" size="sm" appearance="light">
                  10 orders
                </Badge>
                <Badge variant="destructive" size="sm" appearance="light">
                  5 refunds
                </Badge>
              </div>
            </div>
          </ToolbarHeading>
          <ToolbarActions>
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant="outline"
                  mode="input"
                  size="sm"
                  placeholder={!dateRange?.from && !dateRange?.to}
                  className="w-48 md:w-60 truncate"
                >
                  <CalendarIcon className="h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, 'LLL dd, y')} -{' '}
                        {format(dateRange.to, 'LLL dd, y')}
                      </>
                    ) : (
                      format(dateRange.from, 'LLL dd, y')
                    )
                  ) : (
                    <span>Specify dashboard dates</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  autoFocus
                  mode="range"
                  defaultMonth={tempDateRange?.from || dates.defaultStartDate}
                  selected={tempDateRange}
                  onSelect={setTempDateRange}
                  numberOfMonths={2}
                />
                <div className="flex items-center justify-end gap-1.5 border-t border-border p-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDateRangeReset}
                  >
                    Reset
                  </Button>
                  <Button size="sm" onClick={handleDateRangeApply}>
                    Apply
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </ToolbarActions>
        </Toolbar> */}
      </Container>
      <Container>
        {/* <div className="grid gap-5 lg:gap-7">
          <Statistics />
          <div className="grid lg:grid-cols-5 gap-5 lg:gap-7 items-stretch">
            <div className="lg:col-span-2">
              <PopularCategories />
            </div>
            <div className="lg:col-span-3">
              <RecentOrders />
            </div>
          </div>
        </div> */}
      </Container>
    </>
  );
}
