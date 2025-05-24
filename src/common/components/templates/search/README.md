# Search Page Template

This directory contains reusable components for creating search pages with consistent functionality across the application.

## SearchPageTemplate

The `SearchPageTemplate` component provides a standardized way to create search pages with the following features:

- Data fetching with pagination, sorting, and filtering
- Debounced search to reduce API calls
- Consistent error handling
- Configurable columns and navigation paths
- Type-safe implementation

### Usage

To create a new search page:

1. Import the SearchPageTemplate component
2. Define your column configuration
3. Configure the template with appropriate API endpoints and routes

```tsx
import { YourDataType } from '@/src/types';
import { API } from '@framework/helper/api';
import SearchPageTemplate from '@/src/components/common/SearchPageTemplate';

const columns = [
  // Define your columns here
  { field: 'id', headerText: 'ID', width: 45 },
  { field: 'name', headerText: 'Name', width: 100 },
  // ...more columns
];

const YourSearchPage = () => {
  return (
    <SearchPageTemplate<YourDataType>
      title="Your Page Title"
      apiEndpoint={API.yourEntity.list}
      columns={columns}
      detailRoute="/your/detail/route"
      createRoute="/your/create/route"
      idField="id"
      initialSort={{ field: 'id', direction: 'desc' }}
      canOpenSelected={(items) => true} // Custom logic for when items can be opened
    />
  );
};

export default YourSearchPage;
```

### Props

| Prop | Type | Description |
|------|------|-------------|
| title | string | The title displayed in the toolbar |
| apiEndpoint | string | The API endpoint to fetch data from |
| columns | array | Column configuration for the grid |
| detailRoute | string | Base route for detail view |
| createRoute | string | Route for creating new items |
| idField | string | Field to use as ID (default: 'id') |
| initialSort | object | Initial sort configuration |
| transformResponse | function | Optional function to transform API response |
| canOpenSelected | function | Function to determine if items can be opened |

## Data Fetching

The template uses URLSearchParams to build the query string with these parameters:

- `sort`: Field to sort by
- `dir`: Sort direction ('asc' or 'desc')
- `page`: Current page number
- `limit`: Items per page
- `search`: Search text (debounced)

Your API endpoint should handle these parameters accordingly.

## Optimizations

- Debounced search input to reduce API calls
- Memoized callbacks to prevent unnecessary renders
- Type safety with TypeScript generics 