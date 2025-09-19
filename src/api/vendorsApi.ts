import { api } from './apiService';

// ===== VENDOR TYPES =====

export interface Vendor {
  _id: string;
  name: string;
  products: string[];
  quantity: number;
  buying_price: number;
  phone_number: string;
  email: string;
  type: 'not taking return' | 'taking return';
  createdAt: string;
  updatedAt: string;
}

export interface CreateVendorRequest {
  name: string;
  products: string[];
  quantity: number;
  buying_price: number;
  phone_number: string;
  email: string;
  type: 'not taking return' | 'taking return';
}

export interface UpdateVendorRequest {
  name?: string;
  product?: string;
  quantity?: number;
  buying_price?: number;
  phone_number?: string;
  email?: string;
  type?: 'not taking return' | 'taking return';
}

export interface VendorStats {
  total_vendors: number;
  vendors_by_type: Array<{
    _id: string;
    count: number;
  }>;
  total_buying_value: number;
}

export interface VendorsSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: 'not taking return' | 'taking return';
  product?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: {
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
  };
  error?: string;
}

// ===== VENDORS API =====

export const vendorsApi = {
  // Create a new vendor
  createVendor: async (vendorData: CreateVendorRequest) => {
    return api.post<ApiResponse<Vendor>>('/vendors', vendorData);
  },

  // Get all vendors with pagination, search, and filtering
  getVendors: async (params?: VendorsSearchParams) => {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.type) queryParams.append('type', params.type);
    if (params?.product) queryParams.append('product', params.product);

    const url = `/vendors${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<ApiResponse<Vendor[]>>(url);
  },

  // Get vendor statistics
  getVendorStats: async () => {
    return api.get<ApiResponse<VendorStats>>('/vendors/stats');
  },

  // Get vendors by type
  getVendorsByType: async (type: 'not taking return' | 'taking return') => {
    return api.get<ApiResponse<Vendor[]>>(`/vendors/type/${type}`);
  },

  // Get vendor by ID
  getVendorById: async (id: string) => {
    return api.get<ApiResponse<Vendor>>(`/vendors/${id}`);
  },

  // Update vendor
  updateVendor: async (id: string, updateData: UpdateVendorRequest) => {
    return api.put<ApiResponse<Vendor>>(`/vendors/${id}`, updateData);
  },

  // Delete vendor
  deleteVendor: async (id: string) => {
    return api.delete<ApiResponse<{ success: boolean; message: string }>>(`/vendors/${id}`);
  }
};

export default vendorsApi;