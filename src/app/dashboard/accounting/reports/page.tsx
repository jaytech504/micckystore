'use client';

import Link from 'next/link';
import React, {useState, useEffect} from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, Package, ShoppingCart, Search, AlertTriangle, Plus, ChevronDown, Download, Loader2, AlertCircle, X } from 'lucide-react';
import { useDashboardAnalytics } from '../../../../hooks/useDashboardAnalytics';
import { useFinancialAnalytics } from '../../../../hooks/useFinancialAnalytics';
import { useInventorySalesAnalytics } from '../../../../hooks/useInventorySalesAnalytics';
import { useProductSalesStats } from '../../../../hooks/useProductSalesStats';
import { useBranches } from '../../../../hooks/useBranches';
import { useInvoiceAnalytics } from '../../../../hooks/useInvoiceAnalytics';


const Dashboard = () => {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [locationOpen, setLocationOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  
  // API hooks
  const { branches, loading: branchesLoading } = useBranches();
  const { data: dashboardData, loading: dashboardLoading, error: dashboardError, clearError: clearDashboardError } = useDashboardAnalytics({
    branch: selectedLocation || undefined
  });
  
  const { data: financialData, loading: financialLoading, error: financialError, clearError: clearFinancialError } = useFinancialAnalytics({
    branch: selectedLocation || undefined,
    period: selectedPeriod === 'daily' ? 'week' : selectedPeriod === 'weekly' ? 'month' : 'year'
  });
  
  const { data: inventorySalesData, loading: inventorySalesLoading, error: inventorySalesError, clearError: clearInventorySalesError } = useInventorySalesAnalytics({
    branch: selectedLocation || undefined
  });
  
  const { data: productSalesStats, loading: productSalesStatsLoading, error: productSalesStatsError, clearError: clearProductSalesStatsError } = useProductSalesStats({
    branch: selectedLocation || undefined
  });
  
  const { data: invoiceStats, loading: invoiceStatsLoading, error: invoiceStatsError, clearError: clearInvoiceStatsError } = useInvoiceAnalytics({
    branch: selectedLocation || undefined
  });

  // Handle location change
  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
    setLocationOpen(false);
  };

  // Handle period change
  const handlePeriodChange = (period: 'daily' | 'weekly' | 'monthly') => {
    setSelectedPeriod(period);
  };

  // Generate sales data from inventory sales analytics
  const salesData = inventorySalesData?.stockLogs?.slice(0, 12).map((item: any, index: number) => ({
    name: `${index + 1}k`,
    value: item.stock_after?.reduce((sum: number, stock: any) => sum + stock.quantity, 0) || 0
  })) || [];

  // Generate profit/revenue data from financial analytics
  const profitRevenueData = financialData ? [{
    month: new Date().toLocaleDateString('en-US', { month: 'short' }),
    revenue: financialData.revenue.total,
    profit: financialData.revenue.total - financialData.expenses.total
  }] : [];

    const LocationDropdown = () => (
        <div className="relative">
          <button
            onClick={() => setLocationOpen(!locationOpen)}
        disabled={branchesLoading}
        className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 hover:border-gray-300 transition-colors disabled:opacity-50"
          >
            <span className="text-sm text-gray-600">Location:</span>
        <span className="text-sm text-amber-500 font-medium">
          {selectedLocation ? branches.find(b => b._id === selectedLocation)?.name || 'All Branches' : 'All Branches'}
        </span>
            <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${locationOpen ? 'rotate-180' : ''}`} />
          </button>
          {locationOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-full">
          <button
            onClick={() => handleLocationChange('')}
            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg"
          >
            All Branches
          </button>
          {branches.map((branch: any) => (
                <button
              key={branch._id}
              onClick={() => handleLocationChange(branch._id)}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 last:rounded-b-lg"
            >
              {branch.name}
                </button>
              ))}
            </div>
          )}
        </div>
      );
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
          <div>
            <h1 className="text-2xl lg:text-2xl font-bold text-gray-900 mb-2">Accounting dashboard</h1>
            <p className="text-gray-600 text-sm">Monitor all financial activities, revenue, expenses, and invoices.</p>
          </div>
          <div className="text-sm text-gray-500 mt-4 lg:mt-0">
            Last Update: Current date and time
          </div>
        </div>

        {/* Search and controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search reports..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-gray-900 text-sm pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-white"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">⌘ K</span>
          </div>
          <div className="flex items-center gap-3">
            <LocationDropdown />
            <button className="flex text-black text-sm items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              Download report
            </button>
          </div>
        </div>
      </div>

      {/* Error Messages */}
      {(dashboardError || financialError || inventorySalesError || productSalesStatsError || invoiceStatsError) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <div className="flex-1">
              <p className="text-red-800 font-medium">Error Loading Reports Data</p>
              <div className="text-red-600 text-sm space-y-1">
                {dashboardError && <p>• Dashboard Analytics: {dashboardError}</p>}
                {financialError && <p>• Financial Data: {financialError}</p>}
                {inventorySalesError && <p>• Sales Analytics: {inventorySalesError}</p>}
                {productSalesStatsError && <p>• Product Stats: {productSalesStatsError}</p>}
                {invoiceStatsError && <p>• Invoice Stats: {invoiceStatsError}</p>}
              </div>
            </div>
            <button
              onClick={() => {
                clearDashboardError();
                clearFinancialError();
                clearInventorySalesError();
                clearProductSalesStatsError();
                clearInvoiceStatsError();
              }}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {/* Total Gadgets */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Gadgets</p>
              {dashboardLoading ? (
                <div className="flex items-center">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400 mr-2" />
                  <span className="text-gray-400">Loading...</span>
                </div>
              ) : (
                <p className="text-2xl font-semibold text-gray-800">
                  {dashboardData?.totalStaff?.toLocaleString() || '0'}
                </p>
              )}
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Package className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-green-500 font-medium">
              {dashboardData?.dailySales?.count || '0'}%
            </span>
            <span className="text-gray-500">past week</span>
          </div>
        </div>

        {/* Total Sales */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Sales</p>
              {financialLoading ? (
                <div className="flex items-center">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400 mr-2" />
                  <span className="text-gray-400">Loading...</span>
                </div>
              ) : (
                <p className="text-2xl font-semibold text-gray-800">
                  ₦{financialData?.revenue?.total?.toLocaleString() || '0'}
                </p>
              )}
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-green-500 font-medium">
              {financialData?.revenue?.salesCount || '0'}%
            </span>
            <span className="text-gray-500">from yesterday</span>
          </div>
        </div>

        {/* Vendor Orders */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Vendor Orders</p>
              {dashboardLoading ? (
                <div className="flex items-center">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400 mr-2" />
                  <span className="text-gray-400">Loading...</span>
                </div>
              ) : (
                <p className="text-2xl font-semibold text-gray-800">
                  {dashboardData?.dailyTransfers?.count?.toLocaleString() || '0'}
                </p>
              )}
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-green-500 font-medium">
              {dashboardData?.dailyTransfers?.quantity || '0'}%
            </span>
            <span className="text-gray-500">than previous day</span>
          </div>
        </div>

        {/* Stock Alert */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Stock Alert</p>
              {dashboardLoading ? (
                <div className="flex items-center">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400 mr-2" />
                  <span className="text-gray-400">Loading...</span>
                </div>
              ) : (
                <p className="text-2xl font-semibold text-gray-800">
                  {inventorySalesData?.inventory?.lowStockAlert?.count || '0'}
                </p>
              )}
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <TrendingDown className="w-4 h-4 text-red-500" />
            <span className="text-red-500 font-medium">
              {inventorySalesData?.inventory?.lowStockAlert?.products?.length || '0'}%
            </span>
            <span className="text-gray-500">than previous day</span>
          </div>
        </div>
      </div>

      {/* Sales Details Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Sales Details</h2>
          <select 
            value={selectedPeriod}
            onChange={(e) => handlePeriodChange(e.target.value as 'daily' | 'weekly' | 'monthly')}
            className="text-sm text-gray-700 border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        
        <div className="h-80">
          {inventorySalesLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
                <p className="text-gray-600">Loading sales data...</p>
              </div>
            </div>
          ) : salesData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
                  tickFormatter={(value) => `${value}`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white'
                }}
                  formatter={(value) => [`${value}`, 'Sales']}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#3B82F6' }}
              />
            </LineChart>
          </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <p className="text-lg font-medium mb-2">No Sales Data Available</p>
                <p className="text-sm">Select a different period or branch to view data</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overdue Invoices */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Overdue invoices</h3>
            <Link 
            href="/dashboard/accounting/transaction/new-invoice"
            className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700">
              <Plus className="w-4 h-4" />
              New invoice
            </Link>
          </div>
          
          {invoiceStatsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400 mr-2" />
              <span className="text-gray-600">Loading invoice data...</span>
            </div>
          ) : (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Total unpaid invoice</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ 
                      width: `${(invoiceStats?.overdue_count || 0) / (invoiceStats?.total_invoices || 1) * 100}%` 
                    }}
                  ></div>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-red-500">Total overdue</p>
                <p className="text-xl font-semibold text-gray-800">
                  ₦{invoiceStats?.totalUnpaidAmount?.toLocaleString() || '0'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Best Selling Category */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Best selling category</h3>
          
          {productSalesStatsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400 mr-2" />
              <span className="text-gray-600">Loading category data...</span>
            </div>
          ) : productSalesStats?.topSellingProducts && productSalesStats.topSellingProducts.length > 0 ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Category</span>
                <span className="text-sm font-medium text-gray-600">Revenue</span>
                <span className="text-sm font-medium text-gray-600">Quantity</span>
            </div>
            
              {productSalesStats.topSellingProducts.slice(0, 3).map((product, index) => (
                <div key={product.product_id} className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-800">{product.product_name}</span>
                  <span className="text-sm text-gray-800">₦{product.revenue.toLocaleString()}</span>
                  <span className="text-sm text-green-500 font-medium">{product.quantity_sold}</span>
            </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No category data available</p>
            </div>
          )}
        </div>
        
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Profit & Revenue</h3>
            <select 
              value={selectedLocation}
              onChange={(e) => handleLocationChange(e.target.value)}
              className="text-sm text-gray-700 border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500"
              disabled={branchesLoading}
            >
              <option value="">All Branches</option>
              {branches.map((branch: any) => (
                <option key={branch._id} value={branch._id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="h-32">
            {financialLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400 mr-2" />
                <span className="text-gray-600">Loading financial data...</span>
              </div>
            ) : profitRevenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={profitRevenueData}>
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#6B7280' }}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                    formatter={(value: any) => [`₦${value.toLocaleString()}`, '']}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="profit" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <p className="text-sm font-medium mb-1">No Financial Data Available</p>
                  <p className="text-xs">Select a branch to view data</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-600">Revenue</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">Profit</span>
            </div>
          </div>
        </div>
    </div>
  );
};

export default Dashboard;