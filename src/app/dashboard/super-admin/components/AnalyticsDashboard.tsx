'use client';

import React, { useState } from 'react';
import {
  Users,
  TrendingUp,
  ArrowRightLeft,
  CheckCircle,
  DollarSign,
  Package,
  AlertTriangle,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell } from 'recharts';
import { useDashboardAnalytics, useFinancialAnalytics, useBusinessAnalytics, formatCurrency, formatPercentage } from '../hooks/useAnalytics';

interface AnalyticsDashboardProps {
  selectedBranch?: string;
  selectedPeriod?: 'week' | 'month' | 'quarter' | 'year';
  selectedYear?: string;
  selectedMonth?: string;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  selectedBranch = "All Branches",
  selectedPeriod = 'month',
  selectedYear = new Date().getFullYear().toString(),
  selectedMonth = (new Date().getMonth() + 1).toString()
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'financial' | 'business'>('overview');

  // Fetch different analytics data
  const { data: dashboardData, loading: dashboardLoading, error: dashboardError } = useDashboardAnalytics({
    branch: selectedBranch === "All Branches" ? undefined : selectedBranch,
    days: 7
  });

  const { data: financialData, loading: financialLoading, error: financialError } = useFinancialAnalytics({
    branch: selectedBranch === "All Branches" ? undefined : selectedBranch,
    period: selectedPeriod
  });

  const { data: businessData, loading: businessLoading, error: businessError } = useBusinessAnalytics({
    branch: selectedBranch === "All Branches" ? undefined : selectedBranch,
    month: selectedMonth,
    year: selectedYear
  });

  const isLoading = dashboardLoading || financialLoading || businessLoading;
  const hasError = dashboardError || financialError || businessError;

  // Color scheme for charts
  const COLORS = ['#E866B7', '#FBB906', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444'];

  // Overview Tab Content
  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Staff"
          value={dashboardData?.totalStaff || 0}
          icon={<Users className="w-6 h-6" />}
          bgColor="bg-blue-100"
          iconColor="text-blue-600"
          change="+2 this month"
          changeType="positive"
        />
        <MetricCard
          title="Daily Sales"
          value={formatCurrency(dashboardData?.dailySales.revenue || 0)}
          icon={<TrendingUp className="w-6 h-6" />}
          bgColor="bg-green-100"
          iconColor="text-green-600"
          change="+12.5% from yesterday"
          changeType="positive"
        />
        <MetricCard
          title="Transfers"
          value={dashboardData?.dailyTransfers.count || 0}
          icon={<ArrowRightLeft className="w-6 h-6" />}
          bgColor="bg-purple-100"
          iconColor="text-purple-600"
          change="-4.3% from yesterday"
          changeType="negative"
        />
        <MetricCard
          title="Repairs Completed"
          value={dashboardData?.completedRepairs || 0}
          icon={<CheckCircle className="w-6 h-6" />}
          bgColor="bg-orange-100"
          iconColor="text-orange-600"
          change="+8.3% this week"
          changeType="positive"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Activity Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Activity Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dashboardData?.lineGraphData.dailyBreakdown || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { weekday: 'short' })}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <Line 
                  type="monotone" 
                  dataKey="activeUsers" 
                  stroke="#E866B7" 
                  strokeWidth={3} 
                  dot={{ fill: '#E866B7', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="completedTasks" 
                  stroke="#FBB906" 
                  strokeWidth={3} 
                  dot={{ fill: '#FBB906', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="internalMessages" 
                  stroke="#10B981" 
                  strokeWidth={3} 
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {dashboardData?.recentActivityLogs.slice(0, 5).map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-[#E866B7] rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.created_by.firstName} {activity.created_by.lastName}</span>
                    <span className="text-gray-600"> {activity.activity_type}</span>
                  </p>
                  <p className="text-xs text-gray-500">{activity.product_id.itemName}</p>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(activity.activity_date).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Financial Tab Content
  const FinancialTab = () => (
    <div className="space-y-6">
      {/* Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(financialData?.revenue.total || 0)}
          icon={<DollarSign className="w-6 h-6" />}
          bgColor="bg-green-100"
          iconColor="text-green-600"
          change={`${formatPercentage(financialData?.profitLoss.margin || 0)} margin`}
          changeType="positive"
        />
        <MetricCard
          title="Total Expenses"
          value={formatCurrency(financialData?.expenses.total || 0)}
          icon={<TrendingUp className="w-6 h-6" />}
          bgColor="bg-red-100"
          iconColor="text-red-600"
          change="+5.2% from last period"
          changeType="negative"
        />
        <MetricCard
          title="Net Profit"
          value={formatCurrency(financialData?.profitLoss.amount || 0)}
          icon={<BarChart3 className="w-6 h-6" />}
          bgColor="bg-blue-100"
          iconColor="text-blue-600"
          change={`${formatPercentage(financialData?.profitLoss.margin || 0)} margin`}
          changeType="positive"
        />
        <MetricCard
          title="Unpaid Invoices"
          value={financialData?.invoices.unpaid || 0}
          icon={<AlertTriangle className="w-6 h-6" />}
          bgColor="bg-orange-100"
          iconColor="text-orange-600"
          change={formatCurrency(financialData?.invoices.unpaidAmount || 0)}
          changeType="negative"
        />
      </div>

      {/* Financial Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={financialData?.monthlyTrend || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10B981" 
                  strokeWidth={3} 
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#EF4444" 
                  strokeWidth={3} 
                  dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="profit" 
                  stroke="#8B5CF6" 
                  strokeWidth={3} 
                  dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <RechartsPieChart.Pie
                  data={financialData?.transactionBreakdown || []}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="total"
                  label={({ _id, total }) => `${_id}: ${formatCurrency(total)}`}
                >
                  {(financialData?.transactionBreakdown || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </RechartsPieChart.Pie>
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );

  // Business Tab Content
  const BusinessTab = () => (
    <div className="space-y-6">
      {/* Business Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Today's Sales"
          value={formatCurrency(businessData?.todaySales.totalSales.amount || 0)}
          icon={<DollarSign className="w-6 h-6" />}
          bgColor="bg-green-100"
          iconColor="text-green-600"
          change={`${formatPercentage(businessData?.todaySales.totalSales.percentageChange || 0)} from yesterday`}
          changeType="positive"
        />
        <MetricCard
          title="Total Orders"
          value={businessData?.todaySales.totalOrders.amount || 0}
          icon={<Package className="w-6 h-6" />}
          bgColor="bg-blue-100"
          iconColor="text-blue-600"
          change={`${formatPercentage(businessData?.todaySales.totalOrders.percentageChange || 0)} from yesterday`}
          changeType="positive"
        />
        <MetricCard
          title="Products Sold"
          value={businessData?.todaySales.productsSold.amount || 0}
          icon={<Activity className="w-6 h-6" />}
          bgColor="bg-purple-100"
          iconColor="text-purple-600"
          change={`${formatPercentage(businessData?.todaySales.productsSold.percentageChange || 0)} from yesterday`}
          changeType="positive"
        />
        <MetricCard
          title="New Customers"
          value={businessData?.todaySales.newCustomers.amount || 0}
          icon={<Users className="w-6 h-6" />}
          bgColor="bg-orange-100"
          iconColor="text-orange-600"
          change={`${formatPercentage(businessData?.todaySales.newCustomers.percentageChange || 0)} from yesterday`}
          changeType="positive"
        />
      </div>

      {/* Business Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue vs Expenses</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={businessData?.lineGraphData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#10B981" 
                  strokeWidth={3} 
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#EF4444" 
                  strokeWidth={3} 
                  dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Revenue</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={businessData?.barGraphData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <Bar dataKey="revenue" fill="#E866B7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {businessData?.lowQuantityStock && businessData.lowQuantityStock.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-orange-200">
          <h3 className="text-lg font-semibold text-orange-800 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Low Stock Alert
          </h3>
          <div className="space-y-2">
            {businessData.lowQuantityStock.slice(0, 5).map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="font-medium text-gray-900">{item.itemName}</p>
                  <p className="text-sm text-gray-500">{item.category.name} • {item.vendor.name}</p>
                </div>
                <span className="text-red-600 font-medium">{item.quantity} left</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E866B7] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 mx-auto mb-4 text-red-500" />
          <p className="text-red-600 mb-2">Failed to load analytics</p>
          <p className="text-gray-600 text-sm">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'financial', name: 'Financial', icon: <DollarSign className="w-4 h-4" /> },
            { id: 'business', name: 'Business', icon: <Activity className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-[#E866B7] text-[#E866B7]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'financial' && <FinancialTab />}
      {activeTab === 'business' && <BusinessTab />}
    </div>
  );
};

// Metric Card Component
interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  bgColor,
  iconColor,
  change,
  changeType = 'neutral'
}) => {
  const changeColor = {
    positive: 'text-green-500',
    negative: 'text-red-500',
    neutral: 'text-gray-500'
  }[changeType];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
          <div className={iconColor}>
            {icon}
          </div>
        </div>
      </div>
      {change && (
        <div className="mt-4">
          <p className={`text-sm font-medium ${changeColor}`}>
            {change}
          </p>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
