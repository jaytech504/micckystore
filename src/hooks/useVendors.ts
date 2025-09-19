import { useState, useEffect, useCallback } from 'react';
import { vendorsApi } from '../api/vendorsApi';
import type {
  Vendor,
  CreateVendorRequest,
  UpdateVendorRequest,
  VendorStats,
  VendorsSearchParams
} from '../api/vendorsApi';

// ===== VENDOR HOOKS =====

export const useVendors = (params?: VendorsSearchParams) => {
  const [data, setData] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await vendorsApi.getVendors(params);
      setData(response.data.data);
      setPagination(response.data.pagination);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch vendors');
    } finally {
      setLoading(false);
    }
  }, [params?.page, params?.limit, params?.search, params?.type, params?.product]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const createVendor = useCallback(async (vendorData: CreateVendorRequest) => {
    try {
      const response = await vendorsApi.createVendor(vendorData);
      await fetchData(); // Refresh the list
      return response.data;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to create vendor');
    }
  }, [fetchData]);

  const updateVendor = useCallback(async (id: string, updateData: UpdateVendorRequest) => {
    try {
      const response = await vendorsApi.updateVendor(id, updateData);
      await fetchData(); // Refresh the list
      return response.data;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to update vendor');
    }
  }, [fetchData]);

  const deleteVendor = useCallback(async (id: string) => {
    try {
      await vendorsApi.deleteVendor(id);
      await fetchData(); // Refresh the list
    } catch (err: any) {
      throw new Error(err.message || 'Failed to delete vendor');
    }
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    pagination,
    refetch: fetchData,
    createVendor,
    updateVendor,
    deleteVendor
  };
};

export const useVendor = (id: string) => {
  const [data, setData] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await vendorsApi.getVendorById(id);
      setData(response.data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch vendor');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export const useVendorStats = () => {
  const [data, setData] = useState<VendorStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await vendorsApi.getVendorStats();
      setData(response.data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch vendor stats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export const useVendorsByType = (type: 'not taking return' | 'taking return') => {
  const [data, setData] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await vendorsApi.getVendorsByType(type);
      setData(response.data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch vendors by type');
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export default {
  useVendors,
  useVendor,
  useVendorStats,
  useVendorsByType
};
