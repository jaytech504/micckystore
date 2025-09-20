import { useState, useEffect, useCallback } from 'react';
import { superAdminApi, InventorySalesAnalytics } from '../api/superAdminApi';

export interface UseInventorySalesAnalyticsParams {
  branch?: string;
  month?: string;
  year?: string;
}

export interface UseInventorySalesAnalyticsReturn {
  data: InventorySalesAnalytics | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearError: () => void;
}

export const useInventorySalesAnalytics = (params?: UseInventorySalesAnalyticsParams): UseInventorySalesAnalyticsReturn => {
  const [data, setData] = useState<InventorySalesAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await superAdminApi.getInventorySalesAnalytics({
        branch: params?.branch,
        month: params?.month,
        year: params?.year
      });

      if (response.data && response.data.success && response.data.data) {
        setData(response.data.data);
      } else {
        setError('Failed to fetch inventory sales analytics');
      }
    } catch (err: any) {
      console.error('Error fetching inventory sales analytics:', err);
      setError(err.response?.data?.message || 'Failed to load inventory sales analytics');
    } finally {
      setLoading(false);
    }
  }, [params?.branch, params?.month, params?.year]);

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

