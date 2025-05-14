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
import { KidActionsCell } from './kid-actions-cell';
import KidEditDialog from './kid-edit-dialog';
import { Kid } from '@/src/business-layer/church-management/models/kid';
import KidGroupDeleteDialog from './kid-group-delete-dialog';

const KidList = () => {
  // Dialog state management
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // List state management
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'createdAt', desc: true },
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

  // Fetch kids from the server API
  const fetchKids = async ({
    pageIndex,
    pageSize,
    sorting,
    searchQuery,
  }: DataGridApiFetchParams): Promise<
    DataGridApiResponse<Kid>
  > => {
    const sortField = sorting?.[0]?.id || 'createdAt';
    const sortDirection = sorting?.[0]?.desc ? 'desc' : 'asc';

    const params = new URLSearchParams({
      page: String(pageIndex + 1),
      limit: String(pageSize),
      ...(sortField ? { sort: sortField, dir: sortDirection } : {}),
      ...(searchQuery ? { query: searchQuery } : {}),
    });

    const response = await fetch(`/api/parents/kids?${params.toString()}`);

    if (!response.ok) {
      throw new Error(
        'Oops! Something didn’t go as planned. Please try again in a moment.',
      );
    }

    return response.json();
  };

  // Kids query
  const { data, isLoading } = useQuery({
    queryKey: ['kids', pagination, sorting, searchQuery],
    queryFn: () =>
      fetchKids({
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
  const columns = useMemo<ColumnDef<Kid>[]>(
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
        accessorKey: 'firstName',
        id: 'firstName',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="First Name"
            column={column}
            visibility={true}
          />
        ),
        cell: (info) => {
          const value = info.getValue() as string;
          return <span className="font-medium">{value}</span>;
        },
        size: 200,
        enableSorting: true,
        enableHiding: false,
        meta: {
          headerTitle: 'First Name',
          skeleton: <Skeleton className="w-28 h-7" />,
        },
      },
      {
        accessorKey: 'middleName',
        id: 'middleName',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Middle Name"
            column={column}
            visibility={true}
          />
        ),
        cell: (info) => {
          const value = info.getValue() as string;
          return <span className="font-medium">{value}</span>;
        },
        size: 200,
        enableSorting: true,
        enableHiding: false,
        meta: {
          headerTitle: 'Middle Name',
          skeleton: <Skeleton className="w-28 h-7" />,
        },
      },
      {
        accessorKey: 'lastName',
        id: 'lastName',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Last Name"
            column={column}
            visibility={true}
          />
        ),
        cell: (info) => {
          const value = info.getValue() as string;
          return <span className="font-medium">{value}</span>;
        },
        size: 200,
        enableSorting: true,
        enableHiding: false,
        meta: {
          headerTitle: 'Last Name',
          skeleton: <Skeleton className="w-28 h-7" />,
        },
      },      
      {
        accessorKey: 'gender',
        id: 'gender',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Gender"
            column={column}
            visibility={true}
          />
        ),
        cell: (info) => {
          const value = info.getValue() as string;
          return <span className="font-medium">{value}</span>;
        },
        size: 200,
        enableSorting: true,
        enableHiding: false,
        meta: {
          headerTitle: 'Gender',
          skeleton: <Skeleton className="w-28 h-7" />,
        },
      },
      {
        accessorKey: 'age',
        id: 'age',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Age"
            column={column}
            visibility={true}
          />
        ),
        cell: (info) => {
          const value = info.getValue() as string;
          return <span className="font-medium">{value}</span>;
        },
        size: 100,
        enableSorting: true,
        enableHiding: true,
        meta: {
          headerTitle: 'Age',
          skeleton: <Skeleton className="w-28 h-7" />,
        },
      },  
      {
        accessorKey: 'birthDate',
        id: 'birthDate',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Birth Date"
            column={column}
            visibility={true}
          />
        ),
        cell: (info) => {
          const value = info.getValue() as string;
          return <span className="font-medium">{value}</span>;
        },
        size: 100,
        enableSorting: true,
        enableHiding: true,
        meta: {
          headerTitle: 'Birth Date',
          skeleton: <Skeleton className="w-28 h-7" />,
        },
      },      
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => <KidActionsCell row={row} />,
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
    getRowId: (row: Kid) => row.id,
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
              Delete {deletePermissionIds.length} kids
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
            Add Kid
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

      <KidEditDialog
        open={addDialogOpen}
        closeDialog={() => setAddDialogOpen(false)}
      />

      {deletePermissionIds && (
        <KidGroupDeleteDialog
          open={groupDeleteDialogOpen}
          closeDialog={() => {
            setGroupDeleteDialogOpen(false);
            setRowSelection({});
          }}
          kidIds={deletePermissionIds}
        />
      )}
    </>
  );
};

export default KidList;
