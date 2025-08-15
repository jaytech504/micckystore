'use client';
import React, {useState} from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Search, Download, ChevronDown } from 'lucide-react';

const FinancialOverview = () => {
  const [selectedLocation, setSelectedLocation] = useState('Lekki');
  const [locationOpen, setLocationOpen] = useState(false);
  const locations: string[] = ['Lekki', 'Gbagada', 'Ikeja'];
  // Sample data for Income vs Expenses chart
  const incomeExpensesData = [
    { date: 'Jan 1', income: 35000, expenses: 60000 },
    { date: 'Jan 5', income: 37000, expenses: 55000 },
    { date: 'Jan 9', income: 60000, expenses: 58000 },
    { date: 'Jan 13', income: 45000, expenses: 55000 },
    { date: 'Jan 17', income: 58000, expenses: 52000 },
    { date: 'Jan 21', income: 68000, expenses: 70000 },
    { date: 'Jan 25', income: 40000, expenses: 48000 },
    { date: 'Jan 29', income: 38000, expenses: 45000 },
  ];

  // Sample data for Inflow vs Outflow chart
  const inflowOutflowData = [
    { day: 'Monday', inflow: 160, outflow: 150 },
    { day: 'Tuesday', inflow: 180, outflow: 160 },
    { day: 'Wednesday', inflow: 200, outflow: 110 },
    { day: 'Thursday', inflow: 170, outflow: 120 },
    { day: 'Friday', inflow: 150, outflow: 155 },
    { day: 'Saturday', inflow: 180, outflow: 165 },
    { day: 'Sunday', inflow: 200, outflow: 145 },
  ];

  const transactions = [
    {
      date: 'Jun 1, 2025',
      description: 'Sale - iPhone 15',
      type: 'Sale',
      category: 'Sales Revenue',
      amount: '₦1,500,000',
      direction: 'InFlow',
      directionColor: 'bg-green-500'
    },
    {
      date: 'Jun 2, 2025',
      description: 'Staff Salary',
      type: 'Expense',
      category: 'Salaries',
      amount: '₦2,500,000',
      direction: 'OutFlow',
      directionColor: 'bg-red-500'
    },
    {
      date: 'Jun 2, 2025',
      description: 'Repair Payment - HP PC',
      type: 'Repair',
      category: 'Repairs Revenue',
      amount: '₦80,000',
      direction: 'On Time',
      directionColor: 'bg-green-500'
    },
    {
      date: 'Jun 2, 2025',
      description: 'Inventory Purchase',
      type: 'Expenses',
      category: 'Purchases',
      amount: '₦90,000',
      direction: 'OutFlow',
      directionColor: 'bg-red-500'
    },
    {
      date: 'Jun 2, 2025',
      description: 'Staff Salary',
      type: 'Sale',
      category: 'Sales Revenue',
      amount: '₦1,500,000',
      direction: 'On Time',
      directionColor: 'bg-green-500'
    },
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
            <h1 className="text-2xl lg:text-2xl font-bold text-gray-900 mb-2">Financial Overview</h1>
            <p className="text-gray-600 text-sm">Comprehensive view of profit & loss and cash flow statements</p>
          </div>
          <div className="text-sm text-gray-500 mt-4 lg:mt-0">
            Last Update: Current date and time
          </div>
        </div>
        
        
        {/* Search and Controls */}
        <div className="flex justify-between items-center mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 text-gray-700 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 w-64"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">⌘ K</span>
          </div>
          <div className="flex items-center space-x-4">
            <select className="px-3 py-2 text-gray-800 border border-gray-300 rounded-lg focus:outline-none">
              <option>This Month</option>
            </select>
            <LocationDropdown />
            <button className="bg-[#E866B7] hover:bg-pink-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Download report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
          <p className="text-lg text-gray-900 font-semibold">₦2,450,000</p>
          <p className="text-xs text-green-500 flex items-center mt-1">↗ +1.1%</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600 mb-1">Total Expenses</p>
          <p className="text-lg text-gray-900 font-semibold">₦1,680,000</p>
          <p className="text-xs text-red-500 flex items-center mt-1">↘ -2.1%</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600 mb-1">Gross Profit</p>
          <p className="text-lg text-gray-900 font-semibold">₦770,000</p>
          <p className="text-xs text-red-500 flex items-center mt-1">↘ -7.2%</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600 mb-1">Profit Margin</p>
          <p className="text-lg text-gray-900 font-semibold">31.4%</p>
          <p className="text-xs text-red-500 flex items-center mt-1">↘ -2.1%</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600 mb-1">Net Inflow</p>
          <p className="text-lg text-gray-900 font-semibold">₦320,000</p>
          <p className="text-xs text-red-500 flex items-center mt-1">↘ -5.3%</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600 mb-1">Closing Balance</p>
          <p className="text-lg text-gray-900 font-semibold">₦1,850,000</p>
          <p className="text-xs text-green-500 flex items-center mt-1">Current</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Income vs Expenses Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg text-gray-700 font-semibold">Income vs Expenses</h3>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded">Week</button>
              <button className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded">Month</button>
              <button className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded">Year</button>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={incomeExpensesData}>
                <XAxis dataKey="date" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#ec4899" 
                  strokeWidth={3}
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#f59e0b" 
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Income</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Expenses</span>
            </div>
          </div>
        </div>

        {/* Inflow vs Outflow Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg text-gray-700 font-semibold mb-4">Inflow vs Outflow</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={inflowOutflowData} barCategoryGap="20%">
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Bar dataKey="inflow" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="outflow" fill="#ec4899" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Inflow</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Outflow</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <div className="max-h-96 overflow-y-auto scrollbar-orange">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (₦)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Direction</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.concat(transactions).concat(transactions).map((transaction, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{transaction.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${transaction.directionColor}`}>
                        {transaction.direction}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Summary Footer */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex space-x-8">
            <div>
              <span className="text-sm text-gray-600">Total Income: </span>
              <span className="font-semibold text-green-600">₦1,500,000</span>
            </div>
            <div>
              <span className="text-sm text-gray-600">Total Expenses: </span>
              <span className="font-semibold text-red-600">₦595,000</span>
            </div>
            <div>
              <span className="text-sm text-gray-600">Net Profit: </span>
              <span className="font-semibold text-red-600">₦-180,000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .scrollbar-orange::-webkit-scrollbar {
          width: 8px;
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