'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { Search, Plus, Download, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

interface Receipt {
  id: string;
  date: string;
  paymentMode: string;
  receiptNumber: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  customerName: string;
  branch: string;
  amount: string;
  salesperson: string;
}

const receipts: Receipt[] = [
  {
    id: '1',
    date: '3/8/2025',
    paymentMode: 'Bank Transfer',
    receiptNumber: 'S-R/709743',
    status: 'Paid',
    customerName: 'Samuel Monday',
    branch: 'Gbagada',
    amount: 'NGN2,000,000',
    salesperson: 'Chineye'
  },
  {
    id: '2',
    date: '3/8/2025',
    paymentMode: 'Bank Transfer',
    receiptNumber: 'S-R/709743',
    status: 'Paid',
    customerName: 'Samuel Monday',
    branch: 'Lekki',
    amount: 'NGN2,000,000',
    salesperson: 'Margret'
  },
  {
    id: '3',
    date: '3/8/2025',
    paymentMode: 'Bank Transfer',
    receiptNumber: 'S-R/709743',
    status: 'Paid',
    customerName: 'Samuel Monday',
    branch: 'Ikeja',
    amount: 'NGN2,000,000',
    salesperson: 'Margret'
  },
  {
    id: '4',
    date: '3/8/2025',
    paymentMode: 'Bank Transfer',
    receiptNumber: 'S-R/709743',
    status: 'Paid',
    customerName: 'Samuel Monday',
    branch: 'Ikeja',
    amount: 'NGN2,000,000',
    salesperson: 'Samuel'
  },
  {
    id: '5',
    date: '3/8/2025',
    paymentMode: 'Bank Transfer',
    receiptNumber: 'S-R/709743',
    status: 'Paid',
    customerName: 'Samuel Monday',
    branch: 'Gbagada',
    amount: 'NGN2,000,000',
    salesperson: 'Michael'
  },
  {
    id: '6',
    date: '3/8/2025',
    paymentMode: 'Bank Transfer',
    receiptNumber: 'S-R/709743',
    status: 'Paid',
    customerName: 'Samuel Monday',
    branch: 'Lekki',
    amount: 'NGN2,000,000',
    salesperson: 'Dennis'
  },
  {
    id: '7',
    date: '3/8/2025',
    paymentMode: 'Bank Transfer',
    receiptNumber: 'S-R/709743',
    status: 'Paid',
    customerName: 'Samuel Monday',
    branch: 'Ikeja',
    amount: 'NGN2,000,000',
    salesperson: 'Chineye'
  },
  {
    id: '8',
    date: '3/8/2025',
    paymentMode: 'Bank Transfer',
    receiptNumber: 'S-R/709743',
    status: 'Paid',
    customerName: 'Samuel Monday',
    branch: 'Gbagada',
    amount: 'NGN2,000,000',
    salesperson: 'Dennis'
  },
  {
    id: '9',
    date: '3/8/2025',
    paymentMode: 'Bank Transfer',
    receiptNumber: 'S-R/709743',
    status: 'Paid',
    customerName: 'Samuel Monday',
    branch: 'Ikeja',
    amount: 'NGN2,000,000',
    salesperson: 'Tina'
  },
  {
    id: '10',
    date: '3/8/2025',
    paymentMode: 'Bank Transfer',
    receiptNumber: 'S-R/709743',
    status: 'Paid',
    customerName: 'Samuel Monday',
    branch: 'Gbagada',
    amount: 'NGN2,000,000',
    salesperson: 'Dennis'
  },
  {
    id: '11',
    date: '3/8/2025',
    paymentMode: 'Bank Transfer',
    receiptNumber: 'S-R/709743',
    status: 'Paid',
    customerName: 'Samuel Monday',
    branch: 'Lekki',
    amount: 'NGN2,000,000',
    salesperson: 'Chineye'
  }
];

export default function AccountingDashboard() {
  const [selectedReceipts, setSelectedReceipts] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleReceipt = (id: string) => {
    setSelectedReceipts(prev => 
      prev.includes(id) 
        ? prev.filter(receiptId => receiptId !== id)
        : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelectedReceipts(prev => 
      prev.length === receipts.length ? [] : receipts.map(r => r.id)
    );
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
          <Link
            href="/dashboard/accounting/transaction/new-invoice"
            className="bg-[#E866B7] text-white px-4 py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            New Invoice
          </Link>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2 text-sm">
            <Download className="h-4 w-4" />
            Download Report
          </button>
        </div>
      </div>

      {/* Products Section */}
      <div className="bg-white rounded-lg shadow-sm">
        {/* Products Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Products</h2>
          
          <div className="flex gap-3">
            <Link
              href="/dashboard/accounting/sales/new-receipt"
              className="bg-[#FBB906] hover:bg-yellow-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              New Receipt
            </Link>
            <button className="flex items-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition-colors">
              <Filter className="h-4 w-4" />
              Filters
            </button>
            <button className="flex items-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition-colors">
              Download all
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="w-12 p-4">
                  <input
                    type="checkbox"
                    checked={selectedReceipts.length === receipts.length}
                    onChange={toggleAll}
                    className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                  />
                </th>
                <th className="text-left p-4 font-medium text-sm text-gray-700 min-w-[100px]">Receipt date#</th>
                <th className="text-left p-4 font-medium text-sm text-gray-700 min-w-[120px]">Payment Mode</th>
                <th className="text-left p-4 font-medium text-sm text-gray-700 min-w-[120px]">Receipt number#</th>
                <th className="text-left p-4 font-medium text-sm text-gray-700 min-w-[80px]">Status</th>
                <th className="text-left p-4 font-medium text-sm text-gray-700 min-w-[120px]">Customer Name</th>
                <th className="text-left p-4 font-medium text-sm text-gray-700 min-w-[100px]">Branch</th>
                <th className="text-left p-4 font-medium text-sm text-gray-700 min-w-[120px]">Amount</th>
                <th className="text-left p-4 font-medium text-sm text-gray-700 min-w-[120px]">Salesperson</th>
              </tr>
            </thead>
            <tbody>
              {receipts.map((receipt, index) => (
                <tr key={receipt.id} className={`border-b hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedReceipts.includes(receipt.id)}
                      onChange={() => toggleReceipt(receipt.id)}
                      className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                    />
                  </td>
                  <td className="p-4 text-xs text-gray-900">{receipt.date}</td>
                  <td className="p-4 text-xs text-gray-900">{receipt.paymentMode}</td>
                  <td className="p-4 text-xs text-gray-900">{receipt.receiptNumber}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium text-green-700">
                      {receipt.status}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-gray-900">{receipt.customerName}</td>
                  <td className="p-4 text-xs text-gray-900">{receipt.branch}</td>
                  <td className="p-4 text-xs text-gray-900">{receipt.amount}</td>
                  <td className="p-4 text-xs text-gray-900">{receipt.salesperson}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 border-t">
          <button className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors">
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>
          
          <span className="text-sm text-gray-700">
            Page 1 of 10
          </span>
          
          <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors">
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}