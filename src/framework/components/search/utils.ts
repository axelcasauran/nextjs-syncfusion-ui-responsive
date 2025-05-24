import { BaseRecord } from './types';

/**
 * Encodes an array of record IDs for URL-safe transmission
 */
export const encodeRecordIds = (records: BaseRecord[]): string => {
  const ids = records.map(record => record.id);
  const encodedIds = btoa(JSON.stringify(ids));
  return encodeURIComponent(encodedIds);
};

/**
 * Decodes URL-safe record IDs back into an array
 */
export const decodeRecordIds = (encodedString: string): string[] => {
  try {
    const decodedString = decodeURIComponent(encodedString);
    const ids = JSON.parse(atob(decodedString));
    return Array.isArray(ids) ? ids : [];
  } catch (error) {
    console.error('Error decoding record IDs:', error);
    return [];
  }
};

/**
 * Creates a navigation handler for grid row selection
 */
export const createRowSelectionHandler = <T extends BaseRecord>(
  baseUrl: string,
  navigate: (url: string) => void
) => {
  return (selectedRecords: T[]) => {
    if (selectedRecords.length > 0) {
      const urlSafeIds = encodeRecordIds(selectedRecords);
      navigate(`${baseUrl}/${urlSafeIds}`);
    }
  };
};

/**
 * Creates a handler for opening active records
 */
export const createActiveRecordsHandler = <T extends BaseRecord & { isActive: boolean }>(
  onRowSelected: (records: T[]) => void
) => {
  return (currentData: T[]) => {
    const activeRecords = currentData.filter(item => item.isActive);
    if (activeRecords.length > 0) {
      onRowSelected(activeRecords);
    }
  };
};

/**
 * Creates common grid column configurations
 */
export const createCommonGridColumns = () => [
  {
    type: 'checkbox',
    width: 30,
    isPrimaryKey: true,
    allowResizing: false,
    textAlign: 'Center'
  },
  {
    field: 'createdAt',
    headerText: 'Created Date',
    width: 80,
    type: 'date',
    format: 'dd/MM/yyyy hh:mm a',
    visible: false
  }
];

/**
 * Creates a date column configuration
 */
export const createDateColumn = (
  field: string,
  headerText: string,
  width: number = 80,
  visible: boolean = true
) => ({
  field,
  headerText,
  width,
  type: 'date',
  format: 'dd/MM/yyyy hh:mm a',
  visible,
  hideAtMedia: true
});

/**
 * Creates a boolean column configuration
 */
export const createBooleanColumn = (
  field: string,
  headerText: string,
  width: number = 40
) => ({
  field,
  headerText,
  width,
  type: 'boolean',
  displayAsCheckBox: true,
  editType: 'booleanedit',
  textAlign: 'Center',
  hideAtMedia: true
}); 