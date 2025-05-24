/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { TabComponent, TabItemDirective, TabItemsDirective } from '@syncfusion/ej2-react-navigations';
import { Card, CardContent } from '@reui/ui/card';
import { Skeleton } from '@reui/ui/skeleton';
import { Toolbar } from '@syncfusion/toolbar/toolbar';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { z } from 'zod';

import { GenericRecordForm, FormLayout, GenericFormMethods } from './GenericRecordForm';
import { GenericDataGrid, GenericGridColumn, GenericGridMethods, prepareGridChangesForSave } from '../grid/GenericDataGrid';
import { useEntityRecord, EntityConfig } from '@/src/common/hooks/use-entity-record';

export interface GenericRecordConfig<T, D> extends EntityConfig {
  schema: z.ZodType<any>;
  formLayouts: FormLayout[];
  detailColumns: GenericGridColumn[];
  detailsIdField?: string;
  removableDetailFields?: string[];
  navigationBasePath: string;
  onGridInitialized?: (gridRef: any) => void;
  labels: {
    title: string;
    newTitle?: string;
    detailsTabLabel?: string;
    historyTabLabel?: string;
  };
}

export interface GenericRecordPageProps {
  id: string | 'new';
  isLoading?: boolean;
}

// Create a loading skeleton UI
const LoadingComponent = () => (
  <Card>
    <CardContent>
      <dl className="grid grid-cols-[auto_1fr] text-muted-foreground gap-3 text-sm mb-5">
        <div className="grid grid-cols-subgrid col-span-2 items-baseline">
          <dt className="flex md:w-64">
            <Skeleton className="h-6 w-24" />
          </dt>
          <dd>
            <Skeleton className="h-5 w-36" />
          </dd>
        </div>
        <div className="grid grid-cols-subgrid col-span-2 items-baseline">
          <dt>
            <Skeleton className="h-5 w-36" />
          </dt>
          <dd>
            <Skeleton className="h-5 w-48" />
          </dd>
        </div>
        <div className="grid grid-cols-subgrid col-span-2 items-baseline">
          <dt>
            <Skeleton className="h-5 w-20" />
          </dt>
          <dd>
            <Skeleton className="h-5 w-24" />
          </dd>
        </div>
      </dl>
      <Skeleton className="h-9 w-32" />
    </CardContent>
  </Card>
);

// Utility to parse IDs from URL
const parseIds = (id: string): string[] => {
  try {
    if (id === 'new') return [];

    const urlDecoded = decodeURIComponent(id);
    const base64Decoded = atob(urlDecoded);
    const ids = JSON.parse(base64Decoded) as string[];

    if (!Array.isArray(ids) || ids.length === 0) {
      throw new Error('Invalid ID format');
    }

    return ids;
  } catch (error) {
    console.error('Error decoding IDs:', error);
    toast.error('Error loading record: Invalid ID format');
    return [];
  }
};

// Utility to encode IDs for URL
const encodeIds = (ids: string[]): string => {
  const encoded = btoa(JSON.stringify(ids));
  return encodeURIComponent(encoded);
};

export function GenericRecordPage<T extends Record<string, any>, D extends Record<string, any>>(
  props: GenericRecordPageProps & { config: GenericRecordConfig<T, D> }
) {
  const { id, isLoading: initialLoading, config } = props;
  const router = useRouter();

  // State for record navigation
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  // References for form and grid
  const formRef = useRef<HTMLFormElement | null>(null);
  const formMethods = useRef<GenericFormMethods<T> | null>(null);
  const gridRef = useRef<GenericGridMethods<D> | null>(null);

  // Use the entity record hook
  const {
    isLoading,
    entityData,
    detailsData,
    fetchRecord,
    saveRecord,
    updateDetailsData,
    error
  } = useEntityRecord<T, D>(config);

  // Parse IDs from URL parameter
  useEffect(() => {
    if (id && id !== 'new') {
      const parsedIds = parseIds(id);
      setSelectedRecords(parsedIds);

      // Load the first record
      if (parsedIds.length > 0) {
        fetchRecord(parsedIds[0]);
      }
    }
  }, [id, fetchRecord]);

  // Register form methods when form is ready
  const handleFormReady = useCallback((methods: GenericFormMethods<T>) => {
    formMethods.current = methods;
  }, []);

  // Call onGridInitialized when gridRef is available
  useEffect(() => {
    if (gridRef.current && config.onGridInitialized) {
      console.log('Grid initialized, calling callback with:', gridRef.current);
      config.onGridInitialized(gridRef.current);
    }
  }, [config, detailsData]); // Re-run when detailsData changes to ensure grid is fully loaded

  // Additional effect to watch for gridRef changes
  useEffect(() => {
    const checkGridRef = () => {
      if (gridRef.current && config.onGridInitialized) {
        console.log('Grid ref detected, calling onGridInitialized');
        config.onGridInitialized(gridRef.current);
      } else {
        console.log('Grid ref not ready yet:', { gridRef: gridRef.current, callback: !!config.onGridInitialized });
      }
    };

    // Check immediately
    checkGridRef();

    // Also set up a timer to check again after a short delay
    const timer = setTimeout(checkGridRef, 100);

    return () => clearTimeout(timer);
  }, [gridRef, config, detailsData]);

  // Load a specific record by index
  const loadRecord = useCallback((index: number) => {
    if (selectedRecords && selectedRecords.length > index) {
      fetchRecord(selectedRecords[index]);
      setPage(index + 1);
    }
  }, [selectedRecords, fetchRecord]);

  // Handle page change in navigation
  const handlePageChange = useCallback((newPage: number) => {
    if (selectedRecords.length > newPage - 1) {
      loadRecord(newPage - 1);
    } else {
      console.error('Invalid page number:', newPage);
    }
  }, [selectedRecords, loadRecord]);

  // Save the record
  const handleSave = useCallback(async () => {
    try {
      if (!formRef.current || !formMethods.current || !gridRef.current) {
        toast.error('Form or grid not fully initialized');
        return;
      }

      // Get grid changes
      const gridChanges = gridRef.current.getBatchChanges();
      const cleanedGridChanges = prepareGridChangesForSave(gridChanges, config.removableDetailFields || []);

      // Get form data
      const formData = formMethods.current.getValues();

      // Remove detail table data if it exists
      if (formData.serviceDetail) {
        delete formData.serviceDetail;
      }
      cleanedGridChanges.addedRecords.forEach(record => {
        if (record.Service) {
          delete record.Service;
        }
      });
      cleanedGridChanges.changedRecords.forEach(record => {
        if (record.Service) {
          delete record.Service;
        }
      });
      cleanedGridChanges.deletedRecords.forEach(record => {
        if (record.Service) {
          delete record.Service;  
        }
      });

      const isValid = await formMethods.current.trigger();

      if (!isValid) {
        toast.error('Please fix form errors before saving');
        return;
      }

      const isNewRecord = id === 'new' || !formData[config.idField || 'id'];

      // Save the record
      const savedData = await saveRecord(formData, cleanedGridChanges, isNewRecord);

      // Update URL for new records
      if (isNewRecord && savedData && savedData[config.idField || 'id']) {
        const newId = savedData[config.idField || 'id'] as string;
        const encodedIds = encodeIds([newId]);

        // Update browser history and selected records
        window.history.replaceState(null, '', `${config.navigationBasePath}/${encodedIds}`);
        setSelectedRecords([newId]);
      }

    } catch (error) {
      console.error('Save failed:', error);
      toast.error(`Failed to save record: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [id, saveRecord, config]);

  // Main content component
  const Content = useCallback(() => {
    const title = id === 'new'
      ? (config.labels.newTitle || `New ${config.labels.title}`)
      : config.labels.title;

    return (
      <div className="flex flex-col h-full">
        <Toolbar
          showSave
          showAddNew
          showPager
          title={title}
          totalRecords={selectedRecords.length || 1}
          currentPage={page}
          selectedRecords={selectedRecords}
          onPageChange={handlePageChange}
          formRef={formRef as any}
          onSave={handleSave}
          onAddNew={() => {
            router.push(`${config.navigationBasePath}/new`);
          }}
        />
        <div className="flex-1 overflow-auto">
          <TabComponent>
            <TabItemsDirective>
              <TabItemDirective
                header={{ text: config.labels.detailsTabLabel || 'Details' }}
                content={() => (
                  <div className="pt-5">
                    <GenericRecordForm
                      id={id}
                      initialData={entityData}
                      formRef={formRef as any}
                      schema={config.schema}
                      layouts={config.formLayouts}
                      onFormReady={handleFormReady}
                    />
                    <br />
                    <GenericDataGrid
                      ref={gridRef as any}
                      columns={config.detailColumns}
                      data={detailsData}
                      allowEdit={true}
                      height={200}
                      toolbarItems={['Add', 'Delete', 'Cancel', 'Search']}
                      onDataChanged={updateDetailsData}
                    />
                  </div>
                )}
              />
              {config.labels.historyTabLabel && (
                <TabItemDirective
                  header={{ text: config.labels.historyTabLabel }}
                  content={() => (<></>)}
                />
              )}
            </TabItemsDirective>
          </TabComponent>
        </div>
      </div>
    );
  }, [
    id,
    page,
    entityData,
    detailsData,
    selectedRecords,
    handlePageChange,
    handleSave,
    router,
    updateDetailsData,
    handleFormReady,
    config
  ]);

  // Show error if needed
  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <h3 className="text-red-800 font-medium">Error</h3>
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  // Show loading state or content
  return (
    <>
      {<Content />}
    </>
  );
} 