type ModelFields = {
    [key: string]: string[];
};

export const modelFields: ModelFields = {
    service: ['type', 'name', 'description', 'location','endDate', 'startDate', 'isActive'],
    department: ['name', 'slug', 'description'],
    // Add more models as needed
  };