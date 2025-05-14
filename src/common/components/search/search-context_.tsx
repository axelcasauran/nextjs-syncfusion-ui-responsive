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
import { debounce } from '@lib/utils';

interface SearchResponse {
  data: Record<string, unknown>;
  meta?: {
    query: string;
    limit: number;
  };
}

interface SearchContext {
  query: string;
  setQuery: (query: string) => void;
  resetQuery: () => void;
  data: Record<string, unknown> | null;
  isLoading: boolean;
  isError: boolean;
}

const SearchContext = createContext<SearchContext | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [query, setQuery] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>(''); // Debounced query
  const [stableData, setStableData] = useState<Record<string, unknown> | null>(
    null,
  ); // Stable data for UI
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  // Use a ref for the ongoing request so that it doesn't trigger re-renders.
  const ongoingRequestRef = useRef<Promise<SearchResponse> | null>(null);

  // Debounce function for the search query.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleDebounce = useCallback(
    debounce((...args: unknown[]) => {
      const value = args[0] as string;
      setDebouncedQuery(value.trim());
    }, 200),
    [],
  );

  useEffect(() => {
    handleDebounce(query);
  }, [query, handleDebounce]);

  // Function to fetch search data.
  const fetchData = async (searchQuery: string): Promise<SearchResponse> => {
    const url =
      searchQuery.length > 0
        ? `/api/search?query=${encodeURIComponent(searchQuery)}`
        : `/api/search`; // Fetch predefined data for empty query

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch search results');
    }
    return response.json();
  };

  // Process query with useCallback to keep its reference stable.
  const processQuery = useCallback(
    async (searchQuery: string) => {
      if (ongoingRequestRef.current) {
        await ongoingRequestRef.current; // Wait for any ongoing request.
      }

      setIsError(false);
      setIsLoading(!stableData); // Show loader only if no stable data is present.

      try {
        ongoingRequestRef.current = fetchData(searchQuery);
        const result = await ongoingRequestRef.current;
        setStableData(result.data); // Update stable data when request finishes.
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false); // End loading state.
        ongoingRequestRef.current = null;
      }
    },
    [stableData],
  );

  // Watch for changes in debouncedQuery and process them.
  useEffect(() => {
    if (debouncedQuery !== undefined) {
      processQuery(debouncedQuery);
    }
  }, [debouncedQuery, processQuery]);

  // Reset query: clear state and fetch predefined data.
  const resetQuery = () => {
    setQuery('');
    processQuery('');
  };

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
