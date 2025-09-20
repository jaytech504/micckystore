import { useState, useEffect, useCallback } from 'react';
import { productSalesApi } from '../api/productSalesApi';

export interface ProductSalesStatsData {
  totalSales: number;
  totalRevenue: number;
  averageOrderValue: number;
  totalCustomers: number;
  salesByType: {
    sale: number;
    swap: number;
  };
  salesByPaymentMode: {
    cash: number;
    'Bank Transfer': number;
    POS: number;
  };
  topSellingProducts: Array<{
    product_id: string;
    product_name: string;
    quantity_sold: number;
    revenue: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    sales: number;
    revenue: number;
  }>;
}

export interface UseProductSalesStatsParams {
  start_date?: string;
  end_date?: string;
  branch?: string;
  sales_type?: 'sale' | 'swap';
}

export interface UseProductSalesStatsReturn {
  data: ProductSalesStatsData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearError: () => void;
}

export const useProductSalesStats = (params?: UseProductSalesStatsParams): UseProductSalesStatsReturn => {
  const [data, setData] = useState<ProductSalesStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Use the productSalesApi to get stats (we'll need to add this endpoint to the API)
      // For now, we'll use a mock response structure that matches the expected format
      const response = await productSalesApi.getProductSales({
        page: 1,
        limit: 1000,
        branch: params?.branch,
        sales_type: params?.sales_type,
        start_date: params?.start_date,
        end_date: params?.end_date
      });

      if (response.data && response.data.success && response.data.data) {
        // Transform the sales data into stats format
        const sales = response.data.data;
        
        const stats: ProductSalesStatsData = {
          totalSales: sales.length,
          totalRevenue: sales.reduce((sum, sale) => {
            let total = 0;
            if (sale.buyer_item && sale.buyer_item.length > 0) {
              total += sale.buyer_item.reduce((itemSum: number, item: any) => itemSum + (item.price || 0) * item.quantity, 0);
            }
            if (sale.delivery_fee) total += sale.delivery_fee;
            return sum + total;
          }, 0),
          averageOrderValue: 0,
          totalCustomers: new Set(sales.map(sale => sale.customer_name)).size,
          salesByType: {
            sale: sales.filter(sale => sale.sales_type === 'sale').length,
            swap: sales.filter(sale => sale.sales_type === 'swap').length
          },
          salesByPaymentMode: {
            cash: sales.filter(sale => sale.payment_mode === 'cash').length,
            'Bank Transfer': sales.filter(sale => sale.payment_mode === 'Bank Transfer').length,
            POS: sales.filter(sale => sale.payment_mode === 'POS').length
          },
          topSellingProducts: [], // This would need product details
          monthlyTrends: [] // This would need date grouping
        };

        stats.averageOrderValue = stats.totalSales > 0 ? stats.totalRevenue / stats.totalSales : 0;

        setData(stats);
      } else {
        setError('Failed to fetch product sales statistics');
      }
    } catch (err: any) {
      console.error('Error fetching product sales statistics:', err);
      setError(err.response?.data?.message || 'Failed to load product sales statistics');
    } finally {
      setLoading(false);
    }
  }, [params?.branch, params?.sales_type, params?.start_date, params?.end_date]);

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

