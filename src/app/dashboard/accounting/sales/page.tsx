'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { Search, Plus, Download, Filter, ChevronLeft, ChevronRight, Loader2, AlertCircle, X } from 'lucide-react';
import { useProductSales } from '../../../../hooks/useProductSales';
import { useBranches } from '../../../../hooks/useBranches';

// Helper function to calculate total amount for a sale
const calculateSaleAmount = (sale: any): number => {
  let total = 0;
  
  // Calculate seller items total (what customer is selling to us)
  if (sale.seller_item && sale.seller_item.length > 0) {
    total += sale.seller_item.reduce((sum: number, item: any) => sum + (item.price || 0) * item.quantity, 0);
  }
  
  // Calculate buyer items total (what customer is buying from us)
  if (sale.buyer_item && sale.buyer_item.length > 0) {
    total += sale.buyer_item.reduce((sum: number, item: any) => sum + (item.price || 0) * item.quantity, 0);
  }
  
  // Add delivery fee if applicable
  if (sale.delivery_fee) {
    total += sale.delivery_fee;
  }
  
  return total;
};

// Helper function to get branch name
const getBranchName = (branchId: string, branches: any[]): string => {
  const branch = branches.find(b => b._id === branchId);
  return branch ? branch.name : 'Unknown Branch';
};

export default function AccountingDashboard() {
  const [selectedReceipts, setSelectedReceipts] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedSalesType, setSelectedSalesType] = useState<'sale' | 'swap' | ''>('');
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<'Bank Transfer' | 'POS' | 'cash' | ''>('');
  
  // API hooks
  const { branches, loading: branchesLoading } = useBranches();
  const { 
    sales, 
    loading: salesLoading, 
    error: salesError, 
    pagination, 
    refetch: refetchSales,
    clearError: clearSalesError 
  } = useProductSales({
    page: currentPage,
    limit: 10,
    search: searchTerm || undefined,
    branch: selectedBranch || undefined,
    sales_type: selectedSalesType || undefined,
    payment_mode: selectedPaymentMode || undefined
  });

  // Handle search with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle filter changes
  const handleFilterChange = (filterType: string, value: string) => {
    switch (filterType) {
      case 'branch':
        setSelectedBranch(value);
        break;
      case 'sales_type':
        setSelectedSalesType(value as 'sale' | 'swap' | '');
        break;
      case 'payment_mode':
        setSelectedPaymentMode(value as 'Bank Transfer' | 'POS' | 'cash' | '');
        break;
    }
    setCurrentPage(1); // Reset to first page when filtering
  };

  const toggleReceipt = (id: string) => {
    setSelectedReceipts(prev => 
      prev.includes(id) 
        ? prev.filter(receiptId => receiptId !== id)
        : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelectedReceipts(prev => 
      prev.length === sales.length ? [] : sales.map(s => s._id || '')
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Accounting Dashboard</h1>
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
            placeholder="Search by customer name, phone, or receipt"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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

      {/* Error Messages */}
      {salesError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <div className="flex-1">
              <p className="text-red-800 font-medium">Error Loading Sales Data</p>
              <p className="text-red-600 text-sm">{salesError}</p>
            </div>
            <button
              onClick={clearSalesError}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Products Section */}
      <div className="bg-white rounded-lg shadow-sm">
        {/* Products Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Products</h2>
          
          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/accounting/sales/new-receipt"
              className="bg-[#FBB906] hover:bg-yellow-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              New Receipt
            </Link>
            
            {/* Branch Filter */}
            <select
              value={selectedBranch}
              onChange={(e) => handleFilterChange('branch', e.target.value)}
              className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#E866B7]"
              disabled={branchesLoading}
            >
              <option value="">All Branches</option>
              {branches.map((branch: any) => (
                <option key={branch._id} value={branch._id}>
                  {branch.name}
                </option>
              ))}
            </select>

            {/* Sales Type Filter */}
            <select
              value={selectedSalesType}
              onChange={(e) => handleFilterChange('sales_type', e.target.value)}
              className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#E866B7]"
            >
              <option value="">All Types</option>
              <option value="sale">Sale</option>
              <option value="swap">Swap</option>
            </select>

            {/* Payment Mode Filter */}
            <select
              value={selectedPaymentMode}
              onChange={(e) => handleFilterChange('payment_mode', e.target.value)}
              className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#E866B7]"
            >
              <option value="">All Payment Modes</option>
              <option value="cash">Cash</option>
              <option value="POS">POS</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>

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
                    checked={selectedReceipts.length === sales.length && sales.length > 0}
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
              {salesLoading ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-gray-400 mr-2" />
                      <span className="text-gray-600">Loading sales data...</span>
                    </div>
                  </td>
                </tr>
              ) : sales.length > 0 ? (
                sales.map((sale, index) => {
                  const saleAmount = calculateSaleAmount(sale);
                  const branchName = getBranchName(sale.branch, branches);
                  const saleDate = sale.createdAt ? new Date(sale.createdAt).toLocaleDateString() : 'N/A';
                  
                  return (
                    <tr key={sale._id} className={`border-b hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                  <td className="p-4">
                    <input
                      type="checkbox"
                          checked={selectedReceipts.includes(sale._id || '')}
                          onChange={() => toggleReceipt(sale._id || '')}
                      className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                    />
                  </td>
                      <td className="p-4 text-xs text-gray-900">{saleDate}</td>
                      <td className="p-4 text-xs text-gray-900">{sale.payment_mode}</td>
                      <td className="p-4 text-xs text-gray-900">{sale.reference || 'N/A'}</td>
                  <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${
                          sale.delivery_status === 'Delivered' ? 'text-green-700 bg-green-100' :
                          sale.delivery_status === 'In Transit' ? 'text-yellow-700 bg-yellow-100' :
                          sale.delivery_status === 'Pending' ? 'text-orange-700 bg-orange-100' :
                          'text-red-700 bg-red-100'
                        }`}>
                          {sale.delivery_status || 'Pending'}
                    </span>
                      </td>
                      <td className="p-4 text-xs text-gray-900">{sale.customer_name}</td>
                      <td className="p-4 text-xs text-gray-900">{branchName}</td>
                      <td className="p-4 text-xs text-gray-900">₦{saleAmount.toLocaleString()}</td>
                      <td className="p-4 text-xs text-gray-900">{sale.sales_type}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-gray-500">
                    No sales found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 border-t">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1 || salesLoading}
              className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>
          
          <span className="text-sm text-gray-700">
              Page {pagination.current_page} of {pagination.total_pages} ({pagination.total_items} total items)
          </span>
          
            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= pagination.total_pages || salesLoading}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        )}
      </div>
    </div>
  );
}