import { Service as PrismaService, ServiceDetail as PrismaServiceDetail } from '@prisma/client';
import { User } from '@/src/business-layer/user-management/models/user';

// Base types from Prisma
export type { PrismaService as Service, PrismaServiceDetail as ServiceDetail };

// Extended types for specific use cases
export interface ServiceWithDetails extends PrismaService {
    serviceDetail?: ServiceDetailWithRelations[];
}

export interface ServiceDetailWithRelations extends PrismaServiceDetail {
    service?: PrismaService;
    user?: User;
}

// API response types
export interface ServiceResponse {
    result: ServiceWithDetails[];
    count: number;
}

// Utility type for creating new services
export type ServiceCreate = Omit<PrismaService, 'id' | 'createdAt'>;

// Utility type for updating services
export type ServiceUpdate = Partial<ServiceCreate> & { id: string };