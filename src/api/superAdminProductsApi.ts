import { api } from './apiService';

// Type definitions for products
export interface Product {
  _id: string;
  itemName: string;
  quantity: number;
  productImages: string[];
  category: {
    _id: string;
    name: string;
    description: string;
  };
  imeiSku: string;
  costPrice: number;
  purchaseDescription: string;
  tax: number;
  profit: string;
  sellingPrice: number;
  sellingDescription: string;
  sellingTax: number;
  vendor: {
    _id: string;
    name: string;
    product: string;
    phone_number: string;
    email: string;
    type: string;
  };
  stockLocation: Array<{
    branch: {
      _id: string;
      name: string;
      address: string;
      state: string;
    };
    openingQuantity: number;
    closingQuantity: number;
  }>;
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    name: string;
    staffId: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  products: Product[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface SearchResponse {
  products: Product[];
  searchInfo: {
    query: string;
    filters: {
      category?: string;
      vendor?: string;
      minPrice?: number;
      maxPrice?: number;
      inStock?: string;
      branch?: string;
    };
    sortBy: string;
    sortOrder: string;
    totalCount: number;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
  };
}

export interface BranchProductsResponse {
  products: Product[];
  totalProducts: number;
  branchId: string;
}

export interface ProductSearchParams {
  search?: string;
  category?: string;
  vendor?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: 'true' | 'false';
  branch?: string;
  sortBy?: 'createdAt' | 'itemName' | 'sellingPrice' | 'quantity';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  page?: number;
}

export interface AdvancedSearchParams {
  q?: string;
  category?: string;
  vendor?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: 'true' | 'false';
  branch?: string;
  sortBy?: 'createdAt' | 'itemName' | 'sellingPrice' | 'quantity';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  page?: number;
}

// Product Sales Types
export interface ProductSaleItem {
  product_id: string;
  quantity: number;
}

export interface Address {
  country: string;
  state: string;
  city: string;
  street: string;
}

export interface ProductSale {
  _id?: string;
  customer_name: string;
  customer_phone_number: string;
  customer_address: string;
  address: Address;
  loyalty_id: string;
  branch: string;
  sales_type: 'sale' | 'swap';
  seller_item: ProductSaleItem[];
  buyer_item?: ProductSaleItem[];
  customer_note?: string;
  delivery_fee?: number;
  payment_mode: 'Bank Transfer' | 'POS' | 'cash';
  bank?: string;
  reference: string;
  email_receipt?: string[];
  delivery_status: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProductSalesResponse {
  success: boolean;
  message: string;
  data: ProductSale[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
  };
}

export interface ProductSalesHistoryResponse {
  success: boolean;
  message: string;
  data: {
    product: {
      _id: string;
      itemName: string;
      category: {
        _id: string;
        name: string;
        description: string;
      };
      costPrice: number;
      sellingPrice: number;
    };
    sales: ProductSale[];
    summary: {
      totalQuantity: number;
      totalRevenue: number;
      averagePrice: number;
      totalSales: number;
    };
    monthlyTrends: Array<{
      _id: {
        year: number;
        month: number;
      };
      quantity: number;
      revenue: number;
      salesCount: number;
    }>;
    pagination: {
      current_page: number;
      total_pages: number;
      total_items: number;
      items_per_page: number;
    };
  };
}

export interface ProductSalesSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  sales_type?: 'sale' | 'swap';
  payment_mode?: 'Bank Transfer' | 'POS' | 'cash';
  start_date?: string;
  end_date?: string;
}

export interface ProductSalesHistoryParams {
  page?: number;
  limit?: number;
  start_date?: string;
  end_date?: string;
  branch?: string;
  sales_type?: 'sale' | 'swap';
  payment_mode?: 'Bank Transfer' | 'POS' | 'cash';
}

// Product Logs Types
export interface ProductLog {
  _id?: string;
  product_id: string;
  activity_type: 'sale' | 'restock' | 'transfer' | 'adjustment' | 'damage' | 'return';
  activity_date: string;
  stock_before: Array<{
    branch: string;
    quantity: number;
  }>;
  stock_after: Array<{
    branch: string;
    quantity: number;
  }>;
  activity_details: {
    customer_details?: {
      name: string;
      email: string;
      phone_number: string;
      address: string;
    };
    sales_receipt?: string;
    quantity_sold?: number;
    unit_price?: number;
    total_amount?: number;
    payment_mode?: 'cash' | 'Bank Transfer' | 'POS';
    sales_person?: string;
  };
  notes?: string;
  created_by: string;
}

export interface ProductLogsResponse {
  success: boolean;
  message: string;
  data: ProductLog[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
  };
}

export interface ProductLogsSearchParams {
  page?: number;
  limit?: number;
  product_id?: string;
  activity_type?: 'sale' | 'restock' | 'transfer' | 'adjustment' | 'damage' | 'return';
  start_date?: string;
  end_date?: string;
  branch?: string;
  search?: string;
}

export interface ProductLogsByProductResponse {
  success: boolean;
  message: string;
  data: {
    product: {
      _id: string;
      itemName: string;
      category: any;
    };
    logs: ProductLog[];
    summary: Array<{
      _id: string;
      count: number;
      totalQuantity: number;
    }>;
    pagination: {
      current_page: number;
      total_pages: number;
      total_items: number;
      items_per_page: number;
    };
  };
}

// API service functions
export const superAdminProductsApi = {
  // Get all categories
  getCategories: async () => {
    return api.get<{ categories: Category[] }>('/categories');
  },

  // Get category by ID
  getCategoryById: async (id: string) => {
    return api.get<{ category: Category }>(`/categories/${id}`);
  },

  // Get all products with search and filtering
  getProducts: async (params?: ProductSearchParams) => {
    const queryParams = new URLSearchParams();
    
    if (params?.search) queryParams.append('search', params.search);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.vendor) queryParams.append('vendor', params.vendor);
    if (params?.minPrice) queryParams.append('minPrice', params.minPrice.toString());
    if (params?.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
    if (params?.inStock) queryParams.append('inStock', params.inStock);
    if (params?.branch) queryParams.append('branch', params.branch);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.page) queryParams.append('page', params.page.toString());

    const url = `/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<ProductsResponse>(url);
  },

  // Search products with advanced filtering
  searchProducts: async (params: AdvancedSearchParams) => {
    const queryParams = new URLSearchParams();
    
    if (params.q) queryParams.append('q', params.q);
    if (params.category) queryParams.append('category', params.category);
    if (params.vendor) queryParams.append('vendor', params.vendor);
    if (params.minPrice) queryParams.append('minPrice', params.minPrice.toString());
    if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
    if (params.inStock) queryParams.append('inStock', params.inStock);
    if (params.branch) queryParams.append('branch', params.branch);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.page) queryParams.append('page', params.page.toString());

    const url = `/products/search${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<SearchResponse>(url);
  },

  // Get products by branch
  getProductsByBranch: async (branchId: string) => {
    return api.get<BranchProductsResponse>(`/products/branch/${branchId}`);
  },

  // Get product by ID
  getProductById: async (id: string) => {
    return api.get<{ product: Product }>(`/products/${id}`);
  },

  // Create new product
  createProduct: async (productData: Partial<Product>) => {
    return api.post<{ product: Product; message: string }>('/products', productData);
  },

  // Update product
  updateProduct: async (id: string, productData: Partial<Product>) => {
    return api.put<{ product: Product; message: string }>(`/products/${id}`, productData);
  },

  // Delete product
  deleteProduct: async (id: string) => {
    return api.delete<{ message: string }>(`/products/${id}`);
  },

  // Bulk operations
  bulkUpdateProducts: async (productIds: string[], updateData: Partial<Product>) => {
    return api.put<{ message: string; updatedCount: number }>('/products/bulk-update', {
      productIds,
      updateData
    });
  },

  // Get product statistics
  getProductStats: async (branch?: string) => {
    const queryParams = new URLSearchParams();
    if (branch) queryParams.append('branch', branch);
    
    const url = `/products/stats${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<{
      totalProducts: number;
      totalValue: number;
      lowStockProducts: number;
      outOfStockProducts: number;
      categoriesCount: number;
    }>(url);
  },

  // Export products
  exportProducts: async (params?: ProductSearchParams) => {
    const queryParams = new URLSearchParams();
    
    if (params?.search) queryParams.append('search', params.search);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.vendor) queryParams.append('vendor', params.vendor);
    if (params?.minPrice) queryParams.append('minPrice', params.minPrice.toString());
    if (params?.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
    if (params?.inStock) queryParams.append('inStock', params.inStock);
    if (params?.branch) queryParams.append('branch', params.branch);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const url = `/products/export${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<Blob>(url, {
      responseType: 'blob'
    });
  },

  // Product Sales API Functions
  // Get all product sales
  getProductSales: async (params?: ProductSalesSearchParams) => {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sales_type) queryParams.append('sales_type', params.sales_type);
    if (params?.payment_mode) queryParams.append('payment_mode', params.payment_mode);
    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.end_date) queryParams.append('end_date', params.end_date);

    const url = `/product-sales${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<ProductSalesResponse>(url);
  },

  // Get product sales by ID
  getProductSaleById: async (id: string) => {
    return api.get<{
      success: boolean;
      message: string;
      data: ProductSale;
    }>(`/product-sales/${id}`);
  },

  // Get sales history for a specific product
  getProductSalesHistory: async (productId: string, params?: ProductSalesHistoryParams) => {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.end_date) queryParams.append('end_date', params.end_date);
    if (params?.branch) queryParams.append('branch', params.branch);
    if (params?.sales_type) queryParams.append('sales_type', params.sales_type);
    if (params?.payment_mode) queryParams.append('payment_mode', params.payment_mode);

    const url = `/product-sales/product/${productId}/history${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<ProductSalesHistoryResponse>(url);
  },

  // Create new product sale
  createProductSale: async (saleData: Partial<ProductSale>) => {
    return api.post<{
      success: boolean;
      message: string;
      data: ProductSale;
    }>('/product-sales', saleData);
  },

  // Update product sale
  updateProductSale: async (id: string, saleData: Partial<ProductSale>) => {
    return api.put<{
      success: boolean;
      message: string;
      data: ProductSale;
    }>(`/product-sales/${id}`, saleData);
  },

  // Delete product sale
  deleteProductSale: async (id: string) => {
    return api.delete<{
      success: boolean;
      message: string;
    }>(`/product-sales/${id}`);
  },

  // Get sales statistics
  getSalesStats: async (params?: {
    start_date?: string;
    end_date?: string;
    branch?: string;
    sales_type?: 'sale' | 'swap';
  }) => {
    const queryParams = new URLSearchParams();
    
    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.end_date) queryParams.append('end_date', params.end_date);
    if (params?.branch) queryParams.append('branch', params.branch);
    if (params?.sales_type) queryParams.append('sales_type', params.sales_type);

    const url = `/product-sales/stats${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<{
      success: boolean;
      message: string;
      data: {
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
      };
    }>(url);
  },

  // Export sales data
  exportSales: async (params?: ProductSalesSearchParams) => {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sales_type) queryParams.append('sales_type', params.sales_type);
    if (params?.payment_mode) queryParams.append('payment_mode', params.payment_mode);
    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.end_date) queryParams.append('end_date', params.end_date);

    const url = `/product-sales/export${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<Blob>(url, {
      responseType: 'blob'
    });
  },

  // Product Logs API Functions
  // Get all product logs
  getProductLogs: async (params?: ProductLogsSearchParams) => {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.product_id) queryParams.append('product_id', params.product_id);
    if (params?.activity_type) queryParams.append('activity_type', params.activity_type);
    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.end_date) queryParams.append('end_date', params.end_date);
    if (params?.branch) queryParams.append('branch', params.branch);
    if (params?.search) queryParams.append('search', params.search);

    const url = `/product-logs${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<ProductLogsResponse>(url);
  },

  // Get product log by ID
  getProductLogById: async (id: string) => {
    return api.get<{
      success: boolean;
      message: string;
      data: ProductLog;
    }>(`/product-logs/${id}`);
  },

  // Get logs for a specific product
  getProductLogsByProduct: async (productId: string, params?: {
    page?: number;
    limit?: number;
    activity_type?: 'sale' | 'restock' | 'transfer' | 'adjustment' | 'damage' | 'return';
    start_date?: string;
    end_date?: string;
    branch?: string;
  }) => {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.activity_type) queryParams.append('activity_type', params.activity_type);
    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.end_date) queryParams.append('end_date', params.end_date);
    if (params?.branch) queryParams.append('branch', params.branch);

    const url = `/product-logs/product/${productId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<ProductLogsByProductResponse>(url);
  }
};
