'use client';

import Link from 'next/link';
import { Search, ChevronDown, Calendar, Upload, Check, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { accountingApi, CreateTransactionRequest, TransactionCategory, TransactionType } from '@/api/accountingApi';
import { branchesApi, Branch } from '@/api/branchesApi';
import { useRouter } from 'next/navigation';

interface DropdownProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
  placeholder: string;
}

const AddTransactionPage = () => {
  const router = useRouter();
  
  // UI State
  const [branchOpen, setBranchOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [transactionTypeOpen, setTransactionTypeOpen] = useState(false);
  const [selectedTransactionType, setSelectedTransactionType] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    description: '',
    category: '',
    paymentMethod: '',
    amount: '',
    status: 'unpaid',
    approver: 'Mr Michael',
    dueDate: ''
  });

  // API State
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  // Dynamic Data
  const [categories, setCategories] = useState<TransactionCategory[]>([]);
  const [transactionTypes, setTransactionTypes] = useState<TransactionType[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);


  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        // Load transaction categories and types
        const categoriesResponse = await accountingApi.getTransactionCategories();
        if (categoriesResponse.data?.data) {
          setCategories(categoriesResponse.data.data.categories);
          setTransactionTypes(categoriesResponse.data.data.transaction_types);
        }
        
        // Load branches from API
        const branchesResponse = await branchesApi.getBranches({
          status: 'Active', // Only load active branches
          limit: 100 // Get all branches
        });
        if (branchesResponse.data?.branches) {
          setBranches(branchesResponse.data.branches);
        }
      } catch (err) {
        console.error('Error loading initial data:', err);
        setError('Failed to load form data');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null); // Clear error when user starts typing
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const validateForm = () => {
    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }
    if (!formData.category.trim()) {
      setError('Category is required');
      return false;
    }
    if (!formData.amount.trim() || isNaN(Number(formData.amount))) {
      setError('Valid amount is required');
      return false;
    }
    if (!selectedBranch) {
      setError('Branch selection is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSubmitting(true);
    setError(null);

    try {
      const transactionData: CreateTransactionRequest = {
        description: formData.description,
        category: formData.category,
        branch: selectedBranch,
        amount: Number(formData.amount),
        status: formData.status as 'paid' | 'unpaid' | 'approved' | 'unapproved',
        payment_method: formData.paymentMethod,
        approver: formData.approver,
        due_date: formData.dueDate || undefined,
        category_id: formData.category, // Using category as category_id for now
      };

      const response = await accountingApi.createTransaction(transactionData);
      
      if (response.data?.success) {
        setSuccess(true);
        // Reset form
        setFormData({
          description: '',
          category: '',
          paymentMethod: '',
          amount: '',
          status: 'unpaid',
          approver: 'Mr Michael',
          dueDate: ''
        });
        setSelectedBranch('');
        setSelectedTransactionType('');
        setUploadedFile(null);
        
        // Redirect after success
        setTimeout(() => {
          router.push('/dashboard/accounting/transaction');
        }, 2000);
      }
    } catch (err: any) {
      console.error('Error creating transaction:', err);
      setError(err.response?.data?.message || 'Failed to create transaction');
    } finally {
      setSubmitting(false);
    }
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


      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <X className="w-5 h-5 text-red-500" />
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <Check className="w-5 h-5 text-green-500" />
          <p className="text-green-700">Transaction created successfully! Redirecting...</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
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
                  type="date"
                  className="w-full border text-gray-800 border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E866B7] focus:border-transparent"
                />
              </div>
            </div>

            {/* Receiving Branch */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Receiving branch</label>
              <Dropdown
                isOpen={branchOpen}
                setIsOpen={setBranchOpen}
                options={branches.map(b => b.name)}
                selected={branches.find(b => b._id === selectedBranch)?.name || ''}
                onSelect={(branchName) => {
                  const branch = branches.find(b => b.name === branchName);
                  setSelectedBranch(branch?._id || '');
                }}
                placeholder={loading ? "Loading branches..." : "Select branch"}
              />
            </div>

            {/* Transaction Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Type</label>
              <Dropdown
                isOpen={transactionTypeOpen}
                setIsOpen={setTransactionTypeOpen}
                options={transactionTypes.map(t => t.label)}
                selected={selectedTransactionType}
                onSelect={(typeLabel) => {
                  const type = transactionTypes.find(t => t.label === typeLabel);
                  setSelectedTransactionType(typeLabel);
                  if (type) {
                    handleInputChange('category', type.value);
                  }
                }}
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
            <input
              type="file"
              id="receipt-upload"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label
              htmlFor="receipt-upload"
              className="flex items-center gap-2 bg-[#E866B7] text-white px-4 py-2.5 rounded-lg font-medium text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              {uploadedFile ? `Uploaded: ${uploadedFile.name}` : 'Upload Receipt or Invoice (PDF/Image)'}
            </label>
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
          <button 
            type="submit"
            disabled={submitting || loading}
            className="bg-[#E866B7] text-white px-6 py-3 rounded-lg font-medium text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {submitting ? 'Creating...' : '▶ Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTransactionPage;