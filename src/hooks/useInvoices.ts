import { useState, useEffect, useCallback } from 'react';
import { invoicesApi } from '../api/invoicesApi';
import type {
  Invoice,
  CreateInvoiceRequest,
  UpdateInvoiceRequest,
  InvoiceSearchParams,
  InvoiceStats,
  UpdateStatusRequest
} from '../api/invoicesApi';

// ===== INVOICE HOOKS =====

export const useInvoices = (params?: InvoiceSearchParams) => {
  const [data, setData] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await invoicesApi.getInvoices(params);
      setData(response.data.data);
      setPagination(response.data.pagination);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  }, [params?.page, params?.limit, params?.search, params?.invoice_type, params?.status, params?.branch, params?.start_date, params?.end_date]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const createInvoice = useCallback(async (invoiceData: CreateInvoiceRequest) => {
    try {
      const response = await invoicesApi.createInvoice(invoiceData);
      await fetchData(); // Refresh the list
      return response.data;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to create invoice');
    }
  }, [fetchData]);

  const updateInvoice = useCallback(async (id: string, updateData: UpdateInvoiceRequest) => {
    try {
      const response = await invoicesApi.updateInvoice(id, updateData);
      await fetchData(); // Refresh the list
      return response.data;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to update invoice');
    }
  }, [fetchData]);

  const deleteInvoice = useCallback(async (id: string) => {
    try {
      await invoicesApi.deleteInvoice(id);
      await fetchData(); // Refresh the list
    } catch (err: any) {
      throw new Error(err.message || 'Failed to delete invoice');
    }
  }, [fetchData]);

  const updateStatus = useCallback(async (id: string, status: UpdateStatusRequest['status']) => {
    try {
      await invoicesApi.updateInvoiceStatus(id, { status });
      await fetchData(); // Refresh the list
    } catch (err: any) {
      throw new Error(err.message || 'Failed to update invoice status');
    }
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    pagination,
    refetch: fetchData,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    updateStatus
  };
};

export const useInvoice = (id: string) => {
  const [data, setData] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await invoicesApi.getInvoiceById(id);
      setData(response.data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch invoice');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export const useInvoiceByReceipt = (receipt: string) => {
  const [data, setData] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!receipt) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await invoicesApi.getInvoiceByReceipt(receipt);
      setData(response.data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch invoice');
    } finally {
      setLoading(false);
    }
  }, [receipt]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export const useInvoiceStats = (params?: {
  start_date?: string;
  end_date?: string;
  branch?: string;
}) => {
  const [data, setData] = useState<InvoiceStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await invoicesApi.getInvoiceStats(params);
      setData(response.data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch invoice stats');
    } finally {
      setLoading(false);
    }
  }, [params?.start_date, params?.end_date, params?.branch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Specialized hooks for common operations
export const useInvoicesByType = (type: 'sales' | 'repair' | 'service' | 'rental' | 'consultation', params?: Omit<InvoiceSearchParams, 'invoice_type'>) => {
  return useInvoices({ ...params, invoice_type: type });
};

export const useInvoicesByStatus = (status: 'paid' | 'unpaid' | 'overdue' | 'cancelled', params?: Omit<InvoiceSearchParams, 'status'>) => {
  return useInvoices({ ...params, status });
};

export const useUnpaidInvoices = (params?: Omit<InvoiceSearchParams, 'status'>) => {
  return useInvoicesByStatus('unpaid', params);
};

export const useOverdueInvoices = (params?: Omit<InvoiceSearchParams, 'status'>) => {
  return useInvoicesByStatus('overdue', params);
};

// Quick action hooks
export const useInvoiceActions = () => {
  const markAsPaid = useCallback(async (id: string) => {
    try {
      await invoicesApi.markAsPaid(id);
    } catch (err: any) {
      throw new Error(err.message || 'Failed to mark invoice as paid');
    }
  }, []);

  const markAsUnpaid = useCallback(async (id: string) => {
    try {
      await invoicesApi.markAsUnpaid(id);
    } catch (err: any) {
      throw new Error(err.message || 'Failed to mark invoice as unpaid');
    }
  }, []);

  const cancelInvoice = useCallback(async (id: string) => {
    try {
      await invoicesApi.cancelInvoice(id);
    } catch (err: any) {
      throw new Error(err.message || 'Failed to cancel invoice');
    }
  }, []);

  return {
    markAsPaid,
    markAsUnpaid,
    cancelInvoice
  };
};

export default {
  useInvoices,
  useInvoice,
  useInvoiceByReceipt,
  useInvoiceStats,
  useInvoicesByType,
  useInvoicesByStatus,
  useUnpaidInvoices,
  useOverdueInvoices,
  useInvoiceActions
};
