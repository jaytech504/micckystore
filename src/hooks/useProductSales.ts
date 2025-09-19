import { useState, useEffect, useCallback } from 'react';
import { productSalesApi, ProductSales, ProductSalesSearchParams } from '../api/productSalesApi';

export interface UseProductSalesParams extends ProductSalesSearchParams {
  autoFetch?: boolean;
}

export interface UseProductSalesReturn {
  sales: ProductSales[];
  loading: boolean;
  error: string | null;
  pagination: {
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
  } | null;
  refetch: () => Promise<void>;
  clearError: () => void;
  createSale: (saleData: any) => Promise<ProductSales | null>;
  updateSale: (id: string, updateData: any) => Promise<ProductSales | null>;
  deleteSale: (id: string) => Promise<boolean>;
}

export const useProductSales = (params?: UseProductSalesParams): UseProductSalesReturn => {
  const [sales, setSales] = useState<ProductSales[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
  } | null>(null);

  const fetchSales = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productSalesApi.getProductSales(params);
      
      if (response.data.success && response.data.data) {
        setSales(response.data.data);
        setPagination(response.data.pagination);
      } else {
        setError('Failed to fetch product sales');
      }
    } catch (err: any) {
      console.error('Error fetching product sales:', err);
      setError(err.response?.data?.message || 'Failed to load product sales');
    } finally {
      setLoading(false);
    }
  }, [params?.page, params?.limit, params?.search, params?.sales_type, params?.payment_mode, params?.start_date, params?.end_date, params?.branch]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const createSale = useCallback(async (saleData: any): Promise<ProductSales | null> => {
    try {
      setError(null);
      const response = await productSalesApi.createProductSales(saleData);
      
      if (response.data.success && response.data.data) {
        // Add the new sale to the beginning of the list
        setSales(prev => [response.data.data, ...prev]);
        return response.data.data;
      } else {
        setError('Failed to create product sale');
        return null;
      }
    } catch (err: any) {
      console.error('Error creating product sale:', err);
      setError(err.response?.data?.message || 'Failed to create product sale');
      return null;
    }
  }, []);

  const updateSale = useCallback(async (id: string, updateData: any): Promise<ProductSales | null> => {
    try {
      setError(null);
      const response = await productSalesApi.updateProductSales(id, updateData);
      
      if (response.data.success && response.data.data) {
        // Update the sale in the list
        setSales(prev => prev.map(sale => 
          sale._id === id ? response.data.data : sale
        ));
        return response.data.data;
      } else {
        setError('Failed to update product sale');
        return null;
      }
    } catch (err: any) {
      console.error('Error updating product sale:', err);
      setError(err.response?.data?.message || 'Failed to update product sale');
      return null;
    }
  }, []);

  const deleteSale = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      const response = await productSalesApi.deleteProductSales(id);
      
      if (response.data.success) {
        // Remove the sale from the list
        setSales(prev => prev.filter(sale => sale._id !== id));
        return true;
      } else {
        setError('Failed to delete product sale');
        return false;
      }
    } catch (err: any) {
      console.error('Error deleting product sale:', err);
      setError(err.response?.data?.message || 'Failed to delete product sale');
      return false;
    }
  }, []);

  useEffect(() => {
    if (params?.autoFetch !== false) {
      fetchSales();
    }
  }, [fetchSales, params?.autoFetch]);

  return {
    sales,
    loading,
    error,
    pagination,
    refetch: fetchSales,
    clearError,
    createSale,
    updateSale,
    deleteSale,
  };
};
