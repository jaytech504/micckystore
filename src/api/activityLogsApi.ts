import { api } from './apiService';

// ===== ACTIVITY LOGS TYPES =====

export interface ActivityLogUser {
  _id: string;
  firstName: string;
  lastName: string;
  staffId: string;
}

export interface ActivityLog {
  id: string;
  type: string;
  module: 'product' | 'repair' | 'notification';
  action: string;
  description: string;
  entityType: string;
  entityId: string;
  userId: string;
  user: ActivityLogUser;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  data: Record<string, any>;
  metadata: Record<string, any>;
}

export interface ActivityLogsSummary {
  total_logs: number;
  product_logs: number;
  repair_logs: number;
  notifications: number;
}

export interface ActivityLogsResponse {
  logs: ActivityLog[];
  summary: ActivityLogsSummary;
}

export interface ActivityLogsSearchParams {
  page?: number;
  limit?: number;
  module?: 'product' | 'repair' | 'notification';
  action?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  start_date?: string;
  end_date?: string;
  user_id?: string;
  entity_type?: string;
  search?: string;
}

export interface ModuleActivityLogsSearchParams {
  page?: number;
  limit?: number;
  action?: string;
  start_date?: string;
  end_date?: string;
  user_id?: string;
}

export interface EntityActivityLogsSearchParams {
  page?: number;
  limit?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: {
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
  };
}

// ===== ACTIVITY LOGS API =====

export const activityLogsApi = {
  // Get all activity logs with filtering and pagination
  getActivityLogs: async (params?: ActivityLogsSearchParams) => {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.module) queryParams.append('module', params.module);
    if (params?.action) queryParams.append('action', params.action);
    if (params?.severity) queryParams.append('severity', params.severity);
    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.end_date) queryParams.append('end_date', params.end_date);
    if (params?.user_id) queryParams.append('user_id', params.user_id);
    if (params?.entity_type) queryParams.append('entity_type', params.entity_type);
    if (params?.search) queryParams.append('search', params.search);

    const url = `/activity-logs${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<ApiResponse<ActivityLogsResponse>>(url);
  },

  // Get activity logs by module
  getActivityLogsByModule: async (module: 'product' | 'repair' | 'notification', params?: ModuleActivityLogsSearchParams) => {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.action) queryParams.append('action', params.action);
    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.end_date) queryParams.append('end_date', params.end_date);
    if (params?.user_id) queryParams.append('user_id', params.user_id);

    const url = `/activity-logs/${module}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<ApiResponse<ActivityLog[]>>(url);
  },

  // Get activity logs for a specific entity
  getActivityLogsByEntity: async (
    entityType: 'Product' | 'Repair' | 'User' | 'Customer' | 'Vendor', 
    entityId: string, 
    params?: EntityActivityLogsSearchParams
  ) => {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const url = `/activity-logs/entity/${entityType}/${entityId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<ApiResponse<ActivityLog[]>>(url);
  }
};

export default activityLogsApi;
