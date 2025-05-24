import { useEffect, useRef } from 'react';
import { GridComponent } from '@syncfusion/ej2-react-grids';
import { SortEventArgs } from '@syncfusion/ej2-react-grids';
import { SyncfusionGrid } from '@syncfusion/grid/grid';
import { BaseRecord, SearchGridProps } from './types';
import { useSearch } from './useSearch';

export function SearchGrid<T extends BaseRecord>({
  columns,
  apiEndpoint,
  toolbarConfig,
  onRowSelected,
  defaultSort = 'createdAt',
  defaultSortDir = 'desc',
  gridRef: externalGridRef
}: SearchGridProps<T>) {
  const internalGridRef = useRef<GridComponent>(null);
  const gridReference = externalGridRef || internalGridRef;
  
  const {
    data,
    isLoading,
    handlePageChange,
    handleSearch,
    handleSort,
    loadData
  } = useSearch<T>(apiEndpoint, defaultSort, defaultSortDir);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRowSelected = (args: any) => {
    if (!gridReference.current || !onRowSelected) return;
    
    const selectedRecords = gridReference.current.getSelectedRecords() as T[];
    if (selectedRecords?.length > 0) {
      onRowSelected(selectedRecords);
    }
  };

  const handleActionBegin = async (args: SortEventArgs) => {
    if (args.requestType === 'sorting') {
      args.cancel = true;
      handleSort(
        args.columnName ?? defaultSort,
        args.direction === 'Ascending' ? 'asc' : 'desc'
      );
      await loadData();
    }
  };

  // Create modified toolbar config with access to current data
  const enhancedToolbarConfig = {
    ...toolbarConfig,
    onOpenSelected: toolbarConfig.onOpenSelected 
      ? () => toolbarConfig.onOpenSelected?.(data.result)
      : undefined
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <SyncfusionGrid
        columns={columns}
        dataSource={data}
        gridRef={gridReference as any}
        allowSelection={true}
        allowSorting={true}
        onActionBegin={handleActionBegin}
        onRowSelected={handleRowSelected}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        height="calc(100vh - 180px)"
        toolbar={enhancedToolbarConfig}
      />
    </div>
  );
} 