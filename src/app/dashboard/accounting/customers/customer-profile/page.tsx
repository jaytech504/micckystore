'use client';
import React from 'react';
import { Search, Plus, Gift, ShoppingBag, RotateCcw, Clock, Package, Receipt, Check } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const CustomerDashboard = () => {
  // Sample data for the chart
  const chartData = [
    { day: 'Mon', value: 30000 },
    { day: 'Tue', value: 45000 },
    { day: 'Wed', value: 38000 },
    { day: 'Thu', value: 55000 },
    { day: 'Fri', value: 62000 }
  ];
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Accounting dashboard</h1>
            <p className="text-gray-600">Monitor all financial activities, revenue, expenses, and invoices.</p>
          </div>
          <div className="text-sm text-gray-500 mt-4 lg:mt-0">
            Last Update: Current date and time
          </div>
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
              ⌘ K
            </div>
          </div>
          
          <div className="flex gap-2">
            <button className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm transition-colors">
              Append, take off bonus
            </button>
            <button className="bg-[#E866B7] hover:bg-pink-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors">
              <Plus className="h-4 w-4" />
              Add Sale
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Customer Info */}
        <div className="xl:col-span-2 space-y-6">
          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Points Balance Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="text-2xl font-bold text-gray-900 mb-1">1,250</div>
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Gift className="h-5 w-5 text-red-500" />
                </div>
              </div>
              <div className="text-sm text-gray-600">Points Balance</div>
            </div>

            {/* Eligible for Discount Card */}
            <div className="bg-yellow-100 p-6 rounded-lg shadow-sm relative">
              <div className="flex items-center justify-between mb-2">
                <div className="text-2xl font-bold text-gray-900">1</div>
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white border-2 border-white rounded-full" />
                </div>
              </div>
              <div className="text-sm text-gray-700">Eligible for 5% discount</div>
            </div>

            {/* Expired Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="text-2xl font-bold text-gray-900">2</div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Clock className="h-5 w-5 text-blue-500" />
                </div>
              </div>
              <div className="text-sm text-gray-600">Expired</div>
            </div>
          </div>

          {/* Customer Details and Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Profile */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Samuel Monday</h3>
              </div>
              
              <div className="mb-4">
                <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                  Loyalty Tier Gold
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <ShoppingBag className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="text-xl font-bold text-gray-900">5</div>
                  <div className="text-xs text-gray-600">Total Purchases</div>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <RotateCcw className="h-5 w-5 text-pink-600" />
                  </div>
                  <div className="text-xl font-bold text-gray-900">1</div>
                  <div className="text-xs text-gray-600">Total Returns</div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Details</h4>
                <div className="space-y-2 text-sm">
                  <div className='text-gray-600'><span className="text-gray-600">Contact:</span> +234 802 063 1277</div>
                  <div className='text-gray-600'><span className="text-gray-600">Email:</span> samuelmonday7@gmail.com</div>
                  <div className='text-gray-600'><span className="text-gray-600">Loyalty ID:</span> <span className="text-yellow-600">LY-123863</span> 🔒</div>
                  <div className='text-gray-600'><span className="text-gray-600">Branch:</span> Gbagada</div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-3">Segments</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded border border-yellow-300">
                    Loyalty Points Above 1000
                  </span>
                  <span className="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded border border-pink-300">
                    5 years
                  </span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded border border-blue-300">
                    Recent Buyer
                  </span>
                  <span className="text-xs text-gray-700 px-2 py-1 rounded">
                    2 purchases
                  </span>
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded border border-red-300">
                    Inactive 30+ Days
                  </span>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button className="flex-1 bg-[#E866B7] hover:bg-pink-400 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                  Edit
                </button>
                <button className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm transition-colors">
                  Suspend
                </button>
              </div>
            </div>

            {/* Purchase Chart */}
            <div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-2xl font-bold text-gray-900">₦250,000.00</div>
                  <div className="text-sm text-gray-600">Total Purchase Value</div>
                </div>
                <select className="border border-gray-200 text-gray-700 rounded-lg px-3 py-1 text-sm">
                  <option>Week</option>
                  <option>Month</option>
                </select>
              </div>
              
              {/* Chart Area */}
              <div className="relative h-48 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ec4899" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#ec4899"
                      strokeWidth={3}
                      fill="url(#colorGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="absolute top-4 right-4 bg-orange-400 text-white text-xs px-2 py-1 rounded">
                  ₦5,201.96
                </div>
              </div>

              {/* Days of week */}
              <div className="flex justify-between text-xs text-gray-500 mb-4">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
              </div>

              <div className="text-sm text-gray-600 text-center">
                Customer bought an extra ₦50,000 this week
              </div>
          
            </div>
            {/* Discount Eligibility */}
            <div className="bg-yellow-100 p-6 rounded-lg shadow-sm mt-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Discount Eligibility</h3>
            <p className="text-sm text-gray-700 mb-4">
              Based on customer&apos;s ₦250,000 total purchases and 1,250 points in the last 60 days.
            </p>
            <p className="text-sm text-gray-900 italic mb-4">
              Customer to Spend ₦30,000 more to unlock 10% Discount
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
            </div>
          </div>

          
        </div>

        {/* Right Column - Activity Timeline */}
        <div className="bg-white p-6 rounded-lg shadow-sm h-fit">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Activity Timeline</h3>
          
          <div className="space-y-4">
            {/* Activity Item 1 */}
            <div className="flex gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900">Earned 500 points</span>
                  <span className="text-xs text-gray-500">12 min ago</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">Earned 500 points.</p>
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-orange-500" />
                  <span className="text-sm text-gray-600">Invoices.pdf</span>
                </div>
              </div>
            </div>

            {/* Activity Item 2 */}
            <div className="flex gap-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900">Joined the Program</span>
                  <span className="text-xs text-gray-500">12 min ago</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">Customer joined the Program.</p>
                <div className="text-lg">👋</div>
              </div>
            </div>

            {/* Activity Item 3 */}
            <div className="flex gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900">8 Invoices have been paid</span>
                  <span className="text-xs text-gray-500">42 min ago</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">Invoices have been paid to the company.</p>
                <div className="flex items-center gap-1">
                  <div className="w-6 h-6 bg-red-500 rounded text-white text-xs flex items-center justify-center">M</div>
                  <div className="w-6 h-6 bg-yellow-500 rounded text-white text-xs flex items-center justify-center">M</div>
                </div>
              </div>
            </div>

            {/* Activity Item 4 */}
            <div className="flex gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900">Order #37745</span>
                  <span className="text-xs text-gray-500">52 min ago</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">Invoices have been paid to the company.</p>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-gray-500" />
                  <span className="text-xs text-gray-500">Tiktok</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;