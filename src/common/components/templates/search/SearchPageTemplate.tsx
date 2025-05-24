/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SyncfusionGrid } from '@syncfusion/grid/grid';
import { SortEventArgs } from '@syncfusion/ej2-react-grids';
import { GridComponent } from '@syncfusion/ej2-react-grids';
import { useDebounce } from '@common/hooks/use-debounce';
import { SearchDataResult } from '@common/hooks/use-search-data';

export type SearchTemplateProps<T> = {
  title: string;
  apiEndpoint: string;
  columns: any[];
  detailRoute: string;
  createRoute: string;
  idField?: string;
  initialSort?: {
    field: string;
    direction: 'asc' | 'desc';
  };
  transformResponse?: (data: any) => SearchDataResult<T>;
  canOpenSelected?: (items: T[]) => boolean;
  encodeIds?: boolean;
};

const SearchPageTemplate = <T extends Record<string, any>>({
  title,
  apiEndpoint,
  columns,
  detailRoute,
  createRoute,
  idField = 'id',
  initialSort = { field: 'id', direction: 'desc' },
  transformResponse = (data) => data as SearchDataResult<T>,
  canOpenSelected = (items: T[]) => items.some((item: T) => item.isActive === true),
  encodeIds = true,
}: SearchTemplateProps<T>) => {
  const router = useRouter();
  const gridRef = useRef<GridComponent>(null);
  const [gridData, setGridData] = useState<SearchDataResult<T>>({
    result: [],
    count: 0
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [sortField, setSortField] = useState(initialSort.field);
  const [sortDirection, setSortDirection] = useState(initialSort.direction);
  const [isLoading, setIsLoading] = useState(false);
  
  const debouncedSearchText = useDebounce(searchText, 300);

  // Load data with pagination, sorting and filtering
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const params = new URLSearchParams();
      if (sortField) params.append('sort', sortField);
      if (sortDirection) params.append('dir', sortDirection);
      if (page) params.append('page', page.toString());
      if (pageSize) params.append('limit', pageSize.toString());
      if (debouncedSearchText) params.append('search', debouncedSearchText);
      
      const response = await fetch(`${apiEndpoint}?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const rawData = await response.json();
      const processedData = transformResponse(rawData);
      
      setGridData(processedData);
    } catch (error) {
      console.error('Error loading data:', error);
      // Show user-friendly error message
    } finally {
      setIsLoading(false);
    }
  }, [apiEndpoint, sortField, sortDirection, page, pageSize, debouncedSearchText, transformResponse]);

  // Effect to load data when dependencies change
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Navigate to detail view with secure ID handling
  const rowSelected = useCallback(() => {
    if (!gridRef.current) return;
    
    const selectedRecords = gridRef.current.getSelectedRecords();
    if (selectedRecords && selectedRecords.length > 0) {
      const ids = selectedRecords.map((record: any) => record[idField]);
      
      // Use URL encoding + Base64 for security and flexibility
      let idParam;
      if (encodeIds) {
        // Encode the array of IDs as JSON, then Base64, then URL-encode
        idParam = encodeURIComponent(btoa(JSON.stringify(ids)));
      } else {
        // Fallback to comma-separated for backward compatibility
        idParam = ids.join(',');
      }
      
      router.push(`${detailRoute}/${idParam}`);
    }
  }, [router, detailRoute, idField, encodeIds]);

  // Handle page changes
  const handlePageChange = useCallback((newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  }, []);

  // Handle search input
  const handleSearch = useCallback((text: string) => {
    setSearchText(text);
    setPage(1); // Reset to first page on new search
  }, []);

  // Handle sorting
  const actionBegin = useCallback(async (args: SortEventArgs): Promise<void> => {
    if (args.requestType === 'sorting') {
      args.cancel = true;
      setSortField(args.columnName ?? initialSort.field);
      setSortDirection(args.direction === 'Ascending' ? 'asc' : 'desc');
    }
  }, [initialSort.field]);

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <SyncfusionGrid
        columns={columns}
        dataSource={gridData}
        gridRef={gridRef as any}
        allowSelection={true}
        allowSorting={true}
        onActionBegin={actionBegin}
        onRowSelected={rowSelected}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        height="calc(100vh - 180px)"
        toolbar={{
          title: title,
          showSearch: true,
          showAddNew: true,
          showOpen: true,
          onAddNew: () => router.push(createRoute),
          onOpenSelected: () => {
            if (gridRef.current) {
              const selectedRecords = gridRef.current.getSelectedRecords() as T[];
              if (selectedRecords && selectedRecords.length > 0 && canOpenSelected(selectedRecords)) {
                rowSelected();
              }
            }
          },
        }}
      />
    </div>
  );
};

export default SearchPageTemplate; 