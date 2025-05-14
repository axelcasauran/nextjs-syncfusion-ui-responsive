import { User } from '@/src/business-layer/user-management/models/user';

export interface Service {
    id: string;
    name: string;
    description: string;
    type: string;
    location: string;
    startDate?: string;
    endDate?: string;
    isActive?: boolean;
}

export interface ServiceDetail {
    id: string;
    serviceId: string;
    userId: string;
    role: string;
    description: string;
    notes: string;
    isAccepted?: boolean;
    isRequired?: boolean;
    minutes?: string;
    startDate?: string;
    isActive?: boolean;
    service?: Service[];
    user?: User[];
}