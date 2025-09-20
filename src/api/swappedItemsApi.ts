import { api } from './apiService';

// ===== SWAPPED ITEMS TYPES =====

export interface SwapProduct {
  name: string;
  imei: string;
  valued_price: number;
  quantity: number;
  tax: number;
  images: string[];
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  description: string;
}

export interface ProductSold {
  product_id: string;
  quantity: number;
  tax: number;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
}

export interface SwappedItem {
  _id: string;
  swap_products: SwapProduct[];
  products_sold: ProductSold[];
  amount_added: number;
  customer_info: CustomerInfo;
  branch: string;
  reference: string;
  loyalty_discount?: number;
  delivery_fee?: number;
  notes?: string;
  total_product_value: number;
  status?: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface CreateSwappedItemRequest {
  swap_products: SwapProduct[];
  products_sold: ProductSold[];
  amount_added: number;
  customer_info: CustomerInfo;
  branch: string;
  reference: string;
  loyalty_discount?: number;
  delivery_fee?: number;
  notes?: string;
  total_product_value: number;
}

export interface UpdateSwappedItemRequest {
  status?: 'pending' | 'completed' | 'cancelled';
  notes?: string;
  amount_added?: number;
}

export interface SwappedItemsSearchParams {
  status?: 'pending' | 'completed' | 'cancelled';
  staff_id?: string;
  branch_id?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
}

export interface SwappedItemsStats {
  total_swaps: number;
  total_value: number;
  total_amount_added: number;
  pending_swaps: number;
  completed_swaps: number;
  cancelled_swaps: number;
}

export interface SwappedItemsStatsParams {
  start_date?: string;
  end_date?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface SwappedItemsResponse {
  message: string;
  data: SwappedItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface SwappedItemResponse {
  message: string;
  data: SwappedItem;
}

export interface CreateSwappedItemResponse {
  message: string;
  data: SwappedItem;
}

export interface UpdateSwappedItemResponse {
  message: string;
  data: SwappedItem;
}

export interface DeleteSwappedItemResponse {
  message: string;
}

export interface SwappedItemsStatsResponse {
  message: string;
  data: SwappedItemsStats;
}

// ===== SWAPPED ITEMS API =====

export const swappedItemsApi = {
  /**
   * Create a new swap transaction
   * Where a customer trades in their device for a new product
   */
  createSwappedItem: async (swapData: CreateSwappedItemRequest) => {
    return api.post<CreateSwappedItemResponse>('/swapped-items', swapData);
  },

  /**
   * Get all swaps with filters and pagination
   * Supports filtering by status, staff, branch, and date range
   */
  getSwappedItems: async (params?: SwappedItemsSearchParams) => {
    const queryParams = new URLSearchParams();
    
    if (params?.status) queryParams.append('status', params.status);
    if (params?.staff_id) queryParams.append('staff_id', params.staff_id);
    if (params?.branch_id) queryParams.append('branch_id', params.branch_id);
    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.end_date) queryParams.append('end_date', params.end_date);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const url = `/swapped-items${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<SwappedItemsResponse>(url);
  },

  /**
   * Get a specific swap by ID
   * Retrieve detailed information about a specific swap
   */
  getSwappedItemById: async (id: string) => {
    return api.get<SwappedItemResponse>(`/swapped-items/${id}`);
  },

  /**
   * Update swap status or notes
   * Update the status or notes of a swap
   */
  updateSwappedItem: async (id: string, updateData: UpdateSwappedItemRequest) => {
    return api.put<UpdateSwappedItemResponse>(`/swapped-items/${id}`, updateData);
  },

  /**
   * Delete/cancel swap
   * Delete a swap (only allowed for pending swaps)
   */
  deleteSwappedItem: async (id: string) => {
    return api.delete<DeleteSwappedItemResponse>(`/swapped-items/${id}`);
  },

  /**
   * Get swap statistics
   * Get aggregated statistics for swaps
   */
  getSwappedItemsStats: async (params?: SwappedItemsStatsParams) => {
    const queryParams = new URLSearchParams();
    
    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.end_date) queryParams.append('end_date', params.end_date);

    const url = `/swapped-items/stats${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<SwappedItemsStatsResponse>(url);
  }
};

export default swappedItemsApi;

