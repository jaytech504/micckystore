import { api, authService } from './apiService';

// ===== TRANSACTION TYPES =====

export interface Transaction {
  _id: string;
  transaction_id: string;
  date: string;
  description: string;
  category: string;
  branch: {
    _id: string;
    name: string;
  };
  amount: number;
  status: 'paid' | 'unpaid' | 'approved' | 'unapproved';
  payment_method: string;
  invoice_image?: string;
  approver: {
  _id: string;
    username: string;
  email: string;
  };
  due_date?: string;
  category_id: string;
  createdBy: {
  _id: string;
    username: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionRequest {
  description: string;
  category: string;
  branch: string;
  amount: number;
  status: 'paid' | 'unpaid' | 'approved' | 'unapproved';
  payment_method: string;
  invoice_image?: string;
  approver: string;
  due_date?: string;
  category_id: string;
}

export interface UpdateTransactionRequest {
  description?: string;
  category?: string;
  branch?: string;
  amount?: number;
  status?: 'paid' | 'unpaid' | 'approved' | 'unapproved';
  payment_method?: string;
  invoice_image?: string;
  approver?: string;
  due_date?: string;
  category_id?: string;
}

export interface TransactionCategory {
  id: string;
  value: string;
  label: string;
  description: string;
}

export interface TransactionType {
  id: string;
  value: string;
  label: string;
  description: string;
}

export interface TransactionCategoriesResponse {
  categories: TransactionCategory[];
  transaction_types: TransactionType[];
}

export interface SearchParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: 'repairs' | 'expenses' | 'budget' | 'sales' | 'msc' | 'invoice';
  status?: 'paid' | 'unpaid' | 'approved' | 'unapproved';
  start_date?: string;
  end_date?: string;
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
}

// ===== TRANSACTIONS API =====

export const accountingApi = {
  // Create a new transaction
  createTransaction: async (transactionData: CreateTransactionRequest) => {
    return api.post<ApiResponse<Transaction>>('/transactions', transactionData);
  },

  // Get all transactions with pagination, search, and filtering
  getTransactions: async (params?: SearchParams) => {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.end_date) queryParams.append('end_date', params.end_date);

    const url = `/transactions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<ApiResponse<Transaction[]>>(url);
  },

  // Get transaction by ID
  getTransactionById: async (id: string) => {
    return api.get<ApiResponse<Transaction>>(`/transactions/${id}`);
  },

  // Update transaction
  updateTransaction: async (id: string, updateData: UpdateTransactionRequest) => {
    return api.put<ApiResponse<Transaction>>(`/transactions/${id}`, updateData);
  },

  // Delete transaction
  deleteTransaction: async (id: string) => {
    return api.delete<ApiResponse<{ success: boolean; message: string }>>(`/transactions/${id}`);
  },

  // Get transaction categories and types
  getTransactionCategories: async () => {
    return api.get<ApiResponse<TransactionCategoriesResponse>>('/transactions/categories');
  }
};

export default accountingApi;