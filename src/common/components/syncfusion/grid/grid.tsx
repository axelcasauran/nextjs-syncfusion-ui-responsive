/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  ColumnDirective,
  ColumnsDirective,
  GridComponent,
  Inject,
  Page,
  Sort,
  Filter,
  Group,
  // Search,
  Toolbar,
  Edit
} from '@syncfusion/ej2-react-grids';
import { SyncfusionGridProps } from './types';
import { ColumnMenu, FilterType, NewRowPosition, SelectionMode } from '@syncfusion/ej2-grids';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { useState, useEffect, useCallback, useRef } from 'react';

export const SyncfusionGrid = ({
  columns,
  dataSource,
  toolbar,
  height = 400,
  allowEdit = false,
  allowSelection = true,
  allowSorting = true,
  allowMultiSorting = true,
  allowFiltering = true,
  allowPaging = true,
  allowResizing = true,
  toolbarItems = [],
  onToolbarClick,
  onRowSelected,
  onBatchSave,
  onActionBegin,
  onPageChange,
  onSearch,
  gridRef,
  pageSettings,
}: SyncfusionGridProps) => {
  const processedColumns = columns.map(column => ({
    ...column,
    hideAtMedia: column.hideAtMedia ? '(min-width: 768px)' : undefined
  }));

  // Default settings
  const filterSettings = { type: 'Menu' as FilterType };

  // Page settings for the grid
  const selectionSettings = {
    mode: 'Row' as SelectionMode,
    type: 'Single' as const,
    enableToggle: false
  };
  const editSettings = {
    newRowPosition: 'Bottom' as NewRowPosition,
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
    showConfirmDialog: true,
    mode: 'Batch' as const
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [filteredCount, setFilteredCount] = useState(0);
  const [value, setValue] = useState('');
  const totalRecords = filteredCount || (dataSource?.count || 0);
  const pageSize = pageSettings?.pageSize || 10;
  const totalPages = Math.ceil(totalRecords / pageSize);

  // Update handlePageChange function
  const handlePageChange = (newPage: number) => {
    if (gridRef?.current && newPage >= 1 && newPage <= totalPages) {
      // Update current page first
      setCurrentPage(newPage);

      // Emit page change event for parent to handle
      if (onPageChange) {
        onPageChange(newPage, pageSize);
      }

      // Update grid page
      gridRef.current.setProperties({
        pageSettings: {
          currentPage: newPage,
          pageSize: pageSize
        }
      });

      // Ensure filtered count matches total records
      setFilteredCount(dataSource?.count || 0);
    }
  };

  // Update getPageRange to use filteredCount when available
  const getPageRange = (currentPage: number, pageSize: number, totalRecords: number) => {
    if (totalRecords === 0) return '0/0';
    const start = ((currentPage - 1) * pageSize) + 1;
    const end = Math.min(currentPage * pageSize, totalRecords);
    return `${start}-${end}/${totalRecords}`;
  };

  // Search function to handle input changes
  const handleClear = () => {
    // Clear the input field first
    setValue('');
    // Then trigger search with empty string to reset    
    if (onSearch) {
      onSearch('');
    }
    setCurrentPage(1);
  };
  
  // Debounce timer reference
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Debounced search function
  const debouncedSearch = useCallback((searchText: string) => {
    // Clear any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Set a new timer
    debounceTimerRef.current = setTimeout(() => {
      if (onSearch) {
        onSearch(searchText);
      }
      setCurrentPage(1);
    }, 300); // 300ms delay
  }, [onSearch]);
  
  const triggerSearch = (searchText: string) => {
    if (onSearch) {
      onSearch(searchText);
    }
    setCurrentPage(1);
  };
  
  const handleInput = (args: React.KeyboardEvent<HTMLInputElement>) => {
    if (args.key === 'Enter') {
      const searchText = args.currentTarget.value || '';
      triggerSearch(searchText);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchText = e.target.value;
    setValue(searchText);
    debouncedSearch(searchText);
  };

  // Cleanup effect to prevent memory leaks
  useEffect(() => {
    return () => {
      // Cleanup debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      
      // Cleanup any resources when component unmounts
      if (gridRef && gridRef.current) {
        // Perform any necessary cleanup for grid
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-full">
      {toolbar && (
        <div className="flex flex-wrap items-center gap-2 mb-2">

          {/* Add and Open buttons */}
          <div className="flex items-center gap-4 ml-auto">
            {toolbar.showAddNew && (
              <>
                {/* Mobile version - icon only */}
                <div className="block md:hidden">
                  <ButtonComponent
                    iconCss="e-icons e-plus"
                    onClick={toolbar.onAddNew}
                    cssClass="e-primary"
                  />
                </div>
                {/* Desktop version - icon + text */}
                <div className="hidden md:block">
                  <ButtonComponent
                    iconCss="e-icons e-plus"
                    onClick={toolbar.onAddNew}
                    content="New"
                    cssClass="e-primary"
                  />
                </div>
              </>
            )}
          </div>
          <div className="flex items-center gap-4 ml-auto">
            {toolbar.showOpen && (
              <>
                {/* Mobile version - icon only */}
                <div className="block md:hidden">
                  <ButtonComponent
                    iconCss="e-icons e-notes"
                    onClick={toolbar.onOpenSelected}
                    cssClass="e-outline"
                  />
                </div>
                {/* Desktop version - icon + text */}
                <div className="hidden md:block">
                  <ButtonComponent
                    iconCss="e-icons e-notes"
                    onClick={toolbar.onOpenSelected}
                    content="Open"
                    cssClass="e-outline"
                  />
                </div>
              </>
            )}
          </div>

          {/* Title - hidden on mobile */}
          <div className="hidden md:block">
            {toolbar.title && (
              <h1 className="text-lg">{toolbar.title}</h1>
            )}
          </div>
          {/* Spacer - grows to fill space */}
          <div className="flex-1"></div>

          {/* Search */}
          {toolbar.showSearch && (
            <div>
              <div className="relative w-64">
                <input
                  type="text"
                  value={value}
                  onChange={handleInputChange}
                  className="e-control e-textbox e-lib e-input"
                  onKeyDown={handleInput}
                  placeholder="Search..."
                />
                {value && (
                  <button
                    type="button"
                    onClick={() => handleClear()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                  >
                    &times;
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Updated Pager - hidden on mobile */}
          <div className="flex items-center gap-4 ml-auto">
            <div className="hidden md:flex items-center gap-2">
              <ButtonComponent
                iconCss="e-icons e-chevron-left"
                cssClass={`e-primary ${currentPage <= 1 ? 'e-disabled' : ''}`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
              />

              <span className="text-sm text-gray-600 min-w-[80px] text-center">
                {getPageRange(currentPage, pageSize, totalRecords)}
              </span>

              <ButtonComponent
                iconCss="e-icons e-chevron-right"
                cssClass={`e-primary ${currentPage * pageSize >= totalRecords ? 'e-disabled' : ''}`}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage * pageSize >= totalRecords}
              />
            </div>
          </div>
        </div>
      )}

      <GridComponent
        // emptyRecordTemplate={() => { return (<span>Click add button to insert record</span>) }}
        ref={gridRef}
        dataSource={dataSource} //dataSource.result it fixed the flicking issue
        allowSorting={allowSorting}
        allowMultiSorting={allowMultiSorting}
        allowFiltering={allowFiltering}
        allowPaging={allowPaging}
        allowResizing={allowResizing}
        showColumnMenu={true}
        pageSettings={{
          pageSize: pageSize,
          pageCount: 2,
          currentPage: currentPage,
          template: ' ', // Custom template for the pager
        }}
        dataBound={() => {
          if (gridRef?.current) {
            const totalCount = dataSource?.count || 0;
            if (filteredCount !== totalCount) {
              setFilteredCount(totalCount);
            }
            setCurrentPage(currentPage);
          }
        }}
        actionComplete={(args) => {
          if (args.requestType === 'searching' || args.requestType === 'filtering') {
            if (gridRef?.current) {
              const filteredData = gridRef.current.currentViewData;
              setFilteredCount(filteredData.length);
              setCurrentPage(1);
              gridRef.current.setProperties({
                pageSettings: {
                  currentPage: 1,
                  pageSize: pageSize
                }
              });
            }
          }
        }}
        filterSettings={filterSettings}
        selectionSettings={selectionSettings}
        allowSelection={allowSelection}
        height={height}
        toolbar={allowEdit ? toolbarItems : undefined}
        editSettings={allowEdit ? editSettings : undefined}
        toolbarClick={onToolbarClick}
        recordDoubleClick={onRowSelected}
        beforeBatchSave={onBatchSave}
        actionBegin={onActionBegin}
      >
        <ColumnsDirective>
          {processedColumns.map((column, index) => (
            <ColumnDirective key={index} {...column} />
          ))}
        </ColumnsDirective>
        <Inject services={[
          Toolbar,
          Page,
          Sort,
          Filter,
          Group,
          // Search,
          ColumnMenu,
          ...(allowEdit ? [Edit] : [])
        ]} />
      </GridComponent>

    </div>
  );
};