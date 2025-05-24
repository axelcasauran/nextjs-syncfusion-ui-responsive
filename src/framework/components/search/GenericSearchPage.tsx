/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { SyncfusionGrid } from '@syncfusion/grid/grid';
import { SortEventArgs } from '@syncfusion/ej2-react-grids';
import { GridComponent } from '@syncfusion/ej2-react-grids';
import { useEntitySearch, EntitySearchConfig } from '@/src/common/hooks/use-entity-search';
import { GenericGridColumn } from '../grid/GenericDataGrid';

export interface GenericSearchConfig extends EntitySearchConfig {
  columns: GenericGridColumn[];
  detailRoute: string;
  createRoute: string;
  idField?: string;
  selectionMode?: 'Single' | 'Multiple';
  showToolbar?: boolean;
  toolbarOptions?: {
    showAddNew?: boolean;
    showOpen?: boolean;
    showSearch?: boolean;
    showDelete?: boolean;
    showExport?: boolean;
    customTools?: string[];
  };
  encodeIds?: boolean;
}

export interface GenericSearchPageProps {
  config: GenericSearchConfig;
}

export function GenericSearchPage<T extends Record<string, any>>({ config }: GenericSearchPageProps) {
  const router = useRouter();
  const gridRef = useRef<GridComponent>(null);
  
  const {
    columns,
    detailRoute,
    createRoute,
    idField = 'id',
    selectionMode = 'Multiple',
    showToolbar = true,
    toolbarOptions = {
      showAddNew: true,
      showOpen: true,
      showSearch: true,
      showDelete: false,
      showExport: false,
      customTools: []
    },
    encodeIds = true,
    ...searchConfig
  } = config;
  
  const {
    data,
    isLoading,
    error,
    params,
    updateParams,
    updateSort
  } = useEntitySearch<T>(searchConfig);
  
  // Navigate to detail view
  const rowSelected = useCallback((args: any) => {
    if (!gridRef.current) return;
    
    const selectedRecords = gridRef.current.getSelectedRecords();
    if (selectedRecords && selectedRecords.length > 0) {
      const ids = selectedRecords.map((record: any) => record[idField]);
      
      // Either encode IDs or use comma-separated format
      let idParam = encodeIds 
        ? btoa(JSON.stringify(ids)) 
        : ids.join(',');
        
      if (encodeIds) {
        idParam = encodeURIComponent(idParam);
      }
      
      router.push(`${detailRoute}/${idParam}`);
    }
  }, [router, detailRoute, idField, encodeIds]);

  // Handle page changes
  const handlePageChange = useCallback((newPage: number, newPageSize: number) => {
    updateParams({
      page: newPage,
      pageSize: newPageSize
    });
  }, [updateParams]);

  // Handle search input
  const handleSearch = useCallback((text: string) => {
    updateParams({
      searchText: text,
      page: 1 // Reset to first page on new search
    });
  }, [updateParams]);

  // Handle sorting
  const actionBegin = useCallback((args: SortEventArgs): void => {
    if (args.requestType === 'sorting') {
      args.cancel = true;
      if (args.columnName) {
        updateSort(args.columnName);
      }
    }
  }, [updateSort]);
  
  // Generate toolbar items
  const toolbarItems = useCallback(() => {
    const items = [];
    
    if (toolbarOptions.showSearch) items.push('Search');
    if (toolbarOptions.showAddNew) items.push('Add');
    if (toolbarOptions.showOpen) items.push('Open');
    if (toolbarOptions.showDelete) items.push('Delete');
    if (toolbarOptions.showExport) items.push('ExcelExport');
    
    if (toolbarOptions.customTools) {
      items.push(...toolbarOptions.customTools);
    }
    
    return items;
  }, [toolbarOptions]);
  
  // Handle toolbar clicks
  const handleToolbarClick = useCallback((args: any) => {
    const clickHandler = args.item?.id;
    
    if (clickHandler === 'grid_add') {
      router.push(createRoute);
    } else if (clickHandler === 'grid_open' && gridRef.current) {
      const selectedRecords = gridRef.current.getSelectedRecords();
      if (selectedRecords && selectedRecords.length > 0) {
        rowSelected({ rowData: selectedRecords[0] });
      }
    }
  }, [router, createRoute, rowSelected]);

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md mb-4">
          <h3 className="text-red-800 font-medium">Error</h3>
          <p className="text-red-700">{error.message}</p>
        </div>
      )}
      
      <SyncfusionGrid
        columns={columns}
        dataSource={data}
        gridRef={gridRef as any}
        allowSelection={true}
        allowSorting={true}
        // selectionSettings={{ type: selectionMode }}
        onActionBegin={actionBegin as any}
        onRowSelected={rowSelected}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        height="calc(100vh - 180px)"
        toolbar={{
          title: searchConfig.entityName,
          showSearch: toolbarOptions.showSearch,
          showAddNew: toolbarOptions.showAddNew,
          showOpen: toolbarOptions.showOpen,
          onAddNew: () => router.push(createRoute),
          onOpenSelected: () => {
            if (gridRef.current) {
              const selectedRecords = gridRef.current.getSelectedRecords();
              if (selectedRecords && selectedRecords.length > 0) {
                rowSelected({ rowData: selectedRecords[0] });
              }
            }
          },
        }}
        // isLoading={isLoading}
      />
    </div>
  );
} 