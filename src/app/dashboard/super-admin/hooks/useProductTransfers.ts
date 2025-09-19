import { useState, useEffect } from 'react';
import { 
  productTransfersApi, 
  ProductTransfer, 
  TransferRequestsResponse,
  TransferRequestResponse,
  TransferSearchParams,
  CreateTransferRequest,
  UpdateTransferRequest,
  ApproveTransferRequest,
  CompleteTransferRequest
} from '../../../../api/productTransfersApi';

// Hook for getting all transfer requests
export const useTransferRequests = (params?: TransferSearchParams) => {
  const [transfers, setTransfers] = useState<ProductTransfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 0,
    total_items: 0,
    items_per_page: 20
  });

  const fetchTransfers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productTransfersApi.getTransferRequests(params);
      
      // Handle the actual API response structure
      if (response.data && response.data.transferRequests) {
        // Transform the data to match expected structure
        const transformedTransfers = response.data.transferRequests.map((transfer: any) => ({
          ...transfer,
          created_by: transfer.createdBy,
          created_at: transfer.createdAt,
          updated_at: transfer.updatedAt,
          transfer_from: transfer.transfer_from,
          transfer_to: transfer.transfer_to,
          request_status: transfer.request_status
        }));
        
        setTransfers(transformedTransfers);
        
        // Set default pagination since API doesn't provide it
        setPagination({
          current_page: 1,
          total_pages: 1,
          total_items: transformedTransfers.length,
          items_per_page: params?.limit || 20
        });
      } else {
        setError('No transfer requests found');
        setTransfers([]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch transfer requests');
      setTransfers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransfers();
  }, [JSON.stringify(params)]);

  return {
    transfers,
    loading,
    error,
    pagination,
    refetch: fetchTransfers
  };
};

// Hook for getting a single transfer request
export const useTransferRequest = (id: string) => {
  const [transfer, setTransfer] = useState<ProductTransfer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransfer = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await productTransfersApi.getTransferRequestById(id);
      if (response.data.success) {
        setTransfer(response.data.transferRequest);
      } else {
        setError(response.data.message || 'Failed to fetch transfer request');
        setTransfer(null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch transfer request');
      setTransfer(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransfer();
  }, [id]);

  return {
    transfer,
    loading,
    error,
    refetch: fetchTransfer
  };
};

// Hook for transfer operations (create, update, delete, approve, complete)
export const useTransferOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTransfer = async (transferData: CreateTransferRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await productTransfersApi.createTransferRequest(transferData);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to create transfer request');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTransfer = async (id: string, updateData: UpdateTransferRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await productTransfersApi.updateTransferRequest(id, updateData);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to update transfer request');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTransfer = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await productTransfersApi.deleteTransferRequest(id);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to delete transfer request');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const approveTransfer = async (id: string, approvalData: ApproveTransferRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await productTransfersApi.approveTransferRequest(id, approvalData);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to approve/reject transfer request');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const completeTransfer = async (id: string, completionData: CompleteTransferRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await productTransfersApi.completeTransferRequest(id, completionData);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to complete transfer request');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createTransfer,
    updateTransfer,
    deleteTransfer,
    approveTransfer,
    completeTransfer
  };
};

// Hook for transfer statistics
export const useTransferStats = (params?: {
  start_date?: string;
  end_date?: string;
  branch?: string;
  status?: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
}) => {
  const [stats, setStats] = useState({
    totalTransfers: 0,
    pendingTransfers: 0,
    approvedTransfers: 0,
    completedTransfers: 0,
    rejectedTransfers: 0,
    totalQuantityTransferred: 0,
    transfersByStatus: {
      Pending: 0,
      Approved: 0,
      Completed: 0,
      Rejected: 0
    },
    transfersByBranch: [] as Array<{
      branch: string;
      branchName: string;
      incoming: number;
      outgoing: number;
    }>,
    monthlyTrends: [] as Array<{
      month: string;
      transfers: number;
      quantity: number;
    }>
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productTransfersApi.getTransferStats(params);
      if (response.data.success) {
        setStats(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch transfer statistics');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch transfer statistics');
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

export default {
  useTransferRequests,
  useTransferRequest,
  useTransferOperations,
  useTransferStats
};
