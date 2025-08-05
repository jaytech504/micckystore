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

// Sample data for the chart
const salesData = [
  { day: 'Mon', Sales: 150, Expenses: 80 },
  { day: 'Tue', Sales: 130, Expenses: 90 },
  { day: 'Wed', Sales: 180, Expenses: 100 },
  { day: 'Thu', Sales: 250, Expenses: 120 },
  { day: 'Fri', Sales: 200, Expenses: 150 },
  { day: 'Sat', Sales: 180, Expenses: 130 },
];

// Stock transfer data
const stockTransfers = [
  { name: 'Samuel', date: '22/04/2025', from: 'Lekki', to: 'Ikeja', status: 'Approved' },
  { name: 'Samuel', date: '22/04/2025', from: 'Lekki', to: 'Gbagada', status: 'Approved' },
  { name: 'Samuel', date: '22/04/2025', from: 'Ikeja', to: 'Lekki', status: 'Approved' },
  { name: 'Samuel', date: '22/04/2025', from: 'Gbagada', to: 'Ikeja', status: 'Denied' },
  { name: 'Samuel', date: '22/04/2025', from: 'Lekki', to: 'Ikeja', status: 'Approved' },
  { name: 'Chineye', date: '22/04/2025', from: 'Gbagada', to: 'Ikeja', status: 'Pending' },
];

// Vendor & supplier data
const vendorData = [
  { name: 'Chucks Limited', date: '22/04/2025', item: 'Hp 840 g4', price: 'N400,000', imel: '6664454553', status: 'Paid' },
  { name: 'Chucks Limited', date: '22/04/2025', item: 'iPhone 16promax', price: 'N200,000,000', imel: '6664454553', status: 'Owing' },
  { name: 'Chucks Limited', date: '22/04/2025', item: 'PS 5', price: 'N800,000', imel: '6664454553', status: 'Paid' },
  { name: 'Chucks Limited', date: '22/04/2025', item: 'Hp 840 g4', price: 'N400,000', imel: '6664454553', status: 'Owing' },
  { name: 'Chucks Limited', date: '22/04/2025', item: 'Hp 840 g4', price: 'N400,000', imel: '6664454553', status: 'Paid' },
  { name: 'Chucks Limited', date: '22/04/2025', item: 'Hp 840 g4', price: 'N400,000', imel: '6664454553', status: 'Paid' },
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
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hello Samuel</h1>
          <p className="text-gray-600">Here is an overview of Mickkystore&apos;s accounting data</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Branch:</span>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
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
          title="Total Sales"
          amount="₦689,000"
          percentage="1.8%"
          trend="up"
          bgColor="bg-green-100"
          icon={<TrendingUp className="w-6 h-6 text-green-600" />}
        />
        <MetricCard
          title="Expenses"
          amount="₦89,000"
          percentage="4.3%"
          trend="down"
          bgColor="bg-red-100"
          icon={<CreditCard className="w-6 h-6 text-red-600" />}
        />
        <MetricCard
          title="Profit/Loss"
          amount="₦229,000"
          percentage="4.3%"
          trend="down"
          bgColor="bg-blue-100"
          icon={<BarChart3 className="w-6 h-6 text-blue-600" />}
        />
        <MetricCard
          title="Unpaid invoice"
          amount="₦89,000"
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
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
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
                {stockTransfers.map((transfer, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 text-sm text-gray-900">{transfer.name}</td>
                    <td className="py-3 text-sm text-gray-600">{transfer.date}</td>
                    <td className="py-3 text-sm text-gray-600">{transfer.from}</td>
                    <td className="py-3 text-sm text-gray-600">{transfer.to}</td>
                    <td className="py-3">
                      <StatusBadge status={transfer.status} />
                    </td>
                  </tr>
                ))}
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
              {vendorData.map((vendor, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 text-sm text-gray-900">{vendor.name}</td>
                  <td className="py-3 text-sm text-gray-600">{vendor.date}</td>
                  <td className="py-3 text-sm text-gray-600">{vendor.item}</td>
                  <td className="py-3 text-sm text-gray-600">{vendor.price}</td>
                  <td className="py-3 text-sm text-gray-600">{vendor.imel}</td>
                  <td className="py-3">
                    <StatusBadge status={vendor.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;