'use client';

import { useEffect, useMemo, useState } from 'react';
import { useQuery, QueryClient } from '@tanstack/react-query';
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  PaginationState,
  RowSelectionState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { Plus, Search, X } from 'lucide-react';
import { Button } from '@reui/ui/button';
import { Card, CardFooter, CardHeader, CardTable, CardToolbar } from '@reui/ui/card';
import {
  DataGrid,
  DataGridApiFetchParams,
  DataGridApiResponse,
} from '@reui/ui/data-grid';
import { DataGridColumnHeader } from '@reui/ui/data-grid-column-header';
import { DataGridPagination } from '@reui/ui/data-grid-pagination';
import { DataGridTable, DataGridTableRowSelect, DataGridTableRowSelectAll } from '@reui/ui/data-grid-table';
import { Input } from '@reui/ui/input';
import { ScrollArea, ScrollBar } from '@reui/ui/scroll-area';
import { Skeleton } from '@reui/ui/skeleton';
import { Badge } from '@reui/ui/badge';

import { ActionsCell } from '@framework/components/actions-cell';
import GroupDeleteDialog from '@framework/components/delete-group-dialog';
import { PageEditDialog } from './page-edit-dialog';
import { Service } from '@/src/business-layer/church-management/models/service';
// import { Department } from '@/app/models/department';

const queryClient = new QueryClient();

const SearchPage = () => {

  const _page = 'Department';
  const _pageSub = 'department';
  const _usage = 'departments';
  const _query = ["departments"];
  const _field = 'name';
  const _model: Service = {
    id: '',
    name: '',
    description: '',
    type: 'department',
    startDate: null,
    endDate: null,
    isActive: false,
    serviceDetail: [],
    location: 'location',
  };  

  // Dialog state management
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [groupDeleteDialogOpen, setGroupDeleteDialogOpen] = useState(false);

  // List state management
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: _field, desc: true },
  ]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [deleteSelectedIds, setDeleteSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    const selectedRowIds = Object.keys(rowSelection);
    setDeleteSelectedIds(selectedRowIds);
  }, [rowSelection]);

  // Query state management
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch data from the server API
  const fetchData = async ({
    pageIndex,
    pageSize,
    sorting,
    searchQuery,
  }: DataGridApiFetchParams): Promise<
    DataGridApiResponse<Service>
  > => {
    const sortField = sorting?.[0]?.id || _field;
    const sortDirection = sorting?.[0]?.desc ? 'desc' : 'asc';

    const params = new URLSearchParams({
      page: String(pageIndex + 1),
      limit: String(pageSize),
      ...(sortField ? { sort: sortField, dir: sortDirection } : {}),
      ...(searchQuery ? { query: searchQuery } : {}),
    });

    const response = await fetch(`/api/admin/departments?${params.toString()}`);

    if (!response.ok) {
      throw new Error(
        'Oops! Something didn’t go as planned. Please try again in a moment.',
      );
    }

    return response.json();
  };

  // Data query
  const { data, isLoading } = useQuery({
    queryKey: [_usage, pagination, sorting, searchQuery],
    queryFn: () =>
      fetchData({
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        sorting,
        searchQuery,
      }),
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60, // 60 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });

  // Column definitions
  const columns = useMemo<ColumnDef<Service>[]>(() => [
    {
      id: 'id',
      accessorKey: 'id',
      header: () => <DataGridTableRowSelectAll />,
      cell: ({ row }) => <DataGridTableRowSelect row={row} />,
      size: 27,
      enableSorting: false,
      meta: {
        skeleton: <Skeleton className="size-5" />,
      },
      enableResizing: false,
    },
    {
      id: 'name',
      accessorKey: 'name',
      header: ({ column }) => (
        <DataGridColumnHeader title="Name" column={column} visibility/>
      ),
      cell: (info) => info.getValue(),
      size: 120,
      enableHiding: false,
      meta: {
        headerTitle: 'Name',
        skeleton: <Skeleton className="w-28 h-8" />,
      },
    },
    {
      id: 'description',
      accessorKey: 'description',
      header: ({ column }) => (
        <DataGridColumnHeader title="Description" column={column} visibility/>
      ),
      cell: (info) => info.getValue(),
      size: 170,
      meta: {
        headerTitle: 'Description',
        skeleton: <Skeleton className="w-28 h-8" />,
      },
    },
    {
      accessorKey: 'slug',
      id: 'slug',
      header: ({ column }) => (
        <DataGridColumnHeader title="Slug" column={column} visibility />
      ),
      size: 100,
      cell: (info) => {
        const value = info.getValue() as string;

        return <Badge variant="secondary">{value}</Badge>;
      },
      meta: {
        headerTitle: 'slug',
        skeleton: <Skeleton className="w-14 h-7" />,
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <ActionsCell
          row={row}
          deleteEndpoint={(id) => `/api/admin/departments/${id}`}
          EditDialogComponent={PageEditDialog}
        />
      ),
      size: 50,
      enableSorting: false,
      enableHiding: false,
      meta: {
        skeleton: <Skeleton className="size-5" />,
      },
    },
  ], []);

  const [columnOrder, setColumnOrder] = useState<string[]>(
    columns.map((column) => column.id as string),
  );

  const table = useReactTable({
    columns,
    data: data?.data || [],
    pageCount: Math.ceil((data?.pagination.total || 0) / pagination.pageSize),
    getRowId: (row: Service) => row.id,
    state: {
      pagination,
      sorting,
      rowSelection,
      columnOrder
    },
    columnResizeMode: 'onChange',
    enableRowSelection: true,
    onColumnOrderChange: setColumnOrder,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  });

  const DataGridToolbar = () => {
    const [inputValue, setInputValue] = useState(searchQuery);

    const handleSearch = () => {
      setSearchQuery(inputValue);
      setPagination({ ...pagination, pageIndex: 0 });
    };

    return (
      <CardHeader className="py-5">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Search..."
              value={inputValue}
              size="sm"
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              disabled={isLoading && true}
              className="ps-9 w-36 sm:w-64"
            />
            {searchQuery.length > 0 && (
              <Button
                mode="icon"
                size="xs"
                variant="dim"
                className="absolute size-6 end-1.5 top-1/2 -translate-y-1/2"
                onClick={() => setSearchQuery('')}
              >
                <X />
              </Button>
            )}
          </div>
        </div>        
        <CardToolbar>
          {deleteSelectedIds.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setGroupDeleteDialogOpen(true)}
            >
              Delete {deleteSelectedIds.length} {_pageSub}
            </Button>
          )}
          <Button
            size="sm"
            onClick={() => setAddDialogOpen(true)}
          >
            <Plus />
            Add {_page}
          </Button>
        </CardToolbar>
      </CardHeader>
    );
  };
  
  return (
    <>
      <DataGrid
        table={table}
        recordCount={data?.pagination.total || 0}
        isLoading={isLoading}
        tableLayout={{
          columnsResizable: true,
          columnsPinnable: true,
          columnsMovable: true,
          columnsVisibility: true,
          headerSticky: true,
        }}
        tableClassNames={{
          edgeCell: 'px-5',
        }}
      >
        <Card>
          <DataGridToolbar />          
          <CardTable>
          <ScrollArea className="max-h-100">
            <DataGridTable />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          </CardTable>
          <CardFooter>
            <DataGridPagination />
          </CardFooter>
        </Card>
      </DataGrid>

      {/* Add Dialog */}
      <PageEditDialog
        open={addDialogOpen}
        closeDialog={() => setAddDialogOpen(false)}
        data={_model}
      />

      {/* Group Delete Dialog */}
      <GroupDeleteDialog
        open={groupDeleteDialogOpen}
        closeDialog={() => {
          setGroupDeleteDialogOpen(false);
          setRowSelection({});
        }}
        entityIds={deleteSelectedIds}
        entityName={_page}
        deleteEndpoint="/api/admin/departments/delete"
        onSuccess={() => queryClient.invalidateQueries({ queryKey: _query })}
      />
    </>
  );
};

export default SearchPage;