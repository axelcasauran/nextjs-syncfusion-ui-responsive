import { User } from '@/src/business-layer/user-management/models/user';

export interface Department {
    name: string;
    id: string;
    slug: string;
    description: string | null;
    isProtected: boolean;
    isDefault: boolean;
    users?: User[];
}