/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useEffect } from 'react';
import { useDebounce } from './use-debounce';

export interface SearchParams {
  page: number;
  pageSize: number;
  searchText: string;
  sortField: string;
  sortDirection: 'asc' | 'desc';
}

export interface SearchDataResult<T> {
  result: T[];
  count: number;
}

export function useSearchData<T>(
  apiEndpoint: string,
  initialParams?: Partial<SearchParams>,
  transformResponse?: (data: any) => SearchDataResult<T>
) {
  const [data, setData] = useState<SearchDataResult<T>>({ result: [], count: 0 });
  const [params, setParams] = useState<SearchParams>({
    page: initialParams?.page || 1,
    pageSize: initialParams?.pageSize || 10,
    searchText: initialParams?.searchText || '',
    sortField: initialParams?.sortField || 'id',
    sortDirection: initialParams?.sortDirection || 'desc',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const debouncedSearchText = useDebounce(params.searchText, 300);
  
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const urlParams = new URLSearchParams();
      urlParams.append('sort', params.sortField);
      urlParams.append('dir', params.sortDirection);
      urlParams.append('page', params.page.toString());
      urlParams.append('limit', params.pageSize.toString());
      if (debouncedSearchText) {
        urlParams.append('search', debouncedSearchText);
      }
      
      const response = await fetch(`${apiEndpoint}?${urlParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const rawData = await response.json();
      const processedData = transformResponse ? 
        transformResponse(rawData) : 
        { result: rawData.result || [], count: rawData.count || 0 };
      
      setData(processedData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [apiEndpoint, params, debouncedSearchText, transformResponse]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  const updateParams = useCallback((newParams: Partial<SearchParams>) => {
    setParams(prev => ({
      ...prev,
      ...newParams,
      // Reset to first page when search text changes
      page: newParams.searchText !== undefined ? 1 : newParams.page || prev.page,
    }));
  }, []);
  
  return {
    data,
    isLoading,
    error,
    params,
    updateParams,
    refresh: fetchData,
  };
} 