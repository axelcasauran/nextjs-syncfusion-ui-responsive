/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { API } from '@framework/helper/api';
import { SearchGrid } from '@framework/components/search/SearchGrid';
import { BaseRecord } from '@framework/components/search/types';
import { GridComponent } from '@syncfusion/ej2-react-grids';
import {
  createRowSelectionHandler,
  createActiveRecordsHandler,
  createCommonGridColumns,
  createDateColumn,
  createBooleanColumn
} from '@framework/components/search/utils';
import { Service } from '@/src/business-layer/church-management/models/service';

// Extend the Prisma Service type with BaseRecord (which adds any fields needed by the grid)
type ServiceGridRecord = Service & BaseRecord;

const SearchPage = () => {
  const router = useRouter();
  const gridRef = useRef<GridComponent>(null);

  // Create row selection handler
  const handleRowSelected = createRowSelectionHandler<ServiceGridRecord>(
    '/admin/service-and-events',
    router.push
  );

  // Create handler for opening active records
  const handleOpenSelected = createActiveRecordsHandler<ServiceGridRecord>(handleRowSelected);

  // Memoize the grid columns to prevent unnecessary re-renders
  const mainGridColumns = useMemo(() => [
    ...createCommonGridColumns(),
    { field: 'type', headerText: 'Type', width: 45 },
    { field: 'name', headerText: 'Name', width: 100 },
    { field: 'description', headerText: 'Description', width: 100, hideAtMedia: true },
    createDateColumn('startDate', 'Start Date'),
    createDateColumn('endDate', 'End Date'),
    { field: 'location', headerText: 'Location', width: 100, hideAtMedia: true },
    createBooleanColumn('isActive', 'Active')
  ], []);

  return (
    <SearchGrid<ServiceGridRecord>
      columns={mainGridColumns}
      apiEndpoint={API.service.list}
      onRowSelected={handleRowSelected}
      defaultSort="createdAt"
      defaultSortDir="desc"
      gridRef={gridRef}
      toolbarConfig={{
        title: "Service and Events",
        showSearch: true,
        showAddNew: true,
        showOpen: true,
        onAddNew: () => router.push('/admin/service-and-events/new'),
        onOpenSelected: handleOpenSelected
      }}
    />
  );
};

export default SearchPage;