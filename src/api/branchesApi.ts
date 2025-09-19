import { api } from './apiService';

// Type definitions for branches
export interface Branch {
  _id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone: string;
  email: string;
  manager: {
    _id: string;
    firstName: string;
    lastName: string;
    name: string;
    email: string;
    phone: string;
  };
  status: 'Active' | 'Inactive' | 'Maintenance';
  openingDate: string;
  closingDate?: string;
  description?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  operatingHours: {
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
  };
  settings: {
    timezone: string;
    currency: string;
    language: string;
    allowOnlineOrders: boolean;
    allowWalkIns: boolean;
    maxCapacity: number;
  };
  created_by: {
    _id: string;
    firstName: string;
    lastName: string;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

export interface CreateBranchRequest {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone: string;
  email: string;
  manager: string; // Manager user ID
  description?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  operatingHours?: {
    monday?: { open: string; close: string; closed: boolean };
    tuesday?: { open: string; close: string; closed: boolean };
    wednesday?: { open: string; close: string; closed: boolean };
    thursday?: { open: string; close: string; closed: boolean };
    friday?: { open: string; close: string; closed: boolean };
    saturday?: { open: string; close: string; closed: boolean };
    sunday?: { open: string; close: string; closed: boolean };
  };
  settings?: {
    timezone?: string;
    currency?: string;
    language?: string;
    allowOnlineOrders?: boolean;
    allowWalkIns?: boolean;
    maxCapacity?: number;
  };
}

export interface UpdateBranchRequest {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  manager?: string; // Manager user ID
  status?: 'Active' | 'Inactive' | 'Maintenance';
  description?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  operatingHours?: {
    monday?: { open: string; close: string; closed: boolean };
    tuesday?: { open: string; close: string; closed: boolean };
    wednesday?: { open: string; close: string; closed: boolean };
    thursday?: { open: string; close: string; closed: boolean };
    friday?: { open: string; close: string; closed: boolean };
    saturday?: { open: string; close: string; closed: boolean };
    sunday?: { open: string; close: string; closed: boolean };
  };
  settings?: {
    timezone?: string;
    currency?: string;
    language?: string;
    allowOnlineOrders?: boolean;
    allowWalkIns?: boolean;
    maxCapacity?: number;
  };
}

export interface BranchesResponse {
  branches: Branch[];
}

export interface BranchResponse {
  success: boolean;
  message: string;
  branch: Branch;
}

export interface BranchSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'Active' | 'Inactive' | 'Maintenance';
  city?: string;
  state?: string;
  country?: string;
  manager?: string;
  sortBy?: 'name' | 'created_at' | 'updated_at' | 'openingDate';
  sortOrder?: 'asc' | 'desc';
}

export interface BranchStats {
  totalBranches: number;
  activeBranches: number;
  inactiveBranches: number;
  maintenanceBranches: number;
  branchesByStatus: {
    Active: number;
    Inactive: number;
    Maintenance: number;
  };
  branchesByState: Array<{
    state: string;
    count: number;
  }>;
  branchesByCity: Array<{
    city: string;
    count: number;
  }>;
  recentBranches: Branch[];
  topPerformingBranches: Array<{
    branch: Branch;
    metrics: {
      totalSales: number;
      totalOrders: number;
      customerCount: number;
    };
  }>;
}

// API service functions
export const branchesApi = {
  // Create a new branch (Admin/Super Admin only)
  createBranch: async (branchData: CreateBranchRequest) => {
    return api.post<BranchResponse>('/branches', branchData);
  },

  // Get all branches (public access)
  getBranches: async (params?: BranchSearchParams) => {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.city) queryParams.append('city', params.city);
    if (params?.state) queryParams.append('state', params.state);
    if (params?.country) queryParams.append('country', params.country);
    if (params?.manager) queryParams.append('manager', params.manager);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const url = `/branches${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<BranchesResponse>(url);
  },

  // Get branch by ID (public access)
  getBranchById: async (id: string) => {
    return api.get<BranchResponse>(`/branches/${id}`);
  },

  // Update branch (Admin/Super Admin only)
  updateBranch: async (id: string, updateData: UpdateBranchRequest) => {
    return api.put<BranchResponse>(`/branches/${id}`, updateData);
  },

  // Delete branch (Admin/Super Admin only)
  deleteBranch: async (id: string) => {
    return api.delete<{ success: boolean; message: string }>(`/branches/${id}`);
  },

  // Get branch statistics
  getBranchStats: async (params?: {
    start_date?: string;
    end_date?: string;
    includeMetrics?: boolean;
  }) => {
    const queryParams = new URLSearchParams();
    
    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.end_date) queryParams.append('end_date', params.end_date);
    if (params?.includeMetrics) queryParams.append('includeMetrics', params.includeMetrics.toString());

    const url = `/branches/stats${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<{
      success: boolean;
      message: string;
      data: BranchStats;
    }>(url);
  },

  // Get branches by manager
  getBranchesByManager: async (managerId: string) => {
    return api.get<BranchesResponse>(`/branches/manager/${managerId}`);
  },

  // Get nearby branches
  getNearbyBranches: async (params: {
    latitude: number;
    longitude: number;
    radius?: number; // in kilometers
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    queryParams.append('latitude', params.latitude.toString());
    queryParams.append('longitude', params.longitude.toString());
    if (params.radius) queryParams.append('radius', params.radius.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());

    const url = `/branches/nearby?${queryParams.toString()}`;
    return api.get<BranchesResponse>(url);
  },

  // Update branch status
  updateBranchStatus: async (id: string, status: 'Active' | 'Inactive' | 'Maintenance') => {
    return api.patch<BranchResponse>(`/branches/${id}/status`, { status });
  },

  // Get branch operating hours
  getBranchOperatingHours: async (id: string) => {
    return api.get<{
      success: boolean;
      message: string;
      operatingHours: Branch['operatingHours'];
    }>(`/branches/${id}/hours`);
  },

  // Update branch operating hours
  updateBranchOperatingHours: async (id: string, operatingHours: Branch['operatingHours']) => {
    return api.put<BranchResponse>(`/branches/${id}/hours`, { operatingHours });
  },

  // Get branch settings
  getBranchSettings: async (id: string) => {
    return api.get<{
      success: boolean;
      message: string;
      settings: Branch['settings'];
    }>(`/branches/${id}/settings`);
  },

  // Update branch settings
  updateBranchSettings: async (id: string, settings: Branch['settings']) => {
    return api.put<BranchResponse>(`/branches/${id}/settings`, { settings });
  },

  // Export branches data
  exportBranches: async (params?: BranchSearchParams) => {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.city) queryParams.append('city', params.city);
    if (params?.state) queryParams.append('state', params.state);
    if (params?.country) queryParams.append('country', params.country);
    if (params?.manager) queryParams.append('manager', params.manager);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const url = `/branches/export${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<Blob>(url, {
      responseType: 'blob'
    });
  },

  // Bulk operations
  bulkUpdateBranches: async (branchIds: string[], updateData: UpdateBranchRequest) => {
    return api.put<{ 
      success: boolean; 
      message: string; 
      updatedCount: number;
      updatedBranches: string[];
    }>('/branches/bulk-update', {
      branchIds,
      updateData
    });
  },

  bulkDeleteBranches: async (branchIds: string[]) => {
    return api.delete<{ 
      success: boolean; 
      message: string; 
      deletedCount: number;
      deletedBranches: string[];
    }>('/branches/bulk-delete', {
      data: { branchIds }
    });
  }
};

export default branchesApi;
