'use client';

import React from 'react';
import { Calculator, DollarSign, TrendingUp, TrendingDown, FileText, CreditCard } from 'lucide-react';

export default function AccountingPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Accounting</h1>
          <p className="text-gray-600">Manage your financial records and transactions</p>
        </div>
        <button className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors">
          <Calculator className="w-4 h-4 inline mr-2" />
          New Transaction
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₦2,450,000</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
            <span className="text-sm font-medium text-green-500">+12.5%</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">₦1,230,000</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingDown className="w-4 h-4 mr-1 text-red-500" />
            <span className="text-sm font-medium text-red-500">-3.2%</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Net Profit</p>
              <p className="text-2xl font-bold text-gray-900">₦1,220,000</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
            <span className="text-sm font-medium text-green-500">+8.7%</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Invoices</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm font-medium text-yellow-600">₦450,000</span>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              { id: 1, description: 'Phone Repair - iPhone 12', amount: 45000, type: 'income', date: '2024-01-15' },
              { id: 2, description: 'Office Supplies', amount: 15000, type: 'expense', date: '2024-01-14' },
              { id: 3, description: 'Laptop Sale - MacBook Pro', amount: 350000, type: 'income', date: '2024-01-13' },
              { id: 4, description: 'Internet Bill', amount: 25000, type: 'expense', date: '2024-01-12' },
              { id: 5, description: 'Screen Replacement', amount: 30000, type: 'income', date: '2024-01-11' },
            ].map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.type === 'income' ? (
                      <DollarSign className="w-5 h-5 text-green-600" />
                    ) : (
                      <CreditCard className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-500">{transaction.date}</p>
                  </div>
                </div>
                <div className={`font-semibold ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}₦{transaction.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-gray-600 mr-3" />
                <span className="text-gray-700">Generate Invoice</span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <Calculator className="w-5 h-5 text-gray-600 mr-3" />
                <span className="text-gray-700">Record Expense</span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <TrendingUp className="w-5 h-5 text-gray-600 mr-3" />
                <span className="text-gray-700">View Reports</span>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Revenue</span>
              <span className="font-semibold text-green-600">₦2,450,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Expenses</span>
              <span className="font-semibold text-red-600">₦1,230,000</span>
            </div>
            <div className="border-t border-gray-200 pt-2">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-900">Net Profit</span>
                <span className="font-semibold text-blue-600">₦1,220,000</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Bills</h3>
          <div className="space-y-3">
            {[
              { name: 'Rent', amount: 150000, due: '2024-01-20' },
              { name: 'Electricity', amount: 45000, due: '2024-01-25' },
              { name: 'Internet', amount: 25000, due: '2024-01-30' },
            ].map((bill, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{bill.name}</p>
                  <p className="text-sm text-gray-500">Due: {bill.due}</p>
                </div>
                <span className="font-semibold text-gray-900">₦{bill.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
