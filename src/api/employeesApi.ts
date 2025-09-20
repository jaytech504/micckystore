import { api } from './apiService';

// Types for Employee Management
export interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  name: string;
  staffId: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  gender: 'Male' | 'Female' | 'Other';
  nationality: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  department: string;
  role: 'Super Admin' | 'Admin' | 'Staff' | 'Manager' | 'HR' | 'Finance';
  jobTitle: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  workMode: 'Office' | 'Remote' | 'Hybrid';
  resumptionDate: string;
  expectedWorkingDays: string[];
  branchId: string;
  branch?: {
    _id: string;
    name: string;
    address?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeRequest {
  firstName: string;
  lastName: string;
  name: string;
  staffId: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  gender: 'Male' | 'Female' | 'Other';
  nationality: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  department: string;
  role: 'Super Admin' | 'Admin' | 'Staff' | 'Manager' | 'HR' | 'Finance';
  jobTitle: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  workMode: 'Office' | 'Remote' | 'Hybrid';
  resumptionDate: string;
  expectedWorkingDays: string[];
  branchId: string;
}

export interface UpdateEmployeeRequest {
  firstName?: string;
  lastName?: string;
  name?: string;
  staffId?: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';
  gender?: 'Male' | 'Female' | 'Other';
  nationality?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  department?: string;
  role?: 'Super Admin' | 'Admin' | 'Staff' | 'Manager' | 'HR' | 'Finance';
  jobTitle?: string;
  status?: 'Active' | 'Inactive' | 'Suspended';
  workMode?: 'Office' | 'Remote' | 'Hybrid';
  resumptionDate?: string;
  expectedWorkingDays?: string[];
  branchId?: string;
}

export interface EmployeeSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  department?: string;
  role?: string;
  status?: string;
  workMode?: string;
  branchId?: string;
  sortBy?: 'name' | 'email' | 'createdAt' | 'department';
  sortOrder?: 'asc' | 'desc';
}

export interface EmployeeStats {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  employeesByDepartment: Array<{
    department: string;
    count: number;
  }>;
  employeesByRole: Array<{
    role: string;
    count: number;
  }>;
  employeesByWorkMode: Array<{
    workMode: string;
    count: number;
  }>;
  recentHires: number;
  averageTenure: number;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface PasswordResetRequest {
  identifier: string; // email or staffId
}

export interface VerifyOTPRequest {
  identifier: string;
  otp: string;
  newPassword: string;
}

export interface EmployeeResponse {
  success?: boolean;
  message: string;
  data?: Employee;
  user?: Employee; // Actual API response format
}

export interface EmployeesResponse {
  success?: boolean;
  message?: string;
  data?: Employee[];
  users: Employee[]; // Actual API response format
  pagination?: {
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
  };
}

export interface EmployeeStatsResponse {
  success: boolean;
  message: string;
  data: EmployeeStats;
}

export interface PasswordChangeResponse {
  success: boolean;
  message: string;
}

export interface OTPResponse {
  success: boolean;
  message: string;
  note?: string;
}

// Employee Management API
export const employeesApi = {
  // Create a new employee
  createEmployee: async (employeeData: CreateEmployeeRequest) => {
    return api.post<EmployeeResponse>('/users', employeeData);
  },

  // Get all employees with optional filtering and pagination
  getEmployees: async (params?: EmployeeSearchParams) => {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.department) queryParams.append('department', params.department);
    if (params?.role) queryParams.append('role', params.role);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.workMode) queryParams.append('workMode', params.workMode);
    if (params?.branchId) queryParams.append('branchId', params.branchId);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const url = `/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<EmployeesResponse>(url);
  },

  // Get employee by ID
  getEmployeeById: async (id: string) => {
    return api.get<EmployeeResponse>(`/users/${id}`);
  },

  // Update employee
  updateEmployee: async (id: string, updateData: UpdateEmployeeRequest) => {
    return api.put<EmployeeResponse>(`/users/${id}`, updateData);
  },

  // Delete employee
  deleteEmployee: async (id: string) => {
    return api.delete<PasswordChangeResponse>(`/users/${id}`);
  },

  // Get employee statistics
  getEmployeeStats: async () => {
    return api.get<EmployeeStatsResponse>('/users/stats');
  },

  // Search employees
  searchEmployees: async (searchTerm: string, params?: Omit<EmployeeSearchParams, 'search'>) => {
    const queryParams = new URLSearchParams();
    queryParams.append('search', searchTerm);
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.department) queryParams.append('department', params.department);
    if (params?.role) queryParams.append('role', params.role);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.workMode) queryParams.append('workMode', params.workMode);
    if (params?.branchId) queryParams.append('branchId', params.branchId);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const url = `/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<EmployeesResponse>(url);
  },

  // Get employees by department
  getEmployeesByDepartment: async (department: string, params?: Omit<EmployeeSearchParams, 'department'>) => {
    const queryParams = new URLSearchParams();
    queryParams.append('department', department);
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.role) queryParams.append('role', params.role);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.workMode) queryParams.append('workMode', params.workMode);
    if (params?.branchId) queryParams.append('branchId', params.branchId);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const url = `/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<EmployeesResponse>(url);
  },

  // Get employees by role
  getEmployeesByRole: async (role: string, params?: Omit<EmployeeSearchParams, 'role'>) => {
    const queryParams = new URLSearchParams();
    queryParams.append('role', role);
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.department) queryParams.append('department', params.department);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.workMode) queryParams.append('workMode', params.workMode);
    if (params?.branchId) queryParams.append('branchId', params.branchId);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const url = `/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<EmployeesResponse>(url);
  },

  // Get employees by status
  getEmployeesByStatus: async (status: string, params?: Omit<EmployeeSearchParams, 'status'>) => {
    const queryParams = new URLSearchParams();
    queryParams.append('status', status);
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.department) queryParams.append('department', params.department);
    if (params?.role) queryParams.append('role', params.role);
    if (params?.workMode) queryParams.append('workMode', params.workMode);
    if (params?.branchId) queryParams.append('branchId', params.branchId);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const url = `/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<EmployeesResponse>(url);
  },

  // Get employees by branch
  getEmployeesByBranch: async (branchId: string, params?: Omit<EmployeeSearchParams, 'branchId'>) => {
    const queryParams = new URLSearchParams();
    queryParams.append('branchId', branchId);
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.department) queryParams.append('department', params.department);
    if (params?.role) queryParams.append('role', params.role);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.workMode) queryParams.append('workMode', params.workMode);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const url = `/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<EmployeesResponse>(url);
  },

  // Export employees data
  exportEmployees: async (format: 'csv' | 'excel' = 'csv', params?: EmployeeSearchParams) => {
    const queryParams = new URLSearchParams();
    queryParams.append('format', format);
    
    if (params?.search) queryParams.append('search', params.search);
    if (params?.department) queryParams.append('department', params.department);
    if (params?.role) queryParams.append('role', params.role);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.workMode) queryParams.append('workMode', params.workMode);
    if (params?.branchId) queryParams.append('branchId', params.branchId);

    const url = `/users/export${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<Blob>(url, { responseType: 'blob' });
  },

  // Password Management
  changePassword: async (passwordData: ChangePasswordRequest) => {
    return api.post<PasswordChangeResponse>('/users/change-password', passwordData);
  },

  requestPasswordReset: async (resetData: PasswordResetRequest) => {
    return api.post<OTPResponse>('/users/request-password-reset', resetData);
  },

  verifyOTPAndSetPassword: async (otpData: VerifyOTPRequest) => {
    return api.post<PasswordChangeResponse>('/users/verify-otp-and-set-password', otpData);
  }
};
