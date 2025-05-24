/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useEffect } from 'react';
import { useDebounce } from './use-debounce';

export interface SearchParams {
  page: number;
  pageSize: number;
  searchText: string;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  filters?: Record<string, any>;
}

export interface EntityListResponse<T> {
  result: T[];
  count: number;
}

export interface EntitySearchConfig {
  baseUrl: string;
  entityName: string;
  defaultSortField?: string;
  defaultSortDirection?: 'asc' | 'desc';
  defaultPageSize?: number;
}

export function useEntitySearch<T>(
  config: EntitySearchConfig,
  initialParams?: Partial<SearchParams>
) {
  const { 
    baseUrl, 
    entityName,
    defaultSortField = 'id',
    defaultSortDirection = 'desc',
    defaultPageSize = 10
  } = config;

  const [data, setData] = useState<EntityListResponse<T>>({ result: [], count: 0 });
  const [params, setParams] = useState<SearchParams>({
    page: initialParams?.page || 1,
    pageSize: initialParams?.pageSize || defaultPageSize,
    searchText: initialParams?.searchText || '',
    sortField: initialParams?.sortField || defaultSortField,
    sortDirection: initialParams?.sortDirection || defaultSortDirection,
    filters: initialParams?.filters || {}
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
      
      // Add any additional filters
      if (params.filters) {
        Object.entries(params.filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            urlParams.append(key, value.toString());
          }
        });
      }
      
      const response = await fetch(`${baseUrl}?${urlParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const responseData = await response.json();
      
      // Normalize response structure
      const processedData: EntityListResponse<T> = {
        result: responseData.result || [],
        count: responseData.count || responseData.total || 0
      };
      
      setData(processedData);
    } catch (err) {
      console.error(`Error fetching ${entityName} list:`, err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl, params, debouncedSearchText, entityName]);
  
  // Fetch data when parameters change
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  // Update search parameters
  const updateParams = useCallback((newParams: Partial<SearchParams>) => {
    setParams(prev => ({
      ...prev,
      ...newParams,
      // Reset to first page when search text or filters change
      page: newParams.searchText !== undefined || newParams.filters !== undefined 
        ? 1 
        : newParams.page || prev.page,
    }));
  }, []);

  // Helper function for sorting
  const updateSort = useCallback((field: string) => {
    setParams(prev => {
      // If same field, toggle direction; otherwise, use default direction
      const newDirection = 
        field === prev.sortField
          ? prev.sortDirection === 'asc' ? 'desc' : 'asc'
          : defaultSortDirection;
          
      return {
        ...prev,
        sortField: field,
        sortDirection: newDirection
      };
    });
  }, [defaultSortDirection]);
  
  return {
    data,
    isLoading,
    error,
    params,
    updateParams,
    updateSort,
    refresh: fetchData,
  };
} 