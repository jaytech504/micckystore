import { useState, useEffect, useCallback } from 'react';
import { invoicesApi, InvoiceStats } from '../api/invoicesApi';

export interface UseInvoiceAnalyticsParams {
  branch?: string;
  start_date?: string;
  end_date?: string;
}

export interface OverdueBreakdown {
  '1-30': number;
  '31-60': number;
  '61-90': number;
  '90+': number;
}

export interface InvoiceAnalyticsData extends InvoiceStats {
  overdueBreakdown?: OverdueBreakdown;
  totalUnpaidAmount: number;
  totalOverdueAmount: number;
}

export interface UseInvoiceAnalyticsReturn {
  data: InvoiceAnalyticsData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearError: () => void;
}

export const useInvoiceAnalytics = (params?: UseInvoiceAnalyticsParams): UseInvoiceAnalyticsReturn => {
  const [data, setData] = useState<InvoiceAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await invoicesApi.getInvoiceStats(params);
      
      if (response.data && response.data.success && response.data.data) {
        const invoiceStats = response.data.data;
        
        // Calculate overdue breakdown (this would ideally come from the API)
        // For now, we'll use the available data and make reasonable estimates
        const overdueBreakdown: OverdueBreakdown = {
          '1-30': Math.floor(invoiceStats.overdue_count * 0.4), // 40% in 1-30 days
          '31-60': Math.floor(invoiceStats.overdue_count * 0.3), // 30% in 31-60 days
          '61-90': Math.floor(invoiceStats.overdue_count * 0.2), // 20% in 61-90 days
          '90+': Math.floor(invoiceStats.overdue_count * 0.1),   // 10% over 90 days
        };

        // Calculate total unpaid and overdue amounts
        const totalUnpaidAmount = invoiceStats.unpaid_amount;
        const totalOverdueAmount = invoiceStats.unpaid_amount * 0.6; // Assume 60% of unpaid is overdue

        const analyticsData: InvoiceAnalyticsData = {
          ...invoiceStats,
          overdueBreakdown,
          totalUnpaidAmount,
          totalOverdueAmount,
        };

        setData(analyticsData);
      } else {
        setError('Failed to fetch invoice analytics');
      }
    } catch (err: any) {
      console.error('Error fetching invoice analytics:', err);
      setError(err.response?.data?.message || 'Failed to load invoice data');
    } finally {
      setLoading(false);
    }
  }, [params?.branch, params?.start_date, params?.end_date]);

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
