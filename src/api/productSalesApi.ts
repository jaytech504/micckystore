import { api } from './apiService';

// Type definitions for product sales
export interface Address {
  country: string;
  state: string;
  city: string;
  street: string;
}

export interface ProductItem {
  product_id: string;
  quantity: number;
}

export interface ProductSales {
  _id?: string;
  customer_name: string;
  customer_phone_number: string;
  customer_address: string;
  address?: Address;
  loyalty_id?: string;
  branch: string;
  sales_type: 'sale' | 'swap';
  seller_item?: ProductItem[];
  buyer_item?: ProductItem[];
  customer_note?: string;
  delivery_fee?: number;
  payment_mode: 'Bank Transfer' | 'POS' | 'cash';
  bank?: string;
  reference?: string;
  email_receipt?: string[];
  points?: number;
  delivery_status?: 'Pending' | 'In Transit' | 'Delivered' | 'Cancelled';
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductSalesRequest {
  customer_name: string;
  customer_phone_number: string;
  customer_address: string;
  loyalty_id?: string;
  branch: string;
  sales_type: 'sale' | 'swap';
  seller_item?: ProductItem[];
  buyer_item?: ProductItem[];
  customer_note?: string;
  delivery_fee?: number;
  payment_mode: 'Bank Transfer' | 'POS' | 'cash';
  bank?: string;
  reference?: string;
  email_receipt?: string[];
  points?: number;
  delivery_status?: 'Pending' | 'In Transit' | 'Delivered' | 'Cancelled';
}

export interface UpdateProductSalesRequest {
  customer_name?: string;
  customer_phone_number?: string;
  customer_address?: string;
  address?: Address;
  loyalty_id?: string;
  branch?: string;
  sales_type?: 'sale' | 'swap';
  seller_item?: ProductItem[];
  buyer_item?: ProductItem[];
  customer_note?: string;
  delivery_fee?: number;
  payment_mode?: 'Bank Transfer' | 'POS' | 'cash';
  bank?: string;
  reference?: string;
  email_receipt?: string[];
  delivery_status?: 'Pending' | 'In Transit' | 'Delivered' | 'Cancelled';
}

export interface ProductSalesSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  sales_type?: 'sale' | 'swap';
  payment_mode?: 'Bank Transfer' | 'POS' | 'cash';
  start_date?: string;
  end_date?: string;
  branch?: string;
}

export interface ProductSalesResponse {
  success: boolean;
  message: string;
  data: ProductSales;
}

export interface ProductSalesListResponse {
  success: boolean;
  message: string;
  data: ProductSales[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
  };
}

export interface ProductSalesStats {
  totalQuantity: number;
  totalRevenue: number;
  averagePrice: number;
  totalSales: number;
}

export interface MonthlyTrend {
  _id: {
    year: number;
    month: number;
  };
  quantity: number;
  revenue: number;
  salesCount: number;
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
    sales: ProductSales[];
    summary: ProductSalesStats;
    monthlyTrends: MonthlyTrend[];
    pagination: {
      current_page: number;
      total_pages: number;
      total_items: number;
      items_per_page: number;
    };
  };
}

// API service functions
export const productSalesApi = {
  // Create a new product sale or swap
  createProductSales: async (salesData: CreateProductSalesRequest) => {
    return api.post<ProductSalesResponse>('/product-sales', salesData);
  },

  // Get all product sales with pagination, search, and filtering
  getProductSales: async (params?: ProductSalesSearchParams) => {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sales_type) queryParams.append('sales_type', params.sales_type);
    if (params?.payment_mode) queryParams.append('payment_mode', params.payment_mode);
    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.end_date) queryParams.append('end_date', params.end_date);
    if (params?.branch) queryParams.append('branch', params.branch);

    const url = `/product-sales${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<ProductSalesListResponse>(url);
  },

  // Get product sales by ID
  getProductSalesById: async (id: string) => {
    return api.get<ProductSalesResponse>(`/product-sales/${id}`);
  },

  // Update product sales
  updateProductSales: async (id: string, updateData: UpdateProductSalesRequest) => {
    return api.put<ProductSalesResponse>(`/product-sales/${id}`, updateData);
  },

  // Delete product sales
  deleteProductSales: async (id: string) => {
    return api.delete<{ success: boolean; message: string }>(`/product-sales/${id}`);
  },

  // Get sales history for a specific product
  getProductSalesHistory: async (
    productId: string, 
    params?: {
      page?: number;
      limit?: number;
      start_date?: string;
      end_date?: string;
      branch?: string;
      sales_type?: 'sale' | 'swap';
      payment_mode?: 'Bank Transfer' | 'POS' | 'cash';
    }
  ) => {
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
  }
};

export default productSalesApi;

