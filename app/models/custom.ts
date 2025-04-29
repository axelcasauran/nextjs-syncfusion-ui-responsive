export interface AccountNotifications {
  id: string;
  type: string;
  subject: string;
  message: string;
  createdAt: Date;
  entityId: string | null;
  entityType: string | null;
  createdByUserId: string | null;
  createdByName: string | null;
  createdByEmail: string | null;
  createdByAvatar: string | null;
  isRead: boolean;
  isDismissed: boolean;
  readAt: Date | null;
}

export interface DashboardStatistics {
  customers: number;
  orders: number;
  revenue: number;
  sales: {
    date: string;
    total: string;
    count: string;
  }[];
}
