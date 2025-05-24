'use client';

import { GenericSearchPage } from '@/src/framework/components/search/GenericSearchPage';
import { GenericGridColumn } from '@/src/framework/components/grid/GenericDataGrid';
import { API } from '@framework/helper/api';
import { ServiceGridRecord } from '@/src/business-layer/church-management/models/prisma-types';

// Service search columns configuration
const serviceSearchColumns: GenericGridColumn[] = [
  { type: 'checkbox', width: 30, allowResizing: false, textAlign: 'Center' },
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
    hideAtMedia: true
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

// Search page configuration
const serviceSearchConfig = {
  baseUrl: API.service.list,
  entityName: 'Service and Events',
  defaultSortField: 'id',
  defaultSortDirection: 'desc' as const,
  columns: serviceSearchColumns,
  detailRoute: '/admin/service-and-events',
  createRoute: '/admin/service-and-events/new',
  idField: 'id',
  encodeIds: true,
  toolbarOptions: {
    showAddNew: true,
    showOpen: true,
    showSearch: true
  }
};

export default function ServiceSearch() {
  return <GenericSearchPage<ServiceGridRecord> config={serviceSearchConfig} />;
} 