import { Prisma } from '@prisma/client';

// Export Prisma-generated types
export type Service = Prisma.ServiceGetPayload<{
  include: {
    serviceDetail: true;
  };
}>;

export type ServiceDetail = Prisma.ServiceDetailGetPayload<{  
  include: {
    user: true;
    service: true;
  };
}>;

export type ServiceDetailGridRow = Omit<ServiceDetail, 'user'> & {
  fullName: string;
  user: {
    firstName: string;
    lastName: string;
    id: string;
  };
};

export type ServiceFormData = {
  id: string | null;
  name: string;
  location: string;
  type: string;
  startDate: Date;
  endDate: Date | null;
  description: string;
  isActive: boolean | null;
};

export type ServiceGridResponse = {
  result: ServiceDetail[];
  count: number;
};

export type ServiceApiResponse = {
  result: Service;
  message?: string;
};

// Extend the Prisma type if needed
export interface ServiceGridRecord extends Service {
    // Add any UI-specific fields here
    _isNew?: boolean;
    _isModified?: boolean;
}

export interface GridDataState<T> {
    result: T[];
    count: number;
}