// 'use client';

// import * as React from 'react';
// import { formatMoney } from '@i18n/format';
// import { useQuery } from '@tanstack/react-query';
// import {
//   ArrowDown,
//   ArrowUp,
//   DollarSign,
//   ShoppingCart,
//   User,
// } from 'lucide-react';
// import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardHeading,
//   CardTitle,
//   CardToolbar,
// } from '@reui/ui/card';
// import {
//   ChartConfig,
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from '@reui/ui/chart';
// import { Skeleton } from '@reui/ui/skeleton';
// // import { DashboardStatistics } from '@/app/src/models/custom';
// import { useDashboard } from './dashboard-context';

// export default function Statistics() {
//   const { dateRange } = useDashboard();

//   // Fetch statistics
//   const fetchStatistics = async (): Promise<DashboardStatistics> => {
//     const params = new URLSearchParams();
//     if (dateRange?.from) params.append('from', dateRange.from.toISOString());
//     if (dateRange?.to) params.append('to', dateRange.to.toISOString());

//     const response = await fetch(
//       `/api/dashboard/statistics?${params.toString()}`,
//     );
//     if (!response.ok) {
//       throw new Error('Failed to fetch statistics');
//     }
//     return response.json();
//   };

//   const { data: statistics, isLoading } = useQuery({
//     queryKey: ['dashboardStatistics', dateRange],
//     queryFn: fetchStatistics,
//     staleTime: Infinity, // Cache data for 5 minutes
//     enabled: !!dateRange, // Only fetch when `dateRange` is defined
//   });

//   // Chart configuration
//   const chartConfig = {
//     total: {
//       label: 'Sales',
//       color: 'hsl(var(--success))',
//     },
//     count: {
//       label: 'Orders',
//       color: 'hsl(var(--danger))',
//     },
//   } satisfies ChartConfig;

//   // State for active chart
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const [activeChart, setActiveChart] =
//     React.useState<keyof typeof chartConfig>('total');

//   // Format sales data for the chart
//   const salesChartData = React.useMemo(
//     () =>
//       statistics?.sales?.map((sale) => ({
//         date: new Date(sale.date).toISOString(),
//         total: parseFloat(sale.total),
//         count: parseInt(sale.count, 10),
//       })) || [],
//     [statistics],
//   );

//   // Static items
//   const items = React.useMemo(
//     () => [
//       {
//         icon: DollarSign,
//         iconColor: 'text-success',
//         title: 'Revenue',
//         increment: '15%',
//         number: formatMoney(statistics?.revenue || 0),
//         skeleton: <Skeleton className="h-8 w-36" />,
//       },
//       {
//         icon: ShoppingCart,
//         iconColor: 'text-success',
//         title: 'Orders',
//         increment: '10%',
//         number: statistics?.orders || 0,
//         skeleton: <Skeleton className="h-8 w-20" />,
//       },
//       {
//         icon: User,
//         iconColor: 'text-success',
//         title: 'Customers',
//         decrement: '23%',
//         number: statistics?.customers || 0,
//         skeleton: <Skeleton className="h-8 w-20" />,
//       },
//     ],
//     [statistics],
//   );

//   return (
//     <Card>
//       <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 md:flex-row">
//         <CardHeading className="flex flex-1 flex-col justify-center gap-1 px-5 py-3">
//           <CardTitle>Store Statistics</CardTitle>
//           <CardDescription className="flex items-center gap-2.5">
//             Latest updates
//           </CardDescription>
//         </CardHeading>
//         <CardToolbar className="flex-col md:flex-row items-stretch justfify-start">
//           {items.map((item, index) => (
//             <div
//               key={index}
//               className="flex flex-col justify-center gap-1.5 border-t px-5 py-3 md:px-8 md:py-4 md:even:border-s data-[active=true]:bg-muted/50 md:border-s md:border-t-0"
//             >
//               <div className="text-2sm text-muted-foreground">{item.title}</div>
//               <div className="inline-flex items-center gap-1.5">
//                 {isLoading ? (
//                   item.skeleton
//                 ) : (
//                   <>
//                     <div className="text-2xl font-semibold text-foreground">
//                       {item.number}
//                     </div>
//                     {item.increment && (
//                       <span className="text-2sm inline-flex gap-1 text-success">
//                         <ArrowUp className="size-4" /> {item.increment}
//                       </span>
//                     )}
//                     {item.decrement && (
//                       <span className="text-2sm inline-flex gap-1 text-destructive">
//                         <ArrowDown className="size-4" /> {item.decrement}
//                       </span>
//                     )}
//                   </>
//                 )}
//               </div>
//             </div>
//           ))}
//         </CardToolbar>
//       </CardHeader>
//       <CardContent className="px-2 sm:p-6 pt-10">
//         {isLoading ? (
//           <Skeleton className="h-[300px] w-full" />
//         ) : (
//           <ChartContainer
//             config={chartConfig}
//             className="aspect-auto h-[300px] w-full"
//           >
//             <LineChart
//               data={salesChartData}
//               margin={{
//                 left: 12,
//                 right: 12,
//               }}
//             >
//               <CartesianGrid
//                 stroke="hsl(var(--border))"
//                 strokeDasharray="5 5"
//                 vertical={true}
//               />
//               <XAxis
//                 dataKey="date"
//                 tickLine={false}
//                 axisLine={false}
//                 tickMargin={8}
//                 minTickGap={32}
//                 interval={1}
//                 tickFormatter={(value) =>
//                   new Date(value).toLocaleDateString('en-US', {
//                     month: 'short',
//                     day: 'numeric',
//                   })
//                 }
//               />
//               <YAxis
//                 hide
//                 interval={0}
//                 tickFormatter={(value) =>
//                   activeChart === 'total'
//                     ? formatMoney(value)
//                     : value.toString()
//                 }
//               />
//               <ChartTooltip
//                 content={
//                   <ChartTooltipContent
//                     className="w-[140px] p-0"
//                     nameKey={activeChart}
//                     formatter={(value, name, item) => {
//                       const payload = item.payload || {};
//                       const total = payload.total ?? 0;
//                       const count = payload.count ?? 0;

//                       return (
//                         <div className="p-2.5 border-t border-border w-full space-y-1.5 text-xs text-muted-foreground ">
//                           <div className="flex items-center text-muted-foreground gap-1.5">
//                             <span className="grow font-medium">Orders:</span>
//                             <span className="text-foreground font-semibold">
//                               {count}
//                             </span>
//                           </div>
//                           <div className="flex items-center gap-1.5">
//                             <span className="grow font-medium">Total:</span>
//                             <span className="text-foreground font-semibold">
//                               {formatMoney(total)}
//                             </span>
//                           </div>
//                         </div>
//                       );
//                     }}
//                     labelFormatter={(value) => {
//                       return (
//                         <div className="px-2.5 pt-2.5 font-medium text-muted-foreground text-xs">
//                           {new Date(value).toLocaleDateString('en-US', {
//                             month: 'short',
//                             day: 'numeric',
//                             year: 'numeric',
//                           })}
//                         </div>
//                       );
//                     }}
//                   />
//                 }
//               />
//               <Line
//                 dataKey={activeChart}
//                 type="monotone"
//                 stroke={chartConfig[activeChart].color}
//                 strokeWidth={2}
//                 dot={false}
//               />
//             </LineChart>
//           </ChartContainer>
//         )}
//       </CardContent>
//     </Card>
//   );
// }
