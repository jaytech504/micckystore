'use client';

import React from 'react';
import { 
  Users, 
  TrendingUp, 
  ArrowRightLeft, 
  CheckCircle, 
} from 'lucide-react';

// Import components
import StatsCard from './components/StatsCard';
import BranchSelector from './components/BranchSelector';
import ChartSection from './components/ChartSection';
import RecentActivity from './components/RecentActivity';
import MostUsedApps from './components/MostUsedApps';

// Import hooks and types
import { useDashboard } from './hooks/useDashboard';

export default function DashboardPage() {
  const {
    // Data
    stats,
    branches,
    selectedBranch,
    recentActivities,
    chartData,
    userInfo,
    
    // Loading states
    isLoadingStats,
    isLoadingBranches,
    isLoadingActivities,
    isLoadingChart,
    
    // Actions
    setSelectedBranch,
    setTimeRange,
  } = useDashboard();

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Hello {userInfo?.name || 'User'}
          </h1>
          <p className="text-gray-600">Here is an overview of your administrative system.</p>
        </div>
        <BranchSelector
          branches={branches}
          selectedBranch={selectedBranch}
          onBranchChange={setSelectedBranch}
          isLoading={isLoadingBranches}
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Staffs */}
        <StatsCard
          title="Total Staffs"
          value={stats?.totalStaffs || 0}
          icon={Users}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
          percentageText={`${stats?.staffResigned || 0} Staffs resigned`}
          isPositive={false}
          isLoading={isLoadingStats}
        />

        {/* Total Sales */}
        <StatsCard
          title="Total Sales"
          value={stats ? formatCurrency(stats.totalSales) : '₦0'}
          icon={TrendingUp}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
          percentage={stats?.salesPercentage}
          isPositive={(stats?.salesPercentage || 0) >= 0}
          isLoading={isLoadingStats}
        />

        {/* Transferred Items */}
        <StatsCard
          title="Transferred Items"
          value={stats?.transferredItems || 0}
          icon={ArrowRightLeft}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
          percentage={stats?.transferredPercentage}
          isPositive={(stats?.transferredPercentage || 0) >= 0}
          isLoading={isLoadingStats}
        />

        {/* Completed Repairs */}
        <StatsCard
          title="Completed repairs"
          value={stats?.completedRepairs || 0}
          icon={CheckCircle}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
          percentage={stats?.repairsPercentage}
          isPositive={(stats?.repairsPercentage || 0) >= 0}
          isLoading={isLoadingStats}
        />
      </div>

      {/* Charts and Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Activities Chart */}
        <ChartSection
          chartData={chartData}
          isLoading={isLoadingChart}
          onTimeRangeChange={setTimeRange}
          selectedTimeRange="daily"
        />

        {/* Recent Activity */}
        <RecentActivity
          activities={recentActivities}
          isLoading={isLoadingActivities}
        />
      </div>

      {/* Most Used App Section */}
      <MostUsedApps />
    </div>
  );
}