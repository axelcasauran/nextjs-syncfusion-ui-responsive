'use client';

import { useMemo, useState } from 'react';
import { formatDateTime } from '@/i18n/format';
import { useQuery } from '@tanstack/react-query';
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { CalendarIcon, ChevronDown, ChevronUp, Search, X } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardFooter, CardHeader, CardTable } from '@/components/ui/card';
import {
  DataGrid,
  DataGridApiFetchParams,
  DataGridApiResponse,
} from '@/components/ui/data-grid';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import { DataGridTable } from '@/components/ui/data-grid-table';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { SystemNotification } from '@/app/models/system';
import { NotificationActionsCell } from './notification-actions-cell';

const NotificationList = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'createdAt', desc: true },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRangeFilter, setDateRangeFilter] = useState<
    DateRange | undefined
  >();

  // Fetch users from the server API
  const fetchOrders = async ({
    pageIndex,
    pageSize,
    sorting,
    searchQuery,
    dateRangeFilter,
  }: DataGridApiFetchParams & {
    dateRangeFilter: DateRange | undefined;
  }): Promise<DataGridApiResponse<SystemNotification>> => {
    const sortField = sorting?.[0]?.id || '';
    const sortDirection = sorting?.[0]?.desc ? 'desc' : 'asc';

    const params = new URLSearchParams({
      page: String(pageIndex + 1),
      limit: String(pageSize),
      ...(sortField ? { sort: sortField, dir: sortDirection } : {}),
      ...(searchQuery ? { query: searchQuery } : {}),
      ...(dateRangeFilter?.from
        ? { createdAtFrom: dateRangeFilter.from.toISOString() }
        : {}),
      ...(dateRangeFilter?.to
        ? { createdAtTo: dateRangeFilter.to.toISOString() }
        : {}),
    });

    const response = await fetch(
      `/api/account/notifications/?${params.toString()}`,
    );

    if (!response.ok) {
      throw new Error(
        'Oops! Something didn’t go as planned. Please try again in a moment.',
      );
    }

    return response.json();
  };

  // Users query
  const { data, isLoading } = useQuery({
    queryKey: [
      'account-notification',
      pagination,
      sorting,
      searchQuery,
      dateRangeFilter,
    ],
    queryFn: () =>
      fetchOrders({
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        sorting,
        searchQuery,
        dateRangeFilter,
      }),
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60, // 60 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });

  const handleDateRangeApply = (range: DateRange | undefined) => {
    setDateRangeFilter(range);
    setPagination({ ...pagination, pageIndex: 0 });
  };

  const handleDateRangeReset = () => {
    setDateRangeFilter(undefined);
    setPagination({ ...pagination, pageIndex: 0 });
  };

  const DataGridToolbar = () => {
    const [inputValue, setInputValue] = useState(searchQuery);
    const [dateRange, setDateRange] = useState<DateRange | undefined>(
      dateRangeFilter,
    );

    const handleSearch = () => {
      setSearchQuery(inputValue);
      setPagination({ ...pagination, pageIndex: 0 });
    };

    return (
      <CardHeader className="py-3">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Search notifications"
              value={inputValue}
              size="sm"
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              disabled={isLoading}
              className="ps-9 w-64"
            />
            {searchQuery.length > 0 && (
              <Button
                mode="icon"
                variant="dim"
                className="absolute end-1.5 top-1/2 -translate-y-1/2 h-6 w-6"
                onClick={() => setSearchQuery('')}
              >
                <X />
              </Button>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant="outline"
                size="sm"
                className={cn(
                  'w-60 justify-start text-left font-normal relative',
                  !dateRange && 'text-muted-foreground',
                )}
              >
                <CalendarIcon className="me-2 h-4 w-4" />
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
                  <span>Filter by date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                showOutsideDays={true}
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
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
                <Button
                  size="sm"
                  onClick={() => handleDateRangeApply(dateRange)}
                >
                  Apply
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
    );
  };

  const columns = useMemo<ColumnDef<SystemNotification>[]>(
    () => [
      {
        id: 'id',
        header: () => null,
        cell: ({ row }) => {
          return row.getCanExpand() ? (
            <Button
              {...{
                className: 'size-5 text-muted-foreground',
                onClick: row.getToggleExpandedHandler(),
                mode: 'icon',
                variant: 'dim',
              }}
            >
              {row.getIsExpanded() ? <ChevronUp /> : <ChevronDown />}
            </Button>
          ) : null;
        },
        size: 5,
        meta: {
          headerClassName: 'pe-2',
          expandedContent: (row) => (
            <div className="ms-14 py-4 text-muted-foreground text-sm">
              {row.message}
            </div>
          ),
        },
        enableSorting: false,
        enableResizing: false,
      },
      {
        accessorKey: 'subject',
        header: ({ column }) => (
          <DataGridColumnHeader title="Subject" column={column} />
        ),
        cell: ({ row }) => {
          const subject = row.original.subject as string;

          return <span>{subject}</span>;
        },
        size: 250,
        meta: {
          headerTitle: 'Subject',
          skeleton: <Skeleton className="w-14 h-7" />,
        },
        enableSorting: true,
        enableHiding: false,
      },
      {
        accessorKey: 'entityType',
        header: ({ column }) => (
          <DataGridColumnHeader title="Entity" column={column} />
        ),
        cell: ({ row }) => {
          const entityType = row.original.entityType as string;

          return (
            <Badge variant="secondary" appearance="outline">
              {entityType}
            </Badge>
          );
        },
        size: 150,
        meta: {
          headerTitle: 'Entity',
          skeleton: <Skeleton className="w-14 h-7" />,
        },
        enableSorting: true,
        enableHiding: false,
      },
      {
        accessorKey: 'createdAt',
        header: ({ column }) => (
          <DataGridColumnHeader title="Timestamp" column={column} />
        ),
        cell: (info) => formatDateTime(new Date(info.getValue() as string)),
        size: 150,
        meta: {
          headerTitle: 'Timestamp',
          skeleton: <Skeleton className="w-20 h-7" />,
        },
        enableSorting: true,
        enableHiding: false,
      },
      {
        id: 'actions',
        size: 55,
        header: '',
        cell: ({ row }) => <NotificationActionsCell row={row} />,
        enableSorting: false,
        enableResizing: false,
        meta: {
          headerClassName: 'px-0',
          skeleton: <Skeleton className="size-5" />,
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    columns,
    data: data?.data || [],
    pageCount: Math.ceil((data?.pagination.total || 0) / pagination.pageSize),
    getRowId: (row: SystemNotification) => row.id,
    getRowCanExpand: (row) => Boolean(row.original.message),
    state: {
      pagination,
      sorting,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  });

  return (
    <DataGrid
      table={table}
      recordCount={data?.pagination.total || 0}
      isLoading={isLoading}
      tableClassNames={{
        edgeCell: 'px-5',
      }}
    >
      <Card>
        <DataGridToolbar />
        <CardTable>
          <ScrollArea>
            <DataGridTable />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardTable>
        <CardFooter>
          <DataGridPagination />
        </CardFooter>
      </Card>
    </DataGrid>
  );
};

export default NotificationList;
