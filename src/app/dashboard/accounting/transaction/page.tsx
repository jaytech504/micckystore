'use client';

import Link from 'next/link';
import { Search, ChevronDown, Plus, Download } from 'lucide-react';
import { useState } from 'react';

interface DropdownProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
  placeholder: string;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  branch: string;
  amount: string;
  status: string;
}

interface Invoice {
  date: string;
  number: string;
  orderId: string;
  status: string;
  customer: string;
  dueDate: string;
  balance: string;
  branch: string;
}

const TransactionsPage = () => {
  const [locationOpen, setLocationOpen] = useState(false);
  const [dateFilterOpen, setDateFilterOpen] = useState(false);
  const [branchFilterOpen, setBranchFilterOpen] = useState(false);
  const [categoryFilterOpen, setCategoryFilterOpen] = useState(false);
  const [statusFilterOpen, setStatusFilterOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Lekki');

  const locations: string[] = ['Lekki', 'Gbagada', 'Ikeja'];
  const dateRanges: string[] = ['Today', 'This Week', 'This Month', 'Last Month', 'Custom'];
  const branches: string[] = ['All Branches', 'Lekki', 'Gbagada', 'Ikeja'];
  const categories: string[] = ['All Categories', 'Repairs', 'Expenses', 'Budget', 'Sales'];
  const statuses: string[] = ['All Status', 'Approved', 'Unpaid', 'Paid', 'Pending'];

  const transactions: Transaction[] = [
    {
      id: "TXN-10325",
      date: "06-06-2025",
      description: "AC Maintenance",
      category: "Repairs",
      branch: "Gbagada",
      amount: "₦15,000.00",
      status: "approved"
    },
    {
      id: "TXN-10325",
      date: "06-06-2025",
      description: "Vendor payment",
      category: "Expenses",
      branch: "Gbagada",
      amount: "₦15,000.00",
      status: "unpaid"
    },
    {
      id: "TXN-10325",
      date: "06-06-2025",
      description: "Instagram Ads Budget",
      category: "Budget",
      branch: "Gbagada",
      amount: "₦15,000.00",
      status: "paid"
    },
    {
      id: "TXN-10325",
      date: "06-06-2025",
      description: "Invoice for Phone Sales",
      category: "Sales",
      branch: "Gbagada",
      amount: "₦15,000.00",
      status: "paid"
    },
    {
      id: "TXN-10325",
      date: "06-06-2025",
      description: "NEPA Bill",
      category: "Expense",
      branch: "Gbagada",
      amount: "₦15,000.00",
      status: "paid"
    }
  ];

  const invoices: Invoice[] = [
    {
      date: "3/8/2025",
      number: "INV/709743",
      orderId: "System generated",
      status: "paid",
      customer: "Samuel Monday",
      dueDate: "3/8/2025",
      balance: "₦GN2,000,000",
      branch: "Lekki"
    },
    {
      date: "3/8/2025",
      number: "INV/709743",
      orderId: "System generated",
      status: "overdue",
      customer: "Samuel Monday",
      dueDate: "3/8/2025",
      balance: "₦GN2,000,000",
      branch: "Ikeja"
    },
    {
      date: "3/8/2025",
      number: "INV/709743",
      orderId: "System generated",
      status: "partially-paid",
      customer: "Samuel Monday",
      dueDate: "3/8/2025",
      balance: "₦GN2,000,000",
      branch: "Gbagada"
    }
  ];

  const Dropdown: React.FC<DropdownProps> = ({ isOpen, setIsOpen, options, selected, onSelect, placeholder }) => (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 hover:border-gray-300 transition-colors flex items-center gap-2 min-w-[120px] justify-between"
      >
        <span>{selected || placeholder}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-full">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onSelect(option);
                setIsOpen(false);
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

  const getStatusStyles = (status: string): string => {
    const styles: { [key: string]: string } = {
      approved: "bg-green-100 text-green-800",
      unpaid: "bg-yellow-100 text-yellow-800",
      paid: "bg-green-100 text-green-800",
      overdue: "bg-red-100 text-red-600",
      "partially-paid": "bg-blue-100 text-blue-800"
    };
    return styles[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      {/* Header with Last Update */}
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
        <div className="flex items-center gap-3">
          {/* Location Dropdown */}
          <div className="flex items-center gap-2">
           <LocationDropdown />
          </div>

          {/* Add Transaction Button */}
          <Link
            href="/dashboard/accounting/transaction/add-new"
            className="bg-[#E866B7] text-white px-4 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            Add Transaction
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6 relative">
        <h3 className='text-xl font-semibold text-gray-700 pr-17'>Transaction</h3>

        <Dropdown
          isOpen={dateFilterOpen}
          setIsOpen={setDateFilterOpen}
          options={dateRanges}
          selected="Date"
          onSelect={(option: string) => console.log('Date filter:', option)}
          placeholder="Date"
        />
        
        <Dropdown
          isOpen={branchFilterOpen}
          setIsOpen={setBranchFilterOpen}
          options={branches}
          selected="Branch"
          onSelect={(option: string) => console.log('Branch filter:', option)}
          placeholder="Branch"
        />
        
        <Dropdown
          isOpen={categoryFilterOpen}
          setIsOpen={setCategoryFilterOpen}
          options={categories}
          selected="Category"
          onSelect={(option: string) => console.log('Category filter:', option)}
          placeholder="Category"
        />
        
        <Dropdown
          isOpen={statusFilterOpen}
          setIsOpen={setStatusFilterOpen}
          options={statuses}
          selected="Status"
          onSelect={(option: string) => console.log('Status filter:', option)}
          placeholder="Status"
        />

        {/* Export Button */}
        <Link
          href="/transactions/export"
          className="ml-auto bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 hover:border-gray-300 transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export
        </Link>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Transaction ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 hidden md:table-cell">Description</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Category</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 hidden lg:table-cell">Branch</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.map((transaction, index) => (
                <Link
                  key={index}
                  href={`/dashboard/accounting/transaction/transaction-details`}
                  className="table-row hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-4">
                    <span className="text-blue-600 text-sm font-medium">
                      {transaction.id}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">{transaction.date}</td>
                  <td className="px-4 py-4 text-sm text-gray-900 hidden md:table-cell">{transaction.description}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{transaction.category}</td>
                  <td className="px-4 py-4 text-sm text-gray-900 hidden lg:table-cell">{transaction.branch}</td>
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{transaction.amount}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusStyles(transaction.status)}`}>
                      {transaction.status.replace('-', ' ')}
                    </span>
                  </td>
                </Link>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-100">
          <Link
            href="/transactions?page=prev"
            className="bg-white border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Previous
          </Link>
          <span className="text-sm text-gray-600">Page 1 of 10</span>
          <Link
            href="/transactions?page=next"
            className="bg-white border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Next
          </Link>
        </div>
      </div>

      {/* Invoice Section */}
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Invoice</h2>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 w-8">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600" />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Invoice date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Invoice number#</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 hidden md:table-cell">Order Id#</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 hidden lg:table-cell">Customer Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 hidden xl:table-cell">Due date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Balance</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 hidden lg:table-cell">Branch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoices.map((invoice, index) => (
                <Link
                  key={index}
                  href={`/invoices/${invoice.number}`}
                  className="table-row hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-4" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600" />
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">{invoice.date}</td>
                  <td className="px-4 py-4">
                    <span className="text-blue-600 text-sm font-medium">
                      {invoice.number}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900 hidden md:table-cell">{invoice.orderId}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusStyles(invoice.status)}`}>
                      {invoice.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900 hidden lg:table-cell">{invoice.customer}</td>
                  <td className="px-4 py-4 text-sm text-gray-900 hidden xl:table-cell">{invoice.dueDate}</td>
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{invoice.balance}</td>
                  <td className="px-4 py-4 text-sm text-gray-900 hidden lg:table-cell">{invoice.branch}</td>
                </Link>
              ))}
            </tbody>
          </table>
        </div>

        {/* See More Button */}
        <div className="p-4 border-t border-gray-100">
          <Link
            href="/dashboard/accounting/transaction/invoice"
            className="float-right bg-gray-50 border border-gray-200 text-gray-600 px-4 py-2 rounded-md text-sm hover:bg-gray-100 transition-colors"
          >
            See More
          </Link>
          <div className="clear-both"></div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;