/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { GridBatchChanges } from '@/src/framework/components/grid/GenericDataGrid';

export interface EntityResponse<T> {
  result: T;
  error?: string;
}

export interface EntityListResponse<T> {
  result: T[];
  count: number;
}

export interface ErrorResponse {
  error: string;
}

export interface EntityConfig {
  baseUrl: string;
  entityName: string;
  idField?: string;
  detailsField?: string;
}

export interface DataState<T, D> {
  isLoading: boolean;
  entityData: T | null;
  detailsData: { result: D[]; count: number };
  error: string | null;
}

export function useEntityRecord<T extends Record<string, any>, D extends Record<string, any> = Record<string, any>>(
  config: EntityConfig
) {
  const { baseUrl, entityName, idField = 'id', detailsField = 'details' } = config;

  const [state, setState] = useState<DataState<T, D>>({
    isLoading: false,
    entityData: null,
    detailsData: { result: [], count: 0 },
    error: null
  });

  // Set loading state
  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading, error: null }));
  }, []);

  // Set error state
  const setError = useCallback((error: string) => {
    setState(prev => ({ ...prev, error, isLoading: false }));
    toast.error(error);
  }, []);

  // Process and format entity data
  const processEntityData = useCallback((data: T, processDetails: boolean = true) => {
    try {
      // Update entity data
      setState(prev => ({
        ...prev,
        entityData: data,
        detailsData: processDetails 
          ? processDetailsData(data)
          : prev.detailsData
      }));
    } catch (error) {
      console.error("Error processing entity data:", error);
      setError(`Error processing ${entityName} data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [entityName, setError]);

  // Process details data from main entity
  const processDetailsData = useCallback((data: T): { result: D[], count: number } => {
    if (!data || typeof data !== 'object') return { result: [], count: 0 };

    const details = data[detailsField as keyof T];
    
    if (!details || !Array.isArray(details) || details.length === 0) {
      return { result: [], count: 0 };
    }

    try {
      const processedDetails = details.map((detail: any) => {
        // Add a reference to parent entity if needed
        return {
          ...detail,
          [entityName]: { 
            [idField]: data[idField as keyof T]
          }
        } as D;
      });

      return {
        result: processedDetails,
        count: processedDetails.length
      };
    } catch (error) {
      console.error(`Error processing ${entityName} details:`, error);
      return { result: [], count: 0 };
    }
  }, [detailsField, entityName, idField]);

  // Fetch a record by ID
  const fetchRecord = useCallback(async (recordId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/${recordId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch record: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data || !data.result) {
        throw new Error("Invalid data received from API");
      }

      processEntityData(data.result);
      return data.result;
    } catch (error) {
      console.error(`Error fetching ${entityName}:`, error);
      setError(`Failed to load ${entityName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, [baseUrl, entityName, processEntityData, setError, setLoading]);

  // Save (create or update) a record
  const saveRecord = useCallback(async (
    formData: any, 
    gridChanges: GridBatchChanges<any>, 
    isNew: boolean
  ) => {
    try {
      setLoading(true);
      
      const masterData = isNew
        ? { addedRecords: [{ ...formData, [idField]: undefined }] }
        : { changedRecords: [formData] };

      const saveData = {
        ...masterData,
        [detailsField]: gridChanges
      };

      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(saveData)
      });

      if (!response.ok) {
        const errorData = await response.json() as ErrorResponse;
        throw new Error(`Failed to save data: ${errorData.error || response.statusText}`);
      }

      const responseData = await response.json() as EntityResponse<T>;

      if (!responseData || !responseData.result) {
        throw new Error("Server returned invalid data");
      }

      processEntityData(responseData.result);
      toast.success(`${entityName} saved successfully`);
      return responseData.result;
    } catch (error) {
      console.error(`Error saving ${entityName}:`, error);
      setError(`Failed to save ${entityName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, [baseUrl, detailsField, entityName, idField, processEntityData, setError, setLoading]);

  // Update details data
  const updateDetailsData = useCallback((newDetailsData: { result: D[], count: number }) => {
    setState(prev => ({
      ...prev,
      detailsData: newDetailsData
    }));
  }, []);

  // Delete a record
  const deleteRecord = useCallback(async (recordId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/${recordId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete record: ${response.statusText}`);
      }

      toast.success(`${entityName} deleted successfully`);
      return true;
    } catch (error) {
      console.error(`Error deleting ${entityName}:`, error);
      setError(`Failed to delete ${entityName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    } finally {
      setLoading(false);
    }
  }, [baseUrl, entityName, setError, setLoading]);

  return {
    ...state,
    fetchRecord,
    saveRecord,
    updateDetailsData,
    deleteRecord
  };
} 