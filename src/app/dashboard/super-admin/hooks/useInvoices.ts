import { useState, useEffect } from 'react';
import { 
  invoicesApi, 
  Invoice, 
  CreateInvoiceRequest, 
  UpdateInvoiceRequest, 
  InvoiceSearchParams,
  InvoiceStats,
  UpdateStatusRequest
} from '../../../../api/invoicesApi';

// Hook for fetching invoices with search and filtering
export const useInvoices = (params?: InvoiceSearchParams) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    items_per_page: 10
  });

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await invoicesApi.getInvoices(params);
      if (response.data.success) {
        setInvoices(response.data.data);
        setPagination(response.data.pagination);
      } else {
        setError(response.data.message || 'Failed to fetch invoices');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [JSON.stringify(params)]);

  return {
    invoices,
    loading,
    error,
    pagination,
    refetch: fetchInvoices
  };
};

// Hook for invoice operations (create, update, delete)
export const useInvoiceOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createInvoice = async (invoiceData: CreateInvoiceRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await invoicesApi.createInvoice(invoiceData);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to create invoice');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateInvoice = async (id: string, updateData: UpdateInvoiceRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await invoicesApi.updateInvoice(id, updateData);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to update invoice');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteInvoice = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await invoicesApi.deleteInvoice(id);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to delete invoice');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateInvoiceStatus = async (id: string, status: UpdateStatusRequest['status']) => {
    try {
      setLoading(true);
      setError(null);
      const response = await invoicesApi.updateInvoiceStatus(id, { status });
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to update invoice status');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const markAsPaid = async (id: string) => {
    return updateInvoiceStatus(id, 'paid');
  };

  const markAsUnpaid = async (id: string) => {
    return updateInvoiceStatus(id, 'unpaid');
  };

  const cancelInvoice = async (id: string) => {
    return updateInvoiceStatus(id, 'cancelled');
  };

  return {
    createInvoice,
    updateInvoice,
    deleteInvoice,
    updateInvoiceStatus,
    markAsPaid,
    markAsUnpaid,
    cancelInvoice,
    loading,
    error
  };
};

// Hook for invoice statistics
export const useInvoiceStats = (params?: {
  start_date?: string;
  end_date?: string;
  branch?: string;
}) => {
  const [stats, setStats] = useState<InvoiceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await invoicesApi.getInvoiceStats(params);
      if (response.data.success) {
        setStats(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch invoice statistics');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch invoice statistics');
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

// Hook for getting a single invoice by ID
export const useInvoice = (id: string) => {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoice = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await invoicesApi.getInvoiceById(id);
      if (response.data.success) {
        setInvoice(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch invoice');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch invoice');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  return {
    invoice,
    loading,
    error,
    refetch: fetchInvoice
  };
};

// Hook for getting invoice by receipt number
export const useInvoiceByReceipt = (receipt: string) => {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoiceByReceipt = async () => {
    if (!receipt) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await invoicesApi.getInvoiceByReceipt(receipt);
      if (response.data.success) {
        setInvoice(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch invoice');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch invoice');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoiceByReceipt();
  }, [receipt]);

  return {
    invoice,
    loading,
    error,
    refetch: fetchInvoiceByReceipt
  };
};

// Hook for invoices by type
export const useInvoicesByType = (type: 'sales' | 'repair' | 'service' | 'rental' | 'consultation', params?: Omit<InvoiceSearchParams, 'invoice_type'>) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoicesByType = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await invoicesApi.getInvoicesByType(type, params);
      if (response.data.success) {
        setInvoices(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch invoices by type');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch invoices by type');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoicesByType();
  }, [type, JSON.stringify(params)]);

  return {
    invoices,
    loading,
    error,
    refetch: fetchInvoicesByType
  };
};

// Hook for invoices by status
export const useInvoicesByStatus = (status: 'paid' | 'unpaid' | 'overdue' | 'cancelled', params?: Omit<InvoiceSearchParams, 'status'>) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoicesByStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await invoicesApi.getInvoicesByStatus(status, params);
      if (response.data.success) {
        setInvoices(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch invoices by status');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch invoices by status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoicesByStatus();
  }, [status, JSON.stringify(params)]);

  return {
    invoices,
    loading,
    error,
    refetch: fetchInvoicesByStatus
  };
};

// Hook for unpaid invoices
export const useUnpaidInvoices = (params?: Omit<InvoiceSearchParams, 'status'>) => {
  return useInvoicesByStatus('unpaid', params);
};

// Hook for overdue invoices
export const useOverdueInvoices = (params?: Omit<InvoiceSearchParams, 'status'>) => {
  return useInvoicesByStatus('overdue', params);
};

// Hook for searching invoices
export const useInvoiceSearch = (searchTerm: string, params?: Omit<InvoiceSearchParams, 'search'>) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchInvoices = async () => {
    if (!searchTerm.trim()) {
      setInvoices([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await invoicesApi.searchInvoices(searchTerm, params);
      if (response.data.success) {
        setInvoices(response.data.data);
      } else {
        setError(response.data.message || 'Search failed');
      }
    } catch (err: any) {
      setError(err.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchInvoices();
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchTerm, JSON.stringify(params)]);

  return {
    invoices,
    loading,
    error,
    search: searchInvoices
  };
};
