'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { Search,ChevronDown, Download, Plus, ArrowUpRight, TrendingUp, TrendingDown, ShoppingBag, Users, Package, Loader2, AlertCircle, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, BarChart, Bar, Legend, ResponsiveContainer } from 'recharts';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { useFinancialAnalytics } from '../../../hooks/useFinancialAnalytics';
import { useBranches } from '../../../hooks/useBranches';
import { useInvoiceAnalytics } from '../../../hooks/useInvoiceAnalytics';
import { useSalesAnalytics } from '../../../hooks/useSalesAnalytics';
import { useDailyRevenueAnalytics } from '../../../hooks/useDailyRevenueAnalytics';




const Dashboard = () => {
  const [mounted, setMounted] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('All Branches');
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [locationOpen, setLocationOpen] = useState(false);

  // Use branches hook to fetch real branch data
  const { branches, loading: branchesLoading, error: branchesError, clearError: clearBranchesError } = useBranches();

  // Create branch options from API data
  const branchOptions = [
    { value: 'All Branches', label: 'All Branches' },
    ...branches.map(branch => ({
      value: branch._id,
      label: branch.name
    }))
  ];

  // Use financial analytics hook
  const { data: financialData, loading: financialLoading, error: financialError, refetch, clearError } = useFinancialAnalytics({
    branch: selectedLocation === 'All Branches' ? undefined : selectedLocation,
    period: selectedPeriod
  });

  // Use invoice analytics hook
  const { data: invoiceData, loading: invoiceLoading, error: invoiceError, clearError: clearInvoiceError } = useInvoiceAnalytics({
    branch: selectedLocation === 'All Branches' ? undefined : selectedLocation
  });

  // Use sales analytics hook
  const { todaySales, data: salesData, loading: salesLoading, error: salesError, clearError: clearSalesError } = useSalesAnalytics({
    branch: selectedLocation === 'All Branches' ? undefined : selectedLocation
  });

  // Use daily revenue analytics hook for the Total Revenue chart
  const { data: dailyRevenueData, loading: dailyRevenueLoading, error: dailyRevenueError, clearError: clearDailyRevenueError } = useDailyRevenueAnalytics({
    branch: selectedLocation === 'All Branches' ? undefined : selectedLocation,
    week: 'current' // Get current week's data
  });

  // Ensure component is mounted before rendering charts
  useEffect(() => {
    setMounted(true);
  }, []);

  // Utility function to format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Handle location change
  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
    setLocationOpen(false);
  };

  // Chart data for Income vs Expenses - using API data
  const incomeExpensesData = financialData ? [
    { 
      name: financialData.period.type.charAt(0).toUpperCase() + financialData.period.type.slice(1),
      income: financialData.revenue.total,
      expenses: financialData.expenses.total
    }
  ] : [];

  // Bar chart data for Total Revenue - using real API data
  const revenueData = dailyRevenueData?.dailyData?.map(item => ({
    day: item.day,
    online: item.online,
    offline: item.offline,
    total: item.total
  })) || [
    // Fallback data if API data is not available
    { day: 'Monday', online: 0, offline: 0, total: 0 },
    { day: 'Tuesday', online: 0, offline: 0, total: 0 },
    { day: 'Wednesday', online: 0, offline: 0, total: 0 },
    { day: 'Thursday', online: 0, offline: 0, total: 0 },
    { day: 'Friday', online: 0, offline: 0, total: 0 },
    { day: 'Saturday', online: 0, offline: 0, total: 0 },
    { day: 'Sunday', online: 0, offline: 0, total: 0 },
  ];

  const LocationDropdown = () => (
    <div className="relative">
      <button
        onClick={() => setLocationOpen(!locationOpen)}
              disabled={branchesLoading}
        className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 hover:border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="text-sm text-gray-600">Location:</span>
              {branchesLoading ? (
                <Loader2 className="w-3 h-3 animate-spin text-gray-400" />
              ) : (
        <span className="text-sm text-amber-500 font-medium">
                  {branchOptions.find(option => option.value === selectedLocation)?.label || selectedLocation}
        </span>
              )}
        <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${locationOpen ? 'rotate-180' : ''}`} />
      </button>
            {locationOpen && !branchesLoading && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-full">
                {branchOptions.length > 1 ? (
                  branchOptions.map((option) => (
            <button
              key={option.value}
                      onClick={() => handleLocationChange(option.value)}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
            >
              {option.label}
            </button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    No branches available
                  </div>
                )}
        </div>
      )}
    </div>
  );

  // Show loading state for initial load
  if (financialLoading && !financialData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#E866B7]" />
          <p className="text-gray-600">Loading accounting dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-gray-50">
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
              placeholder="Search" 
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
      {financialError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <div className="flex-1">
              <p className="text-red-800 font-medium">Error Loading Financial Data</p>
              <p className="text-red-600 text-sm">{financialError}</p>
            </div>
            <button
              onClick={clearError}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {branchesError && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-orange-500 mr-2" />
            <div className="flex-1">
              <p className="text-orange-800 font-medium">Error Loading Branches</p>
              <p className="text-orange-600 text-sm">{branchesError}</p>
            </div>
            <button
              onClick={clearBranchesError}
              className="text-orange-500 hover:text-orange-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {invoiceError && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-blue-500 mr-2" />
            <div className="flex-1">
              <p className="text-blue-800 font-medium">Error Loading Invoice Data</p>
              <p className="text-blue-600 text-sm">{invoiceError}</p>
            </div>
            <button
              onClick={clearInvoiceError}
              className="text-blue-500 hover:text-blue-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {salesError && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-green-500 mr-2" />
            <div className="flex-1">
              <p className="text-green-800 font-medium">Error Loading Sales Data</p>
              <p className="text-green-600 text-sm">{salesError}</p>
            </div>
            <button
              onClick={clearSalesError}
              className="text-green-500 hover:text-green-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {dailyRevenueError && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-purple-500 mr-2" />
            <div className="flex-1">
              <p className="text-purple-800 font-medium">Error Loading Revenue Chart Data</p>
              <p className="text-purple-600 text-sm">{dailyRevenueError}</p>
            </div>
            <button
              onClick={clearDailyRevenueError}
              className="text-purple-500 hover:text-purple-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600">Total Revenue</span>
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as 'week' | 'month' | 'quarter' | 'year')}
              className="text-xs text-[#FBB906] bg-transparent border-none focus:ring-0"
            >
              <option value="week">Week</option>
              <option value="month">Month</option>
              <option value="quarter">Quarter</option>
              <option value="year">Year</option>
            </select>
          </div>
          <div className="text-xl font-bold text-gray-900 mb-2">
            {financialLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            ) : (
              formatCurrency(financialData?.revenue?.total || 0)
            )}
          </div>
          <div className="flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-500">
              {financialData?.revenue?.salesCount || 0} sales
            </span>
          </div>
        </div>

        {/* Invoice Revenue */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600">Invoice Revenue</span>
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as 'week' | 'month' | 'quarter' | 'year')}
              className="text-xs text-[#FBB906] bg-transparent border-none focus:ring-0"
            >
              <option value="week">Week</option>
              <option value="month">Month</option>
              <option value="quarter">Quarter</option>
              <option value="year">Year</option>
            </select>
          </div>
          <div className="text-xl font-bold text-gray-900 mb-2">
            {financialLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            ) : (
              formatCurrency(financialData?.revenue?.invoiceRevenue || 0)
            )}
          </div>
          <div className="flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-500">From invoices</span>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600">Total Expenses</span>
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as 'week' | 'month' | 'quarter' | 'year')}
              className="text-xs text-[#FBB906] bg-transparent border-none focus:ring-0"
            >
              <option value="week">Week</option>
              <option value="month">Month</option>
              <option value="quarter">Quarter</option>
              <option value="year">Year</option>
            </select>
          </div>
          <div className="text-xl font-bold text-gray-900 mb-2">
            {financialLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            ) : (
              formatCurrency(financialData?.expenses?.total || 0)
            )}
          </div>
          <div className="flex items-center text-sm">
            <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            <span className="text-red-500">
              {financialData?.expenses?.vendorExpenses ? 
                formatCurrency(financialData.expenses.vendorExpenses) : '0'} vendors
            </span>
          </div>
        </div>

        {/* Net Profit */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600">Net Profit</span>
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as 'week' | 'month' | 'quarter' | 'year')}
              className="text-xs text-[#FBB906] bg-transparent border-none focus:ring-0"
            >
              <option value="week">Week</option>
              <option value="month">Month</option>
              <option value="quarter">Quarter</option>
              <option value="year">Year</option>
            </select>
          </div>
          <div className="text-xl font-bold text-gray-900 mb-2">
            {financialLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            ) : (
              formatCurrency(financialData?.profitLoss?.amount || 0)
            )}
          </div>
          <div className="flex items-center text-sm">
            {financialData?.profitLoss?.isProfit ? (
              <>
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-500">
                  {financialData.profitLoss.margin?.toFixed(1)}% margin
                </span>
              </>
            ) : (
              <>
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                <span className="text-red-500">
                  {financialData?.profitLoss?.margin?.toFixed(1)}% loss
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Charts and Invoice Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Income vs Expenses Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Income vs Expenses</h3>
              <select 
                className="px-3 py-1 border text-[#FBB906] border-gray-300 rounded-lg text-sm"
                value={selectedLocation}
                onChange={(e) => handleLocationChange(e.target.value)}
                disabled={branchesLoading}
              >
                {branchesLoading ? (
                  <option value="">Loading branches...</option>
                ) : (
                  branchOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                  ))
                )}
              </select>
          </div>
          <div className="h-80">
            {financialLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#E866B7]" />
                  <p className="text-gray-600">Loading financial data...</p>
                </div>
              </div>
            ) : mounted && incomeExpensesData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={incomeExpensesData}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#9CA3AF' }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#9CA3AF' }}
                    tickFormatter={(value) => `${(value/1000000).toFixed(1)}M`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="income" 
                    stroke="#E866B7" 
                    strokeWidth={3} 
                    dot={true}
                    name="Revenue"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="expenses" 
                    stroke="#F59E0B" 
                    strokeWidth={3} 
                    dot={true}
                    name="Expenses"
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="line"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <p className="text-lg font-medium mb-2">No Data Available</p>
                  <p className="text-sm">Select a different period or branch to view data</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Invoice Status */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex justify-between mb-6">
            <div className='w-27'>
              <h3 className="text-xs text-gray-900">Monitor all invoices past their due date</h3>
            </div>
            <Link
            href="/dashboard/accounting/transaction/new-invoice"
            className="bg-[#E866B7] text-white px-2 py-2 rounded-lg font-medium text-sm flex items-center gap-2 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            New Invoice
          </Link>
          </div>
          
          <div className="space-y-4">
            {invoiceLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-gray-300 h-2 rounded-full animate-pulse" style={{width: '50%'}}></div>
                      </div>
                    </div>
                    <div className="h-4 w-8 bg-gray-200 rounded animate-pulse ml-3"></div>
                  </div>
                ))}
              </div>
            ) : (
              <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                 <span className="text-sm text-gray-600 whitespace-nowrap">1-30 days</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full" 
                        style={{
                          width: `${invoiceData?.overdueBreakdown?.['1-30'] ? 
                            Math.min((invoiceData.overdueBreakdown['1-30'] / Math.max(invoiceData.overdueBreakdown['1-30'], 1)) * 100, 100) : 0}%`
                        }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm text-black font-medium ml-3">
                    {invoiceData?.overdueBreakdown?.['1-30'] || 0}
                  </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <span className="text-sm text-gray-600 whitespace-nowrap">31-60 days</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full" 
                        style={{
                          width: `${invoiceData?.overdueBreakdown?.['31-60'] ? 
                            Math.min((invoiceData.overdueBreakdown['31-60'] / Math.max(invoiceData.overdueBreakdown['31-60'], 1)) * 100, 100) : 0}%`
                        }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm text-black font-medium ml-3">
                    {invoiceData?.overdueBreakdown?.['31-60'] || 0}
                  </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <span className="text-sm text-gray-600 whitespace-nowrap">61-90 days</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{
                          width: `${invoiceData?.overdueBreakdown?.['61-90'] ? 
                            Math.min((invoiceData.overdueBreakdown['61-90'] / Math.max(invoiceData.overdueBreakdown['61-90'], 1)) * 100, 100) : 0}%`
                        }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm text-black font-medium ml-3">
                    {invoiceData?.overdueBreakdown?.['61-90'] || 0}
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total unpaid invoice</span>
              <span className="text-sm text-gray-600 font-medium">
                {invoiceLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin inline" />
                ) : (
                  formatCurrency(invoiceData?.totalUnpaidAmount || 0)
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Overdue</span>
              <span className="text-sm text-gray-600 font-medium">
                {invoiceLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin inline" />
                ) : (
                  formatCurrency(invoiceData?.totalOverdueAmount || 0)
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Sales and Low Quantity Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Today's Sales */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Today&apos;s Sales</h3>
              <p className="text-sm text-gray-600">Sales Summary</p>
            </div>
            <button className="flex text-black text-sm items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <ArrowUpRight className="w-4 h-4" />
              Export
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Sales */}
            <div className="bg-pink-50 p-4 rounded-xl">
              <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center mb-3">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div className="text-xl font-bold text-gray-900">
                {salesLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  formatCurrency(todaySales?.totalSales || 0)
                )}
              </div>
              <div className="text-sm text-gray-600 mb-1">Total Sales</div>
              <div className="text-xs text-pink-500">
                {salesLoading ? (
                  <div className="h-3 w-12 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  `+${todaySales?.salesChange || 0}% from yesterday`
                )}
              </div>
            </div>

            {/* Total Orders */}
            <div className="bg-orange-50 p-4 rounded-xl">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mb-3">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div className="text-xl font-bold text-gray-900">
                {salesLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  todaySales?.totalOrders || 0
                )}
              </div>
              <div className="text-sm text-gray-600 mb-1">Total Orders</div>
              <div className="text-xs text-orange-500">
                {salesLoading ? (
                  <div className="h-3 w-12 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  `+${todaySales?.ordersChange || 0}% from yesterday`
                )}
              </div>
            </div>

            {/* Products Sold */}
            <div className="bg-purple-50 p-4 rounded-xl">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mb-3">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div className="text-xl font-bold text-gray-900">
                {salesLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  todaySales?.productsSold || 0
                )}
              </div>
              <div className="text-sm text-gray-600 mb-1">Products Sold</div>
              <div className="text-xs text-purple-500">
                {salesLoading ? (
                  <div className="h-3 w-12 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  `+${todaySales?.productsChange || 0}% from yesterday`
                )}
              </div>
            </div>

            {/* New Customers */}
            <div className="bg-yellow-50 p-4 rounded-xl">
              <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center mb-3">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="text-xl font-bold text-gray-900">
                {salesLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  todaySales?.newCustomers || 0
                )}
              </div>
              <div className="text-sm text-gray-600 mb-1">New Customers</div>
              <div className="text-xs text-yellow-500">
                {salesLoading ? (
                  <div className="h-3 w-12 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  `+${todaySales?.customersChange || 0}% from yesterday`
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Low Quantity Stock */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Low Quantity Stock</h3>
          
          <div className="space-y-4">
            {salesLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between py-2">
              <div>
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
                ))}
              </div>
            ) : salesData?.inventory?.lowStockAlert?.products && salesData.inventory.lowStockAlert.products.length > 0 ? (
              salesData.inventory.lowStockAlert.products.slice(0, 3).map((product, index) => (
                <div key={product._id || index} className="flex items-center justify-between py-2">
                  <div>
                    <div className="font-medium text-gray-900">{product.itemName}</div>
                    <div className="text-sm text-gray-500">
                      Remaining Quantity: <span className="text-red-500">{product.quantity} Pieces</span>
                    </div>
              </div>
            </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No low stock items</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Total Revenue Bar Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Total Revenue</h3>
          <select
            className="px-3 py-1 border text-[#FBB906] border-gray-300 rounded-lg text-sm"
            value={selectedLocation}
            onChange={(e) => handleLocationChange(e.target.value)}
            disabled={branchesLoading}
          >
            {branchesLoading ? (
              <option value="">Loading branches...</option>
            ) : (
              branchOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))
            )}
          </select>
        </div>
        
        <div className="h-80">
          {dailyRevenueLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#E866B7]" />
                <p className="text-gray-600">Loading revenue data...</p>
              </div>
            </div>
          ) : mounted && revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} barCategoryGap="20%">
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#9CA3AF' }}
                  tickFormatter={(value) => value.substring(0, 3)}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#9CA3AF' }}
                  tickFormatter={(value) => `${value/1000}k`}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                />
                <Bar dataKey="online" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Online Sales" />
                <Bar dataKey="offline" fill="#E866B7" radius={[4, 4, 0, 0]} name="Offline Sales" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <p className="text-lg font-medium mb-2">No Revenue Data Available</p>
                <p className="text-sm">Select a different period or branch to view data</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AccountingDashboard = () => {
  return (
    <ProtectedRoute requiredRoles={['Accounting', 'Super Admin', 'Admin']}>
      <Dashboard />
    </ProtectedRoute>
  );
};

export default AccountingDashboard;