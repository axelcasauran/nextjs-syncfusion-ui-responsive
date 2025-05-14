'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ArrowUp } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from 'recharts';
import { Badge } from '@reui/ui/badge';
import { Button } from '@reui/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardHeading,
  CardTitle,
  CardToolbar,
} from '@reui/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@reui/ui/chart';
import { Skeleton } from '@reui/ui/skeleton';
import { useDashboard } from './dashboard-context';

export interface IPopularCategory {
  name: string;
  totalSold: number;
}

const PopularCategories = () => {
  const { dateRange } = useDashboard();

  const fetchPopularCategories = async (): Promise<IPopularCategory[]> => {
    const params = new URLSearchParams();
    if (dateRange?.from) params.append('from', dateRange.from.toISOString());
    if (dateRange?.to) params.append('to', dateRange.to.toISOString());

    const response = await fetch(
      `/api/dashboard/popular-categories?${params.toString()}`,
    );
    if (!response.ok) {
      throw new Error('Failed to fetch popular categories');
    }
    const { data } = await response.json();
    return data;
  };

  const { data: rawChartData, isLoading } = useQuery({
    queryKey: ['popularCategories', dateRange],
    queryFn: fetchPopularCategories,
    staleTime: Infinity, // Cache data for 5 minutes
    enabled: !!dateRange, // Only fetch when `dateRange` is defined
  });

  // Assign colors to chartData
  const chartData = useMemo(() => {
    const colors = ['#4f46e5', '#9333ea', '#ec4899', '#f59e0b', '#10b981']; // Example colors
    return rawChartData?.map((item, index) => ({
      ...item,
      fill: colors[index % colors.length], // Cycle through colors if data exceeds the array length
    }));
  }, [rawChartData]);

  const chartConfig = {
    totalSold: {
      label: 'Total Sold',
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border py-0 h-14 space-y-0">
        <CardHeading>
          <CardTitle>Trending Categories</CardTitle>
        </CardHeading>
        <CardToolbar>
          {isLoading ? (
            <Skeleton className="h-6 w-16" />
          ) : (
            <Badge
              className="px-0.5 gap-0.5 py-0.5"
              variant="secondary"
              appearance="outline"
            >
              <ArrowUp className="text-success size-4" /> 5.2%
            </Badge>
          )}
        </CardToolbar>
      </CardHeader>
      <CardContent className="flex flex-col justify-center grow p-8">
        {isLoading ? (
          <Skeleton className="h-[260px] w-full" />
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="vertical"
              margin={{
                right: 20,
              }}
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
                hide
              />
              <XAxis dataKey="totalSold" type="number" hide includeHidden />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Bar dataKey="totalSold" layout="vertical" radius={10}>
                <LabelList
                  dataKey="name"
                  position="insideLeft"
                  offset={14}
                  className="fill-white"
                  fontSize={13}
                  fontWeight={500}
                />
                <LabelList
                  dataKey="totalSold"
                  position="right"
                  offset={8}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="justify-center py-0">
        <Button asChild mode="link" underlined="dashed">
          <Link href="/categories">Manage Categories</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PopularCategories;
