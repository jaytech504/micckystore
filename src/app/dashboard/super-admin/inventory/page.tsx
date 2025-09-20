'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, Package, AlertTriangle, DollarSign, CheckCircle, Search, Filter, Plus, Loader2 } from 'lucide-react';
import { useProducts, useCategories, useProductStats, useProductSales, useSalesStats, useProductLogs } from '../hooks/useProducts';
import { useInventorySalesAnalytics } from '../hooks/useAnalytics';
import { useAuth } from '../../../../hooks/useAuth';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import { productTransfersApi } from '../../../../api/productTransfersApi';
import { branchesApi } from '../../../../api/branchesApi';

interface DashboardStats {
  totalStock: {
    count: number;
    description: string;
  };
  lowStockAlerts: {
    count: number;
    percentageChange: number;
    timeframe: string;
  };
  totalStockValue: {
    amount: number;
    currency: string;
    percentageChange: number;
    timeframe: string;
  };
  unpaidItems: {
    amount: number;
    currency: string;
    percentageChange: number;
    timeframe: string;
  };
}

interface ProductDetails {
  lowStockItems: number;
  unpaidItems: number;
  repairItems: number;
  branches: number;
}

interface SalesOverview {
  onlineSalesRep: number;
  walkInCustomers: number;
  referralSystem: number;
  engineeringSystem: number;
}

interface PurchaseOrder {
  totalStocksPurchased: number;
}

interface StockLog {
  id: string;
  date: string;
  product: string;
  action: string;
  quantity: number;
  from: string;
  performedBy: string;
}

interface Branch {
  _id: string;
  name: string;
  address: string;
  state: string;
  country: string;
  zipCode?: string;
  __v?: number;
}

interface Product {
  id: string;
  name: string;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  percentageChange?: number;
  timeframe?: string;
  icon: React.ReactNode;
  bgColor: string;
}

const MetricCard = ({ title, value, description, percentageChange, timeframe, icon, bgColor }: MetricCardProps) => {
  const formatPercentageChange = (percentage?: number, timeframe?: string) => {
    if (percentage === undefined || timeframe === undefined) return null;
    
    const isNegative = percentage < 0;
    const arrow = isNegative ? '↘' : '↗';
    const color = isNegative ? 'text-red-500' : 'text-green-500';
    
    return (
      <p className={`text-xs ${color} mt-1 flex items-center gap-1`}>
        <span>{arrow}</span> {Math.abs(percentage)}% from {timeframe}
      </p>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
        </div>
        <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      {formatPercentageChange(percentageChange, timeframe)}
    </div>
  );
};

// Default sample data (fallback)
const defaultBranches: Branch[] = [
  { _id: '1', name: 'Gbagada', address: 'Gbagada, Lagos', state: 'Lagos', country: 'Nigeria' },
  { _id: '2', name: 'Ikeja', address: 'Ikeja, Lagos', state: 'Lagos', country: 'Nigeria' },
  { _id: '3', name: 'Lekki', address: 'Lekki, Lagos', state: 'Lagos', country: 'Nigeria' }
];

const defaultProducts: Product[] = [
  { id: '1', name: 'iPhone 14promax' },
  { id: '2', name: 'Samsung S25' },
  { id: '3', name: 'HP Laptop' }
];

const defaultStockLogs: StockLog[] = [
  { id: '1', date: '5/30/2025', product: 'iPhone 14promax', action: 'Transfer', quantity: 5, from: 'Gbagada', performedBy: 'Chineye' },
  { id: '2', date: '5/30/2025', product: 'Samsung S25', action: 'Added', quantity: 5, from: 'Gbagada', performedBy: 'Margaret' },
  { id: '3', date: '5/30/2025', product: 'iPhone 14promax', action: 'Transfer', quantity: 5, from: 'Gbagada', performedBy: 'Chineye' },
  { id: '4', date: '5/30/2025', product: 'iPhone 14promax', action: 'Transfer', quantity: 5, from: 'Gbagada', performedBy: 'Chineye' },
];

const defaultDashboardStats: DashboardStats = {
  totalStock: { count: 190, description: 'Across all branches' },
  lowStockAlerts: { count: 5, percentageChange: -4.3, timeframe: 'yesterday' },
  totalStockValue: { amount: 2432522, currency: '₦', percentageChange: -4.3, timeframe: 'yesterday' },
  unpaidItems: { amount: 89000, currency: '₦', percentageChange: -8.3, timeframe: 'last week' }
};

const defaultProductDetails: ProductDetails = {
  lowStockItems: 5,
  unpaidItems: 10,
  repairItems: 25,
  branches: 3
};

const defaultSalesOverview: SalesOverview = {
  onlineSalesRep: 50,
  walkInCustomers: 30,
  referralSystem: 20,
  engineeringSystem: 17
};

const defaultPurchaseOrder: PurchaseOrder = {
  totalStocksPurchased: 123
};

export default function InventoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ [key: string]: string | string[] | undefined }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { user } = useAuth();
  const [selectBranch, setSelectBranch] = useState("All Branches");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [transferForm, setTransferForm] = useState({
    productId: '',
    fromBranchId: '',
    toBranchId: '',
    quantity: '',
    notes: ''
  });
  const [transferLoading, setTransferLoading] = useState(false);
  const [transferError, setTransferError] = useState('');
  const [transferSuccess, setTransferSuccess] = useState('');
  const [branches, setBranches] = useState<Branch[]>([]);
  const [branchesLoading, setBranchesLoading] = useState(false);
  const [branchesError, setBranchesError] = useState('');
  
  // Filter states
  const [productDetailsFilter, setProductDetailsFilter] = useState('current');
  const [salesOverviewFilter, setSalesOverviewFilter] = useState('current');
  const [purchaseOrderFilter, setPurchaseOrderFilter] = useState('current');
  const [stockLogsFilter, setStockLogsFilter] = useState('current');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });

  // Date range helper functions
  const getDateRange = (filter: string) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    
    switch (filter) {
      case 'previous':
        return {
          start_date: startOfLastMonth.toISOString().split('T')[0],
          end_date: endOfLastMonth.toISOString().split('T')[0]
        };
      case 'current':
        return {
          start_date: startOfMonth.toISOString().split('T')[0],
          end_date: endOfMonth.toISOString().split('T')[0]
        };
      case 'custom':
        return {
          start_date: dateRange.start,
          end_date: dateRange.end
        };
      default:
        return {};
    }
  };

  // Fetch branches from API
  const fetchBranches = async () => {
    try {
      console.log('🏢 Starting branches fetch...');
      setBranchesLoading(true);
      setBranchesError('');
      
      console.log('📡 Making API call to /api/branches...');
      const response = await branchesApi.getBranches();
      
      console.log('📡 Branches API Response:', {
        status: response.status,
        branchesCount: response.data.branches?.length || 0,
        branches: response.data.branches,
        fullResponse: response.data
      });
      
      if (response.data.branches && Array.isArray(response.data.branches)) {
        console.log('✅ Branches fetched successfully:', response.data.branches);
        setBranches(response.data.branches);
      } else {
        console.warn('⚠️ Branches API returned invalid data structure:', response.data);
        setBranchesError('Invalid branches data received');
        // Fallback to default branches if API fails
        console.log('🔄 Using fallback branches:', defaultBranches);
        setBranches(defaultBranches);
      }
    } catch (error: any) {
      console.error('❌ Error fetching branches:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        fullError: error
      });
      setBranchesError(error.message || 'Failed to fetch branches');
      // Fallback to default branches if API fails
      console.log('🔄 Using fallback branches due to error:', defaultBranches);
      setBranches(defaultBranches);
    } finally {
      setBranchesLoading(false);
      console.log('🏁 Branches fetch completed');
    }
  };

  // Fetch branches on component mount
  useEffect(() => {
    fetchBranches();
  }, []);

  // Log when branch selection changes
  useEffect(() => {
    console.log('🏢 Branch selection changed:', {
      selectedBranch: selectBranch,
      isAllBranches: selectBranch === "All Branches",
      branchId: selectBranch !== "All Branches" ? selectBranch : undefined
    });
  }, [selectBranch]);

  // API hooks
  const { 
    products, 
    loading: productsLoading, 
    error: productsError, 
    pagination,
    refetch: refetchProducts 
  } = useProducts({
    search: searchQuery || undefined,
    category: selectedCategory || undefined,
    branch: selectBranch !== "All Branches" ? selectBranch : undefined,
    limit: 20,
    page: currentPage,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const { 
    categories, 
    loading: categoriesLoading, 
    error: categoriesError 
  } = useCategories();

  const { 
    stats, 
    loading: statsLoading, 
    error: statsError 
  } = useProductStats(selectBranch !== "All Branches" ? selectBranch : undefined);

  // Sales data
  const { 
    sales, 
    loading: salesLoading, 
    error: salesError,
    pagination: salesPagination 
  } = useProductSales({
    page: 1,
    limit: 5
  });

  const { 
    stats: salesStats, 
    loading: salesStatsLoading, 
    error: salesStatsError 
  } = useSalesStats({
    branch: selectBranch !== "All Branches" ? selectBranch : undefined
  });

  // Inventory and Sales Analytics (includes totalStockPurchased)
  const { 
    data: inventorySalesData, 
    loading: inventorySalesLoading, 
    error: inventorySalesError 
  } = useInventorySalesAnalytics({
    branch: selectBranch !== "All Branches" ? selectBranch : undefined,
    ...getDateRange(productDetailsFilter)
  });

  // Sales Overview Analytics (separate from inventory for different filtering)
  const { 
    data: salesOverviewData, 
    loading: salesOverviewLoading, 
    error: salesOverviewError 
  } = useInventorySalesAnalytics({
    branch: selectBranch !== "All Branches" ? selectBranch : undefined,
    ...getDateRange(salesOverviewFilter)
  });

  // Purchase Order Analytics (separate from inventory for different filtering)
  const { 
    data: purchaseOrderData, 
    loading: purchaseOrderLoading, 
    error: purchaseOrderError 
  } = useInventorySalesAnalytics({
    branch: selectBranch !== "All Branches" ? selectBranch : undefined,
    ...getDateRange(purchaseOrderFilter)
  });

  // Product Logs (for Stock Logs section)
  const { 
    logs: productLogs, 
    loading: productLogsLoading, 
    error: productLogsError,
    pagination: productLogsPagination 
  } = useProductLogs({
    page: 1,
    limit: 10,
    branch: selectBranch !== "All Branches" ? selectBranch : undefined,
    ...getDateRange(stockLogsFilter)
  });


  const handleTransferSubmit = async () => {
    if (!transferForm.productId || !transferForm.fromBranchId || !transferForm.toBranchId || !transferForm.quantity) {
      setTransferError('Please fill in all required fields');
      return;
    }

    setTransferLoading(true);
    setTransferError('');
    setTransferSuccess('');

    try {
      const transferData = {
        product: transferForm.productId,
        transfer_from: transferForm.fromBranchId,
        transfer_to: transferForm.toBranchId,
        transfer_reason: transferForm.notes || 'Stock transfer request',
        quantity: parseInt(transferForm.quantity)
      };

      console.log('Creating transfer request:', transferData);
      
      const response = await productTransfersApi.createTransferRequest(transferData);
      
      if (response.data.success) {
        setTransferSuccess('Transfer request created successfully!');
        
        // Reset form
        setTransferForm({
          productId: '',
          fromBranchId: '',
          toBranchId: '',
          quantity: '',
          notes: ''
        });

        // Clear success message after 3 seconds
        setTimeout(() => {
          setTransferSuccess('');
        }, 3000);
      } else {
        setTransferError(response.data.message || 'Failed to create transfer request');
      }
    } catch (error: any) {
      console.error('Transfer request error:', error);
      setTransferError(error.response?.data?.message || error.message || 'Failed to create transfer request');
    } finally {
      setTransferLoading(false);
    }
  };

  const handleTransferCancel = () => {
    setTransferForm({
      productId: '',
      fromBranchId: '',
      toBranchId: '',
      quantity: '',
      notes: ''
    });
    setTransferError('');
    setTransferSuccess('');
  };

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === '₦') {
      return `₦${amount.toLocaleString()}`;
    }
    return `${currency}${amount.toLocaleString()}`;
  };

  // Filter change handlers
  const handleProductDetailsFilterChange = (filter: string) => {
    setProductDetailsFilter(filter);
  };

  const handleSalesOverviewFilterChange = (filter: string) => {
    setSalesOverviewFilter(filter);
  };

  const handlePurchaseOrderFilterChange = (filter: string) => {
    setPurchaseOrderFilter(filter);
  };

  const handleStockLogsFilterChange = (filter: string) => {
    setStockLogsFilter(filter);
  };

  // Custom date range picker component
  const DateRangePicker = ({ 
    startDate, 
    endDate, 
    onStartDateChange, 
    onEndDateChange 
  }: {
    startDate: string;
    endDate: string;
    onStartDateChange: (date: string) => void;
    onEndDateChange: (date: string) => void;
  }) => (
    <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
      <div className="flex flex-col">
        <label className="text-xs font-medium text-gray-600 mb-1">Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white"
          max={endDate || undefined}
        />
      </div>
      <div className="flex items-end pb-2">
        <span className="text-gray-400 text-sm">to</span>
      </div>
      <div className="flex flex-col">
        <label className="text-xs font-medium text-gray-600 mb-1">End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white"
          min={startDate || undefined}
        />
      </div>
    </div>
  );

  return (
    <ProtectedRoute requiredRoles={['admin', 'Super Admin']}>
      <div className="min-h-screen bg-gray-50 space-y-6">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Hello {user?.name || 'User'}</h1>
              <p className="text-gray-600">Here is an overview of your inventory system.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Branch:</span>
              <select
                value={selectBranch}
                onChange={(e) => setSelectBranch(e.target.value)}
                className="border rounded px-3 py-1.5 text-sm bg-white text-[#FBB906]"
              >
                <option value="All Branches">All Branches</option>
                {branchesLoading ? (
                  <option value="" disabled>Loading branches...</option>
                ) : (
                  branches.map((branch) => (
                    <option key={branch._id} value={branch._id}>
                      {branch.name}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={refetchProducts}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
                <Link
                  href="/dashboard/super-admin/inventory/add-product"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Product
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Products"
              value={statsLoading ? "..." : stats.totalProducts}
              description="Across all branches"
              bgColor="bg-purple-100"
              icon={<Package className="w-6 h-6 text-purple-600" />}
            />
            <MetricCard
              title="Low Stock Alerts"
              value={statsLoading ? "..." : `${stats.lowStockProducts} Products`}
              bgColor="bg-yellow-100"
              icon={<AlertTriangle className="w-6 h-6 text-yellow-600" />}
            />
            <MetricCard
              title="Total Stock Value"
              value={statsLoading ? "..." : formatCurrency(stats.totalValue, "₦")}
              bgColor="bg-teal-100"
              icon={<DollarSign className="w-6 h-6 text-teal-600" />}
            />
            <MetricCard
              title="Out of Stock"
              value={statsLoading ? "..." : `${stats.outOfStockProducts} Products`}
              bgColor="bg-red-100"
              icon={<CheckCircle className="w-6 h-6 text-red-600" />}
            />
          </div>

          {/* Products List */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Products</h2>
              <div className="text-sm text-gray-600">
                {pagination.totalCount} total products
              </div>
            </div>
            
            {productsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading products...</p>
              </div>
            ) : productsError ? (
              <div className="text-center py-8">
                <p className="text-red-600">Error: {productsError}</p>
                <button 
                  onClick={refetchProducts}
                  className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Retry
                </button>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No products found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{product.itemName}</h3>
                        <p className="text-sm text-gray-600">{product.category.name}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm text-gray-500">SKU: {product.imeiSku}</span>
                          <span className="text-sm text-gray-500">Qty: {product.quantity}</span>
                          <span className="text-sm font-medium text-green-600">
                            ₦{product.sellingPrice.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">
                          Edit
                        </button>
                        <button className="px-3 py-1 text-xs bg-red-100 text-red-600 rounded-full">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-gray-600">
                      Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, pagination.totalCount)} of {pagination.totalCount} products
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={!pagination.hasPrevPage}
                        className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <span className="px-3 py-1 text-sm bg-purple-100 text-purple-600 rounded">
                        {currentPage} of {pagination.totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                        disabled={!pagination.hasNextPage}
                        className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Recent Sales Section */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Sales</h2>
              <div className="text-sm text-gray-600">
                {salesPagination.total_items} total sales
              </div>
            </div>
            
            {salesLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading sales...</p>
              </div>
            ) : salesError ? (
              <div className="text-center py-8">
                <p className="text-red-600">Error: {salesError}</p>
              </div>
            ) : sales.length === 0 ? (
              <div className="text-center py-8">
                <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No recent sales found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sales.map((sale) => (
                  <div key={sale._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{sale.customer_name}</h3>
                        <p className="text-sm text-gray-600">{sale.customer_phone_number}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm text-gray-500">
                            {sale.sales_type === 'sale' ? 'Sale' : 'Swap'}
                          </span>
                          <span className="text-sm text-gray-500">
                            {sale.payment_mode}
                          </span>
                          <span className="text-sm font-medium text-green-600">
                            {sale.reference}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          sale.delivery_status === 'Delivered' 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-yellow-100 text-yellow-600'
                        }`}>
                          {sale.delivery_status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Product Details */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Product Details</h2>
                <select
                  value={productDetailsFilter}
                  onChange={(e) => handleProductDetailsFilterChange(e.target.value)}
                  className="flex items-center space-x-1 text-sm text-gray-600 border border-gray-300 px-3 py-2 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="current">Current Month</option>
                  <option value="previous">Previous Month</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
              {productDetailsFilter === 'custom' && (
                <div className="mb-4">
                  <DateRangePicker
                    startDate={dateRange.start}
                    endDate={dateRange.end}
                    onStartDateChange={(date) => setDateRange(prev => ({ ...prev, start: date }))}
                    onEndDateChange={(date) => setDateRange(prev => ({ ...prev, end: date }))}
                  />
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-red-500 font-medium">Low Stock Items</span>
                <span className="text-lg font-semibold text-gray-900">
                  {inventorySalesLoading ? "..." : inventorySalesData?.inventory?.lowStockAlert?.count || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-red-500 font-medium">Out of Stock</span>
                <span className="text-lg font-semibold text-gray-900">
                  {statsLoading ? "..." : stats.outOfStockProducts}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Total Stock</span>
                <span className="text-lg font-semibold text-gray-900">
                  {inventorySalesLoading ? "..." : inventorySalesData?.inventory?.totalStock || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Total Value</span>
                <span className="text-lg font-semibold text-gray-900">
                  {inventorySalesLoading ? "..." : formatCurrency(inventorySalesData?.inventory?.totalStockValue || 0, "₦")}
                </span>
              </div>
            </div>
          </div>

          {/* Sales Overview */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Sales Overview</h2>
                <select
                  value={salesOverviewFilter}
                  onChange={(e) => handleSalesOverviewFilterChange(e.target.value)}
                  className="flex items-center space-x-1 text-sm text-gray-600 border border-gray-300 px-3 py-2 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="current">Current Month</option>
                  <option value="previous">Previous Month</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
              {salesOverviewFilter === 'custom' && (
                <div className="mb-4">
                  <DateRangePicker
                    startDate={dateRange.start}
                    endDate={dateRange.end}
                    onStartDateChange={(date) => setDateRange(prev => ({ ...prev, start: date }))}
                    onEndDateChange={(date) => setDateRange(prev => ({ ...prev, end: date }))}
                  />
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Online Sales Rep</span>
                <span className="text-lg font-semibold text-gray-900">
                  {salesOverviewLoading ? "..." : salesOverviewData?.salesOverview?.onlineSalesRep || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Walk In Customers</span>
                <span className="text-lg font-semibold text-gray-900">
                  {salesOverviewLoading ? "..." : salesOverviewData?.salesOverview?.walkInCustomers || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Referral System</span>
                <span className="text-lg font-semibold text-gray-900">
                  {salesOverviewLoading ? "..." : salesOverviewData?.salesOverview?.referralSystem || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Engineering System</span>
                <span className="text-lg font-semibold text-gray-900">
                  {salesOverviewLoading ? "..." : salesOverviewData?.salesOverview?.engineeringSystem || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Purchase Order */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Purchase Order</h2>
                <select
                  value={purchaseOrderFilter}
                  onChange={(e) => handlePurchaseOrderFilterChange(e.target.value)}
                  className="flex items-center space-x-1 text-sm text-gray-600 border border-gray-300 px-3 py-2 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="current">Current Month</option>
                  <option value="previous">Previous Month</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
              {purchaseOrderFilter === 'custom' && (
                <div className="mb-4">
                  <DateRangePicker
                    startDate={dateRange.start}
                    endDate={dateRange.end}
                    onStartDateChange={(date) => setDateRange(prev => ({ ...prev, start: date }))}
                    onEndDateChange={(date) => setDateRange(prev => ({ ...prev, end: date }))}
                  />
                </div>
              )}
            </div>
            <div className="text-center py-4">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">
                Total Stocks Purchased
              </h4>
              <div className="text-5xl font-bold text-orange-500">
                {purchaseOrderLoading ? "..." : 
                 purchaseOrderError ? "Error" : 
                 purchaseOrderData?.totalStockPurchased ? 
                 formatCurrency(purchaseOrderData.totalStockPurchased, "₦") : 
                 "0"}
              </div>
            </div>
          </div>

          {/* Stock Transfer */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Stock Transfer</h2>
            </div>
            
            {/* Success Message */}
            {transferSuccess && (
              <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-lg text-sm">
                {transferSuccess}
              </div>
            )}
            
            {/* Error Message */}
            {transferError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
                {transferError}
              </div>
            )}
            
            {/* Branches Loading/Error Message */}
            {branchesLoading && (
              <div className="mb-4 p-3 bg-blue-100 border border-blue-300 text-blue-700 rounded-lg text-sm">
                Loading branches...
              </div>
            )}
            
            {branchesError && (
              <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 text-yellow-700 rounded-lg text-sm">
                Warning: {branchesError}. Using fallback branches.
              </div>
            )}
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product</label>
                  <div className="relative">
                    <select 
                      value={transferForm.productId}
                      onChange={(e) => setTransferForm({...transferForm, productId: e.target.value})}
                      className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white"
                    >
                      <option value="">Select product</option>
                      {products.map((product) => (
                        <option key={product._id} value={product._id}>
                          {product.itemName} (Qty: {product.quantity})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From Branch</label>
                  <div className="relative">
                    <select 
                      value={transferForm.fromBranchId}
                      onChange={(e) => setTransferForm({...transferForm, fromBranchId: e.target.value})}
                      className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white"
                    >
                      <option value=""></option>
                      {branchesLoading ? (
                        <option value="" disabled>Loading branches...</option>
                      ) : (
                        branches.map((branch) => (
                          <option key={branch._id} value={branch._id}>
                            {branch.name} - {branch.state}
                          </option>
                        ))
                      )}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">To Branch</label>
                  <div className="relative">
                    <select 
                      value={transferForm.toBranchId}
                      onChange={(e) => setTransferForm({...transferForm, toBranchId: e.target.value})}
                      className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white"
                    >
                      <option value=""></option>
                      {branchesLoading ? (
                        <option value="" disabled>Loading branches...</option>
                      ) : (
                        branches.filter(branch => branch._id !== transferForm.fromBranchId).map((branch) => (
                          <option key={branch._id} value={branch._id}>
                            {branch.name} - {branch.state}
                          </option>
                        ))
                      )}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <input 
                    type="number" 
                    value={transferForm.quantity}
                    onChange={(e) => setTransferForm({...transferForm, quantity: e.target.value})}
                    className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter quantity"
                    min="1"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Optional Notes</label>
                <textarea 
                  value={transferForm.notes}
                  onChange={(e) => setTransferForm({...transferForm, notes: e.target.value})}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Add optional notes..."
                />
              </div>
              <div className="flex space-x-3 pt-2">
                <button 
                  onClick={handleTransferCancel}
                  disabled={transferLoading}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleTransferSubmit}
                  disabled={!transferForm.productId || !transferForm.fromBranchId || !transferForm.toBranchId || !transferForm.quantity || transferLoading}
                  className="px-4 py-2 bg-[#E866B7] text-white rounded-md hover:bg-pink-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {transferLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {transferLoading ? 'Creating...' : 'Transfer'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stock Logs */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Stock Logs</h2>
                <div className="text-sm text-gray-600">
                  {productLogsPagination.total_items} total logs
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => {
                    // Export functionality - you can implement CSV/Excel export here
                    console.log('Export stock logs');
                  }}
                  className="flex items-center space-x-2 text-sm text-gray-600 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <span>Export</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <select
                  value={stockLogsFilter}
                  onChange={(e) => handleStockLogsFilterChange(e.target.value)}
                  className="flex items-center space-x-1 text-sm text-gray-600 border border-gray-300 px-3 py-2 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="current">Current Month</option>
                  <option value="previous">Previous Month</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
            </div>
            {stockLogsFilter === 'custom' && (
              <div className="mb-4">
                <DateRangePicker
                  startDate={dateRange.start}
                  endDate={dateRange.end}
                  onStartDateChange={(date) => setDateRange(prev => ({ ...prev, start: date }))}
                  onEndDateChange={(date) => setDateRange(prev => ({ ...prev, end: date }))}
                />
              </div>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-sm font-medium text-gray-600 pb-3">Date</th>
                  <th className="text-left text-sm font-medium text-gray-600 pb-3">Products</th>
                  <th className="text-left text-sm font-medium text-gray-600 pb-3">Action</th>
                  <th className="text-left text-sm font-medium text-gray-600 pb-3">Quantity</th>
                  <th className="text-left text-sm font-medium text-gray-600 pb-3">From</th>
                  <th className="text-left text-sm font-medium text-gray-600 pb-3">Performed by</th>
                </tr>
              </thead>
              <tbody>
                {productLogsLoading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                      <p className="mt-2 text-gray-600">Loading stock logs...</p>
                    </td>
                  </tr>
                ) : productLogsError ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-red-600">
                      Error: {productLogsError}
                    </td>
                  </tr>
                ) : !productLogs || productLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      No stock logs available
                    </td>
                  </tr>
                ) : (
                  productLogs.map((log) => (
                    <tr key={log._id} className="border-b border-gray-100">
                      <td className="py-3 text-sm text-gray-900">
                        {new Date(log.activity_date).toLocaleDateString()}
                      </td>
                      <td className="py-3 text-sm text-gray-600">{log.product_id}</td>
                      <td className="py-3 text-sm text-gray-600 capitalize">{log.activity_type}</td>
                      <td className="py-3 text-sm text-gray-600">
                        {log.stock_after[0]?.quantity - log.stock_before[0]?.quantity || 0}
                      </td>
                      <td className="py-3 text-sm text-gray-600">{log.stock_before[0]?.branch || 'N/A'}</td>
                      <td className="py-3 text-sm text-gray-600">
                        {log.created_by}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}