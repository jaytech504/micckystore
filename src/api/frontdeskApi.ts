import { api } from './apiService';

interface ProductSaleData {
  customer_name: string;
  customer_phone_number: string;
  customer_address: string;
  loyalty_id?: string;
  branch: string;
  sales_type: 'sales' | 'swap';
  seller_item: Array<{
    product_id: string;
    quantity: number;
  }>;
  buyer_item: Array<{
    product_id: string;
    quantity: number;
  }>;
  customer_note: string;
  delivery_fee: number;
  payment_mode?: string;
  bank?: string;
  reference?: string;
  email_receipt: string[];
  points: number;
  delivery_status?: string;
}

export const frontdeskApi = {
  // GET /chats - Get user's chats
  getChats: (params?: { page?: number; limit?: number; query?: string }) =>
    api.get('/chats', { params }),

  // GET /messaging/unread-count - Get unread message count
  getUnreadMessageCount: () =>
    api.get('/messaging/unread-count'),

  // POST /chats/{chatId}/last-seen - Update last seen
  updateChatLastSeen: (chatId: string, data?: { lastSeenAt?: string }) =>
    api.post(`/chats/${chatId}/last-seen`, data),

  // GET /activity-logs - Get all recent activity logs
  getActivityLogs: (params?: { limit?: number; before?: string; after?: string }) =>
    api.get('/activity-logs', { params }),

  // GET /repairs - Retrieve all repair tickets with optional filtering
  getRepairs: (params?: { status?: string; search?: string; page?: number; limit?: number }) =>
    api.get('/repairs', { params }),

  // GET /customers - Get all customers
  getCustomers: (params?: { search?: string; page?: number; limit?: number }) =>
    api.get('/customers', { params }),

  // GET /loyalty-discounts/{id} - Get loyalty discount by ID
  getLoyaltyDiscountById: (id: string) =>
    api.get(`/loyalty-discounts/${id}`),

  // GET /products - Get all products with search and filtering
  getProducts: (params?: { itemName?: string; costPrice?: number; page?: number; limit?: number }) =>
    api.get('/products', { params }),

  // GET /branches - Get all branches
  getBranches: (params?: { search?: string; page?: number; limit?: number }) =>
    api.get('/branches', { params }),

  // GET /users - Get all users (supports filtering by role/search)
  getUsers: (params?: { role?: string; search?: string; page?: number; limit?: number }) =>
    api.get('/users', { params }),

  // POST /products - Create a new product
  createProduct: (data: {
    itemName: string;
    quantity?: number;
    productImages?: string[];
    category?: string;
    imeiSku?: string;
    costPrice?: number;
    purchaseDescription?: string;
    tax?: number;
    profit?: string;
    sellingPrice?: number;
    sellingDescription?: string;
    sellingTax?: number;
    vendor?: string;
    stockLocation?: Array<{ branch: string; openingQuantity: number; closingQuantity: number }>;
  }) => api.post('/products', data),

  // POST /product-sales - Create a product sale
  createProductSale: (data: ProductSaleData) =>
    api.post('/product-sales', data),

  // POST /repairs - Create a repair ticket
  createRepair: (data: {
    device: string;
    issueReported: string;
    diagnosis?: string;
    imei?: string;
    assignedEngineer?: string;
    priorityLevel?: string;
    customerName?: string;
    customerPhoneNumber?: string;
    customerEmail?: string;
    customerAddress?: string;
    expectedCompletionDate?: string;
    price?: string;
  }) => api.post('/repairs', data),

  // GET /analytics/inventory-sales - Get comprehensive inventory and sales overview
  getInventorySalesAnalytics: (params?: { start?: string; end?: string; month?: string; year?: string }) =>
    api.get('/analytics/inventory-sales', { params }),

  // POST /product-transfers - Create a new product transfer request
  createProductTransfer: (data: {
    product: string;
    transfer_from: string;
    transfer_to: string;
    transfer_reason: string;
    quantity: number;
  }) => api.post('/product-transfers', data),
};

export default frontdeskApi;