import { useState, useEffect, useCallback } from 'react';
import { superAdminApi, FinancialAnalytics } from '../api/superAdminApi';

export interface UseFinancialAnalyticsParams {
  branch?: string;
  period?: 'week' | 'month' | 'quarter' | 'year';
  start_date?: string;
  end_date?: string;
}

export interface UseFinancialAnalyticsReturn {
  data: FinancialAnalytics | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearError: () => void;
}

export const useFinancialAnalytics = (params?: UseFinancialAnalyticsParams): UseFinancialAnalyticsReturn => {
  const [data, setData] = useState<FinancialAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await superAdminApi.getFinancialAnalytics(params);
      
      if (response.data && response.data.success && response.data.data) {
        setData(response.data.data);
      } else {
        setError('Failed to fetch financial analytics');
      }
    } catch (err: any) {
      console.error('Error fetching financial analytics:', err);
      setError(err.response?.data?.message || 'Failed to load financial data');
    } finally {
      setLoading(false);
    }
  }, [params?.branch, params?.period, params?.start_date, params?.end_date]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    data,
    loading,
    error,
    refetch: fetchAnalytics,
    clearError,
  };
};
