import { useState, useEffect, useCallback } from 'react';
import { superAdminProductsApi, Product, ProductSearchParams } from '../api/superAdminProductsApi';
import { superAdminApi, InventorySalesAnalytics } from '../api/superAdminApi';

// Hook for managing products with search and filtering
export const useProducts = (params?: ProductSearchParams) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    items_per_page: 10
  });

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching products with params:', params);
      const response = await superAdminProductsApi.getProducts(params);
      console.log('Products API response:', response);
      
      // Handle the actual API response format
      // The response.data contains the JSON directly from the API
      if (response.data && response.data.products) {
        console.log('Setting products:', response.data.products);
        setProducts(response.data.products);
        
        // Set pagination from the actual response structure
        setPagination({
          current_page: response.data.currentPage || 1,
          total_pages: response.data.totalPages || 1,
          total_items: response.data.totalCount || 0,
          items_per_page: params?.limit || 10
        });
      } else {
        console.error('No products data in response:', response);
        setError('No products data received');
        setProducts([]);
      }
    } catch (err: any) {
      console.error('Error fetching products:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response,
        status: err.response?.status,
        data: err.response?.data
      });
      setError(err.message || 'Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    pagination,
    refetch: fetchProducts
  };
};

// Hook for product search with advanced filtering
export const useProductSearch = () => {
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchProducts = useCallback(async (searchParams: {
    q?: string;
    category?: string;
    vendor?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: string;
    branch?: string;
    limit?: number;
    page?: number;
  }) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await superAdminProductsApi.searchProducts(searchParams);
      
      if (response.data.success) {
        setSearchResults(response.data.data.products);
      } else {
        setError(response.data.message || 'Search failed');
      }
    } catch (err: any) {
      setError(err.message || 'Search failed');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    searchResults,
    loading,
    error,
    searchProducts
  };
};

// Hook for inventory analytics and statistics
export const useInventoryAnalytics = (params?: {
  branch?: string;
  month?: string;
  year?: string;
}) => {
  const [analytics, setAnalytics] = useState<InventorySalesAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await superAdminApi.getInventorySalesAnalytics(params);
      
      if (response.data.success) {
        setAnalytics(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch analytics');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch analytics');
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    analytics,
    loading,
    error,
    refetch: fetchAnalytics
  };
};

// Hook for product categories
export const useCategories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await superAdminProductsApi.getCategories();
      
      if (response.data.categories) {
        setCategories(response.data.categories);
      } else {
        setError('Failed to fetch categories');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch categories');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories
  };
};

// Hook for products by specific branch
export const useProductsByBranch = (branchId: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBranchProducts = useCallback(async () => {
    if (!branchId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await superAdminProductsApi.getProductsByBranch(branchId);
      
      if (response.data.success) {
        setProducts(response.data.data.products);
      } else {
        setError(response.data.message || 'Failed to fetch branch products');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch branch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [branchId]);

  useEffect(() => {
    fetchBranchProducts();
  }, [fetchBranchProducts]);

  return {
    products,
    loading,
    error,
    refetch: fetchBranchProducts
  };
};

// Hook for managing inventory operations
export const useInventoryOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProduct = useCallback(async (productData: Partial<Product>) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await superAdminProductsApi.createProduct(productData);
      
      if (response.data.product) {
        return response.data.product;
      } else {
        throw new Error(response.data.message || 'Failed to create product');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create product');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProduct = useCallback(async (id: string, productData: Partial<Product>) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await superAdminProductsApi.updateProduct(id, productData);
      
      if (response.data.product) {
        return response.data.product;
      } else {
        throw new Error(response.data.message || 'Failed to update product');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update product');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await superAdminProductsApi.deleteProduct(id);
      
      return response.data.message;
    } catch (err: any) {
      setError(err.message || 'Failed to delete product');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct
  };
};

// Utility functions for inventory management
export const useInventoryUtils = () => {
  // Format price with currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Get stock status and color
  const getStockStatus = (product: Product) => {
    const totalQuantity = product.stockLocation.reduce((total, location) => {
      return total + location.closingQuantity;
    }, 0);

    if (totalQuantity === 0) {
      return {
        status: 'Out of stock',
        color: 'text-red-600',
        bgColor: 'bg-red-50'
      };
    } else if (totalQuantity < 5) {
      return {
        status: 'Low stock',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50'
      };
    } else {
      return {
        status: 'In stock',
        color: 'text-green-600',
        bgColor: 'bg-green-50'
      };
    }
  };

  // Get total quantity across all branches
  const getTotalQuantity = (product: Product) => {
    return product.stockLocation.reduce((total, location) => {
      return total + location.closingQuantity;
    }, 0);
  };

  // Get quantity for specific branch
  const getBranchQuantity = (product: Product, branchName: string) => {
    const location = product.stockLocation.find(loc => 
      loc.branch.name.toLowerCase() === branchName.toLowerCase()
    );
    return location ? location.closingQuantity : 0;
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return {
    formatPrice,
    getStockStatus,
    getTotalQuantity,
    getBranchQuantity,
    formatDate
  };
};
