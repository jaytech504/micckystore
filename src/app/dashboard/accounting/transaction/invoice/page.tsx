'use client';

import Link from 'next/link';
import React from 'react';
import { Search, Download, ChevronDown, Plus } from 'lucide-react';

export default function AccountingDashboard() {
  const invoices = [
    { date: '3/8/2025', number: 'INV709743', orderId: 'System generated', status: 'Paid', customer: 'Samuel Monday', dueDate: '3/8/2025', balance: 'NGN2,000,000', branch: 'Lekki' },
    { date: '3/8/2025', number: 'INV709743', orderId: 'System generated', status: 'Overdue', customer: 'Samuel Monday', dueDate: '3/8/2025', balance: 'NGN2,000,000', branch: 'Ikeja' },
    { date: '3/8/2025', number: 'INV709743', orderId: 'System generated', status: 'Partially paid', customer: 'Samuel Monday', dueDate: '3/8/2025', balance: 'NGN2,000,000', branch: 'Gbagada' },
    { date: '3/8/2025', number: 'INV709743', orderId: 'System generated', status: 'Overdue', customer: 'Samuel Monday', dueDate: '3/8/2025', balance: 'NGN2,000,000', branch: 'Gbagada' },
    { date: '3/8/2025', number: 'INV709743', orderId: 'System generated', status: 'Paid', customer: 'Samuel Monday', dueDate: '3/8/2025', balance: 'NGN2,000,000', branch: 'Gbagada' },
    { date: '3/8/2025', number: 'INV709743', orderId: 'System generated', status: 'Paid', customer: 'Samuel Monday', dueDate: '3/8/2025', balance: 'NGN2,000,000', branch: 'Ikeja' },
    { date: '3/8/2025', number: 'INV709743', orderId: 'System generated', status: 'Overdue', customer: 'Samuel Monday', dueDate: '3/8/2025', balance: 'NGN2,000,000', branch: 'Ikeja' },
    { date: '3/8/2025', number: 'INV709743', orderId: 'System generated', status: 'Partially paid', customer: 'Samuel Monday', dueDate: '3/8/2025', balance: 'NGN2,000,000', branch: 'Lekki' },
    { date: '3/8/2025', number: 'INV709743', orderId: 'System generated', status: 'Overdue', customer: 'Samuel Monday', dueDate: '3/8/2025', balance: 'NGN2,000,000', branch: 'Lekki' },
    { date: '3/8/2025', number: 'INV709743', orderId: 'System generated', status: 'Paid', customer: 'Samuel Monday', dueDate: '3/8/2025', balance: 'NGN2,000,000', branch: 'Ikeja' },
    { date: '3/8/2025', number: 'INV709743', orderId: 'System generated', status: 'Paid', customer: 'Samuel Monday', dueDate: '3/8/2025', balance: 'NGN2,000,000', branch: 'Ikeja' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'text-teal-600';
      case 'Overdue':
        return 'text-red-500';
      case 'Partially paid':
        return 'text-blue-500';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Transaction</h1>
            <p className="text-gray-600 text-sm">Monitor all financial activities, revenue, expenses, and invoices.</p>
          </div>
          <div className="text-sm text-gray-500 mt-4 lg:mt-0">
            Last Update: Current date and time
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        {/* Search */}
        <div className="relative w-full sm:flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-900 w-4 h-4" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-16 py-2.5 text-black border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E866B7] focus:border-transparent"
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
            ⌘ K
          </span>
        </div>

        {/* Right Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          {/* Download Report Button */}
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2 text-sm">
            <Download className="h-4 w-4" />
            Download Report
          </button>

          {/* Add Transaction Button */}
          <Link
            href="/dashboard/accounting/transaction/new-invoice"
            className="bg-[#E866B7] text-white px-4 py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            New Invoice
          </Link>
        </div>
      </div>

      <div className="space-y-3">
        {/* Payment Summary */}
        <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 mb-4">
          <div className="px-4 md:px-6 py-3">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-semibold text-gray-900">Payment Summary</h2>
            </div>
          </div>
          
          <div className="px-4 md:px-6 py-3 bg-gray-50">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 lg:gap-8">
              <div>
                <p className="text-xs text-gray-600 mb-1">Total Outstanding</p>
                <p className="text-sm font-bold text-red-600">NGN300,000.00</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Due Today</p>
                <p className="text-sm font-bold text-orange-500">NGN40,000.00</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-xs text-gray-600">Due in 30 days</p>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
                <p className="text-sm font-bold text-gray-900">NGN150,000.00</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Total Overdue invoice</p>
                <p className="text-sm font-bold text-red-600">NGN150,000.00</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Number of overdue customers</p>
                <p className="text-sm font-bold text-gray-900">8</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Name of highest debtor</p>
                <p className="text-sm font-bold text-gray-900">Name</p>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Table Container with Horizontal Scroll */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50 top-0 border-b border-gray-200">
                <tr>
                  <th className="text-left p-2 sm:p-3 md:p-4 font-medium text-gray-700 w-12">
                    <input type="checkbox" className="rounded border-gray-300 text-pink-500 focus:ring-pink-500" />
                  </th>
                  <th className="text-left p-2 sm:p-3 md:p-4 font-medium text-gray-700 text-xs sm:text-sm">Invoice date</th>
                  <th className="text-left p-2 sm:p-3 md:p-4 font-medium text-gray-700 text-xs sm:text-sm">Invoice number#</th>
                  <th className="text-left p-2 sm:p-3 md:p-4 font-medium text-gray-700 text-xs sm:text-sm">Order id#</th>
                  <th className="text-left p-2 sm:p-3 md:p-4 font-medium text-gray-700 text-xs sm:text-sm">Status</th>
                  <th className="text-left p-2 sm:p-3 md:p-4 font-medium text-gray-700 text-xs sm:text-sm">Customer Name</th>
                  <th className="text-left p-2 sm:p-3 md:p-4 font-medium text-gray-700 text-xs sm:text-sm">Due date</th>
                  <th className="text-left p-2 sm:p-3 md:p-4 font-medium text-gray-700 text-xs sm:text-sm">Balance</th>
                  <th className="text-left p-2 sm:p-3 md:p-4 font-medium text-gray-700 text-xs sm:text-sm">Branch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoices.map((invoice, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-2 sm:p-3 md:p-4">
                      <input type="checkbox" className="rounded border-gray-300 text-pink-500 focus:ring-pink-500" />
                    </td>
                    <td className="p-2 sm:p-3 md:p-4 text-xs sm:text-sm text-gray-900 whitespace-nowrap">{invoice.date}</td>
                    <td className="p-2 sm:p-3 md:p-4 whitespace-nowrap">
                      <span className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 cursor-pointer font-medium">
                        {invoice.number}
                      </span>
                    </td>
                    <td className="p-2 sm:p-3 md:p-4 text-xs sm:text-sm text-gray-600 whitespace-nowrap">{invoice.orderId}</td>
                    <td className="p-2 sm:p-3 md:p-4 whitespace-nowrap">
                      <span className={`text-xs sm:text-sm font-medium ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="p-2 sm:p-3 md:p-4 text-xs sm:text-sm text-gray-900 whitespace-nowrap">{invoice.customer}</td>
                    <td className="p-2 sm:p-3 md:p-4 text-xs sm:text-sm text-gray-900 whitespace-nowrap">{invoice.dueDate}</td>
                    <td className="p-2 sm:p-3 md:p-4 text-xs sm:text-sm text-gray-900 font-medium whitespace-nowrap">{invoice.balance}</td>
                    <td className="p-2 sm:p-3 md:p-4 text-xs sm:text-sm text-gray-900 whitespace-nowrap">{invoice.branch}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center px-4 md:px-6 py-4 border-t border-gray-200 bg-white gap-3">
            <button className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium text-center sm:text-left text-sm">
              Previous
            </button>
            <span className="text-sm text-gray-600 text-center">Page 1 of 10</span>
            <button className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium text-center sm:text-right text-sm">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}