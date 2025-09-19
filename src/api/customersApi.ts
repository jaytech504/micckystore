import { api } from './apiService';

// ===== CUSTOMER TYPES =====

export interface Customer {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  type: 'individual' | 'business';
  profile_image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerRequest {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  type: 'individual' | 'business';
  profile_image?: string;
}

export interface UpdateCustomerRequest {
  name?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  type?: 'individual' | 'business';
  profile_image?: string;
}

export interface LoyaltyDiscount {
  _id: string;
  loyalty_id: string;
  percentage_deduction: number;
  createdAt: string;
  updatedAt: string;
}

export interface DiscountUsed {
  discount: LoyaltyDiscount;
  usedAt: string;
}

export interface TierInfo {
  tier: string;
  min: number;
  next: number;
}

export interface PurchaseHistory {
  month: string;
  purchases: number;
}

export interface CustomerAnalytics {
  customer: Customer;
  totalPurchases: number;
  loyaltyTier: string;
  tierInfo: TierInfo;
  lineGraph: PurchaseHistory[];
  pointsToNextDiscount: number;
  nextDiscount: LoyaltyDiscount;
}

export interface CustomersResponse {
  customers: Customer[];
}

export interface CustomerResponse {
  customer: Customer;
}

export interface CreateCustomerResponse {
  message: string;
  customer: Customer;
}

export interface UpdateCustomerResponse {
  message: string;
  customer: Customer;
}

export interface DeleteCustomerResponse {
  message: string;
}

export interface DiscountsUsedResponse {
  discountsUsed: DiscountUsed[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// ===== CUSTOMERS API =====

export const customersApi = {
  // Create a new customer
  createCustomer: async (customerData: CreateCustomerRequest) => {
    return api.post<CreateCustomerResponse>('/customers', customerData);
  },

  // Get all customers
  getCustomers: async () => {
    return api.get<CustomersResponse>('/customers');
  },

  // Search customers by name, email, or phone number
  searchCustomers: async (query: string) => {
    const queryParams = new URLSearchParams();
    queryParams.append('query', query);
    
    const url = `/api/customers/search?${queryParams.toString()}`;
    return api.get<CustomersResponse>(url);
  },

  // Get customer by ID
  getCustomerById: async (id: string) => {
    return api.get<CustomerResponse>(`/customers/${id}`);
  },

  // Update customer
  updateCustomer: async (id: string, updateData: UpdateCustomerRequest) => {
    return api.put<UpdateCustomerResponse>(`/customers/${id}`, updateData);
  },

  // Delete customer
  deleteCustomer: async (id: string) => {
    return api.delete<DeleteCustomerResponse>(`/customers/${id}`);
  },

  // Get customer loyalty discounts used
  getCustomerLoyaltyDiscounts: async (id: string) => {
    return api.get<DiscountsUsedResponse>(`/customers/${id}/loyalty-discounts-used`);
  },

  // Get customer analytics
  getCustomerAnalytics: async (id: string) => {
    return api.get<CustomerAnalytics>(`/customers/${id}/analytics`);
  }
};

export default customersApi;
