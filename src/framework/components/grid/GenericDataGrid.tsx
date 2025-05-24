/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useCallback, useRef, forwardRef, useImperativeHandle, JSX } from 'react';
import { SyncfusionGrid } from '@syncfusion/grid/grid';
import { GridComponent } from '@syncfusion/ej2-react-grids';
import { ActionEventArgs } from '@syncfusion/ej2-react-grids';

export interface GenericGridColumn {
  field?: string;
  headerText?: string;
  width?: number;
  type?: string;
  visible?: boolean;
  textAlign?: 'Left' | 'Right' | 'Center';
  allowResizing?: boolean;
  isPrimaryKey?: boolean;
  displayAsCheckBox?: boolean;
  editType?: string;
  template?: (data: any) => JSX.Element;
  editTemplate?: (data: any) => JSX.Element;
  format?: string;
  headerTemplate?: (data: any) => JSX.Element;
  [key: string]: any;
}

export interface GridBatchChanges<T> {
  addedRecords: T[];
  changedRecords: T[];
  deletedRecords: T[];
}

export interface ToolbarClickArgs {
  text?: string;
  item?: {
    text: string;
  };
  cancel?: boolean;
}

export interface GenericGridMethods<T> {
  getSelectedRecords: () => T[];
  getBatchChanges: () => GridBatchChanges<T>;
  refresh: () => void;
  addRecord: (record: T) => void;
  deleteRecord: (record: T) => void;
  updateCell: (rowIndex: number, field: string, value: any) => void;
  saveCell: () => void;
  getGrid: () => GridComponent | null;
}

export interface GenericDataGridProps<T> {
  columns: GenericGridColumn[];
  data: { result: T[]; count: number };
  idField?: string;
  height?: number | string;
  allowPaging?: boolean;
  allowSorting?: boolean;
  allowFiltering?: boolean;
  allowGrouping?: boolean;
  allowSelection?: boolean;
  allowEdit?: boolean;
  selectionMode?: 'Single' | 'Multiple';
  toolbarItems?: string[];
  onActionBegin?: (args: ActionEventArgs) => void;
  onRowSelected?: (args: { rowData?: T }) => void;
  onToolbarClick?: (args: ToolbarClickArgs) => void;
  onBatchSave?: () => Promise<void>;
  onDataChanged?: (data: { result: T[]; count: number }) => void;
}

function GenericDataGridInner<T extends Record<string, any>>(
  props: GenericDataGridProps<T>,
  ref: React.ForwardedRef<GenericGridMethods<T>>
) {
  const {
    columns,
    data,
    height = 400,
    allowPaging = true,
    allowSorting = true,
    allowFiltering = false,
    allowGrouping = false,
    allowSelection = true,
    allowEdit = false,
    selectionMode = 'Multiple',
    toolbarItems,
    onActionBegin,
    onRowSelected,
    onToolbarClick,
    onBatchSave
  } = props;

  const gridRef = useRef<GridComponent>(null);

  // Methods to expose via ref
  const getSelectedRecords = useCallback(() => {
    if (!gridRef.current) return [];
    return gridRef.current.getSelectedRecords() as T[];
  }, []);

  const getBatchChanges = useCallback(() => {
    if (!gridRef.current) {
      return { addedRecords: [], changedRecords: [], deletedRecords: [] };
    }
    
    // Access the internal getBatchChanges method
    return (gridRef.current as any).getBatchChanges() as GridBatchChanges<T>;
  }, []);

  const refresh = useCallback(() => {
    if (!gridRef.current) return;
    gridRef.current.refresh();
  }, []);

  const addRecord = useCallback((record: T) => {
    if (!gridRef.current) return;
    (gridRef.current as any).addRecord(record);
  }, []);

  const deleteRecord = useCallback((record: T) => {
    if (!gridRef.current) return;
    (gridRef.current as any).deleteRecord(record);
  }, []);

  const updateCell = useCallback((rowIndex: number, field: string, value: any) => {
    if (!gridRef.current) return;
    (gridRef.current as any).updateCell(rowIndex, field, value);
  }, []);

  const saveCell = useCallback(() => {
    if (!gridRef.current) return;
    (gridRef.current as any).saveCell();
  }, []);

  const getGrid = useCallback(() => {
    if (!gridRef.current) return null;
    return gridRef.current as GridComponent;
  }, []);

  // Expose methods via ref
  useImperativeHandle(
    ref,
    () => ({
      getSelectedRecords,
      getBatchChanges,
      refresh,
      addRecord,
      deleteRecord,
      updateCell,
      saveCell,
      getGrid,
    }),
    [getSelectedRecords, getBatchChanges, refresh, addRecord, deleteRecord, updateCell, saveCell, getGrid]
  );

  // Handle action events
  const handleActionBegin = useCallback(
    (args: ActionEventArgs) => {
      if (onActionBegin) {
        onActionBegin(args);
      }
    },
    [onActionBegin]
  );

  // Handle row selection
  const handleRowSelected = useCallback(
    (args: { rowData?: T }) => {
      if (onRowSelected) {
        onRowSelected(args);
      }
    },
    [onRowSelected]
  );

  // Handle toolbar click
  const handleToolbarClick = useCallback(
    (args: ToolbarClickArgs) => {
      if (onToolbarClick) {
        onToolbarClick(args);
      }
    },
    [onToolbarClick]
  );

  // Handle batch save
  const handleBatchSave = useCallback(async () => {
    if (onBatchSave) {
      await onBatchSave();
    }
  }, [onBatchSave]);

  return (
    <SyncfusionGrid
      columns={columns}
      dataSource={data}
      height={height}
      allowPaging={allowPaging}
      allowSorting={allowSorting}
      allowFiltering={allowFiltering}
      allowSelection={allowSelection}
      allowEdit={allowEdit}
      toolbarItems={toolbarItems}
      gridRef={gridRef as any}
      onActionBegin={async (args) => await handleActionBegin(args)}
      onRowSelected={handleRowSelected}
      onToolbarClick={handleToolbarClick}
      onBatchSave={handleBatchSave}
    />
  );
}

export const GenericDataGrid = forwardRef(GenericDataGridInner) as <T extends Record<string, any>>(
  props: GenericDataGridProps<T> & { ref?: React.ForwardedRef<GenericGridMethods<T>> }
) => JSX.Element;

// Utils for common grid operations
export function prepareGridChangesForSave<T extends Record<string, any>>(
  changes: GridBatchChanges<T>,
  fieldsToRemove: string[] = []
): GridBatchChanges<Partial<T>> {
  return {
    addedRecords: changes.addedRecords.map(record => {
      const newRecord = { ...record };
      for (const field of fieldsToRemove) {
        delete newRecord[field];
      }
      return newRecord;
    }),
    changedRecords: changes.changedRecords.map(record => {
      const newRecord = { ...record };
      for (const field of fieldsToRemove) {
        delete newRecord[field];
      }
      return newRecord;
    }),
    deletedRecords: changes.deletedRecords.map(record => {
      // For deletedRecords, we typically just need the ID
      return { id: record.id } as unknown as Partial<T>;
    })
  };
} 