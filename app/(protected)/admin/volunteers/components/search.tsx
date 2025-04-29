/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  ActionEventArgs,
  SortEventArgs,
  FilterEventArgs,
  ColumnDirective, ColumnsDirective, GridComponent,
  Inject, Page, Sort, Filter, Group,
  Search,
  SelectionSettingsModel,
  Toolbar
} from '@syncfusion/ej2-react-grids';
// import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { useEffect, useRef, useState } from 'react';
import { redirect } from 'next/navigation';

const SearchPage = () => {

  const pageSettings: object = { pageSize: 10 };
  const filterSettings: object = { type: 'Menu' };
  const toolbarOptions = [{ text: 'New', tooltipText: 'Create New', prefixIcon: 'e-plus', id: 'btnCreateNew' }, 'Print', 'Search'];

  const gridRef = useRef<any>(null);
  const [formPage, setFormPage] = useState([]);
  const selectionSettings: SelectionSettingsModel = { mode: 'Row', type: 'Single', enableToggle: false };

  const rowSelected = (args: any) => {
    const userId = args.rowData.id;
    redirect(`/admin/volunteers/${userId}`);
  }

  useEffect(() => {
      fetch('/api/admin/volunteers')
          .then(res => res.json())
          .then(data => setFormPage(data.result));
  }, []);

  const actionBegin = async (args: ActionEventArgs) => {
    console.log('actionBegin', args);
    if (args.action == 'clearFilter') {
      const response = await fetch(`/api/admin/volunteers`);
        if (response.ok) {
          const data = await response.json();
          setFormPage(data);
          if (gridRef.current) {
            gridRef.current.hideSpinner();
          }
        }
    }
    else if (args.requestType === 'sorting') {
      const sortArgs = args as SortEventArgs;
      const field = sortArgs.columnName;
      const direction = sortArgs.direction?.toLowerCase();
      
      try {
        const params = new URLSearchParams({
          sort: field || '', // Ensure field is a string
          dir: direction || 'asc'
        });

        const response = await fetch(`/api/admin/volunteers?${params}`);
        if (response.ok) {
          const data = await response.json();
          setFormPage(data);
          // End the spinning state
          if (gridRef.current) {
            gridRef.current.hideSpinner();
          }
        }
      } catch (error) {
        console.error('Sorting failed:', error);
        // End the spinning state on error
        if (gridRef.current) {
          gridRef.current.hideSpinner();
        }
      }
    }
    else if (args.requestType === 'filtering') {
      const filterArgs = args as FilterEventArgs;
      try {
        const params = new URLSearchParams();
        
        if (filterArgs.currentFilterObject) {
          params.append('field', filterArgs.currentFilterObject.field || '');
          params.append('operator', filterArgs.currentFilterObject.operator || '');
          params.append('value', String(filterArgs.currentFilterObject.value));
        }

        const response = await fetch(`/api/admin/volunteers?${params}`);
        if (response.ok) {
          const data = await response.json();
          setFormPage(data);
          if (gridRef.current) {
            gridRef.current.hideSpinner();
          }
        }
      } catch (error) {
        console.error('Filtering failed:', error);
        if (gridRef.current) {
          gridRef.current.hideSpinner();
        }
      }
    }
    else if (args.requestType === 'searching') {
      const searchArgs = args as FilterEventArgs;
      try {
        const params = new URLSearchParams();
        
        if ('searchString' in searchArgs && searchArgs.searchString) {
          params.append('search', String(searchArgs.searchString));
        }

        console.log(params);
        
        const response = await fetch(`/api/admin/volunteers?${params}`);
        if (response.ok) {
          const data = await response.json();
          setFormPage(data);
          if (gridRef.current) {
            gridRef.current.hideSpinner();
          }
        }
      } catch (error) {
        console.error('Searching failed:', error);
        if (gridRef.current) {
          gridRef.current.hideSpinner();
        }
      }

    }
  };

  return (
    <>
      <GridComponent
        dataSource={formPage}
        allowSorting={true}
        allowMultiSorting={true}
        allowFiltering={true}
        allowPaging={true}
        pageSettings={pageSettings}
        filterSettings={filterSettings}
        selectionSettings={selectionSettings}
        toolbar={toolbarOptions}
        allowSelection={true}
        recordDoubleClick={rowSelected}
        height={400}
        ref={gridRef}
        actionBegin={actionBegin}  
        key={"grid-2-tw"}
        enableHover={true}
      >
        <ColumnsDirective>
          <ColumnDirective field="firstName" headerText="First Name" width="80" 
            template={(data: any) => (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8">
                    <span className="e-avatar e-avatar-circle e-avatar-small"
                      style={{ 
                        backgroundImage: `url('${data.avatar || '/media/avatars/blank.png'}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'block',
                        width: '100%',
                        height: '100%'
                      }}
                    />
                </div>
                <div className="text-sm text-gray-900 dark:text-gray-50">{data.firstName}</div>
              </div>
            )}
          />
          <ColumnDirective field="lastName" headerText='Last Name' width="80" />
          <ColumnDirective field="email" headerText='Email'width="120"  />
          <ColumnDirective field="mobilenumber" headerText='Mobile #'width="100"  />
          <ColumnDirective field="department.name" headerText='Department'width="100"  />
          <ColumnDirective field="role.name" headerText='Role'width="100"  />
        </ColumnsDirective>
        <Inject services={[Toolbar, Page, Sort, Filter, Group, Search]} />
      </GridComponent>
    </>
  );
};

export default SearchPage;