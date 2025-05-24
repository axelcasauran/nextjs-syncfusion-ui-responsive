/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useState } from 'react';
import { API } from '@framework/helper/api';
import { toast } from 'sonner';
import { Service, ServiceDetailGridRow } from '@/src/business-layer/church-management/models/prisma-types';

export interface FormDetailPage {
  result: ServiceDetailGridRow[];
  count: number;
}

export interface ServiceResponse {
  result: Service;
  error?: string;
}

export interface ErrorResponse {
  error: string;
}

export function useServiceRecord() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [serviceData, setServiceData] = useState<Service | null>(null);
  const [detailsData, setDetailsData] = useState<FormDetailPage>({
    result: [],
    count: 0
  });

  // Fetch a record by ID
  const fetchRecord = useCallback(async (recordId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API.service.get}/${recordId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch record: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data || !data.result) {
        console.error("Invalid data received from API", data);
        toast.error("Failed to load service data");
        return;
      }

      setServiceData(data.result);
      
      // Process service details for the grid
      if (data.result.serviceDetail && Array.isArray(data.result.serviceDetail)) {
        try {
          // Cast to any first to handle the potentially inconsistent API data
          const processedDetails = (data.result.serviceDetail as any[]).map(detail => {
            // Create a properly typed grid row by constructing it explicitly
            const gridRow: ServiceDetailGridRow = {
              id: detail.id || '',
              serviceId: detail.serviceId || '',
              userId: detail.userId || '',
              role: detail.role || '',
              description: detail.description || '',
              notes: detail.notes || '',
              isAccepted: detail.isAccepted || false,
              isRequired: detail.isRequired || true,
              minutes: detail.minutes || null,
              startDate: detail.startDate || null,
              // Add user data
              user: {
                firstName: detail.user?.firstName || '',
                lastName: detail.user?.lastName || '',
                id: detail.user?.id || ''
              },
              // Add a reference to the parent service
              service: {
                id: data.result.id,
                name: data.result.name || '',
              } as unknown as Service
            };

            return gridRow;
          });

          setDetailsData({
            result: processedDetails,
            count: processedDetails.length
          });
        } catch (error) {
          console.error("Error processing service details:", error);
          setDetailsData({ result: [], count: 0 });
        }
      } else {
        setDetailsData({
          result: [],
          count: 0
        });
      }

    } catch (error) {
      console.error('Error fetching record:', error);
      toast.error(`Failed to load record: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save the service record
  const saveRecord = useCallback(async (
    formData: any, 
    gridChanges: any, 
    isNewRecord: boolean
  ) => {
    try {
      setIsLoading(true);
      
      const masterData = isNewRecord
        ? { addedRecords: [{ ...formData, id: undefined }] }
        : { changedRecords: [formData] };

      const saveData = {
        ...masterData,
        details: gridChanges
      };

      const response = await fetch(`${API.service.post}`, {
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

      const responseData = await response.json() as ServiceResponse;

      if (!responseData || !responseData.result) {
        throw new Error("Server returned invalid data");
      }

      // Update local state
      setServiceData(responseData.result);
      
      // Process service details
      if (responseData.result.serviceDetail && Array.isArray(responseData.result.serviceDetail)) {
        const processedDetails = responseData.result.serviceDetail.map((detail: any) => ({
          ...detail,
          service: {
            id: responseData.result.id,
            name: responseData.result.name,
          } as unknown as Service
        }));
        
        setDetailsData({
          result: processedDetails,
          count: processedDetails.length
        });
      }

      toast.success('Record saved successfully');
      return responseData.result;
    } catch (error) {
      console.error('Save failed:', error);
      toast.error(`Failed to save record: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update details data
  const updateDetailsData = useCallback((newData: FormDetailPage) => {
    setDetailsData(newData);
  }, []);

  return {
    isLoading,
    serviceData,
    detailsData,
    fetchRecord,
    saveRecord,
    updateDetailsData
  };
} 