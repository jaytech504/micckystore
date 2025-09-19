import { api } from './apiService';

// ===== SYSTEM FEATURES TYPES =====

export interface RelatedEntity {
  type: string;
  id: string;
}

export interface Notification {
  _id: string;
  userId: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  category: 'system' | 'user' | 'transaction' | 'inventory' | 'repair' | 'general';
  actionType?: string;
  relatedEntity?: RelatedEntity;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotificationRequest {
  userId: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  category?: 'system' | 'user' | 'transaction' | 'inventory' | 'repair' | 'general';
  actionType?: string;
  relatedEntity?: RelatedEntity;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

export interface UpdateNotificationRequest {
  message?: string;
  type?: 'info' | 'warning' | 'error' | 'success';
  category?: 'system' | 'user' | 'transaction' | 'inventory' | 'repair' | 'general';
  actionType?: string;
  relatedEntity?: RelatedEntity;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

export interface NotificationsSearchParams {
  type?: 'info' | 'warning' | 'error' | 'success';
  category?: 'system' | 'user' | 'transaction' | 'inventory' | 'repair' | 'general';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  read?: boolean;
  page?: number;
  limit?: number;
  start_date?: string;
  end_date?: string;
}

export interface NotificationStats {
  total_notifications: number;
  unread_notifications: number;
  notifications_by_type: Array<{
    type: string;
    count: number;
  }>;
  notifications_by_category: Array<{
    category: string;
    count: number;
  }>;
  notifications_by_priority: Array<{
    priority: string;
    count: number;
  }>;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  notifications?: T[];
  notification?: T;
  error?: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
}

export interface NotificationResponse {
  notification: Notification;
}

export interface CreateNotificationResponse {
  message: string;
  notification: Notification;
}

export interface UpdateNotificationResponse {
  message: string;
  notification: Notification;
}

export interface MarkAsReadResponse {
  message: string;
  notification: Notification;
}

export interface DeleteNotificationResponse {
  message: string;
}

export interface NotificationStatsResponse {
  message: string;
  data: NotificationStats;
}

// ===== SYSTEM FEATURES API =====

export const systemFeaturesApi = {
  /**
   * Get all notifications for the logged-in user
   * Returns list of user's notifications
   */
  getNotifications: async () => {
    return api.get<NotificationsResponse>('/notifications');
  },

  /**
   * Create a notification
   * Admin or Super Admin can create a notification for a user
   */
  createNotification: async (notificationData: CreateNotificationRequest) => {
    return api.post<CreateNotificationResponse>('/notifications', notificationData);
  },

  /**
   * Mark notification as read
   * Mark a notification as read for the logged-in user
   */
  markNotificationAsRead: async (id: string) => {
    return api.patch<MarkAsReadResponse>(`/notifications/${id}/read`);
  }
};

export default systemFeaturesApi;

