import axios from 'axios';
import { 
  DashboardStats, 
  Branch, 
  RecentActivity, 
  ChartData, 
  UserInfo 
} from '../types';

// Configure axios base URL - replace with your actual API base URL
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 10000,
});

// Add request interceptor for authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Dashboard API functions
export const dashboardAPI = {
  // Fetch dashboard statistics
  getStats: async (branchId?: string): Promise<DashboardStats> => {
    const params = branchId && branchId !== 'all' ? { branchId } : {};
    const response = await api.get('/dashboard/stats', { params });
    return response.data;
  },

  // Fetch all branches
  getBranches: async (): Promise<Branch[]> => {
    const response = await api.get('/branches');
    return response.data;
  },

  // Fetch recent activities
  getRecentActivities: async (limit: number = 10): Promise<RecentActivity[]> => {
    const response = await api.get('/dashboard/activities', { 
      params: { limit } 
    });
    return response.data;
  },

  // Fetch chart data
  getChartData: async (
    timeRange: 'daily' | 'monthly' = 'daily',
    branchId?: string
  ): Promise<ChartData> => {
    const params: Record<string, string> = { timeRange };
    if (branchId && branchId !== 'all') {
      params.branchId = branchId;
    }
    const response = await api.get('/dashboard/chart', { params });
    return response.data;
  },



  // Fetch user information
  getUserInfo: async (): Promise<UserInfo> => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  // Refresh dashboard data
  refreshDashboard: async (branchId?: string) => {
    const [stats, activities, chartData] = await Promise.all([
      dashboardAPI.getStats(branchId),
      dashboardAPI.getRecentActivities(),
      dashboardAPI.getChartData('daily', branchId),
    ]);
    
    return {
      stats,
      activities,
      chartData,
    };
  },
};

// Example API response types (for reference)
export interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Error handling utility
export const handleAPIError = (error: unknown): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const apiError = error as { response?: { data?: { message?: string } } };
    if (apiError.response?.data?.message) {
      return apiError.response.data.message;
    }
  }
  if (error && typeof error === 'object' && 'message' in error) {
    const errorWithMessage = error as { message: string };
    return errorWithMessage.message;
  }
  return 'An unexpected error occurred';
};

export default api; 