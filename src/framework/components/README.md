# Generic UI Framework

This framework provides reusable components and hooks for building dynamic data-driven interfaces across the application. It enables rapid development of CRUD operations with minimal code duplication.

## Core Architecture

The framework is built around these key concepts:

1. **Entity Data Model**: Consistent data structures for entities and their relationships
2. **Form Generation**: Schema-driven forms using Zod for validation
3. **Data Grid**: Configurable grid with sorting, filtering, and pagination
4. **Record Management**: Reusable patterns for viewing, creating, and editing records
5. **Data Fetching**: Standardized hooks for API communication

## Key Components

### 1. GenericRecordForm

A schema-driven form component that can be configured for any entity type.

```tsx
<GenericRecordForm 
  id="entityId" 
  initialData={entityData} 
  schema={EntitySchema} 
  layouts={formLayouts} 
  onFormReady={handleFormReady} 
/>
```

### 2. GenericDataGrid

A configurable grid component for displaying entity data with advanced features.

```tsx
<GenericDataGrid
  columns={entityColumns}
  data={entityListData}
  allowEdit={true}
  toolbarItems={['Add', 'Delete', 'Search']}
  onDataChanged={updateData}
/>
```

### 3. GenericRecordPage

A complete page component that combines form and grid for entity management.

```tsx
<GenericRecordPage<EntityType, DetailType>
  id={recordId}
  config={entityConfig}
/>
```

### 4. GenericSearchPage

A search/listing page component for filtering and selecting entities.

```tsx
<GenericSearchPage<EntityType>
  config={searchConfig}
/>
```

## Hooks

### 1. useEntityRecord

Manages fetching, saving, and updating entity records.

```tsx
const { 
  isLoading, 
  entityData, 
  detailsData, 
  fetchRecord, 
  saveRecord 
} = useEntityRecord<EntityType, DetailType>(config);
```

### 2. useEntitySearch

Handles search, pagination, and sorting for entity lists.

```tsx
const {
  data,
  isLoading,
  params,
  updateParams,
  updateSort
} = useEntitySearch<EntityType>(config);
```

### 3. useDebounce

Utility hook for debouncing search inputs.

```tsx
const debouncedSearchText = useDebounce(searchText, 300);
```

## Implementation Guide

### Step 1: Define Your Entity Schema

```tsx
import { z } from 'zod';

const EntitySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  // Add other fields...
});
```

### Step 2: Define Form Layouts

```tsx
const formLayouts: FormLayout[] = [
  {
    columns: { xs: 1, sm: 2, md: 3, lg: 4 },
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
        colSpan: { xs: 1, sm: 2, md: 2, lg: 2 }
      },
      // Add other fields...
    ]
  }
];
```

### Step 3: Define Grid Columns

```tsx
const gridColumns: GenericGridColumn[] = [
  { type: 'checkbox', width: 30, allowResizing: false },
  { field: 'id', headerText: 'ID', width: 100, visible: false },
  { field: 'name', headerText: 'Name', width: 150 },
  // Add other columns...
];
```

### Step 4: Configure Entity Settings

```tsx
const entityConfig = {
  baseUrl: '/api/entities',
  entityName: 'Entity',
  idField: 'id',
  detailsField: 'details',
  schema: EntitySchema,
  formLayouts: formLayouts,
  detailColumns: detailGridColumns,
  navigationBasePath: '/admin/entities',
  labels: {
    title: 'Entity Management',
    newTitle: 'New Entity',
    detailsTabLabel: 'Entity Details'
  }
};
```

### Step 5: Implement Pages

```tsx
// Search page
function EntitySearchPage() {
  return <GenericSearchPage<EntityType> config={searchConfig} />;
}

// Record page
function EntityRecordPage({ id }: { id: string }) {
  return <GenericRecordPage<EntityType, DetailType> id={id} config={entityConfig} />;
}
```

## Best Practices

1. **Type Safety**: Always use TypeScript interfaces for your entity types
2. **Schema Validation**: Use Zod to define robust validation rules
3. **Responsive Layouts**: Configure column spans for different screen sizes
4. **Separation of Concerns**: Keep entity configuration separate from UI components
5. **Error Handling**: Implement proper error states and loading indicators

## Example Implementations

See the `src/app/(protected)/(church-management)/admin/service-and-events/search-example.tsx` file for a complete implementation example. 