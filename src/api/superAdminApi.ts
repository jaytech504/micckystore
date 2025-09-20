import { api, authService } from './apiService';

// Type definitions for analytics data
export interface DashboardStats {
  totalStaff: number;
  dailySales: {
    count: number;
    revenue: number;
  };
  dailyTransfers: {
    count: number;
    quantity: number;
  };
  completedRepairs: number;
  recentActivityLogs: ActivityLog[];
  lineGraphData: {
    summary: {
      activeUsers: number;
      completedTasks: number;
      internalMessages: number;
    };
    dailyBreakdown: DailyBreakdown[];
  };
}

export interface ActivityLog {
  _id: string;
  activity_type: string;
  activity_date: string;
  product_id: {
    _id: string;
    itemName: string;
  };
  created_by: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  stock_before: StockInfo[];
  stock_after: StockInfo[];
  activity_details: Record<string, any>;
}

export interface StockInfo {
  branch: {
    _id: string;
    name: string;
  };
  quantity: number;
}

export interface DailyBreakdown {
  date: string;
  activeUsers: number;
  completedTasks: number;
  internalMessages: number;
}


export interface FinancialAnalytics {
  period: {
    start: string;
    end: string;
    type: string;
  };
  revenue: {
    total: number;
    salesCount: number;
    invoiceRevenue: number;
  };
  expenses: {
    total: number;
    vendorExpenses: number;
    transactionExpenses: number;
  };
  profitLoss: {
    amount: number;
    margin: number;
    isProfit: boolean;
  };
  invoices: {
    total: number;
    paid: number;
    unpaid: number;
    unpaidAmount: number;
  };
  transactionBreakdown: TransactionBreakdown[];
  monthlyTrend: MonthlyTrend[];
}

export interface TransactionBreakdown {
  _id: string;
  count: number;
  total: number;
}

export interface MonthlyTrend {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface InventorySalesAnalytics {
  period: {
    start: string;
    end: string;
    month: string;
    year: string;
  };
  inventory: {
    totalStock: number;
    lowStockAlert: {
      count: number;
      products: LowStockProduct[];
    };
    totalStockValue: number;
  };
  unpaidItems: {
    sales: {
      count: number;
      total: number;
    };
    invoices: {
      count: number;
      total: number;
    };
  };
  productDetails: {
    lowStockItems: any[];
    unpaidItems: any[];
    repairItems: any[];
    branches: any[];
  };
  salesOverview: {
    onlineSalesRep: number;
    walkInCustomers: number;
    referralSystem: number;
    engineeringSystem: number;
  };
  totalStockPurchased: number;
  stockLogs: StockLog[];
}

export interface LowStockProduct {
  _id: string;
  itemName: string;
  quantity: number;
  category: {
    _id: string;
    name: string;
  };
  vendor: {
    _id: string;
    name: string;
  };
}

export interface StockLog {
  _id: string;
  activity_type: string;
  activity_date: string;
  product_id: {
    _id: string;
    itemName: string;
  };
  created_by: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  stock_before: StockInfo[];
  stock_after: StockInfo[];
}

export interface BusinessAnalytics {
  period: {
    start: string;
    end: string;
    month: string;
    year: string;
  };
  totalRevenue: number;
  productPrice: {
    itemName: string;
    costPrice: number;
    sellingPrice: number;
    profit: string;
    tax: number;
  };
  totalExpenses: number;
  netProfit: number;
  invoiceAnalysis: {
    invoices1to30: {
      count: number;
      total: number;
    };
    invoices31to60: {
      count: number;
      total: number;
    };
    invoices61to90: {
      count: number;
      total: number;
    };
    totalUnpaidInvoiceValue: number;
    totalOverdueInvoiceValue: number;
  };
  lineGraphData: LineGraphData[];
  todaySales: {
    totalSales: {
      amount: number;
      percentageChange: number;
    };
    totalOrders: {
      amount: number;
      percentageChange: number;
    };
    productsSold: {
      amount: number;
      percentageChange: number;
    };
    newCustomers: {
      amount: number;
      percentageChange: number;
    };
  };
  lowQuantityStock: LowStockProduct[];
  barGraphData: BarGraphData[];
}

export interface LineGraphData {
  date: string;
  income: number;
  expenses: number;
}

export interface BarGraphData {
  day: string;
  revenue: number;
}

export interface YearlyFinancialAnalytics {
  year: number;
  previousYear: number;
  branch: string;
  yearlyComparison: {
    totalIncome: {
      currentYear: number;
      previousYear: number;
      percentageChange: number;
    };
    totalExpenses: {
      currentYear: number;
      previousYear: number;
      percentageChange: number;
    };
    grossProfit: {
      currentYear: number;
      previousYear: number;
      percentageChange: number;
    };
    profitMargin: {
      currentYear: number;
      previousYear: number;
      percentageChange: number;
    };
  };
  lineGraphData: YearlyLineGraphData[];
  currentYearBreakdown: {
    productSales: {
      total: number;
      count: number;
    };
    repairsRevenue: {
      total: number;
    };
    swapFees: {
      total: number;
    };
    expensesBreakdown: {
      transactions: TransactionBreakdown[];
      vendors: VendorBreakdown[];
    };
  };
}

export interface YearlyLineGraphData {
  year: number;
  income: number;
  expenses: number;
  profit: number;
}

export interface VendorBreakdown {
  _id: string;
  total: number;
  count: number;
}

export interface CashFlowAnalytics {
  yearlyCashFlow: {
    totalCashInflow: number;
    totalCashOutflow: number;
    netFlowCash: number;
    openingCashBalance: number;
    closingCashBalance: number;
  };
  monthlyTransactions: MonthlyTransaction[];
  charts: {
    cashFlowLineGraph: CashFlowLineData[];
    cashFlowPieChart: CashFlowPieData[];
    netFlowLineGraph: NetFlowLineData[];
  };
}

export interface MonthlyTransaction {
  type: string;
  date: string;
  amount: number;
  description: string;
  customer: string;
  vendor: string;
  category: string;
}

export interface CashFlowLineData {
  month: string;
  inflow: number;
  outflow: number;
}

export interface CashFlowPieData {
  category: string;
  amount: number;
  type: string;
}

export interface NetFlowLineData {
  date: string;
  netFlow: number;
}

export interface InventorySalesAnalytics {
  period: {
    start: string;
    end: string;
    month: string;
    year: string;
  };
  inventory: {
    totalStock: number;
    lowStockAlert: {
      count: number;
      products: Array<{
        _id: string;
        itemName: string;
        quantity: number;
        category: {
          _id: string;
          name: string;
        };
        vendor: {
          _id: string;
          name: string;
        };
      }>;
    };
    totalStockValue: number;
  };
  unpaidItems: {
    sales: {
      count: number;
      total: number;
    };
    invoices: {
      count: number;
      total: number;
    };
  };
  productDetails: {
    lowStockItems: any[];
    unpaidItems: any[];
    repairItems: any[];
    branches: any[];
  };
  salesOverview: {
    onlineSalesRep: number;
    walkInCustomers: number;
    referralSystem: number;
    engineeringSystem: number;
  };
  totalStockPurchased: number;
  stockLogs: Array<{
    _id: string;
    activity_type: string;
    activity_date: string;
    product_id: {
      _id: string;
      itemName: string;
    };
    created_by: {
      _id: string;
      firstName: string;
      lastName: string;
    };
    stock_before: Array<{
      branch: {
        _id: string;
        name: string;
      };
      quantity: number;
    }>;
    stock_after: Array<{
      branch: {
        _id: string;
        name: string;
      };
      quantity: number;
    }>;
  }>;
}

// API service functions
export const superAdminApi = {
  // Dashboard Analytics
  getDashboardAnalytics: async (params?: {
    branch?: string;
    days?: number;
    month?: string;
    year?: string;
  }) => {
    const queryParams = new URLSearchParams();
    
    // Use user's branch if no branch specified
    const branchId = params?.branch || authService.getUserBranch();
    if (branchId) queryParams.append('branch', branchId);
    if (params?.days) queryParams.append('days', params.days.toString());
    if (params?.month) queryParams.append('month', params.month);
    if (params?.year) queryParams.append('year', params.year);

    const url = `/analytics/dashboard${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<{ success: boolean; message: string; data: DashboardStats }>(url);
  },

  // Financial Analytics
  getFinancialAnalytics: async (params?: {
    branch?: string;
    period?: 'week' | 'month' | 'quarter' | 'year';
    start_date?: string;
    end_date?: string;
  }) => {
    const queryParams = new URLSearchParams();
    
    // Use user's branch if no branch specified
    const branchId = params?.branch || authService.getUserBranch();
    if (branchId) queryParams.append('branch', branchId);
    if (params?.period) queryParams.append('period', params.period);
    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.end_date) queryParams.append('end_date', params.end_date);

    const url = `/analytics/financial${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<{ success: boolean; message: string; data: FinancialAnalytics }>(url);
  },

  // Inventory and Sales Analytics
  getInventorySalesAnalytics: async (params?: {
    branch?: string;
    month?: string;
    year?: string;
  }) => {
    const queryParams = new URLSearchParams();
    
    // Use user's branch if no branch specified
    const branchId = params?.branch || authService.getUserBranch();
    if (branchId) queryParams.append('branch', branchId);
    if (params?.month) queryParams.append('month', params.month);
    if (params?.year) queryParams.append('year', params.year);

    const url = `/analytics/inventory-sales${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<{ success: boolean; message: string; data: InventorySalesAnalytics }>(url);
  },

  // Business Analytics
  getBusinessAnalytics: async (params?: {
    branch?: string;
    month?: string;
    year?: string;
    product_id?: string;
  }) => {
    const queryParams = new URLSearchParams();
    
    // Use user's branch if no branch specified
    const branchId = params?.branch || authService.getUserBranch();
    if (branchId) queryParams.append('branch', branchId);
    if (params?.month) queryParams.append('month', params.month);
    if (params?.year) queryParams.append('year', params.year);
    if (params?.product_id) queryParams.append('product_id', params.product_id);

    const url = `/analytics/business${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<{ success: boolean; message: string; data: BusinessAnalytics }>(url);
  },

  // Yearly Financial Analytics
  getYearlyFinancialAnalytics: async (params?: {
    branch?: string;
    year?: string;
  }) => {
    const queryParams = new URLSearchParams();
    
    // Use user's branch if no branch specified
    const branchId = params?.branch || authService.getUserBranch();
    if (branchId) queryParams.append('branch', branchId);
    if (params?.year) queryParams.append('year', params.year);

    const url = `/analytics/yearly-financial${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<{ success: boolean; message: string; data: YearlyFinancialAnalytics }>(url);
  },

  // Cash Flow Analytics
  getCashFlowAnalytics: async (params?: {
    branch?: string;
    year?: string;
    month?: string;
  }) => {
    const queryParams = new URLSearchParams();
    
    // Use user's branch if no branch specified
    const branchId = params?.branch || authService.getUserBranch();
    if (branchId) queryParams.append('branch', branchId);
    if (params?.year) queryParams.append('year', params.year);
    if (params?.month) queryParams.append('month', params.month);

    const url = `/analytics/cash-flow${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<{ success: boolean; message: string; data: CashFlowAnalytics }>(url);
  },

};

export default superAdminApi;