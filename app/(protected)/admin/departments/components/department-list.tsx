'use client';

import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTable, CardToolbar } from '@/components/ui/card';
import {
  DataGrid,
  DataGridApiFetchParams,
  DataGridApiResponse,
} from '@/components/ui/data-grid';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import { DataGridTable, DataGridTableRowSelect, DataGridTableRowSelectAll } from '@/components/ui/data-grid-table';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { DepartmentActionsCell } from './department-actions-cell';
import DepartmentEditDialog from './department-edit-dialog';
import { Department } from '@/app/models/department';
import DepartmentGroupDeleteDialog from './department-group-delete-dialog';
import { Badge } from '@/components/ui/badge';

const DepartmentList = () => {
  // Dialog state management
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // List state management
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'name', desc: true },
  ]);

  // Form state management
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [groupDeleteDialogOpen, setGroupDeleteDialogOpen] = useState(false);
  const [deletePermissionIds, setDeletePermissionIds] = useState<string[]>([]);

  useEffect(() => {
    const selectedRowIds = Object.keys(rowSelection);
    if (selectedRowIds.length > 0) {
      setDeletePermissionIds(selectedRowIds);
    } else {
      setDeletePermissionIds([]);
    }
  }, [rowSelection]);

  // Query state management
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch departments from the server API
  const fetchDepartment = async ({
    pageIndex,
    pageSize,
    sorting,
    searchQuery,
  }: DataGridApiFetchParams): Promise<
    DataGridApiResponse<Department>
  > => {
    const sortField = sorting?.[0]?.id || 'name';
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

  // Department query
  const { data, isLoading } = useQuery({
    queryKey: ['departments', pagination, sorting, searchQuery],
    queryFn: () =>
      fetchDepartment({
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

  useEffect(() => {
    const selectedRowIds = Object.keys(rowSelection);
    if (selectedRowIds.length > 0) {
      setDeletePermissionIds(selectedRowIds);
    } else {
      setDeletePermissionIds([]);
    }
  }, [rowSelection]);

  // Column definitions
  const columns = useMemo<ColumnDef<Department>[]>(
    () => [
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
          <DataGridColumnHeader title="Name" column={column} />
        ),
        cell: (info) => info.getValue(),
        size: 120,
        enableSorting: true,
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
          <DataGridColumnHeader title="Description" column={column} />
        ),
        cell: (info) => info.getValue(),
        size: 170,
        enableSorting: true,
        enableHiding: false,
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
        enableSorting: true,
        enableHiding: true,
        meta: {
          headerTitle: 'slug',
          skeleton: <Skeleton className="w-14 h-7" />,
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => <DepartmentActionsCell row={row} />,
        size: 100,
        enableSorting: false,
        enableHiding: false,
        meta: {
          skeleton: <Skeleton className="size-5" />,
        },
      },
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
    getRowId: (row: Department) => row.id,
    state: {
      pagination,
      sorting,
      columnOrder,
      rowSelection,
    },
    columnResizeMode: 'onChange',
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
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
        {deletePermissionIds.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                setGroupDeleteDialogOpen(true);
              }}
            >
              Delete {deletePermissionIds.length} Departments
            </Button>
          )}
          <Button
            disabled={isLoading && true}
            size="sm"
            onClick={() => {
              setAddDialogOpen(true);
            }}
          >
            <Plus />
            Add Department
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

      <DepartmentEditDialog
        open={addDialogOpen}
        closeDialog={() => setAddDialogOpen(false)}
      />

      {deletePermissionIds && (
        <DepartmentGroupDeleteDialog
          open={groupDeleteDialogOpen}
          closeDialog={() => {
            setGroupDeleteDialogOpen(false);
            setRowSelection({});
          }}
          entityIds={deletePermissionIds}
        />
      )}
    </>
  );
};

export default DepartmentList;
