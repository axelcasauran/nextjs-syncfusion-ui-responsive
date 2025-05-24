/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { z } from 'zod';
import { FormLayout } from '@/src/framework/components/record/GenericRecordForm';
import { GenericRecordPage } from '@/src/framework/components/record/GenericRecordPage';
import { GenericGridColumn, GenericGridMethods } from '@/src/framework/components/grid/GenericDataGrid';
import { Service, ServiceDetailGridRow } from '@/src/business-layer/church-management/models/prisma-types';
import { API } from '@framework/helper/api';
import { MultiColumnComboBoxComponent, ColumnsDirective, ColumnDirective } from '@syncfusion/ej2-react-multicolumn-combobox';

interface RecordPageProps {
  id: string;
  isLoading: boolean;
}

interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  fullName: string;
}

interface EditTemplateProps {
  userId?: number;
  user?: UserData;
  [key: string]: unknown; // Allow additional properties for grid row data
}

// User data state - this will be populated when the component mounts
let userData: UserData[] = [
  { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', fullName: 'John Doe' },
  { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', fullName: 'Jane Smith' },
  { id: 3, firstName: 'Bob', lastName: 'Johnson', email: 'bob@example.com', fullName: 'Bob Johnson' },
  { id: 4, firstName: 'Alice', lastName: 'Brown', email: 'alice@example.com', fullName: 'Alice Brown' },
  { id: 5, firstName: 'Charlie', lastName: 'Davis', email: 'charlie@example.com', fullName: 'Charlie Davis' }
];

// Function to fetch and update user data
const initializeUserData = async () => {
  try {
    const response = await fetch(API.user.collection);
    const data = await response.json();
    if (data.result || data) {
      userData = (data.result || data).map((user: any) => ({
        ...user,
        fullName: `${user.firstName} ${user.lastName}`.trim()
      }));
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    // userData already has fallback data
  }
};

// Initialize user data when module loads
initializeUserData();

// Global variable to store the grid reference for updates
let currentGridRef: GenericGridMethods<ServiceDetailGridRow> | null = null;

// Function to set the grid reference
const setGridReference = (gridRef: GenericGridMethods<ServiceDetailGridRow>) => {
  console.log('setGridReference called with:', gridRef);
  currentGridRef = gridRef;
  console.log('currentGridRef is now:', currentGridRef);
};

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

// 3. Define service detail columns for grid
const ServiceDetailsColumns: GenericGridColumn[] = [
  { type: 'checkbox', width: 10, allowResizing: false, textAlign: 'Center' },
  { field: 'id', isPrimaryKey: true, visible: false },
  { field: 'serviceId', visible: false },
  {
    field: 'fullName',
    headerText: 'Name',
    width: 55,
    // template: (data: ServiceDetailGridRow) => {
    //   if (!data?.fullName) return <span></span>;
    //   return <span>{data.fullName}</span>;
    // },
    editType: 'dropdownedit',
    editTemplate: (props: EditTemplateProps) => {
      return <UserEditComponent props={props} />;
    }
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
  { field: 'minutes', headerText: 'Minutes', width: 25, type: 'number', hideAtMedia: true },
  { field: 'isAccepted', headerText: 'Accepted', width: 25, type: 'boolean', displayAsCheckBox: true, editType: 'booleanedit', textAlign: 'Center', hideAtMedia: true },
  { field: 'isRequired', headerText: 'Required', width: 25, type: 'boolean', displayAsCheckBox: true, editType: 'booleanedit', textAlign: 'Center', hideAtMedia: true },
];

// 4. Define record config
const serviceRecordConfig = {
  baseUrl: API.service.post,
  entityName: 'Service',
  idField: 'id',
  detailsField: 'serviceDetail',
  navigationBasePath: '/admin/service-and-events',
  schema: ServiceSchema,
  formLayouts: serviceFormLayouts,
  detailColumns: ServiceDetailsColumns,
  removableDetailFields: ['user', 'service'],
  labels: {
    title: 'Service and Events',
    newTitle: 'New Service/Event',
    detailsTabLabel: 'Details',
    historyTabLabel: 'History'
  },
  onGridInitialized: setGridReference
};

// User Edit Component for the multicolumn combobox
const UserEditComponent = ({ props }: { props: EditTemplateProps }) => {
  return (
    <MultiColumnComboBoxComponent
      dataSource={userData}
      fields={{ text: 'fullName', value: 'fullName' }}
      value={props.fullName?.toString()}
      allowFiltering={true}
      filterType="Contains"
      change={(e: any) => {
        if (e.itemData && currentGridRef) {
          try {
            const selectedUser = e.itemData;
            const grid = currentGridRef.getGrid();
            if (grid) {
              const rowIndex = grid.selectedRowIndex;
              if (rowIndex !== undefined) {
                grid.updateCell(rowIndex, 'userId', selectedUser.id);
                // grid.updateCell(rowIndex, 'fullName', selectedUser.fullName);
                grid.saveCell();
              }
            }
          } catch (error) {
            console.error('Error updating grid:', error);
          }
        }
      }}
    >
      <ColumnsDirective>
        <ColumnDirective field="firstName" header="First Name" width="100" />
        <ColumnDirective field="lastName" header="Last Name" width="100" />
        <ColumnDirective field="email" header="Email" width="150" />
      </ColumnsDirective>
    </MultiColumnComboBoxComponent>
  );
};

// 5. Use GenericRecordPage with proper typing
const RecordPage = ({ id, isLoading }: RecordPageProps) => {
  return (
    <GenericRecordPage<Service, ServiceDetailGridRow>
      id={id}
      isLoading={isLoading}
      config={serviceRecordConfig}
    />
  );
};

export default RecordPage;
