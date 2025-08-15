'use client';

import Link from 'next/link';
import { Search, ChevronRight, Printer, Download, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const TransactionDetailsPage = () => {
  const [locationOpen, setLocationOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Lekki');

  const locations = ['Lekki', 'Gbagada', 'Ikeja'];

  const transactionData = {
    id: "TXN-00086532",
    type: "Sale / Invoice / Expense / Budget / Repair",
    dateCreated: "April 5, 2025",
    status: "Paid",
    statusOptions: ["Paid", "Pending", "Overdue", "Approved"],
    date: "June 18 2025",
    branch: "Gbagada Branch",
    description: "AC Maintenance",
    category: "Repairs",
    approval: "Mr Michael",
    amount: "₦15,000.00",
    dueDate: "24th June 2025",
    paidDate: "30th June 2025"
  };

  const progressSteps = [
    { label: "Created", date: "1st, Apr 2025", status: "completed" },
    { label: "Awaiting Approval", date: "3rd, Apr 2025", status: "inactive" },
    { label: "Approved", date: "4th, Apr 2025", status: "inactive" },
    { label: "Paid", date: "6th, Apr 2025", status: "inactive" }
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
  const getStatusColor = (status: string): string => {
    const colors: { [key: string]: string } = {
      Paid: "text-green-600",
      Pending: "text-yellow-600", 
      Overdue: "text-red-600",
      Approved: "text-green-600"
    };
    return colors[status] || "text-gray-600";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
          <div>
            <h1 className="text-2xl lg:text-2xl font-bold text-gray-900 mb-2">Transaction</h1>
            <p className="text-gray-600 text-sm">Monitor all financial activities, revenue, expenses, and invoices.</p>
          </div>
          <div className="text-sm text-gray-500 mt-4 lg:mt-0">
            Last Update: Current date and time
          </div>
        </div>
      </div>
      {/* Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 text-black pr-16 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E866B7] focus:border-transparent"
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
            ⌘ K
          </span>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Location Dropdown */}
          <LocationDropdown />

          {/* Add Transaction Button */}
          <Link
            href="/dashboard/accounting/transaction/add-new"
            className="bg-[#E866B7] text-white px-4 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            <span className="text-sm">+</span>
            Add Transaction
          </Link>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/transactions" className="hover:text-gray-700">Repair</Link>
        <ChevronRight className="w-4 h-4" />
        <span>Transaction ID</span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">{transactionData.id}</span>
      </div>

      {/* Transaction Header */}
      <div className="flex flex-col gap-4 mb-8">
        {/* Transaction ID and Action Buttons */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            Transaction ID: {transactionData.id}
          </h2>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#E866B7] text-white rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>

        {/* Transaction Details */}
        <div className="flex flex-col lg:flex-row gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span>Transaction Type: {transactionData.type}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Date Created: <span className="text-gray-900 font-medium">{transactionData.dateCreated}</span></span>
          </div>
        </div>

        {/* Status Line */}
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-gray-600">Status:</span>
          <span className={`font-medium ${getStatusColor(transactionData.status)}`}>
            {transactionData.status}
          </span>
          <span className="text-gray-400">/</span>
          <span className="text-yellow-600">Pending</span>
          <span className="text-gray-400">/</span>
          <span className="text-red-600">Overdue</span>
          <span className="text-gray-400">/</span>
          <span className="text-green-600">Approved</span>
        </div>
      </div>

      {/* Progress Tracker */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-8">
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-200"></div>
          <div className="absolute top-6 left-6 w-8 h-0.5 bg-green-500"></div>

          {/* Progress Steps */}
          <div className="flex justify-between relative">
            {progressSteps.map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mb-3 ${
                  index === 0 
                    ? 'bg-green-500 border-green-500' 
                    : 'bg-gray-200 border-gray-200'
                }`}>
                  {index === 0 && <div className="w-2 h-2 bg-white rounded-full"></div>}
                </div>
                <div className="text-center">
                  <div className={`text-sm font-medium mb-1 ${
                    index === 0 ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </div>
                  <div className="text-xs text-gray-500">{step.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Date and Branch */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Date</h3>
              <p className="text-gray-600">{transactionData.date}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Branch</h3>
              <p className="text-gray-600">{transactionData.branch}</p>
            </div>
          </div>

          {/* Description and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600">{transactionData.description}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Category</h3>
              <p className="text-gray-600">{transactionData.category}</p>
            </div>
          </div>

          {/* Approval */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Approval</h3>
            <p className="text-gray-600">{transactionData.approval}</p>
          </div>
        </div>

        {/* Right Column - Summary */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Amount</span>
              <span className="text-xl font-semibold text-gray-900">{transactionData.amount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Due date</span>
              <span className="text-gray-900">{transactionData.dueDate}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Paid Date</span>
              <span className="text-gray-900">{transactionData.paidDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailsPage;