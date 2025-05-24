/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { API } from '@framework/helper/api';
import { useRouter } from 'next/navigation';
import { SyncfusionGrid } from '@syncfusion/grid/grid';
import { load, SortEventArgs } from '@syncfusion/ej2-react-grids';
import { GridComponent } from '@syncfusion/ej2-react-grids';

// Define interfaces for better type safety
interface ServiceRecord {
  id: string;
  name: string;
  description?: string;
  type: string;
  location: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
}

interface GridDataState {
  result: ServiceRecord[];
  count: number;
}

const SearchPage = () => {
  const router = useRouter();
  const gridRef = useRef<GridComponent>(null);
  const [formPage, setFormPage] = useState<GridDataState>({ result: [], count: 0 });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [isLoading, setIsLoading] = useState(false);

  // Create a ref to track initial load
  const isInitialLoad = useRef(true);

  // Combined fetch function for all data loading
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Build the query parameters
      const sortFieldParam = sortField ? `&sort=${sortField}` : '';
      const sortDirectionParam = sortDirection ? `&dir=${sortDirection}` : '';
      const pageParam = page ? `&page=${page}` : '';
      const pageSizeParam = pageSize ? `&limit=${pageSize}` : '';
      const searchParam = searchText ? `&search=${encodeURIComponent(searchText)}` : '';
      const url = `${API.service.list}?${sortFieldParam}${sortDirectionParam}${pageParam}${pageSizeParam}${searchParam}`;

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();

      setFormPage({
        result: data.result || [],
        count: data.count || (data.result?.length || 0)
      });
      
      isInitialLoad.current = false; // Mark as loaded after any successful load
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [sortField, sortDirection, page, pageSize, searchText]);

  // Load data on component mount and when dependencies change
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle row selection to navigate to record detail
  const rowSelected = useCallback((args: any) => {
    if (!gridRef.current) return;
    
    const selectedRecords = gridRef.current.getSelectedRecords();
    if (selectedRecords && selectedRecords.length > 0) {
      const ids = selectedRecords.map((record: any) => record.id);
      const encodedIds = btoa(JSON.stringify(ids));
      const urlSafeIds = encodeURIComponent(encodedIds);
      router.push(`/admin/service-and-events/${urlSafeIds}`);
    }
  }, [router]);

  // Handle page changes
  const handlePageChange = useCallback(async (newPage: number, newPageSize: number) => {
    try {
      setPage(newPage);
      setPageSize(newPageSize);
      await loadData();
    } catch (error) {
      console.error('Error fetching page:', error);
    }
  }, [loadData, setPage, setPageSize]);

  // Handle search changes
  const handleSearch = useCallback(async (searchText: string) => {
    try {
      setSearchText(searchText);
      setPage(1); // Reset to first page on new search
      await loadData();
    } catch (error) {
      console.error('Error searching:', error);
    }
  }, [loadData, setSearchText, setPage]);

  // Handle sorting
  const actionBegin = useCallback(async (args: SortEventArgs): Promise<void> => {
    if (args.requestType === 'sorting') {
      args.cancel = true;
      setSortField(args.columnName ?? 'id');
      setSortDirection(args.direction === 'Ascending' ? 'asc' : 'desc');
      await loadData();
    }
  }, [loadData, setSortField, setSortDirection]);

  // Memoize the grid columns to prevent unnecessary re-renders
  const mainGridColumns = useMemo(() => [
    { type: 'checkbox', width: 30, isPrimaryKey: true, allowResizing: false, textAlign: 'Center' },
    { field: 'type', headerText: 'Type', width: 45 },
    { field: 'name', headerText: 'Name', width: 100 },
    { field: 'description', headerText: 'Description', width: 100, hideAtMedia: true },
    {
      field: 'startDate',
      headerText: 'Start Date',
      width: 80,
      type: 'date',
      format: 'dd/MM/yyyy hh:mm a',
      visible: true,
      hideAtMedia: true
    },
    {
      field: 'endDate',
      headerText: 'End Date',
      width: 80,
      type: 'date',
      format: 'dd/MM/yyyy hh:mm a',
      visible: true,
      hideAtMedia: true
    },
    { field: 'location', headerText: 'Location', width: 100, hideAtMedia: true },
    {
      field: 'isActive',
      headerText: 'Active',
      width: 40,
      type: 'boolean',
      displayAsCheckBox: true,
      editType: 'booleanedit',
      textAlign: 'Center',
      hideAtMedia: true
    }
  ], []);

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <SyncfusionGrid
        columns={mainGridColumns}
        dataSource={formPage}
        gridRef={gridRef as any}
        allowSelection={true}
        allowSorting={true}
        onActionBegin={actionBegin}
        onRowSelected={rowSelected}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        height="calc(100vh - 180px)"
        toolbar={{
          title: "Service and Events",
          showSearch: true,
          showAddNew: true,
          showOpen: true,
          onAddNew: () => router.push('/admin/service-and-events/new'),
          onOpenSelected: () => {
            if (gridRef.current) {
              const activeRecords = formPage.result.filter((item) => item.isActive);
              if (activeRecords.length > 0) {
                rowSelected({ rowData: activeRecords });
              }
            }
          },
        }}
      />
    </div>
  );
};

export default SearchPage;