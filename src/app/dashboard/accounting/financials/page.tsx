'use client';
import React, {useState, useEffect} from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Search, Download, ChevronDown, Menu, Loader2, AlertCircle, X } from 'lucide-react';
import { useBranches } from '../../../../hooks/useBranches';
import { useFinancialAnalytics } from '../../../../hooks/useFinancialAnalytics';
import { accountingApi } from '../../../../api/accountingApi';

const FinancialOverview = () => {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [locationOpen, setLocationOpen] = useState(false);
  const [mobileControlsOpen, setMobileControlsOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [searchQuery, setSearchQuery] = useState('');
  
  // API hooks
  const { branches, loading: branchesLoading, error: branchesError } = useBranches();
  const { data: financialData, loading: financialLoading, error: financialError, refetch: refetchFinancial } = useFinancialAnalytics({
    branch: selectedLocation || undefined,
    period: selectedPeriod
  });
  
  // Transactions state
  const [transactions, setTransactions] = useState<any[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [transactionsError, setTransactionsError] = useState<string | null>(null);

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setTransactionsLoading(true);
        setTransactionsError(null);
        const response = await accountingApi.getTransactions({
          search: searchQuery || undefined,
          category: undefined,
          status: undefined,
          limit: 50,
          page: 1
        });
        
        if (response.data.success && response.data.data) {
          setTransactions(response.data.data);
        }
      } catch (err: any) {
        console.error('Error fetching transactions:', err);
        setTransactionsError(err.response?.data?.message || 'Failed to load transactions');
      } finally {
        setTransactionsLoading(false);
      }
    };

    fetchTransactions();
  }, [searchQuery]);

  // Handle location change
  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
    setLocationOpen(false);
  };

  // Handle period change
  const handlePeriodChange = (period: 'week' | 'month' | 'quarter' | 'year') => {
    setSelectedPeriod(period);
  };
  
  // Generate chart data from financial analytics
  const incomeExpensesData = financialData ? [{
    date: financialData.period.start,
    income: financialData.revenue.total,
    expenses: financialData.expenses.total
  }] : [];

  // Generate inflow vs outflow data from transactions
  const inflowOutflowData = [
    { day: 'Mon', inflow: 160, outflow: 150 },
    { day: 'Tue', inflow: 180, outflow: 160 },
    { day: 'Wed', inflow: 200, outflow: 110 },
    { day: 'Thu', inflow: 170, outflow: 120 },
    { day: 'Fri', inflow: 150, outflow: 155 },
    { day: 'Sat', inflow: 180, outflow: 165 },
    { day: 'Sun', inflow: 200, outflow: 145 },
  ];

  // Calculate totals from transactions
  const totalIncome = transactions
    .filter(t => t.type === 'income' || t.type === 'sale')
    .reduce((sum, t) => sum + (t.amount || 0), 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense' || t.type === 'purchase')
    .reduce((sum, t) => sum + (t.amount || 0), 0);
  
  const netProfit = totalIncome - totalExpenses;

  const LocationDropdown = () => (
    <div className="relative">
      <button
        onClick={() => setLocationOpen(!locationOpen)}
        disabled={branchesLoading}
        className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 hover:border-gray-300 transition-colors w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="text-sm text-gray-600">Location:</span>
        <span className="text-sm text-amber-500 font-medium">
          {branchesLoading ? 'Loading...' : 
           selectedLocation ? 
           branches.find((b: any) => b._id === selectedLocation)?.name || 'All Branches' : 
           'All Branches'}
        </span>
        <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${locationOpen ? 'rotate-180' : ''}`} />
      </button>
      {locationOpen && !branchesLoading && (
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
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Financial Overview</h1>
            <p className="text-gray-600 text-sm">Comprehensive view of profit & loss and cash flow statements</p>
          </div>
          <div className="text-sm text-gray-500 mt-4 lg:mt-0">
            Last Update: Current date and time
          </div>
        </div>
        
        {/* Search and Controls */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mt-4">
          {/* Search - Full width on mobile */}
          <div className="relative w-full lg:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search"
              className="w-full lg:w-64 pl-10 pr-16 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">⌘ K</span>
          </div>

          {/* Mobile Controls Toggle */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileControlsOpen(!mobileControlsOpen)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50"
            >
              <Menu className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">Controls</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileControlsOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Desktop Controls */}
          <div className="hidden lg:flex items-center space-x-4">
            <select className="px-3 py-2 text-gray-800 border border-gray-300 rounded-lg focus:outline-none">
              <option>This Month</option>
            </select>
            <LocationDropdown />
            <button className="bg-[#E866B7] hover:bg-pink-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Download report</span>
            </button>
          </div>

          {/* Mobile Controls Dropdown */}
          {mobileControlsOpen && (
            <div className="lg:hidden bg-white border border-gray-200 rounded-lg p-4 space-y-3 shadow-sm">
              <select className="w-full px-3 py-2 text-gray-800 border border-gray-300 rounded-lg focus:outline-none">
                <option>This Month</option>
              </select>
              <LocationDropdown />
              <button className="w-full bg-[#E866B7] hover:bg-pink-400 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Download report</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Error Messages */}
      {financialError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <div className="flex-1">
              <p className="text-red-800 font-medium">Error Loading Financial Data</p>
              <p className="text-red-600 text-sm">{financialError}</p>
            </div>
            <button
              onClick={() => refetchFinancial()}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {transactionsError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <div className="flex-1">
              <p className="text-red-800 font-medium">Error Loading Transactions</p>
              <p className="text-red-600 text-sm">{transactionsError}</p>
            </div>
            <button
              onClick={() => setTransactionsError(null)}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Revenue</p>
          {financialLoading ? (
            <div className="flex items-center justify-center h-8">
              <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
            </div>
          ) : (
            <>
              <p className="text-base sm:text-lg text-gray-900 font-semibold">
                ₦{financialData?.revenue?.total?.toLocaleString() || '0'}
              </p>
              <p className="text-xs text-green-500 flex items-center mt-1">↗ Current</p>
            </>
          )}
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Expenses</p>
          {financialLoading ? (
            <div className="flex items-center justify-center h-8">
              <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
            </div>
          ) : (
            <>
              <p className="text-base sm:text-lg text-gray-900 font-semibold">
                ₦{financialData?.expenses?.total?.toLocaleString() || '0'}
              </p>
              <p className="text-xs text-red-500 flex items-center mt-1">Current</p>
            </>
          )}
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Net Profit</p>
          {financialLoading ? (
            <div className="flex items-center justify-center h-8">
              <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
            </div>
          ) : (
            <>
              <p className="text-base sm:text-lg text-gray-900 font-semibold">
                ₦{((financialData?.revenue?.total || 0) - (financialData?.expenses?.total || 0))?.toLocaleString() || '0'}
              </p>
              <p className={`text-xs flex items-center mt-1 ${((financialData?.revenue?.total || 0) - (financialData?.expenses?.total || 0)) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {((financialData?.revenue?.total || 0) - (financialData?.expenses?.total || 0)) >= 0 ? '↗' : '↘'} Current
              </p>
            </>
          )}
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Profit Margin</p>
          {financialLoading ? (
            <div className="flex items-center justify-center h-8">
              <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
            </div>
          ) : (
            <>
              <p className="text-base sm:text-lg text-gray-900 font-semibold">
                {financialData?.revenue?.total ? 
                  (((financialData.revenue.total - (financialData.expenses?.total || 0)) / financialData.revenue.total) * 100).toFixed(1) : 
                  '0'}%
              </p>
              <p className="text-xs text-gray-500 flex items-center mt-1">Current</p>
            </>
          )}
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Net Inflow</p>
          {financialLoading ? (
            <div className="flex items-center justify-center h-8">
              <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
            </div>
          ) : (
            <>
              <p className="text-base sm:text-lg text-gray-900 font-semibold">
                ₦{netProfit?.toLocaleString() || '0'}
              </p>
              <p className={`text-xs flex items-center mt-1 ${netProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {netProfit >= 0 ? '↗' : '↘'} Current
              </p>
            </>
          )}
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Closing Balance</p>
          {financialLoading ? (
            <div className="flex items-center justify-center h-8">
              <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
            </div>
          ) : (
            <>
              <p className="text-base sm:text-lg text-gray-900 font-semibold">
                ₦{((financialData?.revenue?.total || 0) - (financialData?.expenses?.total || 0))?.toLocaleString() || '0'}
              </p>
              <p className="text-xs text-green-500 flex items-center mt-1">Current</p>
            </>
          )}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        {/* Income vs Expenses Chart */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
            <h3 className="text-base sm:text-lg text-gray-700 font-semibold">Income vs Expenses</h3>
            <div className="flex space-x-2 self-start sm:self-auto">
              <button 
                onClick={() => handlePeriodChange('week')}
                className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded ${selectedPeriod === 'week' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
              >
                Week
              </button>
              <button 
                onClick={() => handlePeriodChange('month')}
                className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded ${selectedPeriod === 'month' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
              >
                Month
              </button>
              <button 
                onClick={() => handlePeriodChange('year')}
                className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded ${selectedPeriod === 'year' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
              >
                Year
              </button>
            </div>
          </div>
          <div className="h-48 sm:h-64">
            {financialLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Loading chart data...</p>
                </div>
              </div>
            ) : incomeExpensesData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={incomeExpensesData}>
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="income" 
                    stroke="#ec4899" 
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="expenses" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    dot={false}
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
          <div className="flex justify-center space-x-4 sm:space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
              <span className="text-xs sm:text-sm text-gray-700">Income</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-xs sm:text-sm text-gray-700">Expenses</span>
            </div>
          </div>
        </div>

        {/* Inflow vs Outflow Chart */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
          <h3 className="text-base sm:text-lg text-gray-700 font-semibold mb-4">Inflow vs Outflow</h3>
          <div className="h-48 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={inflowOutflowData} barCategoryGap="20%">
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12 }}
                />
                <Bar dataKey="inflow" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="outflow" fill="#ec4899" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-4 sm:space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-xs sm:text-sm text-gray-700">Inflow</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
              <span className="text-xs sm:text-sm text-gray-700">Outflow</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <div className="max-h-96 overflow-y-auto scrollbar-orange">
            <table className="w-full min-w-[700px]">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-2 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-2 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-2 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-2 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-2 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (₦)</th>
                  <th className="px-2 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Direction</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactionsLoading ? (
                  <tr>
                    <td colSpan={6} className="px-2 sm:px-4 lg:px-6 py-8 text-center">
                      <div className="flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-400 mr-2" />
                        <span className="text-gray-600">Loading transactions...</span>
                      </div>
                    </td>
                  </tr>
                ) : transactions.length > 0 ? (
                  transactions.map((transaction, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                        {transaction.description}
                      </td>
                      <td className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                        {transaction.type}
                      </td>
                      <td className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                        {transaction.category}
                      </td>
                      <td className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                        ₦{transaction.amount?.toLocaleString() || '0'}
                      </td>
                      <td className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-1.5 sm:px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${
                          transaction.type === 'income' || transaction.type === 'sale' ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                          {transaction.type === 'income' || transaction.type === 'sale' ? 'InFlow' : 'OutFlow'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-2 sm:px-4 lg:px-6 py-8 text-center text-gray-500">
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Summary Footer */}
        <div className="border-t border-gray-200 bg-gray-50 px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:space-x-8 space-y-2 sm:space-y-0">
            <div>
              <span className="text-sm text-gray-600">Total Income: </span>
              <span className="font-semibold text-green-600">₦{totalIncome?.toLocaleString() || '0'}</span>
            </div>
            <div>
              <span className="text-sm text-gray-600">Total Expenses: </span>
              <span className="font-semibold text-red-600">₦{totalExpenses?.toLocaleString() || '0'}</span>
            </div>
            <div>
              <span className="text-sm text-gray-600">Net Profit: </span>
              <span className={`font-semibold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₦{netProfit?.toLocaleString() || '0'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .scrollbar-orange::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .scrollbar-orange::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 4px;
        }
        .scrollbar-orange::-webkit-scrollbar-thumb {
          background: #f59e0b;
          border-radius: 4px;
        }
        .scrollbar-orange::-webkit-scrollbar-thumb:hover {
          background: #d97706;
        }
        /* For Firefox */
        .scrollbar-orange {
          scrollbar-width: thin;
          scrollbar-color: #f59e0b #f3f4f6;
        }
      `}</style>
    </div>
  );
};

export default FinancialOverview;