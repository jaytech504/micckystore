import { api } from './apiService';

// Type definitions for invoices
export interface InvoiceItem {
  product_id: {
    _id: string;
    name: string;
    price: number;
  };
  quantity: number;
}

export interface Invoice {
  _id: string;
  customer_name: string;
  customer_number: string;
  date_of_invoice: string;
  due_date: string;
  branch: {
    _id: string;
    name: string;
  };
  invoice_receipt: string;
  invoice_type: 'sales' | 'repair' | 'service' | 'rental' | 'consultation';
  invoice_items: InvoiceItem[];
  customer_note: string;
  sub_total: number;
  delivery_fee: number;
  payment_type: 'pos' | 'cash' | 'bank transfer';
  bank: string;
  reference: string;
  email_receipt: string[];
  sales_person: {
    _id: string;
    username: string;
    email: string;
  };
  status: 'paid' | 'unpaid' | 'overdue' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvoiceRequest {
  customer_name: string;
  customer_number: string;
  date_of_invoice: string;
  due_date: string;
  branch: string;
  invoice_type: 'sales' | 'repair' | 'service' | 'rental' | 'consultation';
  invoice_items: Array<{
    product_id: string;
    quantity: number;
  }>;
  customer_note?: string;
  sub_total: number;
  delivery_fee?: number;
  payment_type: 'pos' | 'cash' | 'bank transfer';
  bank?: string;
  reference?: string;
  email_receipt?: string[];
  sales_person: string;
}

export interface UpdateInvoiceRequest {
  customer_name?: string;
  customer_number?: string;
  date_of_invoice?: string;
  due_date?: string;
  branch?: string;
  invoice_type?: 'sales' | 'repair' | 'service' | 'rental' | 'consultation';
  invoice_items?: Array<{
    product_id: string;
    quantity: number;
  }>;
  customer_note?: string;
  sub_total?: number;
  delivery_fee?: number;
  payment_type?: 'pos' | 'cash' | 'bank transfer';
  bank?: string;
  reference?: string;
  email_receipt?: string[];
  sales_person?: string;
}

export interface InvoiceSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  invoice_type?: 'sales' | 'repair' | 'service' | 'rental' | 'consultation';
  payment_type?: 'pos' | 'cash' | 'bank transfer';
  branch?: string;
  start_date?: string;
  end_date?: string;
  status?: 'paid' | 'unpaid' | 'overdue' | 'cancelled';
}

export interface InvoicesResponse {
  success: boolean;
  message: string;
  data: Invoice[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
  };
}

export interface InvoiceResponse {
  success: boolean;
  message: string;
  data: Invoice;
}

export interface InvoiceStats {
  total_invoices: number;
  total_revenue: number;
  invoices_by_type: Array<{
    _id: string;
    count: number;
  }>;
  invoices_by_payment_type: Array<{
    _id: string;
    count: number;
  }>;
  invoices_by_status: Array<{
    _id: string;
    count: number;
  }>;
  unpaid_amount: number;
  overdue_count: number;
}

export interface InvoiceStatsResponse {
  success: boolean;
  message: string;
  data: InvoiceStats;
}

export interface UpdateStatusRequest {
  status: 'paid' | 'unpaid' | 'overdue' | 'cancelled';
}

// API service functions
export const invoicesApi = {
  // Create a new invoice
  createInvoice: async (invoiceData: CreateInvoiceRequest) => {
    return api.post<InvoiceResponse>('/invoices', invoiceData);
  },

  // Get all invoices with pagination, search, and filtering
  getInvoices: async (params?: InvoiceSearchParams) => {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.invoice_type) queryParams.append('invoice_type', params.invoice_type);
    if (params?.payment_type) queryParams.append('payment_type', params.payment_type);
    if (params?.branch) queryParams.append('branch', params.branch);
    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.end_date) queryParams.append('end_date', params.end_date);
    if (params?.status) queryParams.append('status', params.status);

    const url = `/invoices${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<InvoicesResponse>(url);
  },

  // Get invoice by ID
  getInvoiceById: async (id: string) => {
    return api.get<InvoiceResponse>(`/invoices/${id}`);
  },

  // Get invoice by receipt number
  getInvoiceByReceipt: async (receipt: string) => {
    return api.get<InvoiceResponse>(`/invoices/receipt/${receipt}`);
  },

  // Update invoice
  updateInvoice: async (id: string, updateData: UpdateInvoiceRequest) => {
    return api.put<InvoiceResponse>(`/invoices/${id}`, updateData);
  },

  // Delete invoice
  deleteInvoice: async (id: string) => {
    return api.delete<{ success: boolean; message: string }>(`/invoices/${id}`);
  },

  // Update invoice status
  updateInvoiceStatus: async (id: string, statusData: UpdateStatusRequest) => {
    return api.put<InvoiceResponse>(`/invoices/${id}/status`, statusData);
  },

  // Get invoice statistics
  getInvoiceStats: async (params?: {
    start_date?: string;
    end_date?: string;
    branch?: string;
  }) => {
    const queryParams = new URLSearchParams();
    
    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.end_date) queryParams.append('end_date', params.end_date);
    if (params?.branch) queryParams.append('branch', params.branch);

    const url = `/invoices/stats${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<InvoiceStatsResponse>(url);
  },

  // Search invoices
  searchInvoices: async (searchTerm: string, params?: Omit<InvoiceSearchParams, 'search'>) => {
    return invoicesApi.getInvoices({
      ...params,
      search: searchTerm
    });
  },

  // Get invoices by type
  getInvoicesByType: async (type: 'sales' | 'repair' | 'service' | 'rental' | 'consultation', params?: Omit<InvoiceSearchParams, 'invoice_type'>) => {
    return invoicesApi.getInvoices({
      ...params,
      invoice_type: type
    });
  },

  // Get invoices by status
  getInvoicesByStatus: async (status: 'paid' | 'unpaid' | 'overdue' | 'cancelled', params?: Omit<InvoiceSearchParams, 'status'>) => {
    return invoicesApi.getInvoices({
      ...params,
      status: status
    });
  },

  // Get unpaid invoices
  getUnpaidInvoices: async (params?: Omit<InvoiceSearchParams, 'status'>) => {
    return invoicesApi.getInvoicesByStatus('unpaid', params);
  },

  // Get overdue invoices
  getOverdueInvoices: async (params?: Omit<InvoiceSearchParams, 'status'>) => {
    return invoicesApi.getInvoicesByStatus('overdue', params);
  },

  // Mark invoice as paid
  markAsPaid: async (id: string) => {
    return invoicesApi.updateInvoiceStatus(id, { status: 'paid' });
  },

  // Mark invoice as unpaid
  markAsUnpaid: async (id: string) => {
    return invoicesApi.updateInvoiceStatus(id, { status: 'unpaid' });
  },

  // Cancel invoice
  cancelInvoice: async (id: string) => {
    return invoicesApi.updateInvoiceStatus(id, { status: 'cancelled' });
  }
};

export default invoicesApi;
