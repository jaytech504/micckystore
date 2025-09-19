import { useState, useEffect } from 'react';
import { 
  vendorsApi, 
  Vendor, 
  CreateVendorRequest, 
  UpdateVendorRequest, 
  VendorSearchParams,
  VendorStats 
} from '../../../../api/vendorsApi';

// Hook for fetching vendors with search and filtering
export const useVendors = (params?: VendorSearchParams) => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    items_per_page: 10
  });

  const fetchVendors = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await vendorsApi.getVendors(params);
      if (response.data.success) {
        setVendors(response.data.data);
        setPagination(response.data.pagination);
      } else {
        setError(response.data.message || 'Failed to fetch vendors');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch vendors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, [JSON.stringify(params)]);

  return {
    vendors,
    loading,
    error,
    pagination,
    refetch: fetchVendors
  };
};

// Hook for vendor operations (create, update, delete)
export const useVendorOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createVendor = async (vendorData: CreateVendorRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await vendorsApi.createVendor(vendorData);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to create vendor');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateVendor = async (id: string, updateData: UpdateVendorRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await vendorsApi.updateVendor(id, updateData);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to update vendor');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteVendor = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await vendorsApi.deleteVendor(id);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to delete vendor');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createVendor,
    updateVendor,
    deleteVendor,
    loading,
    error
  };
};

// Hook for vendor statistics
export const useVendorStats = () => {
  const [stats, setStats] = useState<VendorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await vendorsApi.getVendorStats();
      if (response.data.success) {
        setStats(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch vendor statistics');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch vendor statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
};

// Hook for getting a single vendor by ID
export const useVendor = (id: string) => {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVendor = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await vendorsApi.getVendorById(id);
      if (response.data.success) {
        setVendor(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch vendor');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch vendor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendor();
  }, [id]);

  return {
    vendor,
    loading,
    error,
    refetch: fetchVendor
  };
};

// Hook for vendors by type
export const useVendorsByType = (type: 'taking return' | 'not taking return') => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVendorsByType = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await vendorsApi.getVendorsByType(type);
      if (response.data.success) {
        setVendors(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch vendors by type');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch vendors by type');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorsByType();
  }, [type]);

  return {
    vendors,
    loading,
    error,
    refetch: fetchVendorsByType
  };
};

// Hook for searching vendors
export const useVendorSearch = (searchTerm: string, params?: Omit<VendorSearchParams, 'search'>) => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchVendors = async () => {
    if (!searchTerm.trim()) {
      setVendors([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await vendorsApi.searchVendors(searchTerm, params);
      if (response.data.success) {
        setVendors(response.data.data);
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
      searchVendors();
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchTerm, JSON.stringify(params)]);

  return {
    vendors,
    loading,
    error,
    search: searchVendors
  };
};
