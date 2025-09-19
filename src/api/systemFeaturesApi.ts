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
   * Returns paginated list of user's notifications
   */
  getNotifications: async (params?: NotificationsSearchParams) => {
    const queryParams = new URLSearchParams();
    
    if (params?.type) queryParams.append('type', params.type);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.priority) queryParams.append('priority', params.priority);
    if (params?.read !== undefined) queryParams.append('read', params.read.toString());
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.end_date) queryParams.append('end_date', params.end_date);

    const url = `/notifications${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<NotificationsResponse>(url);
  },

  /**
   * Create a notification
   * Admin or Super Admin can create a notification for a user
   */
  createNotification: async (notificationData: CreateNotificationRequest) => {
    return api.post<CreateNotificationResponse>('/notifications', notificationData);
  },

  /**
   * Get notification by ID
   * Get specific notification details
   */
  getNotificationById: async (id: string) => {
    return api.get<NotificationResponse>(`/notifications/${id}`);
  },

  /**
   * Update notification
   * Update notification details (Admin/Super Admin only)
   */
  updateNotification: async (id: string, updateData: UpdateNotificationRequest) => {
    return api.put<UpdateNotificationResponse>(`/notifications/${id}`, updateData);
  },

  /**
   * Mark notification as read
   * Mark a notification as read for the logged-in user
   */
  markNotificationAsRead: async (id: string) => {
    return api.patch<MarkAsReadResponse>(`/notifications/${id}/read`);
  },

  /**
   * Mark multiple notifications as read
   * Mark multiple notifications as read for the logged-in user
   */
  markNotificationsAsRead: async (notificationIds: string[]) => {
    return api.patch<{ message: string; updatedCount: number }>('/notifications/read-multiple', {
      notificationIds
    });
  },

  /**
   * Mark all notifications as read
   * Mark all notifications as read for the logged-in user
   */
  markAllNotificationsAsRead: async () => {
    return api.patch<{ message: string; updatedCount: number }>('/notifications/read-all');
  },

  /**
   * Delete notification
   * Delete a notification (Admin/Super Admin only)
   */
  deleteNotification: async (id: string) => {
    return api.delete<DeleteNotificationResponse>(`/notifications/${id}`);
  },

  /**
   * Get notification statistics
   * Get aggregated statistics for notifications
   */
  getNotificationStats: async (params?: { start_date?: string; end_date?: string }) => {
    const queryParams = new URLSearchParams();
    
    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.end_date) queryParams.append('end_date', params.end_date);

    const url = `/notifications/stats${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<NotificationStatsResponse>(url);
  },

  /**
   * Get unread notification count
   * Get count of unread notifications for the logged-in user
   */
  getUnreadNotificationCount: async () => {
    return api.get<{ unreadCount: number }>('/notifications/unread-count');
  }
};

export default systemFeaturesApi;

