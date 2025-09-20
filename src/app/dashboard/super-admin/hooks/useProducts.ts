import { useState, useEffect } from 'react';
import { 
  superAdminProductsApi, 
  Product, 
  Category, 
  ProductsResponse, 
  SearchResponse,
  BranchProductsResponse,
  ProductSearchParams,
  AdvancedSearchParams,
  ProductSale,
  ProductSalesResponse,
  ProductSalesHistoryResponse,
  ProductSalesSearchParams,
  ProductSalesHistoryParams,
  ProductLog,
  ProductLogsResponse,
  ProductLogsSearchParams,
  ProductLogsByProductResponse
} from '../../../../api/superAdminProductsApi';

// Hook for getting all products
export const useProducts = (params?: ProductSearchParams) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    currentPage: 1,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await superAdminProductsApi.getProducts(params);
      setProducts(response.data.products);
      setPagination({
        totalCount: response.data.totalCount,
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        hasNextPage: response.data.hasNextPage,
        hasPrevPage: response.data.hasPrevPage
      });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [JSON.stringify(params)]);

  return {
    products,
    loading,
    error,
    pagination,
    refetch: fetchProducts
  };
};

// Hook for searching products
export const useProductSearch = (params: AdvancedSearchParams) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchInfo, setSearchInfo] = useState<any>(null);

  const searchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await superAdminProductsApi.searchProducts(params);
      setProducts(response.data.products);
      setSearchInfo(response.data.searchInfo);
    } catch (err: any) {
      setError(err.message || 'Failed to search products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    loading,
    error,
    searchInfo,
    searchProducts
  };
};

// Hook for getting categories
export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await superAdminProductsApi.getCategories();
      setCategories(response.data.categories);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch categories');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories
  };
};

// Hook for getting a single product
export const useProduct = (id: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await superAdminProductsApi.getProductById(id);
      setProduct(response.data.product);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch product');
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  return {
    product,
    loading,
    error,
    refetch: fetchProduct
  };
};

// Hook for getting products by branch
export const useProductsByBranch = (branchId: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalProducts, setTotalProducts] = useState(0);

  const fetchProductsByBranch = async () => {
    if (!branchId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await superAdminProductsApi.getProductsByBranch(branchId);
      setProducts(response.data.products);
      setTotalProducts(response.data.totalProducts);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch products by branch');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsByBranch();
  }, [branchId]);

  return {
    products,
    loading,
    error,
    totalProducts,
    refetch: fetchProductsByBranch
  };
};

// Hook for product statistics
export const useProductStats = (branch?: string) => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
    categoriesCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await superAdminProductsApi.getProductStats(branch);
      setStats(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch product statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [branch]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
};

// Hook for product operations (create, update, delete)
export const useProductOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProduct = async (productData: Partial<Product>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await superAdminProductsApi.createProduct(productData);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to create product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await superAdminProductsApi.updateProduct(id, productData);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to update product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await superAdminProductsApi.deleteProduct(id);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to delete product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const bulkUpdateProducts = async (productIds: string[], updateData: Partial<Product>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await superAdminProductsApi.bulkUpdateProducts(productIds, updateData);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to bulk update products');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    bulkUpdateProducts
  };
};

// Hook for getting product sales
export const useProductSales = (params?: ProductSalesSearchParams) => {
  const [sales, setSales] = useState<ProductSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 0,
    total_items: 0,
    items_per_page: 20
  });

  const fetchSales = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await superAdminProductsApi.getProductSales(params);
      setSales(response.data.data);
      setPagination(response.data.pagination);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch sales');
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [JSON.stringify(params)]);

  return {
    sales,
    loading,
    error,
    pagination,
    refetch: fetchSales
  };
};

// Hook for getting a single product sale
export const useProductSale = (id: string) => {
  const [sale, setSale] = useState<ProductSale | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSale = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await superAdminProductsApi.getProductSaleById(id);
      setSale(response.data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch sale');
      setSale(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSale();
  }, [id]);

  return {
    sale,
    loading,
    error,
    refetch: fetchSale
  };
};

// Hook for getting product sales history
export const useProductSalesHistory = (productId: string, params?: ProductSalesHistoryParams) => {
  const [history, setHistory] = useState<ProductSalesHistoryResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    if (!productId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await superAdminProductsApi.getProductSalesHistory(productId, params);
      setHistory(response.data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch sales history');
      setHistory(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [productId, JSON.stringify(params)]);

  return {
    history,
    loading,
    error,
    refetch: fetchHistory
  };
};

// Hook for sales statistics
export const useSalesStats = (params?: {
  start_date?: string;
  end_date?: string;
  branch?: string;
  sales_type?: 'sale' | 'swap';
}) => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    totalCustomers: 0,
    salesByType: {
      sale: 0,
      swap: 0
    },
    salesByPaymentMode: {
      cash: 0,
      'Bank Transfer': 0,
      POS: 0
    },
    topSellingProducts: [] as Array<{
      product_id: string;
      product_name: string;
      quantity_sold: number;
      revenue: number;
    }>,
    monthlyTrends: [] as Array<{
      month: string;
      sales: number;
      revenue: number;
    }>
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await superAdminProductsApi.getSalesStats(params);
      setStats(response.data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch sales statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [JSON.stringify(params)]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
};

// Hook for sales operations (create, update, delete)
export const useSalesOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSale = async (saleData: Partial<ProductSale>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await superAdminProductsApi.createProductSale(saleData);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to create sale');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateSale = async (id: string, saleData: Partial<ProductSale>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await superAdminProductsApi.updateProductSale(id, saleData);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to update sale');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteSale = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await superAdminProductsApi.deleteProductSale(id);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to delete sale');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const exportSales = async (params?: ProductSalesSearchParams) => {
    try {
      setLoading(true);
      setError(null);
      const response = await superAdminProductsApi.exportSales(params);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to export sales');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createSale,
    updateSale,
    deleteSale,
    exportSales
  };
};

// Hook for getting product logs
export const useProductLogs = (params?: ProductLogsSearchParams) => {
  const [logs, setLogs] = useState<ProductLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 0,
    total_items: 0,
    items_per_page: 10
  });

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await superAdminProductsApi.getProductLogs(params);
      setLogs(response.data.data);
      setPagination(response.data.pagination);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch product logs');
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [JSON.stringify(params)]);

  return {
    logs,
    loading,
    error,
    pagination,
    refetch: fetchLogs
  };
};

// Hook for getting a single product log
export const useProductLog = (id: string) => {
  const [log, setLog] = useState<ProductLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLog = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await superAdminProductsApi.getProductLogById(id);
      setLog(response.data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch product log');
      setLog(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLog();
  }, [id]);

  return {
    log,
    loading,
    error,
    refetch: fetchLog
  };
};

// Hook for getting product logs by product
export const useProductLogsByProduct = (productId: string, params?: {
  page?: number;
  limit?: number;
  activity_type?: 'sale' | 'restock' | 'transfer' | 'adjustment' | 'damage' | 'return';
  start_date?: string;
  end_date?: string;
  branch?: string;
}) => {
  const [data, setData] = useState<ProductLogsByProductResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!productId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await superAdminProductsApi.getProductLogsByProduct(productId, params);
      setData(response.data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch product logs');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [productId, JSON.stringify(params)]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
};
