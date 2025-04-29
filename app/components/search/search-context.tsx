'use client';

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { EcommerceOrder, EcommerceProduct } from '@/app/models/ecommerce';
import { User } from '@/app/models/user';

interface SearchData {
  orders: Array<EcommerceOrder>;
  products: Array<EcommerceProduct>;
  customers: Array<User>;
}

interface SearchResponse {
  data: SearchData;
  meta?: {
    query: string;
    limit: number;
  };
}

interface SearchContext {
  query: string;
  setQuery: (query: string) => void;
  resetQuery: () => void;
  data: SearchData | null;
  isLoading: boolean;
  isError: boolean;
}

const SearchContext = createContext<SearchContext | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [query, setQuery] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const [stableData, setStableData] = useState<SearchData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const ongoingRequestRef = useRef<Promise<SearchResponse> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Update debounced query when search query changes
  useEffect(() => {
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 200);

    // Cleanup on unmount or when query changes
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query]);

  // Function to fetch search data
  const fetchData = async (searchQuery: string): Promise<SearchResponse> => {
    const url =
      searchQuery.length > 0
        ? `/api/search?query=${encodeURIComponent(searchQuery)}`
        : `/api/search`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch search results');
    }
    return response.json();
  };

  // Process query
  const processQuery = useCallback(async (searchQuery: string) => {
    if (ongoingRequestRef.current) {
      await ongoingRequestRef.current; // Wait for ongoing request
    }

    setIsError(false);
    setIsLoading(true);

    try {
      ongoingRequestRef.current = fetchData(searchQuery);
      const result = await ongoingRequestRef.current;
      setStableData(result.data);
    } catch {
      setIsError(true);
      setStableData(null);
    } finally {
      setIsLoading(false);
      ongoingRequestRef.current = null;
    }
  }, []);

  // Watch for changes in debouncedQuery and process them
  useEffect(() => {
    if (debouncedQuery !== undefined) {
      processQuery(debouncedQuery);
    }
  }, [debouncedQuery, processQuery]);

  // Reset query and fetch initial data
  const resetQuery = useCallback(() => {
    setQuery('');
    processQuery('');
  }, [processQuery]);

  // Fetch initial data on mount
  useEffect(() => {
    resetQuery();
  }, [resetQuery]);

  return (
    <SearchContext.Provider
      value={{
        query,
        setQuery,
        resetQuery,
        data: stableData,
        isLoading,
        isError,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = (): SearchContext => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
