/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionEventArgs, SortEventArgs, FilterEventArgs } from '@syncfusion/ej2-react-grids';

interface GridActionProps {
  args: ActionEventArgs;
  apiEndpoint: string;
  gridRef: React.RefObject<any>;
  setData: (data: any) => void;
}

export async function gridAction({
  args,
  apiEndpoint,
  gridRef,
  setData
}: GridActionProps) {
  if (args.action === 'clearFilter') {
    const response = await fetch(apiEndpoint);
    if (response.ok) {
      const data = await response.json();
      setData(data);
      gridRef.current?.hideSpinner();
    }
  }
  else if (args.requestType === 'sorting') {
    const sortArgs = args as SortEventArgs;
    const field = sortArgs.columnName;
    const direction = sortArgs.direction?.toLowerCase();
    
    try {
      const params = new URLSearchParams({
        sort: field || '',
        dir: direction || 'asc'
      });

      const response = await fetch(`${apiEndpoint}?${params}`);
      if (response.ok) {
        const data = await response.json();
        setData(data);
        gridRef.current?.hideSpinner();
      }
    } catch (error) {
      console.error('Sorting failed:', error);
      gridRef.current?.hideSpinner();
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

      const response = await fetch(`${apiEndpoint}?${params}`);
      if (response.ok) {
        const data = await response.json();
        setData(data);
        gridRef.current?.hideSpinner();
      }
    } catch (error) {
      console.error('Filtering failed:', error);
      gridRef.current?.hideSpinner();
    }
  }
  else if (args.requestType === 'searching') {
    const searchArgs = args as FilterEventArgs;
    try {
      const params = new URLSearchParams();
      
      if ('searchString' in searchArgs && searchArgs.searchString) {
        params.append('search', String(searchArgs.searchString));
      }

      const response = await fetch(`${apiEndpoint}?${params}`);
      if (response.ok) {
        const data = await response.json();
        setData(data);
        gridRef.current?.hideSpinner();
      }
    } catch (error) {
      console.error('Searching failed:', error);
      gridRef.current?.hideSpinner();
    }
  }
}