'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  TrendingUp,
  ArrowRightLeft,
  CheckCircle,
  Plus,
  Calculator,
  Package,
  MessageSquare,
  Wrench
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

interface StatCard {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change: string;
  changeType: 'positive' | 'negative';
  bgColor: string;
  iconColor: string;
}

interface ChartData {
  name: string;
  activeUsers: number;
  tasksCompleted: number;
  internalMessages: number;
}

interface Activity {
  user: string;
  action: string;
  timestamp: string;
}

interface AppUsage {
  name: string;
  icon: React.ReactNode;
  route: string;
}

const DashboardPage = () => {
  const [selectedBranch, setSelectedBranch] = useState("All Branches");

  const statsData: StatCard[] = [
    {
      title: 'Total Staffs',
      value: 20,
      icon: <Users className="w-6 h-6" />,
      change: '2 Staffs resigned',
      changeType: 'negative',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Total Sales',
      value: '₦689,000',
      icon: <TrendingUp className="w-6 h-6" />,
      change: '↗ 1.8% than previous day',
      changeType: 'positive',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'Transferred Items',
      value: 10,
      icon: <ArrowRightLeft className="w-6 h-6" />,
      change: '↘ 4.3% from yesterday',
      changeType: 'negative',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'Completed repairs',
      value: 30,
      icon: <CheckCircle className="w-6 h-6" />,
      change: '↘ 8.3% from last week',
      changeType: 'negative',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    }
  ];

  const chartData: ChartData[] = [
    { name: 'Mon', activeUsers: 300, tasksCompleted: 150, internalMessages: 80 },
    { name: 'Tue', activeUsers: 380, tasksCompleted: 200, internalMessages: 120 },
    { name: 'Wed', activeUsers: 420, tasksCompleted: 250, internalMessages: 140 },
    { name: 'Thu', activeUsers: 450, tasksCompleted: 220, internalMessages: 160 },
    { name: 'Fri', activeUsers: 480, tasksCompleted: 280, internalMessages: 180 },
    { name: 'Sat', activeUsers: 500, tasksCompleted: 300, internalMessages: 200 }
  ];

  const recentActivities: Activity[] = [
    { user: 'Semiu', action: 'completed a repair ticket.', timestamp: '2 minutes ago' },
    { user: 'Chineye', action: 'made a sale.', timestamp: '5 minutes ago' },
    { user: 'Margret', action: 'updated the inventory.', timestamp: '10 minutes ago' },
    { user: 'Nifemi', action: 'completed her task.', timestamp: '2 days ago' },
    { user: 'Samad', action: 'submitted a request.', timestamp: '2 days ago' }
  ];

  const mostUsedApps: AppUsage[] = [
    { name: 'Accounting', icon: <Calculator className="w-8 h-8 text-pink-500" />, route: '/dashboard/super-admin/accounting' },
    { name: 'Inventory', icon: <Package className="w-8 h-8 text-pink-500" />, route: '/dashboard/super-admin/inventory' },
    { name: 'Cross Messaging', icon: <MessageSquare className="w-8 h-8 text-pink-500" />, route: '/dashboard/super-admin/messaging' },
    { name: 'Repair tracking', icon: <Wrench className="w-8 h-8 text-pink-500" />, route: '/dashboard/super-admin/repair-tracking' }
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hello Samuel</h1>
          <p className="text-gray-600">Here is an overview of your administrative system.</p>
        </div>

        {/* Branch Dropdown */}
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

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <div className={stat.iconColor}>
                  {stat.icon}
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <div className={`flex items-center ${stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
                {stat.title === 'Total Staffs' && <Plus className="w-4 h-4 mr-1" />}
                <span className="text-sm font-medium">{stat.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart and Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">User Activities</h2>
            <div className="flex items-center space-x-4">
              <button className="text-sm text-gray-600 hover:text-gray-900">Daily</button>
              <button className="text-sm text-gray-600 hover:text-gray-900">Monthly</button>
            </div>
          </div>
          <div className="h-64 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <Line type="monotone" dataKey="activeUsers" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: '#f59e0b' }} />
                <Line type="monotone" dataKey="tasksCompleted" stroke="#ec4899" strokeWidth={3} dot={{ fill: '#ec4899', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: '#ec4899' }} />
                <Line type="monotone" dataKey="internalMessages" stroke="#f9a8d4" strokeWidth={3} dot={{ fill: '#f9a8d4', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: '#f9a8d4' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
              <span className="text-gray-600">Active Users</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-pink-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Tasks completed</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-pink-300 rounded-full mr-2"></div>
              <span className="text-gray-600">Internal Messages</span>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex flex-col">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">{activity.user}</span> {activity.action}
                </p>
                <span className="text-xs text-gray-500">{activity.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Most Used Apps (with links) */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Most Used Apps</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {mostUsedApps.map((app, index) => (
            <Link href={app.route} key={index} className="text-center hover:opacity-90 transition-all">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                {app.icon}
              </div>
              <p className="text-sm font-medium text-gray-900">{app.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
