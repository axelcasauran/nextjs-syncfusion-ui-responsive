import { User } from './user';

export interface Department {
    name: string;
    id: string;
    slug: string;
    description: string | null;
    isProtected: boolean;
    isDefault: boolean;
    users?: User[];
}