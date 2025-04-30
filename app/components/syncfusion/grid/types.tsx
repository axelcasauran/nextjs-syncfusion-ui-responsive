import { JSX } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface GridColumn {
  field?: string;
  headerText?: string;
  width?: number;
  type?: string;
  format?: string;
  visible?: boolean;
  textAlign?: string;
  editType?: string;
  defaultValue?: number;
  allowFiltering?: boolean;
  hideAtMedia?: boolean;
  allowResizing?: boolean;
  displayAsCheckBox?: boolean;
  template?: (props: any) => JSX.Element;
  editTemplate?: (props: any) => JSX.Element;
}

export interface SyncfusionGridProps {
  columns: GridColumn[];
  dataSource: {
    result: any[];
    count: number;
  };
  height?: string | number;
  allowEdit?: boolean;
  allowSelection?: boolean;
  allowSorting?: boolean;
  allowMultiSorting?: boolean;
  allowFiltering?: boolean;
  allowPaging?: boolean;
  allowResizing?: boolean;
  enableToolbar?: boolean;
  toolbarItems?: any[];
  onToolbarClick?: (args: any) => void;
  onRowSelected?: (args: any) => void;
  onBatchSave?: () => Promise<void>;
  onActionBegin?: (args: any) => Promise<void>;
  onPageChange?: (page: number, pageSize: number) => void;
  onSearch?: (searchText: string) => void;
  gridRef?: any;
  pageSettings?: {
    pageSize: number;
    pageSizes?: boolean;
    pageCount?: number;
  };
  toolbar?: {
    title?: string;
    showSearch?: boolean;
    showAddNew?: boolean;
    showOpen?: boolean;
    showPager?: boolean;
    onAddNew?: () => void;
    onOpenSelected?: () => void;
  };
}