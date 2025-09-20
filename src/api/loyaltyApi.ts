import { api } from './apiService';

// ===== LOYALTY DISCOUNT TYPES =====

export interface LoyaltyDiscount {
  _id: string;
  loyalty_id: string;
  percentage_deduction: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLoyaltyDiscountRequest {
  loyalty_id: string;
  percentage_deduction: number;
}

export interface UpdateLoyaltyDiscountRequest {
  loyalty_id?: string;
  percentage_deduction?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  loyaltyDiscount?: T;
  loyaltyDiscounts?: T[];
  error?: string;
}

export interface LoyaltyDiscountsResponse {
  loyaltyDiscounts: LoyaltyDiscount[];
}

export interface LoyaltyDiscountResponse {
  loyaltyDiscount: LoyaltyDiscount;
}

export interface CreateLoyaltyDiscountResponse {
  message: string;
  loyaltyDiscount: LoyaltyDiscount;
}

export interface UpdateLoyaltyDiscountResponse {
  message: string;
  loyaltyDiscount: LoyaltyDiscount;
}

export interface DeleteLoyaltyDiscountResponse {
  message: string;
}

// ===== LOYALTY DISCOUNTS API =====

export const loyaltyApi = {
  /**
   * Create a new loyalty discount
   * Admin and Super Admin only
   */
  createLoyaltyDiscount: async (loyaltyData: CreateLoyaltyDiscountRequest) => {
    return api.post<CreateLoyaltyDiscountResponse>('/loyalty-discounts', loyaltyData);
  },

  /**
   * Get all loyalty discounts
   * Any authenticated user
   */
  getLoyaltyDiscounts: async () => {
    return api.get<LoyaltyDiscountsResponse>('/loyalty-discounts');
  },

  /**
   * Get loyalty discount by ID
   * Any authenticated user
   */
  getLoyaltyDiscountById: async (id: string) => {
    return api.get<LoyaltyDiscountResponse>(`/loyalty-discounts/${id}`);
  },

  /**
   * Update loyalty discount by ID
   * Admin and Super Admin only
   */
  updateLoyaltyDiscount: async (id: string, updateData: UpdateLoyaltyDiscountRequest) => {
    return api.put<UpdateLoyaltyDiscountResponse>(`/loyalty-discounts/${id}`, updateData);
  },

  /**
   * Delete loyalty discount by ID
   * Admin and Super Admin only
   */
  deleteLoyaltyDiscount: async (id: string) => {
    return api.delete<DeleteLoyaltyDiscountResponse>(`/loyalty-discounts/${id}`);
  }
};

export default loyaltyApi;
