/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useRef, useState } from 'react';
import { API } from '@/app/framework/helper/api';
import { CheckBoxComponent } from '@syncfusion/ej2-react-buttons';
import { redirect } from 'next/navigation';
import { SyncfusionGrid } from '@/app/components/syncfusion/grid/grid';

const SearchPage = () => {

  // const toolbarOptions = [{ text: 'Add New', tooltipText: 'Create New', prefixIcon: 'e-plus', id: 'btnCreateNew' }, 'Search'];
  const gridRef = useRef<any>(null);
  const [formPage, setFormPage] = useState<{ result: any[], count: number }>({ 
    result: [], 
    count: 0 
  });


  useEffect(() => {
    fetch(API.service.get)
      .then(res => res.json())
      .then(data => {
        setFormPage({
          result: data.result || [], // The array of records
          count: data.count || data.result?.length // Total count of records
        });
      });
  }, []);


  const checkBoxTemplate = ((data: any) => {
    return (
      <div>
        <CheckBoxComponent checked={data} disabled={true} />
      </div>
    )
  });


  // const clickHandler = (args: any) => {
  //   console.log(args);
  //   if (args.item) {
  //     if (gridRef && args.item.id === 'btnCreateNew') {
  //       redirect(`/admin/service-and-events/${'new'}`);
  //     }
  //   }
  // }

  const rowSelected = (args: any) => {
    const userId = args.rowData.id;
    redirect(`/admin/service-and-events/${userId}`);
  }

  const mainGridColumns = [
    { field: 'type', headerText: 'Type', width: 100 },
    { field: 'name', headerText: 'Name', width: 100 },
    { field: 'description', headerText: 'Description', width: 100, hideAtMedia: true },
    {
      field: 'date',
      headerText: 'Date',
      width: 80,
      type: 'date',
      format: 'dd/MM/yyyy hh:mm a',
      visible: true,
      hideAtMedia: true // Will hide on screens smaller than tablet
    },
    { field: 'location', headerText: 'Location', width: 100, hideAtMedia: true },
    {
      field: 'isActive',
      headerText: 'Active',
      width: 50,
      template: checkBoxTemplate,
      textAlign: 'Center',
      hideAtMedia: true
    }
  ];

  const handlePageChange = async (page: number, pageSize: number) => {
    try {
      const response = await fetch(`${API.service.get}?page=${page}&pageSize=${pageSize}`);
      const data = await response.json();
      
      setFormPage({
        result: data.result,
        count: data.count // Total count should remain the same
      });
    } catch (error) {
      console.error('Error fetching page:', error);
    }
  };

  const handleSearch = async (searchText: string) => {
    try {
      const response = await fetch(`${API.service.get}?search=${encodeURIComponent(searchText)}`);
      const data = await response.json();
      
      setFormPage({
        result: data.result,
        count: data.count
      });
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

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
            onAddNew: () => redirect('/admin/service-and-events/new')
          }}
        />
      </div>
    </>
  );
};

export default SearchPage;