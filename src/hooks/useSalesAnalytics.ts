import { useState, useEffect, useCallback } from 'react';
import { superAdminApi, InventorySalesAnalytics } from '../api/superAdminApi';

export interface UseSalesAnalyticsParams {
  branch?: string;
  month?: string;
  year?: string;
}

export interface TodaySalesData {
  totalSales: number;
  totalOrders: number;
  productsSold: number;
  newCustomers: number;
  salesChange: number;
  ordersChange: number;
  productsChange: number;
  customersChange: number;
}

export interface UseSalesAnalyticsReturn {
  data: InventorySalesAnalytics | null;
  todaySales: TodaySalesData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearError: () => void;
}

export const useSalesAnalytics = (params?: UseSalesAnalyticsParams): UseSalesAnalyticsReturn => {
  const [data, setData] = useState<InventorySalesAnalytics | null>(null);
  const [todaySales, setTodaySales] = useState<TodaySalesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await superAdminApi.getInventorySalesAnalytics(params);
      
      if (response.data && response.data.success && response.data.data) {
        const analyticsData = response.data.data;
        setData(analyticsData);

        // Calculate today's sales data from the analytics
        // This would ideally come from a dedicated today's sales endpoint
        const salesData: TodaySalesData = {
          totalSales: analyticsData.unpaidItems.sales.total,
          totalOrders: analyticsData.unpaidItems.sales.count,
          productsSold: analyticsData.inventory.lowStockAlert.count,
          newCustomers: Math.floor(analyticsData.unpaidItems.sales.count * 0.1), // Estimate 10% of orders are new customers
          salesChange: 8, // These would come from comparison data
          ordersChange: 5,
          productsChange: 1.2,
          customersChange: 0.5,
        };

        setTodaySales(salesData);
      } else {
        setError('Failed to fetch sales analytics');
      }
    } catch (err: any) {
      console.error('Error fetching sales analytics:', err);
      setError(err.response?.data?.message || 'Failed to load sales data');
    } finally {
      setLoading(false);
    }
  }, [params?.branch, params?.month, params?.year]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    data,
    todaySales,
    loading,
    error,
    refetch: fetchAnalytics,
    clearError,
  };
};
