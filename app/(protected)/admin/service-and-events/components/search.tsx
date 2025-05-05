/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useRef, useState } from 'react';
import { API } from '@/app/framework/helper/api';
import { useRouter  } from 'next/navigation';
import { SyncfusionGrid } from '@/app/components/syncfusion/grid/grid';

const SearchPage = () => {

  const router = useRouter();
  const gridRef = useRef<any>(null);
  const [formPage, setFormPage] = useState<{ result: any[], count: number }>({result: [], count: 0 });

  useEffect(() => {
    console.log('useEffect called');
    fetch(API.service.list)
      .then(res => res.json())
      .then(data => {
        setFormPage({
          result: data.result || [], // The array of records
          count: data.count || data.result?.length // Total count of records
        });
      });
  }, []);

  const rowSelected = (args: any) => {
    const selectedRecords = gridRef.current.getSelectedRecords();
    if (selectedRecords && selectedRecords.length > 0) {
      const selectedIds = selectedRecords.map((record: any) => record.id).join(',');
      router.push(`/admin/service-and-events/${selectedIds}`);
    }
  }

  const handlePageChange = async (page: number, pageSize: number) => {
    try {
      const response = await fetch(`${API.service.list}?page=${page}&pageSize=${pageSize}`);
      const data = await response.json();

      setFormPage({
        result: data.result,
        count: data.count
      });
    } catch (error) {
      console.error('Error fetching page:', error);
    }
  };

  const handleSearch = async (searchText: string) => {
    try {
      const response = await fetch(`${API.service.list}?search=${encodeURIComponent(searchText)}`);
      const data = await response.json();

      setFormPage({
        result: data.result,
        count: data.count
      });
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

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