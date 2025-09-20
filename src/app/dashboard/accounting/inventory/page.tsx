'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { Search, Download, ChevronDown, Filter, Plus, Loader2, AlertCircle } from 'lucide-react';
import { useProducts, useInventoryAnalytics, useInventoryUtils } from '../../../../hooks/useInventory';
import { branchesApi } from '../../../../api/branchesApi';
import ProtectedRoute from '../../../../components/ProtectedRoute';

const AccountingInventoryPage = () => {
  const [selectedLocation, setSelectedLocation] = useState('All Branches');
  const [locationOpen, setLocationOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [branches, setBranches] = useState<any[]>([]);
  const [branchesLoading, setBranchesLoading] = useState(false);

  // Utility functions
  const { formatPrice, getStockStatus, getTotalQuantity, getBranchQuantity } = useInventoryUtils();

  // Fetch branches
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setBranchesLoading(true);
        const response = await branchesApi.getBranches();
        if (response.data && response.data.branches) {
          setBranches(response.data.branches);
        }
      } catch (error) {
        console.error('Error fetching branches:', error);
      } finally {
        setBranchesLoading(false);
      }
    };

    fetchBranches();
  }, []);

  // Fetch products with filtering
  const { 
    products, 
    loading: productsLoading, 
    error: productsError, 
    pagination,
    refetch: refetchProducts 
  } = useProducts({
    branch: selectedLocation !== 'All Branches' ? selectedLocation : undefined,
    search: searchTerm || undefined,
    page: currentPage,
    limit: 10
  });

  // Fetch inventory analytics
  const { 
    analytics, 
    loading: analyticsLoading, 
    error: analyticsError 
  } = useInventoryAnalytics({
    branch: selectedLocation !== 'All Branches' ? selectedLocation : undefined
  });

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Handle location change
  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
    setLocationOpen(false);
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const LocationDropdown = () => (
    <div className="relative">
      <button
        onClick={() => setLocationOpen(!locationOpen)}
        className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 hover:border-gray-300 transition-colors"
        disabled={branchesLoading}
      >
        <span className="text-sm text-gray-600">Location:</span>
        <span className="text-sm text-amber-500 font-medium">{selectedLocation}</span>
        <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${locationOpen ? 'rotate-180' : ''}`} />
        {branchesLoading && <Loader2 className="w-3 h-3 animate-spin" />}
      </button>
      {locationOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-full">
          <button
            onClick={() => handleLocationChange('All Branches')}
            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg"
          >
            All Branches
          </button>
          {branches.map((branch) => (
            <button
              key={branch._id}
              onClick={() => handleLocationChange(branch.name)}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 last:rounded-b-lg"
            >
              {branch.name}
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
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4 gap-4">
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Accounting dashboard</h1>
            <p className="text-gray-600 text-sm">Monitor all financial activities, revenue, expenses, and invoices.</p>
          </div>
          <div className="text-sm text-gray-500 text-left lg:text-right">
            Last Update: Current date and time
          </div>
        </div>

        {/* Search and controls */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10 text-gray-900 text-sm pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-white"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">⌘ K</span>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <LocationDropdown />
            <button className="flex text-black text-sm items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              Download report
            </button>
          </div>
        </div>
      </div>

      {/* Overall Inventory Section */}
      <div className="mb-8">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
          <h2 className="text-lg text-gray-900 font-semibold mb-4">Overall Inventory</h2>
          {analyticsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#E866B7]" />
                <p className="text-gray-600">Loading inventory analytics...</p>
              </div>
            </div>
          ) : analyticsError ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center text-red-500">
                <AlertCircle className="w-8 h-8 mx-auto mb-4" />
                <p>Error loading analytics: {analyticsError}</p>
              </div>
            </div>
          ) : analytics ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8">
              {/* Sales Overview */}
              <div className="text-center sm:text-left">
                <h3 className="text-blue-600 text-sm font-medium mb-2">Sales Overview</h3>
                <p className="text-lg text-gray-900 mb-1">{analytics.salesOverview.onlineSalesRep + analytics.salesOverview.walkInCustomers}</p>
                <p className="text-xs text-gray-500">Total Sales</p>
              </div>
              
              {/* Total Stock */}
              <div className="text-center sm:text-left">
                <h3 className="text-orange-500 text-sm font-medium mb-2">Total Stock</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4">
                  <p className="text-lg text-gray-900">{analytics.inventory.totalStock}</p>
                  <p className="text-lg text-gray-900">{formatPrice(analytics.inventory.totalStockValue)}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4">
                  <p className="text-xs text-gray-500">Items</p>
                  <p className="text-xs text-gray-400">Total Value</p>
                </div>
              </div>
              
              {/* Stock Purchased */}
              <div className="text-center sm:text-left">
                <h3 className="text-purple-600 text-sm font-medium mb-2">Stock Purchased</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4">
                  <p className="text-lg text-gray-900">{analytics.totalStockPurchased}</p>
                  <p className="text-lg text-gray-600">{analytics.period.month}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4">
                  <p className="text-xs text-gray-500">Items</p>
                  <p className="text-xs text-gray-400">Period</p>
                </div>
              </div>
              
              {/* Low Stock Alert */}
              <div className="text-center sm:text-left">
                <h3 className="text-red-500 text-sm font-medium mb-2">Low Stock Alert</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4">
                  <p className="text-lg text-gray-900">{analytics.inventory.lowStockAlert.count}</p>
                  <p className="text-lg text-gray-600">{analytics.unpaidItems.sales.count}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4">
                  <p className="text-xs text-gray-500">Low Stock</p>
                  <p className="text-xs text-gray-400">Unpaid Sales</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <div className="text-center text-gray-500">
                <p>No analytics data available</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Products Section */}
      <div className="bg-white rounded-lg shadow-sm">
        {/* Products Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center p-4 md:p-6 border-b border-gray-200 gap-4">
          <h2 className="text-xl text-gray-800 font-semibold">
            Products {pagination.total_items > 0 && `(${pagination.total_items})`}
          </h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link 
            href="/dashboard/accounting/inventory/add-product"
            className="bg-[#FBB906] hover:bg-yellow-400 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm">
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </Link>
            <div className="flex gap-3">
              <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm flex-1 sm:flex-none">
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
              <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm flex-1 sm:flex-none">
                Download all
              </button>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost price</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Selling price</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {productsLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin mr-2" />
                      <span className="text-gray-600">Loading products...</span>
                    </div>
                  </td>
                </tr>
              ) : productsError ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-red-600">
                    Error: {productsError}
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    {searchTerm ? `No products found for "${searchTerm}"` : 'No products available'}
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const stockStatus = getStockStatus(product);
                  const totalQuantity = getTotalQuantity(product);
                  
                  return (
                    <Link
                      key={product._id}
                      href={`/dashboard/accounting/inventory/inventory-details?id=${product._id}`}
                      className="table-row hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        <div>
                          <span className="text-blue-600 text-sm hover:text-blue-800 cursor-pointer font-medium">
                            {product.itemName}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">{product.imeiSku}</p>
                        </div>
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-xs text-gray-900">
                        {formatPrice(product.costPrice)}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-xs text-gray-900">
                        {formatPrice(product.sellingPrice)}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-xs">
                        <span className={totalQuantity === 0 ? 'text-red-600' : totalQuantity < 5 ? 'text-yellow-600' : 'text-gray-900'}>
                          {totalQuantity} {totalQuantity === 1 ? 'piece' : 'pieces'}
                        </span>
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-xs text-gray-900">
                        {product.category.name}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-xs">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color} ${stockStatus.bgColor}`}>
                          {stockStatus.status}
                        </span>
                      </td>
                    </Link>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.total_pages > 1 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 md:px-6 py-4 border-t border-gray-200 gap-4">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600 text-center">
              Page {pagination.current_page} of {pagination.total_pages}
              {pagination.total_items > 0 && ` (${pagination.total_items} items)`}
            </span>
            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.total_pages}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const AccountingInventory = () => {
  return (
    <ProtectedRoute requiredRoles={['Accounting', 'Super Admin', 'Admin']}>
      <AccountingInventoryPage />
    </ProtectedRoute>
  );
};

export default AccountingInventory;