import { useState, useEffect, useCallback } from 'react';
import { customersApi, Customer, CreateCustomerRequest } from '../api/customersApi';

export interface UseCustomersReturn {
  customers: Customer[];
  loading: boolean;
  error: string | null;
  searchLoading: boolean;
  createLoading: boolean;
  refetch: () => Promise<void>;
  searchCustomers: (query: string) => Promise<void>;
  createCustomer: (customerData: CreateCustomerRequest) => Promise<boolean>;
  clearError: () => void;
}

export const useCustomers = (): UseCustomersReturn => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await customersApi.getCustomers();
      
      if (response.data && response.data.customers) {
        setCustomers(response.data.customers);
      } else {
        setError('No customers found');
      }
    } catch (err: any) {
      console.error('Error fetching customers:', err);
      setError(err.response?.data?.message || 'Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  }, []);

  const searchCustomers = useCallback(async (query: string) => {
    if (!query.trim()) {
      await fetchCustomers();
      return;
    }

    try {
      setSearchLoading(true);
      setError(null);
      const response = await customersApi.searchCustomers(query.trim());
      
      if (response.data && response.data.customers) {
        setCustomers(response.data.customers);
      } else {
        setCustomers([]);
      }
    } catch (err: any) {
      console.error('Error searching customers:', err);
      setError(err.response?.data?.message || 'Failed to search customers');
    } finally {
      setSearchLoading(false);
    }
  }, [fetchCustomers]);

  const createCustomer = useCallback(async (customerData: CreateCustomerRequest): Promise<boolean> => {
    try {
      setCreateLoading(true);
      setError(null);
      
      const response = await customersApi.createCustomer(customerData);
      
      if (response.data && response.data.customer) {
        // Add the new customer to the list
        setCustomers(prev => [response.data.customer, ...prev]);
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('Error creating customer:', err);
      setError(err.response?.data?.message || 'Failed to create customer');
      return false;
    } finally {
      setCreateLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return {
    customers,
    loading,
    error,
    searchLoading,
    createLoading,
    refetch: fetchCustomers,
    searchCustomers,
    createCustomer,
    clearError,
  };
};
