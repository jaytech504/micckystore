'use client';

import Link from 'next/link';
import React, {useState} from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, Package, ShoppingCart, Search, AlertTriangle, Plus, ChevronDown, Download } from 'lucide-react';


const Dashboard = () => {
  const [selectedLocation, setSelectedLocation] = useState('Lekki');
  const [locationOpen, setLocationOpen] = useState(false);
  const locations: string[] = ['Lekki', 'Gbagada', 'Ikeja'];

  const salesData = [
      { name: '5k', value: 20 },
      { name: '10k', value: 30 },
      { name: '15k', value: 45 },
      { name: '20k', value: 35 },
      { name: '25k', value: 50 },
      { name: '30k', value: 45 },
      { name: '35k', value: 55 },
      { name: '40k', value: 25 },
      { name: '45k', value: 35 },
      { name: '50k', value: 45 },
      { name: '55k', value: 50 },
      { name: '60k', value: 45 },
    ];

    const profitRevenueData = [
      { month: 'Sep', revenue: 35000, profit: 28000 },
      { month: 'Oct', revenue: 38000, profit: 32000 },
      { month: 'Nov', revenue: 32000, profit: 28000 },
      { month: 'Dec', revenue: 45000, profit: 35000 },
      { month: 'Jan', revenue: 58000, profit: 48000 },
      { month: 'Feb', revenue: 62000, profit: 52000 },
      { month: 'Mar', revenue: 45000, profit: 38000 },
    ];

    const LocationDropdown = () => (
        <div className="relative">
          <button
            onClick={() => setLocationOpen(!locationOpen)}
            className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 hover:border-gray-300 transition-colors"
          >
            <span className="text-sm text-gray-600">Location:</span>
            <span className="text-sm text-amber-500 font-medium">{selectedLocation}</span>
            <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${locationOpen ? 'rotate-180' : ''}`} />
          </button>
          {locationOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-full">
              {locations.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setSelectedLocation(option);
                    setLocationOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                >
                  {option}
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
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {/* Total Gadgets */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Gadgets</p>
              <p className="text-2xl font-semibold text-gray-800">10,293</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Package className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-green-500 font-medium">1.3%</span>
            <span className="text-gray-500">past week</span>
          </div>
        </div>

        {/* Total Sales */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Sales</p>
              <p className="text-2xl font-semibold text-gray-800">₦89,000</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <TrendingDown className="w-4 h-4 text-red-500" />
            <span className="text-red-500 font-medium">4.3%</span>
            <span className="text-gray-500">from yesterday</span>
          </div>
        </div>

        {/* Vendor Orders */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Vendor Orders</p>
              <p className="text-2xl font-semibold text-gray-800">8</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-green-500 font-medium">1.8%</span>
            <span className="text-gray-500">than previous day</span>
          </div>
        </div>

        {/* Stock Alert */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Stock Alert</p>
              <p className="text-2xl font-semibold text-gray-800">19</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <TrendingDown className="w-4 h-4 text-red-500" />
            <span className="text-red-500 font-medium">8%</span>
            <span className="text-gray-500">than previous day</span>
          </div>
        </div>
      </div>

      {/* Sales Details Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Sales Details</h2>
          <select className="text-sm text-gray-700 border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500">
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
          </select>
        </div>
        
        <div className="h-80">
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
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white'
                }}
                formatter={(value) => [`${value}%`, 'Sales']}
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
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Total unpaid invoice</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-red-500">Total overdue</p>
              <p className="text-xl font-semibold text-gray-800">NGN 344,000</p>
            </div>
          </div>
        </div>

        {/* Best Selling Category */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Best selling category</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Category</span>
              <span className="text-sm font-medium text-gray-600">Profit</span>
              <span className="text-sm font-medium text-gray-600">Increase By</span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-800">iPhone</span>
              <span className="text-sm text-gray-800">NGN2,000,000</span>
              <span className="text-sm text-green-500 font-medium">5.2%</span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-800">Gaming</span>
              <span className="text-sm text-gray-800">NGN82,000</span>
              <span className="text-sm text-green-500 font-medium">4%</span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-800">Speaker</span>
              <span className="text-sm text-gray-800">NGN12,000</span>
              <span className="text-sm text-green-500 font-medium">8.4%</span>
            </div>
          </div>
        </div>
        
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Profit & Revenue</h3>
            <select className="text-sm text-gray-700 border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500">
              <option>Gbagada</option>
              <option>Lekki</option>
              <option>Ikeja</option>
            </select>
          </div>
          
          <div className="h-32">
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