'use client';

import React, { useState } from 'react';
import { ChevronDown, Package, AlertTriangle, DollarSign, CheckCircle } from 'lucide-react';

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
  id: string;
  name: string;
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

// Default sample data
const defaultBranches: Branch[] = [
  { id: 'lekki', name: 'Lekki' },
  { id: 'ikeja', name: 'Ikeja' },
  { id: 'gbagada', name: 'Gbagada' }
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

// Page component for Next.js App Router - params and searchParams are now Promises
export default function DashboardPage({
  params,
  searchParams,
}: {
  params: Promise<{ [key: string]: string | string[] | undefined }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [selectBranch, setSelectBranch] = useState("All Branches");
  const [transferForm, setTransferForm] = useState({
    productId: '',
    fromBranchId: '',
    toBranchId: '',
    quantity: '',
    notes: ''
  });

  // Since params and searchParams are Promises, you would need to use them differently
  // For now, we'll use the component state for branch selection

  const handleTransferSubmit = () => {
    if (transferForm.productId && transferForm.fromBranchId && transferForm.toBranchId && transferForm.quantity) {
      // Handle stock transfer logic here
      console.log('Stock transfer:', {
        productId: transferForm.productId,
        fromBranchId: transferForm.fromBranchId,
        toBranchId: transferForm.toBranchId,
        quantity: parseInt(transferForm.quantity),
        notes: transferForm.notes || undefined
      });
      
      // Reset form
      setTransferForm({
        productId: '',
        fromBranchId: '',
        toBranchId: '',
        quantity: '',
        notes: ''
      });
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
  };

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === '₦') {
      return `₦${amount.toLocaleString()}`;
    }
    return `${currency}${amount.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hello Samuel</h1>
            <p className="text-gray-600">Here is an overview of your administrative system.</p>
          </div>
         <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Branch:</span>
            <select
              value={selectBranch}
              onChange={(e) => setSelectBranch(e.target.value)}
              className="border rounded px-3 py-1.5 text-sm bg-white text-[#FBB906]"
            >
              <option>All Branches</option>
              <option>Gbagada</option>
              <option>Ikeja</option>
              <option>Lekki</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Stock"
            value={defaultDashboardStats.totalStock.count}
            description={defaultDashboardStats.totalStock.description}
            bgColor="bg-purple-100"
            icon={<Package className="w-6 h-6 text-purple-600" />}
          />
          <MetricCard
            title="Low Stock Alerts"
            value={`${defaultDashboardStats.lowStockAlerts.count} Stocks`}
            percentageChange={defaultDashboardStats.lowStockAlerts.percentageChange}
            timeframe={defaultDashboardStats.lowStockAlerts.timeframe}
            bgColor="bg-green-100"
            icon={<AlertTriangle className="w-6 h-6 text-green-600" />}
          />
          <MetricCard
            title="Total Stock Value"
            value={formatCurrency(defaultDashboardStats.totalStockValue.amount, defaultDashboardStats.totalStockValue.currency)}
            percentageChange={defaultDashboardStats.totalStockValue.percentageChange}
            timeframe={defaultDashboardStats.totalStockValue.timeframe}
            bgColor="bg-teal-100"
            icon={<DollarSign className="w-6 h-6 text-teal-600" />}
          />
          <MetricCard
            title="Unpaid Items"
            value={formatCurrency(defaultDashboardStats.unpaidItems.amount, defaultDashboardStats.unpaidItems.currency)}
            percentageChange={defaultDashboardStats.unpaidItems.percentageChange}
            timeframe={defaultDashboardStats.unpaidItems.timeframe}
            bgColor="bg-green-100"
            icon={<CheckCircle className="w-6 h-6 text-green-600" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Product Details */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Product Details</h2>
              <button className="flex items-center space-x-1 text-sm text-gray-600 border border-gray-300 px-3 py-1 rounded">
                <span>Previous Month</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-red-500 font-medium">Low Stock Items</span>
                <span className="text-lg font-semibold text-gray-900">{defaultProductDetails.lowStockItems}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-red-500 font-medium">Unpaid Items</span>
                <span className="text-lg font-semibold text-gray-900">{defaultProductDetails.unpaidItems}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Repair Items</span>
                <span className="text-lg font-semibold text-gray-900">{defaultProductDetails.repairItems}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Branches</span>
                <span className="text-lg font-semibold text-gray-900">{defaultProductDetails.branches}</span>
              </div>
            </div>
          </div>

          {/* Sales Overview */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Sales Overview</h2>
              <button className="flex items-center space-x-1 text-sm text-gray-600 border border-gray-300 px-3 py-1 rounded">
                <span>Previous Month</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Online Sales Rep</span>
                <span className="text-lg font-semibold text-gray-900">{defaultSalesOverview.onlineSalesRep}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Walk In Customers</span>
                <span className="text-lg font-semibold text-gray-900">{defaultSalesOverview.walkInCustomers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Referral System</span>
                <span className="text-lg font-semibold text-gray-900">{defaultSalesOverview.referralSystem}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Engineering system</span>
                <span className="text-lg font-semibold text-gray-900">{defaultSalesOverview.engineeringSystem}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Purchase Order */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Purchase Order</h2>
              <button className="flex items-center space-x-1 text-sm text-gray-600 border border-gray-300 px-3 py-1 rounded">
                <span>Previous Month</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            <div className="text-center py-4">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">
                Total Stocks Purchased
              </h4>
              <div className="text-5xl font-bold text-orange-500">{defaultPurchaseOrder.totalStocksPurchased}</div>
            </div>
          </div>

          {/* Stock Transfer */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Stock Transfer</h2>
            </div>
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
                      {defaultProducts.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name}
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
                      {defaultBranches.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name}
                        </option>
                      ))}
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
                      {defaultBranches.filter(branch => branch.id !== transferForm.fromBranchId).map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name}
                        </option>
                      ))}
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
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleTransferSubmit}
                  disabled={!transferForm.productId || !transferForm.fromBranchId || !transferForm.toBranchId || !transferForm.quantity}
                  className="px-4 py-2 bg-[#E866B7] text-white rounded-md hover:bg-pink-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Transfer
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stock Logs */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Stock Logs</h2>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-1 text-sm text-gray-600 border border-gray-300 px-3 py-1 rounded">
                <span>Export</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <button className="flex items-center space-x-1 text-sm text-gray-600 border border-gray-300 px-3 py-1 rounded">
                <span>Monthly</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
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
                {defaultStockLogs.length > 0 ? (
                  defaultStockLogs.map((log) => (
                    <tr key={log.id} className="border-b border-gray-100">
                      <td className="py-3 text-sm text-gray-900">{log.date}</td>
                      <td className="py-3 text-sm text-gray-600">{log.product}</td>
                      <td className="py-3 text-sm text-gray-600">{log.action}</td>
                      <td className="py-3 text-sm text-gray-600">{log.quantity}</td>
                      <td className="py-3 text-sm text-gray-600">{log.from}</td>
                      <td className="py-3 text-sm text-gray-600">{log.performedBy}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-4 text-center text-sm text-gray-500">
                      No stock logs available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}