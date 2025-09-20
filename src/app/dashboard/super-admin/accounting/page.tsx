'use client';

import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';
import { 
  ChevronDown, 
  TrendingUp, 
  TrendingDown,  
  CreditCard,
  BarChart3,
  FileText,
} from 'lucide-react';
import { useFinancialAnalytics } from '../hooks/useAnalytics';
import { useVendors } from '../hooks/useVendors';
import { useInvoiceStats, useUnpaidInvoices } from '../hooks/useInvoices';
import { useTransferRequests } from '../hooks/useProductTransfers';
import { branchesApi } from '../../../../api/branchesApi';
import { useAuth } from '../../../../hooks/useAuth';

// Sample data for the chart (keeping for now until we implement chart data formatting)
const salesData = [
  { day: 'Mon', Sales: 150, Expenses: 80 },
  { day: 'Tue', Sales: 130, Expenses: 90 },
  { day: 'Wed', Sales: 180, Expenses: 100 },
  { day: 'Thu', Sales: 250, Expenses: 120 },
  { day: 'Fri', Sales: 200, Expenses: 150 },
  { day: 'Sat', Sales: 180, Expenses: 130 },
];

interface MetricCardProps {
  title: string;
  amount: string;
  percentage: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
  bgColor: string;
}

const MetricCard = ({ title, amount, percentage, trend, icon, bgColor }: MetricCardProps) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{amount}</p>
      </div>
      <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
        {icon}
      </div>
    </div>
    <div className="mt-4 flex items-center">
      {trend === 'up' ? (
        <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
      ) : (
        <TrendingDown className="w-4 h-4 mr-1 text-red-500" />
      )}
      <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
        {percentage}
      </span>
    </div>
  </div>
);

interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'denied':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'owing':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles(status)}`}>
      {status}
    </span>
  );
};

const Dashboard = () => {
  const [selectedBranch, setSelectedBranch] = useState("All Branches");
  
  // User authentication
  const { user, isLoading: userLoading } = useAuth();
  
  // API hooks
  const { data: financialData, loading: financialLoading, error: financialError } = useFinancialAnalytics({
    branch: selectedBranch !== "All Branches" ? selectedBranch : undefined,
    period: 'month'
  });
  
  const { vendors, loading: vendorsLoading, error: vendorsError } = useVendors({
    limit: 6,
    page: 1
  });
  
  const { stats: invoiceStats, loading: invoiceStatsLoading, error: invoiceStatsError } = useInvoiceStats({
    branch: selectedBranch !== "All Branches" ? selectedBranch : undefined
  });
  
  const { invoices: unpaidInvoices, loading: unpaidLoading, error: unpaidError } = useUnpaidInvoices({
    limit: 1
  });
  
  const { transfers, loading: transfersLoading, error: transfersError } = useTransferRequests({
    limit: 6,
    page: 1
  });
  
  // Branches state management
  const [branches, setBranches] = useState<any[]>([]);
  const [branchesLoading, setBranchesLoading] = useState(true);
  const [branchesError, setBranchesError] = useState<string | null>(null);
  
  // Fetch branches on component mount
  React.useEffect(() => {
    const fetchBranches = async () => {
      try {
        setBranchesLoading(true);
        setBranchesError(null);
        const response = await branchesApi.getBranches();
        if (response.data.branches) {
          setBranches(response.data.branches);
        } else {
          setBranchesError('Failed to fetch branches');
        }
      } catch (err: any) {
        setBranchesError(err.message || 'Failed to fetch branches');
      } finally {
        setBranchesLoading(false);
      }
    };
    fetchBranches();
  }, []);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  // Calculate unpaid amount
  const unpaidAmount = unpaidInvoices.length > 0 ? 
    unpaidInvoices.reduce((sum, invoice) => sum + (invoice.sub_total + invoice.delivery_fee), 0) : 0;
  
  // Format chart data from financial analytics
  const chartData = financialData?.monthlyTrend?.map((trend: any) => ({
    day: new Date(trend.month).toLocaleDateString('en-US', { weekday: 'short' }),
    Sales: Math.round(trend.revenue / 1000), // Convert to thousands
    Expenses: Math.round(trend.expenses / 1000), // Convert to thousands
  })) || salesData; // Fallback to sample data if no real data
  
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {userLoading ? (
              <div className="animate-pulse bg-gray-200 h-8 w-48 rounded"></div>
            ) : (
              `Hello ${user?.name || 'User'}`
            )}
          </h1>
          <p className="text-gray-600">Here is an overview of Mickkystore&apos;s accounting data</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Branch:</span>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="border rounded px-3 py-1.5 text-sm bg-white text-[#FBB906]"
            disabled={branchesLoading}
          >
            <option>All Branches</option>
            {branches.map((branch: any) => (
              <option key={branch._id} value={branch._id}>
                {branch.name}
              </option>
            ))}
          </select>
          {branchesLoading && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#FBB906]"></div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Sales"
          amount={financialLoading ? "Loading..." : formatCurrency(financialData?.revenue?.total || 0)}
          percentage="1.8%"
          trend="up"
          bgColor="bg-green-100"
          icon={<TrendingUp className="w-6 h-6 text-green-600" />}
        />
        <MetricCard
          title="Expenses"
          amount={financialLoading ? "Loading..." : formatCurrency(financialData?.expenses?.total || 0)}
          percentage="4.3%"
          trend="down"
          bgColor="bg-red-100"
          icon={<CreditCard className="w-6 h-6 text-red-600" />}
        />
        <MetricCard
          title="Profit/Loss"
          amount={financialLoading ? "Loading..." : formatCurrency(financialData?.profitLoss?.amount || 0)}
          percentage="4.3%"
          trend={financialData?.profitLoss?.isProfit ? "up" : "down"}
          bgColor="bg-blue-100"
          icon={<BarChart3 className="w-6 h-6 text-blue-600" />}
        />
        <MetricCard
          title="Unpaid invoice"
          amount={unpaidLoading ? "Loading..." : formatCurrency(unpaidAmount)}
          percentage="8.3%"
          trend="down"
          bgColor="bg-yellow-100"
          icon={<FileText className="w-6 h-6 text-yellow-600" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales & Expenses Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Sales & Expenses</h2>
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
          <div className="h-64">
            {financialLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading chart data...</p>
                </div>
              </div>
            ) : financialError ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-red-500">
                  <p>Error loading chart data: {financialError}</p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis 
                    dataKey="day" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    tickFormatter={(value) => `${value}k`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Sales" 
                    stroke="#F59E0B" 
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6, fill: '#F59E0B' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Expenses" 
                    stroke="#EC4899" 
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6, fill: '#EC4899' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    iconType="line"
                    wrapperStyle={{ paddingTop: '20px' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Stock Transfer */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Stock Transfer</h2>
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
                  <th className="text-left text-sm font-medium text-gray-600 pb-3">Name</th>
                  <th className="text-left text-sm font-medium text-gray-600 pb-3">Date</th>
                  <th className="text-left text-sm font-medium text-gray-600 pb-3">From</th>
                  <th className="text-left text-sm font-medium text-gray-600 pb-3">To</th>
                  <th className="text-left text-sm font-medium text-gray-600 pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {transfersLoading ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500 mx-auto mb-2"></div>
                      Loading transfers...
                    </td>
                  </tr>
                ) : transfersError ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-red-500">
                      Error loading transfers: {transfersError}
                    </td>
                  </tr>
                ) : transfers.length > 0 ? (
                  transfers.map((transfer: any, index: number) => (
                    <tr key={transfer._id} className="border-b border-gray-100">
                      <td className="py-3 text-sm text-gray-900">
                        {transfer.created_by?.name || 'Unknown'}
                      </td>
                      <td className="py-3 text-sm text-gray-600">
                        {formatDate(transfer.created_at)}
                      </td>
                      <td className="py-3 text-sm text-gray-600">
                        {transfer.transfer_from?.name || 'Unknown'}
                      </td>
                      <td className="py-3 text-sm text-gray-600">
                        {transfer.transfer_to?.name || 'Unknown'}
                      </td>
                      <td className="py-3">
                        <StatusBadge status={transfer.request_status} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      No transfers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Vendor & Supplier */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Vendor & supplier</h2>
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
                <th className="text-left text-sm font-medium text-gray-600 pb-3">Name</th>
                <th className="text-left text-sm font-medium text-gray-600 pb-3">Date</th>
                <th className="text-left text-sm font-medium text-gray-600 pb-3">Item</th>
                <th className="text-left text-sm font-medium text-gray-600 pb-3">Price</th>
                <th className="text-left text-sm font-medium text-gray-600 pb-3">Imel/Sku</th>
                <th className="text-left text-sm font-medium text-gray-600 pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {vendorsLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500 mx-auto mb-2"></div>
                    Loading vendors...
                  </td>
                </tr>
              ) : vendorsError ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-red-500">
                    Error loading vendors: {vendorsError}
                  </td>
                </tr>
              ) : vendors.length > 0 ? (
                vendors.map((vendor: any, index: number) => (
                  <tr key={vendor._id} className="border-b border-gray-100">
                    <td className="py-3 text-sm text-gray-900">{vendor.name}</td>
                    <td className="py-3 text-sm text-gray-600">
                      {formatDate(vendor.createdAt)}
                    </td>
                    <td className="py-3 text-sm text-gray-600">
                      {vendor.products.join(', ')}
                    </td>
                    <td className="py-3 text-sm text-gray-600">
                      {formatCurrency(vendor.buying_price)}
                    </td>
                    <td className="py-3 text-sm text-gray-600">
                      {vendor.phone_number}
                    </td>
                    <td className="py-3">
                      <StatusBadge status={vendor.type === 'taking return' ? 'Paid' : 'Owing'} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    No vendors found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;