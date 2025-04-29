'use client';

import { useMemo, useState } from 'react';
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
import {
  Card,
  CardFooter,
  CardHeader,
  CardHeading,
  CardTable,
  CardTitle,
  CardToolbar,
} from '@/components/ui/card';
import {
  DataGrid,
  DataGridApiFetchParams,
  DataGridApiResponse,
} from '@/components/ui/data-grid';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import { DataGridTable } from '@/components/ui/data-grid-table';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { comingSoonToast } from '@/app/components/common/coming-soon-toast';
import {
  EcommerceOrder,
} from '@/app/models/ecommerce';

const RecentOrders = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'createdAt', desc: true },
  ]);

  // Fetch users from the server API
  const fetchOrders = async ({
    pageIndex,
    pageSize,
    sorting,
    selectedStatus,
  }: DataGridApiFetchParams & { selectedStatus: string | null }): Promise<
    DataGridApiResponse<EcommerceOrder>
  > => {
    const sortField = sorting?.[0]?.id || '';
    const sortDirection = sorting?.[0]?.desc ? 'desc' : 'asc';

    const params = new URLSearchParams({
      page: String(pageIndex + 1),
      limit: String(pageSize),
      ...(sortField ? { sort: sortField, dir: sortDirection } : {}),
      ...(selectedStatus && selectedStatus !== 'all'
        ? { status: selectedStatus }
        : {}),
    });

    const response = await fetch(
      `/api/dashboard/recent-orders/?${params.toString()}`,
    );

    if (!response.ok) {
      throw new Error('Failed to fetch orders.');
    }

    return response.json();
  };

  // Users query
  const { data, isLoading } = useQuery({
    queryKey: ['orders', pagination, sorting],
    queryFn: () =>
      fetchOrders({
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        sorting,
        selectedStatus: '',
      }),
    staleTime: Infinity, // Reload in 10 mins
  });

  const handleRowClick = () => {
    comingSoonToast();
  };

  const DataGridToolbar = () => {
    return (
      <CardHeader>
        <CardHeading>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeading>
        <CardToolbar>
        </CardToolbar>
      </CardHeader>
    );
  };

  const columns = useMemo<ColumnDef<EcommerceOrder>[]>(
    () => [
    ],
    [],
  );

  const [columnOrder, setColumnOrder] = useState<string[]>(
    columns.map((column) => column.id as string),
  );

  const table = useReactTable({
    columns,
    data: data?.data || [],
    pageCount: Math.ceil((data?.pagination.total || 0) / pagination.pageSize),
    getRowId: (row: EcommerceOrder) => row.id,
    state: {
      pagination,
      sorting,
      columnOrder,
    },
    columnResizeMode: 'onChange',
    onColumnOrderChange: setColumnOrder,
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
      onRowClick={handleRowClick}
      tableLayout={{
        columnsResizable: true,
        columnsPinnable: true,
        columnsMovable: true,
        columnsVisibility: true,
      }}
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

export default RecentOrders;
