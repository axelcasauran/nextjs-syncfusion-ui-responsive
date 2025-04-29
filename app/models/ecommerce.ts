
import { User } from './user';

// Models
export interface EcommerceCategory {
  id: string;
  name: string;
  description?: string | null;
  slug: string;
  isTrashed: boolean;
  parentId?: string | null;
  parent?: EcommerceCategory | null;
  children?: EcommerceCategory[];
  products?: EcommerceProduct[];
  createdAt: Date;
  createdByUserId?: string | null;
  createdByUser?: User | null;
}

export interface EcommerceProduct {
  id: string;
  name: string;
  sku?: string | null;
  description?: string | null;
  price: number;
  beforeDiscount?: number | null;
  isTrashed: boolean;
  stockValue: number;
  createdAt: Date;
  categoryId?: string | null;
  category?: EcommerceCategory | null;
  thumbnail?: string | null;
  images?: EcommerceProductImage[];
}

export interface EcommerceProductImage {
  id: string;
  productId: string;
  url: string;
  product?: EcommerceProduct;
}

export interface EcommerceOrder {
  id: string;
  userId: string;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
  isTrashed: boolean;
  user?: User;
  orderItems?: EcommerceOrderItem[];
  createdByUserId?: string | null;
}

export interface EcommerceOrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  order?: EcommerceOrder;
  product?: EcommerceProduct;
}
