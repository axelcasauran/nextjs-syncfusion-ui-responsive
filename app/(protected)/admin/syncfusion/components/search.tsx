/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  ActionEventArgs,
  SortEventArgs,
  FilterEventArgs,
  ColumnDirective, ColumnsDirective, GridComponent,
  Inject, Page, Sort, Filter, Group,
  Edit,
  Toolbar,
  Search
} from '@syncfusion/ej2-react-grids';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { RiCheckboxCircleFill, RiErrorWarningFill } from '@remixicon/react';

const SearchPage = () => {

  const pageSettings: object = { pageSize: 10 };
  const filterSettings: object = { type: 'Menu' };
  const editOptions = { allowEditing: true, allowAdding: true, allowDeleting: true, showConfirmDialog: true, mode: 'Batch' };
  const toolbarOptions = ['Add', 'Delete', 'Update', 'Cancel', 'Search'];

  const gridRef = useRef<any>(null);
  const [formPage, setFormPage] = useState([]);

  useEffect(() => {
      fetch('/api/admin/syncfusion')
          .then(res => res.json())
          .then(data => setFormPage(data.result));
  }, []);

  const saveChanges = async () => {
    const batchChanges = gridRef.current.getBatchChanges();
    if (!batchChanges || (!batchChanges.addedRecords.length && !batchChanges.changedRecords.length && !batchChanges.deletedRecords.length)) {
      gridRef.current.editModule.endEdit();
      return;
    }

    const response = await fetch('/api/admin/syncfusion/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(batchChanges),
    });

    console.log(response);
    if (response.ok) {
      const refreshResponse = await fetch('/api/admin/syncfusion');
      const newData = await refreshResponse.json();      
      setFormPage(newData.result);

      toast.custom(() => (
        <Alert variant="mono" icon="success">
          <AlertIcon>
            <RiCheckboxCircleFill />
          </AlertIcon>
          <AlertTitle>Sample updated successfully</AlertTitle>
        </Alert>
      ));
      
    }
    else {
      toast.custom(() => (
        <Alert variant="mono" icon="destructive">
          <AlertIcon>
            <RiErrorWarningFill />
          </AlertIcon>
          <AlertTitle>error</AlertTitle>
        </Alert>
      ));
    }
  };

  const actionBegin = async (args: ActionEventArgs) => {
    console.log('actionBegin', args);
    if (args.action == 'clearFilter') {
      const response = await fetch(`/api/admin/syncfusion`);
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

        const response = await fetch(`/api/admin/syncfusion?${params}`);
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

        const response = await fetch(`/api/admin/syncfusion?${params}`);
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
        
        const response = await fetch(`/api/admin/syncfusion?${params}`);
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
        editSettings={editOptions}
        toolbar={toolbarOptions}
        dataSource={formPage}
        allowSorting={true}
        allowMultiSorting={true}
        allowFiltering={true}
        allowPaging={true}
        pageSettings={pageSettings}
        filterSettings={filterSettings}
        height={400}
        ref={gridRef}
        beforeBatchSave={saveChanges}      
        actionBegin={actionBegin}  
      >
        <ColumnsDirective>
          <ColumnDirective field="name" headerText='Name' width="100" />
          <ColumnDirective field="description" headerText='Description' width="100" />
          <ColumnDirective field="slug" headerText='Slug'width="100"  />
        </ColumnsDirective>
        <Inject services={[Edit, Toolbar, Page, Sort, Filter, Group, Search]} />
      </GridComponent>
    </>
  );
};

export default SearchPage;