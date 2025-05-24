import { useState, useCallback, useRef } from 'react';
import { BaseRecord, SearchState, SearchParams } from './types';

export function useSearch<T extends BaseRecord>(
  apiEndpoint: string,
  defaultSort: string = 'createdAt',
  defaultSortDir: 'asc' | 'desc' = 'desc'
) {
  const [data, setData] = useState<SearchState<T>>({ result: [], count: 0 });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [sortField, setSortField] = useState(defaultSort);
  const [sortDirection, setSortDirection] = useState(defaultSortDir);
  const [isLoading, setIsLoading] = useState(false);
  const isInitialLoad = useRef(true);

  const buildSearchParams = (): SearchParams => ({
    sort: sortField,
    dir: sortDirection,
    page,
    limit: pageSize,
    search: searchText
  });

  const buildQueryString = (params: SearchParams): string => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value.toString());
    });
    return queryParams.toString();
  };

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = buildSearchParams();
      const queryString = buildQueryString(params);
      const url = `${apiEndpoint}?${queryString}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setData({
        result: result.result || [],
        count: result.count || (result.result?.length || 0)
      });
      
      isInitialLoad.current = false;
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [apiEndpoint, sortField, sortDirection, page, pageSize, searchText]);

  const handlePageChange = useCallback((newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  }, []);

  const handleSearch = useCallback((text: string) => {
    setSearchText(text);
    setPage(1);
  }, []);

  const handleSort = useCallback((field: string, direction: 'asc' | 'desc') => {
    setSortField(field);
    setSortDirection(direction);
  }, []);

  return {
    data,
    isLoading,
    page,
    pageSize,
    sortField,
    sortDirection,
    searchText,
    loadData,
    handlePageChange,
    handleSearch,
    handleSort
  };
} 