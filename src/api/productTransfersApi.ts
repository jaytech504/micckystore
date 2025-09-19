import { api } from './apiService';

// Type definitions for product transfers
export interface ProductTransfer {
  _id: string;
  product: {
    _id: string;
    itemName: string;
    quantity: number;
    imeiSku: string;
    costPrice: number;
    purchaseDescription: string;
    sellingPrice: number;
    stockLocation: Array<{
      branch: string;
      openingQuantity: number;
      closingQuantity: number;
      _id: string;
    }>;
  };
  transfer_from: {
    _id: string;
    name: string;
    address: string;
    state: string;
    country: string;
    zipCode: string;
  };
  transfer_to: {
    _id: string;
    name: string;
    address: string;
    state: string;
    country: string;
    zipCode: string;
  };
  transfer_reason: string;
  quantity: number;
  request_status: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
  date_of_transfer_request: string;
  date_of_product_transfer?: string;
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    name: string;
    staffId: string;
    email: string;
  };
  approvedBy?: {
    _id: string;
    firstName: string;
    lastName: string;
    name: string;
    staffId: string;
    email: string;
  } | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
  // Transformed fields for compatibility
  created_by?: {
    _id: string;
    firstName: string;
    lastName: string;
    name: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface CreateTransferRequest {
  product: string;
  transfer_from: string;
  transfer_to: string;
  transfer_reason: string;
  quantity: number;
}

export interface UpdateTransferRequest {
  transfer_reason?: string;
  quantity?: number;
  date_of_product_transfer?: string;
}

export interface ApproveTransferRequest {
  request_status: 'Approved' | 'Rejected';
  date_of_product_transfer?: string;
}

export interface CompleteTransferRequest {
  date_of_product_transfer: string;
}

export interface TransferRequestsResponse {
  success: boolean;
  message: string;
  transferRequests: ProductTransfer[];
  pagination?: {
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
  };
}

export interface TransferRequestResponse {
  success: boolean;
  message: string;
  transferRequest: ProductTransfer;
}

export interface TransferSearchParams {
  page?: number;
  limit?: number;
  status?: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
  product?: string;
  transfer_from?: string;
  transfer_to?: string;
  created_by?: string;
  start_date?: string;
  end_date?: string;
  search?: string;
}

// API service functions
export const productTransfersApi = {
  // Create a new product transfer request
  createTransferRequest: async (transferData: CreateTransferRequest) => {
    return api.post<TransferRequestResponse>('/product-transfers', transferData);
  },

  // Get all transfer requests
  getTransferRequests: async (params?: TransferSearchParams) => {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.product) queryParams.append('product', params.product);
    if (params?.transfer_from) queryParams.append('transfer_from', params.transfer_from);
    if (params?.transfer_to) queryParams.append('transfer_to', params.transfer_to);
    if (params?.created_by) queryParams.append('created_by', params.created_by);
    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.end_date) queryParams.append('end_date', params.end_date);
    if (params?.search) queryParams.append('search', params.search);

    const url = `/product-transfers${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<TransferRequestsResponse>(url);
  },

  // Get transfer request by ID
  getTransferRequestById: async (id: string) => {
    return api.get<TransferRequestResponse>(`/product-transfers/${id}`);
  },

  // Update transfer request
  updateTransferRequest: async (id: string, updateData: UpdateTransferRequest) => {
    return api.put<TransferRequestResponse>(`/product-transfers/${id}`, updateData);
  },

  // Delete transfer request
  deleteTransferRequest: async (id: string) => {
    return api.delete<{ success: boolean; message: string }>(`/product-transfers/${id}`);
  },

  // Approve or reject transfer request (Accountant only)
  approveTransferRequest: async (id: string, approvalData: ApproveTransferRequest) => {
    return api.post<TransferRequestResponse>(`/product-transfers/${id}/approve`, approvalData);
  },

  // Mark transfer request as completed
  completeTransferRequest: async (id: string, completionData: CompleteTransferRequest) => {
    return api.post<TransferRequestResponse>(`/product-transfers/${id}/complete`, completionData);
  },

  // Get transfer statistics
  getTransferStats: async (params?: {
    start_date?: string;
    end_date?: string;
    branch?: string;
    status?: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
  }) => {
    const queryParams = new URLSearchParams();
    
    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.end_date) queryParams.append('end_date', params.end_date);
    if (params?.branch) queryParams.append('branch', params.branch);
    if (params?.status) queryParams.append('status', params.status);

    const url = `/product-transfers/stats${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<{
      success: boolean;
      message: string;
      data: {
        totalTransfers: number;
        pendingTransfers: number;
        approvedTransfers: number;
        completedTransfers: number;
        rejectedTransfers: number;
        totalQuantityTransferred: number;
        transfersByStatus: {
          Pending: number;
          Approved: number;
          Completed: number;
          Rejected: number;
        };
        transfersByBranch: Array<{
          branch: string;
          branchName: string;
          incoming: number;
          outgoing: number;
        }>;
        monthlyTrends: Array<{
          month: string;
          transfers: number;
          quantity: number;
        }>;
      };
    }>(url);
  },

  // Export transfer data
  exportTransfers: async (params?: TransferSearchParams) => {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.product) queryParams.append('product', params.product);
    if (params?.transfer_from) queryParams.append('transfer_from', params.transfer_from);
    if (params?.transfer_to) queryParams.append('transfer_to', params.transfer_to);
    if (params?.created_by) queryParams.append('created_by', params.created_by);
    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.end_date) queryParams.append('end_date', params.end_date);
    if (params?.search) queryParams.append('search', params.search);

    const url = `/product-transfers/export${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<Blob>(url, {
      responseType: 'blob'
    });
  }
};

export default productTransfersApi;
