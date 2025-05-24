export interface BaseRecord {
  id: string;
  createdAt?: string | Date;
}

export interface SearchState<T extends BaseRecord> {
  result: T[];
  count: number;
}

export interface SearchParams {
  sort?: string;
  dir?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  search?: string;
}

export interface ToolbarConfig<T extends BaseRecord> {
  title: string;
  showSearch?: boolean;
  showAddNew?: boolean;
  showOpen?: boolean;
  onAddNew?: () => void;
  onOpenSelected?: (currentData: T[]) => void;
}

export interface SearchGridProps<T extends BaseRecord> {
  columns: any[];
  apiEndpoint: string;
  toolbarConfig: ToolbarConfig<T>;
  onRowSelected?: (records: T[]) => void;
  defaultSort?: string;
  defaultSortDir?: 'asc' | 'desc';
  gridRef?: any;
} 