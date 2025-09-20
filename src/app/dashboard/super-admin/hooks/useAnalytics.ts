import { useState, useEffect } from 'react';
import { superAdminApi, DashboardStats, FinancialAnalytics, InventorySalesAnalytics, BusinessAnalytics, YearlyFinancialAnalytics, CashFlowAnalytics } from '../../../../api/superAdminApi';

// Custom hook for dashboard analytics
export const useDashboardAnalytics = (params?: {
  branch?: string;
  days?: number;
  month?: string;
  year?: string;
}) => {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await superAdminApi.getDashboardAnalytics(params);
        if (response.data.success) {
          setData(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch dashboard analytics');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params?.branch, params?.days, params?.month, params?.year]);

  return { data, loading, error, refetch: () => fetchData() };
};

// Custom hook for financial analytics
export const useFinancialAnalytics = (params?: {
  branch?: string;
  period?: 'week' | 'month' | 'quarter' | 'year';
  start_date?: string;
  end_date?: string;
}) => {
  const [data, setData] = useState<FinancialAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await superAdminApi.getFinancialAnalytics(params);
        if (response.data.success) {
          setData(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch financial analytics');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params?.branch, params?.period, params?.start_date, params?.end_date]);

  return { data, loading, error, refetch: () => fetchData() };
};

// Custom hook for inventory and sales analytics
export const useInventorySalesAnalytics = (params?: {
  branch?: string;
  month?: string;
  year?: string;
}) => {
  const [data, setData] = useState<InventorySalesAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await superAdminApi.getInventorySalesAnalytics(params);
        if (response.data.success) {
          setData(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch inventory sales analytics');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params?.branch, params?.month, params?.year]);

  return { data, loading, error, refetch: () => fetchData() };
};

// Custom hook for business analytics
export const useBusinessAnalytics = (params?: {
  branch?: string;
  month?: string;
  year?: string;
  product_id?: string;
}) => {
  const [data, setData] = useState<BusinessAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await superAdminApi.getBusinessAnalytics(params);
        if (response.data.success) {
          setData(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch business analytics');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params?.branch, params?.month, params?.year, params?.product_id]);

  return { data, loading, error, refetch: () => fetchData() };
};

// Custom hook for yearly financial analytics
export const useYearlyFinancialAnalytics = (params?: {
  branch?: string;
  year?: string;
}) => {
  const [data, setData] = useState<YearlyFinancialAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await superAdminApi.getYearlyFinancialAnalytics(params);
        if (response.data.success) {
          setData(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch yearly financial analytics');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params?.branch, params?.year]);

  return { data, loading, error, refetch: () => fetchData() };
};

// Custom hook for cash flow analytics
export const useCashFlowAnalytics = (params?: {
  branch?: string;
  year?: string;
  month?: string;
}) => {
  const [data, setData] = useState<CashFlowAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await superAdminApi.getCashFlowAnalytics(params);
        if (response.data.success) {
          setData(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch cash flow analytics');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params?.branch, params?.year, params?.month]);

  return { data, loading, error, refetch: () => fetchData() };
};

// Utility function to format currency
export const formatCurrency = (amount: number, currency: string = 'NGN'): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Utility function to format percentage
export const formatPercentage = (value: number): string => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
};

// Utility function to format date
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Utility function to get time ago
export const getTimeAgo = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return formatDate(dateString);
};
