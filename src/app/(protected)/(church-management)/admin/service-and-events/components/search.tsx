/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { API } from '@framework/helper/api';
import { useRouter } from 'next/navigation';
import { SyncfusionGrid } from '@syncfusion/grid/grid';
import { load, SortEventArgs } from '@syncfusion/ej2-react-grids';
import { se } from 'date-fns/locale';
import { set } from 'date-fns';

const SearchPage = () => {

  const router = useRouter();
  const gridRef = useRef<any>(null);
  const [formPage, setFormPage] = useState<{ result: any[], count: number }>({ result: [], count: 0 });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('desc');
  const [isLoading, setIsLoading] = useState(false);

  // Create a ref to track initial load
  const isInitialLoad = useRef(true);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Use for both initial load and subsequent reloads
      const sortFieldParam = sortField ? `&sort=${sortField}` : '';
      const sortDirectionParam = sortDirection ? `&dir=${sortDirection}` : '';
      const pageParam = page ? `&page=${page}` : '';
      const pageSizeParam = pageSize ? `&limit=${pageSize}` : '';
      const searchParam = searchText ? `&search=${encodeURIComponent(searchText)}` : '';
      const url = `${API.service.list}?${sortFieldParam}${sortDirectionParam}${pageParam}${pageSizeParam}${searchParam}`;

      const response = await fetch(url);
      const data = await response.json();

      setFormPage({
        result: data.result || [],
        count: data.count || data.result?.length
      });
      
      isInitialLoad.current = false; // Mark as loaded after any successful load
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [sortField, sortDirection, page, pageSize, searchText]);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  const rowSelected = (args: any) => {
    const selectedRecords = gridRef.current.getSelectedRecords();
    if (selectedRecords && selectedRecords.length > 0) {
      const ids = selectedRecords.map((record: any) => record.id);
      const encodedIds = btoa(JSON.stringify(ids));
      const urlSafeIds = encodeURIComponent(encodedIds);
      router.push(`/admin/service-and-events/${urlSafeIds}`);
    }
  }

  const handlePageChange = async (page: number, pageSize: number) => {
    try {
      setPage(page);
      setPageSize(pageSize);
      await loadData(); // Use the same loadData function
    } catch (error) {
      console.error('Error fetching page:', error);
    }
  };

  const handleSearch = async (searchText: string) => {
    try {
      setSearchText(searchText);
      setPage(1); // Reset to first page on new search
      await loadData(); // Use the same loadData function
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const actionBegin = async (args: SortEventArgs): Promise<void> => {
    console.log('actionBegin', args);
    if (args.requestType === 'sorting') {
      args.cancel = true;
      setSortField(args.columnName ?? 'id');
      setSortDirection(args.direction == 'Ascending' ? 'asc' : 'desc');
      await loadData();
    }
  }

  // const handleSorting = async (args: any) => {
  //   try {
  //     const sortField = args.columnName;
  //     const sortDirection = args.direction.toLowerCase();
  //     const response = await fetch(`${API.service.list}?sortField=${sortField}&sortDirection=${sortDirection}`);
  //     const data = await response.json();

  //     setFormPage({
  //       result: data.result,
  //       count: data.count
  //     });
  //   } catch (error) {
  //     console.error('Error sorting:', error);
  //   }
  // };

  // GRID COLUMN CONFIGURATION
  // This is the configuration for the grid columns. You can modify it as per your requirements.
  const mainGridColumns = [
    { type: 'checkbox', width: 30, isPrimaryKey: true, allowResizing: false, textAlign: 'Center' },
    { field: 'type', headerText: 'Type', width: 45 },
    { field: 'name', headerText: 'Name', width: 100 },
    { field: 'description', headerText: 'Description', width: 100, hideAtMedia: true },
    {
      field: 'startDate',
      headerText: 'Start Date',
      width: 80,
      type: 'date',
      format: 'dd/MM/yyyy hh:mm a',
      visible: true,
      hideAtMedia: true // Will hide on screens smaller than tablet
    },
    {
      field: 'endDate',
      headerText: 'End Date',
      width: 80,
      type: 'date',
      format: 'dd/MM/yyyy hh:mm a',
      visible: true,
      hideAtMedia: true
    },
    { field: 'location', headerText: 'Location', width: 100, hideAtMedia: true },
    {
      field: 'isActive',
      headerText: 'Active',
      width: 40,
      type: 'boolean',
      displayAsCheckBox: true,
      editType: 'booleanedit',
      textAlign: 'Center',
      hideAtMedia: true
    }
  ];

  return (
    <>
      <div className="flex flex-col h-[calc(100vh-120px)]">
        <SyncfusionGrid
          columns={mainGridColumns}
          dataSource={formPage}
          gridRef={gridRef}
          allowSelection={true}
          allowSorting={true}
          onActionBegin={actionBegin}
          onRowSelected={rowSelected}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          height="calc(100vh - 180px)"
          toolbar={{
            title: "Service and Events",
            showSearch: true,
            showAddNew: true,
            showOpen: true,
            onAddNew: () => router.push('/admin/service-and-events/new'),
            onOpenSelected: () => { rowSelected({ rowData: formPage.result.filter((item) => item.isActive) }) },
          }}
        />
      </div>
    </>
  );
};

export default SearchPage;