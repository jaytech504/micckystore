import { useState, useEffect, useCallback } from 'react';
import { superAdminApi, DashboardStats } from '../api/superAdminApi';

export interface UseDashboardAnalyticsParams {
  branch?: string;
  days?: number;
  month?: string;
  year?: string;
}

export interface UseDashboardAnalyticsReturn {
  data: DashboardStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearError: () => void;
}

export const useDashboardAnalytics = (params?: UseDashboardAnalyticsParams): UseDashboardAnalyticsReturn => {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await superAdminApi.getDashboardAnalytics({
        branch: params?.branch,
        days: params?.days,
        month: params?.month,
        year: params?.year
      });

      if (response.data && response.data.success && response.data.data) {
        setData(response.data.data);
      } else {
        setError('Failed to fetch dashboard analytics');
      }
    } catch (err: any) {
      console.error('Error fetching dashboard analytics:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard analytics');
    } finally {
      setLoading(false);
    }
  }, [params?.branch, params?.days, params?.month, params?.year]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    clearError,
  };
};

