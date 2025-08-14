'use client';

import Link from 'next/link';
import { Search, ChevronDown, Calendar, Upload } from 'lucide-react';
import { useState } from 'react';

interface DropdownProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
  placeholder: string;
}

const AddTransactionPage = () => {
  const [locationOpen, setLocationOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Lekki');
  const [branchOpen, setBranchOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [transactionTypeOpen, setTransactionTypeOpen] = useState(false);
  const [selectedTransactionType, setSelectedTransactionType] = useState('');
  
  const [formData, setFormData] = useState({
    date: '',
    description: '',
    category: '',
    paymentMethod: '',
    amount: '',
    dueDate: '',
    status: '',
    approver: 'Mr Michael'
  });

  const locations: string[] = ['Lekki', 'Gbagada', 'Ikeja'];
  const branches: string[] = ['Select option', 'Lekki Branch', 'Gbagada Branch', 'Ikeja Branch'];
  const transactionTypes: string[] = ['Sale, Expense, Budget, Invoice', 'Sale', 'Expense', 'Budget', 'Invoice'];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const Dropdown: React.FC<DropdownProps> = ({ isOpen, setIsOpen, options, selected, onSelect, placeholder }) => (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-left text-sm text-gray-600 hover:border-gray-300 transition-colors flex items-center justify-between"
      >
        <span className={selected ? 'text-gray-900' : 'text-gray-400'}>
          {selected || placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onSelect(option);
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative mb-6">
        <div className="absolute top-0 right-0 text-xs text-gray-500">
          Last Update: Current date and time
        </div>
        
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-1">Transactions</h1>
          <p className="text-gray-600 text-sm">
            Monitor all financial activities, revenue, expenses, and invoices.
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search"
            className="w-full text-black pl-10 pr-16 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E866B7] focus:border-transparent"
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
            className="flex items-center gap-2 bg-[#E866B7] text-white px-4 py-2.5 rounded-lg font-medium text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            <span className="text-sm">+</span>
            Add Transaction
          </Link>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {/* Basic Info Section */}
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Basic Info</h2>
          <p className="text-sm text-gray-600 mb-6">Kindly fill in the form below to create a budget</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="DD/MM/YYYY"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full border text-gray-800 border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E866B7] focus:border-transparent pr-10"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </div>

            {/* Receiving Branch */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Receiving branch</label>
              <Dropdown
                isOpen={branchOpen}
                setIsOpen={setBranchOpen}
                options={branches}
                selected={selectedBranch}
                onSelect={setSelectedBranch}
                placeholder="Select option"
              />
            </div>

            {/* Transaction Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Type</label>
              <Dropdown
                isOpen={transactionTypeOpen}
                setIsOpen={setTransactionTypeOpen}
                options={transactionTypes}
                selected={selectedTransactionType}
                onSelect={setSelectedTransactionType}
                placeholder="Sale, Expense, Budget, Invoice"
              />
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                placeholder="Enter description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full border text-gray-800 border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E866B7] focus:border-transparent resize-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <textarea
                placeholder="(auto-adapts to type: Sales, Repairs, Office Supplies, Staff Salary, etc."
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                rows={4}
                className="w-full border text-gray-800 border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E866B7] focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
            <input
              type="text"
              placeholder="Cash, Bank Transfer, POS, etc."
              value={formData.paymentMethod}
              onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
              className="w-full md:w-1/2 border text-gray-800 border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E866B7] focus:border-transparent"
            />
          </div>
        </div>

        {/* Finance Section */}
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Finance</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <input
                type="text"
                placeholder="Type in the amount"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                className="w-full border text-gray-800 border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E866B7] focus:border-transparent"
              />
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Due Date (if invoice or budget)</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Status (Paid, Unpaid, Pending, Overdue)"
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full border text-gray-800 border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E866B7] focus:border-transparent pr-10"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Upload Receipt */}
          <div>
            <button className="flex items-center gap-2 bg-[#E866B7] text-white px-4 py-2.5 rounded-lg font-medium text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
              <Upload className="w-4 h-4" />
              Upload Receipt or Invoice (PDF/Image)
            </button>
          </div>
        </div>

        {/* Request Approval Section */}
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Request Approval</h2>
          
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">Approver</label>
            <input
              type="text"
              value={formData.approver}
              onChange={(e) => handleInputChange('approver', e.target.value)}
              className="w-full md:w-1/2 text-gray-800 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E866B7] focus:border-transparent bg-gray-50"
              readOnly
            />
          </div>

          {/* Submit Button */}
          <button className="bg-[#E866B7] text-white px-6 py-3 rounded-lg font-medium text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
            ▶ Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTransactionPage;