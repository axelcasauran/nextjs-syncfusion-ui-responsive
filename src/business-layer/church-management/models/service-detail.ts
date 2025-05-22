import { User } from '@/src/business-layer/user-management/models/user';

export interface ServiceDetail {
    id: string;
    serviceId: string;
    userId: string;
    role: string;
    description?: string;
    notes?: string;
    isAccepted: boolean;
    isRequired: boolean;
    minutes?: number;
    user?: User;
}

export interface ServiceDetailGridRow extends Omit<ServiceDetail, 'user'> {
    user: {
        firstName: string;
        lastName: string;
        id: string;
    };
}

export interface ServiceDetailBatchChanges {
    addedRecords: ServiceDetailGridRow[];
    changedRecords: ServiceDetailGridRow[];
    deletedRecords: ServiceDetailGridRow[];
}

export * from './prisma-types'; 