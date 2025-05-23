import { User } from '@/src/business-layer/user-management/models/user';

export interface Kid {
    id: string;
    fatherId?: string;
    motherId?: string;
    firstName: string;
    middleName?: string;
    lastName?: string;
    birthDate?: string;
    gender?: string;
    isActive: boolean;
    createdAt: Date;
    createdByUserId?: string | null;
    createdByUser?: User | null;
  }