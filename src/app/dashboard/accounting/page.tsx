'use client';

import React, { useState, useEffect } from 'react';
import { Search, Download, Plus, ArrowUpRight, TrendingUp, TrendingDown, ShoppingBag, Users, Package } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, BarChart, Bar, Legend, ResponsiveContainer } from 'recharts';




const Dashboard = () => {
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before rendering charts
  useEffect(() => {
    setMounted(true);
  }, []);

  // Chart data for Income vs Expenses
  const incomeExpensesData = [
    { name: 'Jan 1', income: 35000, expenses: 28000 },
    { name: 'Jan 5', income: 45000, expenses: 32000 },
    { name: 'Jan 9', income: 42000, expenses: 38000 },
    { name: 'Jan 13', income: 48000, expenses: 45000 },
    { name: 'Jan 17', income: 52000, expenses: 48000 },
    { name: 'Jan 21', income: 58000, expenses: 52000 },
    { name: 'Jan 25', income: 48000, expenses: 45000 },
    { name: 'Jan 29', income: 42000, expenses: 38000 },
  ];

  // Bar chart data for Total Revenue
  const revenueData = [
    { day: 'Monday', online: 12000, offline: 10000 },
    { day: 'Tuesday', online: 15000, offline: 8000 },
    { day: 'Wednesday', online: 5000, offline: 18000 },
    { day: 'Thursday', online: 14000, offline: 6000 },
    { day: 'Friday', online: 11000, offline: 9000 },
    { day: 'Saturday', online: 16000, offline: 12000 },
    { day: 'Sunday', online: 20000, offline: 8000 },
  ];

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
              className="pl-10 text-gray-900 text-sm pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className='text-gray-900'>Location:</label>
            <select className="px-2 py-1.5 border text-sm text-[#FBB906] border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500">
              <option>Lekki</option>
              <option>Gbagada</option>
              <option>Ikeja</option>
            </select>
            <button className="flex text-black text-sm items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              Download report
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600">Total Revenue</span>
            <select className="text-xs text-[#FBB906] bg-transparent border-none focus:ring-0">
              <option>January</option>
            </select>
          </div>
          <div className="text-xl font-bold text-gray-900 mb-2">₦3,250,000</div>
          <div className="flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-500">1.8%</span>
            <span className="text-gray-500 ml-1">than last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600">Gadget price</span>
            <select className="text-xs text-[#FBB906] bg-transparent border-none focus:ring-0">
              <option>January</option>
            </select>
          </div>
          <div className="text-xl font-bold text-gray-900 mb-2">₦1,870,000</div>
          <div className="flex items-center text-sm">
            <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            <span className="text-red-500">4.3%</span>
            <span className="text-gray-500 ml-1">from previous month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600">Total Expenses</span>
            <select className="text-xs text-[#FBB906] bg-transparent border-none focus:ring-0">
              <option>January</option>
            </select>
          </div>
          <div className="text-xl font-bold text-gray-900 mb-2">₦1,870,000</div>
          <div className="flex items-center text-sm">
            <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            <span className="text-red-500">4.3%</span>
            <span className="text-gray-500 ml-1">from previous month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600">Net Profit</span>
            <select className="text-xs text-[#FBB906] bg-transparent border-none focus:ring-0">
              <option>January</option>
            </select>
          </div>
          <div className="text-xl font-bold text-gray-900 mb-2">₦1,870,000</div>
          <div className="flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-500">1.8%</span>
            <span className="text-gray-500 ml-1">than last month</span>
          </div>
        </div>
      </div>

      {/* Charts and Invoice Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Income vs Expenses Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Income vs Expenses</h3>
              <select className="px-3 py-1 border text-[#FBB906] border-gray-300 rounded-lg text-sm">
               <option>Branch: Lekki</option>
                <option>Branch: Gbagada</option>
                <option>Branch: Ikeja</option>
              </select>
          </div>
          <div className="h-80">
            {mounted ? (
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
                    tickFormatter={(value) => `${value/1000}k`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="income" 
                    stroke="#E866B7" 
                    strokeWidth={3} 
                    dot={false}
                    name="Income"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="expenses" 
                    stroke="#F59E0B" 
                    strokeWidth={3} 
                    dot={false}
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
                Loading chart...
              </div>
            )}
          </div>
        </div>

        {/* Invoice Status */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm text-gray-900">Monitor all invoices past their due date</h3>
            </div>
            <button className="flex items-center text-sm gap-2 px-3 py-2 bg-[#E866B7] text-white rounded-lg hover:bg-pink-400 transition-colors">
              <Plus className="w-4 h-4" />
              New Invoice
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                 <span className="text-sm text-gray-600 whitespace-nowrap">1-30 days</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{width: '70%'}}></div>
                </div>
              </div>
              <span className="text-sm text-black font-medium ml-3">5</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <span className="text-sm text-gray-600 whitespace-nowrap">31-60 days</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{width: '40%'}}></div>
                </div>
              </div>
              <span className="text-sm text-black font-medium ml-3">3</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <span className="text-sm text-gray-600 whitespace-nowrap">61-90 days</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{width: '90%'}}></div>
                </div>
              </div>
              <span className="text-sm text-black font-medium ml-3">7</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total unpaid invoice</span>
              <span className="text-sm text-gray-600 font-medium">₦256,200</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Overdue</span>
              <span className="text-sm text-gray-600 font-medium">₦156,200</span>
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
            <div className="bg-pink-50 p-4 rounded-xl">
              <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center mb-3">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div className="text-xl font-bold text-gray-900">₦450,239</div>
              <div className="text-sm text-gray-600 mb-1">Total Sales</div>
              <div className="text-xs text-pink-500">+8% from yesterday</div>
            </div>

            <div className="bg-orange-50 p-4 rounded-xl">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mb-3">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div className="text-xl font-bold text-gray-900">300</div>
              <div className="text-sm text-gray-600 mb-1">Total Order</div>
              <div className="text-xs text-orange-500">+5% from yesterday</div>
            </div>

            <div className="bg-purple-50 p-4 rounded-xl">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mb-3">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div className="text-xl font-bold text-gray-900">5</div>
              <div className="text-sm text-gray-600 mb-1">Product Sold</div>
              <div className="text-xs text-purple-500">+1.2% from yesterday</div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-xl">
              <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center mb-3">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="text-xl font-bold text-gray-900">8</div>
              <div className="text-sm text-gray-600 mb-1">New Customers</div>
              <div className="text-xs text-yellow-500">0.5% from yesterday</div>
            </div>
          </div>
        </div>

        {/* Low Quantity Stock */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Low Quantity Stock</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <div className="font-medium text-gray-900">iPhone 15promax 256gb</div>
                <div className="text-sm text-gray-500">Remaining Quantity: <span className="text-red-500">2 Pieces</span></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div>
                <div className="font-medium text-gray-900">HP 1040 G2</div>
                <div className="text-sm text-gray-500">Remaining Quantity: <span className="text-red-500">1 Pieces</span></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div>
                <div className="font-medium text-gray-900">PS 5</div>
                <div className="text-sm text-gray-500">Remaining Quantity: <span className="text-red-500">3 Pieces</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Total Revenue Bar Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Total Revenue</h3>
        
        <div className="h-80">
          {mounted ? (
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
              Loading chart...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;