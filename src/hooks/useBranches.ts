import { useState, useEffect, useCallback } from 'react';
import { branchesApi, Branch } from '../api/branchesApi';

export interface UseBranchesParams {
  status?: 'Active' | 'Inactive' | 'Maintenance';
  search?: string;
  limit?: number;
}

export interface UseBranchesReturn {
  branches: Branch[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearError: () => void;
}

export const useBranches = (params?: UseBranchesParams): UseBranchesReturn => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBranches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await branchesApi.getBranches({
        status: 'Active', // Only fetch active branches by default
        limit: params?.limit || 50,
        sortBy: 'name',
        sortOrder: 'asc'
      });
      
      if (response.data && response.data.branches) {
        setBranches(response.data.branches);
      } else {
        setError('No branches found');
      }
    } catch (err: any) {
      console.error('Error fetching branches:', err);
      setError(err.response?.data?.message || 'Failed to load branches');
    } finally {
      setLoading(false);
    }
  }, [params?.limit]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  return {
    branches,
    loading,
    error,
    refetch: fetchBranches,
    clearError,
  };
};