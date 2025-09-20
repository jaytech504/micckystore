import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  employeesApi, 
  Employee, 
  CreateEmployeeRequest, 
  UpdateEmployeeRequest, 
  EmployeeSearchParams, 
  EmployeeStats,
  ChangePasswordRequest,
  PasswordResetRequest,
  VerifyOTPRequest
} from '../../../../api/employeesApi';

// Hook for fetching all employees with filtering and pagination
export const useEmployees = (params?: EmployeeSearchParams) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
  } | null>(null);

  // Memoize params to prevent unnecessary re-fetches
  const memoizedParams = useMemo(() => params, [
    params?.page,
    params?.limit,
    params?.search,
    params?.department,
    params?.role,
    params?.status,
    params?.branchId
  ]);

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeesApi.getEmployees(memoizedParams);
      
      // Handle the actual API response format: {users: Employee[]}
      if (response.data.users) {
        setEmployees(response.data.users);
        // Set default pagination if not provided
        setPagination({
          current_page: 1,
          total_pages: 1,
          total_items: response.data.users.length,
          items_per_page: response.data.users.length
        });
      } else if (response.data.success && response.data.data) {
        // Fallback for expected format: {success: boolean, data: Employee[]}
        setEmployees(response.data.users || response.data.data || []);
        setPagination(response.data.pagination || null);
      } else {
        setError('Invalid response format from employees API');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  }, [memoizedParams]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  return { 
    employees, 
    loading, 
    error, 
    pagination, 
    refetch: fetchEmployees 
  };
};

// Hook for fetching a single employee by ID
export const useEmployee = (id: string) => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployee = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await employeesApi.getEmployeeById(id);
      
      if (response.data.success && response.data.data) {
        setEmployee(response.data.data);
      } else if (response.data.user) {
        setEmployee(response.data.user);
      } else {
        setError(response.data.message || 'Failed to fetch employee');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch employee');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEmployee();
  }, [fetchEmployee]);

  return { 
    employee, 
    loading, 
    error, 
    refetch: fetchEmployee 
  };
};

// Hook for employee CRUD operations
export const useEmployeeOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createEmployee = useCallback(async (employeeData: CreateEmployeeRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeesApi.createEmployee(employeeData);
      
      // Handle both response formats
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else if (response.data.user) {
        // Handle the actual API response format: {message: string, user: Employee}
        return response.data.user;
      } else if (response.data.message) {
        // If there's a message but no success field, it might still be successful
        // Check if status is 201 or 200
        if (response.status === 201 || response.status === 200) {
          return response.data.user || response.data.data;
        } else {
          throw new Error(response.data.message);
        }
      } else {
        throw new Error('Invalid response format from create employee API');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create employee';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateEmployee = useCallback(async (id: string, updateData: UpdateEmployeeRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeesApi.updateEmployee(id, updateData);
      
      // Handle both response formats
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else if (response.data.user) {
        // Handle the actual API response format: {message: string, user: Employee}
        return response.data.user;
      } else if (response.data.message) {
        // If there's a message but no success field, it might still be successful
        // Check if status is 201 or 200
        if (response.status === 201 || response.status === 200) {
          return response.data.user || response.data.data;
        } else {
          throw new Error(response.data.message);
        }
      } else {
        throw new Error('Invalid response format from update employee API');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update employee';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteEmployee = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeesApi.deleteEmployee(id);
      
      if (response.data.success) {
        return true;
      } else {
        throw new Error(response.data.message || 'Failed to delete employee');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete employee';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createEmployee,
    updateEmployee,
    deleteEmployee,
    loading,
    error,
    clearError: () => setError(null)
  };
};

// Hook for employee statistics
export const useEmployeeStats = () => {
  const [stats, setStats] = useState<EmployeeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeesApi.getEmployeeStats();
      
      if (response.data.success) {
        setStats(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch employee statistics');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch employee statistics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { 
    stats, 
    loading, 
    error, 
    refetch: fetchStats 
  };
};

// Hook for searching employees
export const useEmployeeSearch = (searchTerm: string, params?: Omit<EmployeeSearchParams, 'search'>) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoize params to prevent unnecessary re-fetches
  const memoizedParams = useMemo(() => params, [
    params?.page,
    params?.limit,
    params?.department,
    params?.role,
    params?.status,
    params?.branchId
  ]);

  const searchEmployees = useCallback(async () => {
    if (!searchTerm.trim()) {
      setEmployees([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await employeesApi.searchEmployees(searchTerm, memoizedParams);
      
      // Handle the actual API response format: {users: Employee[]}
      if (response.data.users) {
        setEmployees(response.data.users);
      } else if (response.data.success && response.data.data) {
        setEmployees(response.data.users || response.data.data || []);
      } else {
        setError('Invalid response format from employees API');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to search employees');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, memoizedParams]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchEmployees();
    }, 500); // Increased to 500ms debounce to match the component

    return () => clearTimeout(timeoutId);
  }, [searchEmployees]);

  return { 
    employees, 
    loading, 
    error, 
    search: searchEmployees 
  };
};

// Hook for employees by department
export const useEmployeesByDepartment = (department: string, params?: Omit<EmployeeSearchParams, 'department'>) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployeesByDepartment = useCallback(async () => {
    if (!department) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await employeesApi.getEmployeesByDepartment(department, params);
      
      // Handle the actual API response format: {users: Employee[]}
      if (response.data.users) {
        setEmployees(response.data.users);
      } else if (response.data.success && response.data.data) {
        setEmployees(response.data.users || response.data.data || []);
      } else {
        setError('Invalid response format from employees API');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch employees by department');
    } finally {
      setLoading(false);
    }
  }, [department, params]);

  useEffect(() => {
    fetchEmployeesByDepartment();
  }, [fetchEmployeesByDepartment]);

  return { 
    employees, 
    loading, 
    error, 
    refetch: fetchEmployeesByDepartment 
  };
};

// Hook for employees by role
export const useEmployeesByRole = (role: string, params?: Omit<EmployeeSearchParams, 'role'>) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployeesByRole = useCallback(async () => {
    if (!role) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await employeesApi.getEmployeesByRole(role, params);
      
      if (response.data.success) {
        setEmployees(response.data.users || response.data.data || []);
      } else {
        setError(response.data.message || 'Failed to fetch employees by role');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch employees by role');
    } finally {
      setLoading(false);
    }
  }, [role, params]);

  useEffect(() => {
    fetchEmployeesByRole();
  }, [fetchEmployeesByRole]);

  return { 
    employees, 
    loading, 
    error, 
    refetch: fetchEmployeesByRole 
  };
};

// Hook for employees by status
export const useEmployeesByStatus = (status: string, params?: Omit<EmployeeSearchParams, 'status'>) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployeesByStatus = useCallback(async () => {
    if (!status) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await employeesApi.getEmployeesByStatus(status, params);
      
      if (response.data.success) {
        setEmployees(response.data.users || response.data.data || []);
      } else {
        setError(response.data.message || 'Failed to fetch employees by status');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch employees by status');
    } finally {
      setLoading(false);
    }
  }, [status, params]);

  useEffect(() => {
    fetchEmployeesByStatus();
  }, [fetchEmployeesByStatus]);

  return { 
    employees, 
    loading, 
    error, 
    refetch: fetchEmployeesByStatus 
  };
};

// Hook for employees by branch
export const useEmployeesByBranch = (branchId: string, params?: Omit<EmployeeSearchParams, 'branchId'>) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployeesByBranch = useCallback(async () => {
    if (!branchId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await employeesApi.getEmployeesByBranch(branchId, params);
      
      if (response.data.success) {
        setEmployees(response.data.users || response.data.data || []);
      } else {
        setError(response.data.message || 'Failed to fetch employees by branch');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch employees by branch');
    } finally {
      setLoading(false);
    }
  }, [branchId, params]);

  useEffect(() => {
    fetchEmployeesByBranch();
  }, [fetchEmployeesByBranch]);

  return { 
    employees, 
    loading, 
    error, 
    refetch: fetchEmployeesByBranch 
  };
};

// Hook for password management operations
export const usePasswordOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changePassword = useCallback(async (passwordData: ChangePasswordRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeesApi.changePassword(passwordData);
      
      if (response.data.success) {
        return true;
      } else {
        throw new Error(response.data.message || 'Failed to change password');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to change password';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const requestPasswordReset = useCallback(async (resetData: PasswordResetRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeesApi.requestPasswordReset(resetData);
      
      if (response.data.success) {
        return true;
      } else {
        throw new Error(response.data.message || 'Failed to request password reset');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to request password reset';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyOTPAndSetPassword = useCallback(async (otpData: VerifyOTPRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeesApi.verifyOTPAndSetPassword(otpData);
      
      if (response.data.success) {
        return true;
      } else {
        throw new Error(response.data.message || 'Failed to verify OTP and set password');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to verify OTP and set password';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    changePassword,
    requestPasswordReset,
    verifyOTPAndSetPassword,
    loading,
    error,
    clearError: () => setError(null)
  };
};

// Hook for exporting employees data
export const useEmployeeExport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportEmployees = useCallback(async (format: 'csv' | 'excel' = 'csv', params?: EmployeeSearchParams) => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeesApi.exportEmployees(format, params);
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `employees.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to export employees';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    exportEmployees,
    loading,
    error,
    clearError: () => setError(null)
  };
};
