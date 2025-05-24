'use client';

import { z } from 'zod';
import { FormLayout } from '@/src/framework/components/record/GenericRecordForm';
import { GenericSearchPage } from '@/src/framework/components/search/GenericSearchPage';
import { GenericRecordPage } from '@/src/framework/components/record/GenericRecordPage';
import { GenericGridColumn } from '@/src/framework/components/grid/GenericDataGrid';
import { ServiceGridRecord, ServiceDetailGridRow } from '@/src/business-layer/church-management/models/prisma-types';
import { API } from '@framework/helper/api';

// 1. Define form validation schema 
const ServiceSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  type: z.string().min(1, 'Type is required'),
  location: z.string().min(1, 'Location is required'),
  startDate: z.date(),
  endDate: z.date().optional().nullable(),
  isActive: z.boolean().default(false),
});

// 2. Define form layouts
const serviceFormLayouts: FormLayout[] = [
  {
    columns: { xs: 1, sm: 2, md: 3, lg: 5 },
    fields: [
      {
        name: 'id',
        label: 'ID',
        type: 'text',
        hidden: true
      },
      {
        name: 'name',
        label: 'Name',
        type: 'text',
        required: true,
        placeholder: 'Enter a name',
        colSpan: { xs: 1, sm: 2, md: 2, lg: 1 }
      },
      {
        name: 'description',
        label: 'Description',
        type: 'text',
        placeholder: 'Provide a brief overview of the service/events',
        colSpan: { xs: 1, sm: 2, md: 2, lg: 3 }
      },
      {
        name: 'isActive',
        label: 'Active Status',
        type: 'checkbox',
        colSpan: { xs: 1, sm: 1, md: 1, lg: 1 }
      }
    ]
  },
  {
    columns: { xs: 1, sm: 2, md: 3, lg: 5 },
    fields: [
      {
        name: 'type',
        label: 'Type',
        type: 'combo',
        required: true,
        options: ['Events', 'Services'],
        colSpan: { xs: 1, sm: 1, md: 1, lg: 1 }
      },
      {
        name: 'location',
        label: 'Location',
        type: 'text',
        required: true,
        placeholder: 'Enter location',
        colSpan: { xs: 1, sm: 2, md: 2, lg: 2 }
      },
      {
        name: 'startDate',
        label: 'Start Date',
        type: 'datetime',
        required: true,
        colSpan: { xs: 1, sm: 1, md: 1, lg: 1 }
      },
      {
        name: 'endDate',
        label: 'End Date',
        type: 'datetime',
        colSpan: { xs: 1, sm: 1, md: 1, lg: 1 }
      }
    ]
  }
];

// 3. Define search grid columns
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

// 4. Define detail grid columns
// This would have the columns for volunteers/people assigned to the service
const serviceDetailColumns: GenericGridColumn[] = [
  { type: 'checkbox', width: 10, allowResizing: false, textAlign: 'Center' },
  { field: 'id', isPrimaryKey: true, visible: false },
  { field: 'serviceId', visible: false },
  { field: 'userId', visible: false },
  {
    field: 'user',
    headerText: 'Name',
    width: 55,
    template: (data: ServiceDetailGridRow) => {
      if (!data?.user) return <span></span>;
      return <span>{data.user.firstName} {data.user.lastName}</span>;
    },
  },
  {
    field: 'role',
    headerText: 'Role',
    width: 40,
    editType: 'dropdownedit',
    edit: {
      params: {
        dataSource: [
          { role: 'Preacher' },
          { role: 'Host' },
          { role: 'Tech' },
          { role: 'Registration' },
          { role: 'Door keeper' },
          { role: 'Volunteer' }
        ],
        fields: { text: 'role', value: 'role' },
        allowFiltering: true,
        filterType: 'Contains'
      }
    },
  },
  { field: 'description', headerText: 'Description', width: 50, hideAtMedia: true },
  { field: 'notes', headerText: 'Notes', width: 50, hideAtMedia: true },
  { field: 'isAccepted', headerText: 'Accepted', width: 25, type: 'boolean', displayAsCheckBox: true, editType: 'booleanedit', textAlign: 'Center', hideAtMedia: true },
  { field: 'isRequired', headerText: 'Required', width: 25, type: 'boolean', displayAsCheckBox: true, editType: 'booleanedit', textAlign: 'Center', hideAtMedia: true },
];

// 5. Search Page Configuration
const serviceSearchConfig = {
  baseUrl: API.service.list,
  entityName: 'Service and Events',
  defaultSortField: 'id',
  defaultSortDirection: 'desc' as const,
  columns: serviceSearchColumns,
  detailRoute: '/admin/service-and-events',
  createRoute: '/admin/service-and-events/new',
  idField: 'id',
  encodeIds: true
};

// 6. Record Page Configuration
const serviceRecordConfig = {
  baseUrl: API.service.post,
  entityName: 'Service',
  idField: 'id',
  detailsField: 'serviceDetail',
  navigationBasePath: '/admin/service-and-events',
  schema: ServiceSchema,
  formLayouts: serviceFormLayouts,
  detailColumns: serviceDetailColumns,
  removableDetailFields: ['user', 'service'],
  labels: {
    title: 'Service and Events',
    newTitle: 'New Service/Event',
    detailsTabLabel: 'Details',
    historyTabLabel: 'History'
  }
};

// 7. Export the components
export function ServiceSearchPageExample() {
  return <GenericSearchPage<ServiceGridRecord> config={serviceSearchConfig} />;
}

export function ServiceRecordPageExample({ id }: { id: string }) {
  return (
    <GenericRecordPage<ServiceGridRecord, ServiceDetailGridRow> 
      id={id} 
      config={serviceRecordConfig} 
    />
  );
} 