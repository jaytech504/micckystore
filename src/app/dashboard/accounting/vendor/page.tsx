'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { Search, Download, Plus, Filter, User } from 'lucide-react';
import { useVendors } from '../../../../hooks/useVendors';

const VendorsDashboard = () => {
  const [showNewSupplierModal, setShowNewSupplierModal] = useState(false);
  const [supplierType, setSupplierType] = useState('Not taking return');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const [formData, setFormData] = useState({
    vendorName: '',
    product: '',
    quantity: '',
    buyingPrice: '',
    contactNumber: '',
    email: '',
    type: 'Not taking return'
  });

  // API hook for vendors
  const {
    data: vendors,
    loading: vendorsLoading,
    error: vendorsError,
    pagination,
    createVendor,
    refetch: refetchVendors
  } = useVendors({
    page: currentPage,
    limit: 10,
    search: searchTerm || undefined,
    type: selectedType || undefined
  });

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSupplier = async () => {
    try {
      const vendorData = {
        name: formData.vendorName,
        products: [formData.product], // Convert single product to array
        quantity: parseInt(formData.quantity) || 0,
        buying_price: parseFloat(formData.buyingPrice) || 0,
        phone_number: formData.contactNumber,
        email: formData.email,
        type: formData.type.toLowerCase().replace(' ', '_') as 'not taking return' | 'taking return'
      };
      
      await createVendor(vendorData);
      setShowNewSupplierModal(false);
      setFormData({
        vendorName: '',
        product: '',
        quantity: '',
        buyingPrice: '',
        contactNumber: '',
        email: '',
        type: 'Not taking return'
      });
    } catch (error) {
      console.error('Error creating vendor:', error);
      // You could add a toast notification here
    }
  };

  const handleDiscard = () => {
    setShowNewSupplierModal(false);
    setFormData({
      vendorName: '',
      product: '',
      quantity: '',
      buyingPrice: '',
      contactNumber: '',
      email: '',
      type: 'Not taking return'
    });
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
            placeholder="Search vendors..."
            value={searchTerm}
            onChange={handleSearchChange}
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

      {/* Vendors Section */}
      <div className="bg-white rounded-lg shadow-sm">
        {/* Table Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <h2 className="text-lg font-medium text-gray-900">Vendors</h2>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setShowNewSupplierModal(true)}
              className="bg-[#E866B7] text-white px-4 py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              Add Vendor
            </button>
            <button className="border border-gray-200 hover:bg-gray-50 px-3 py-2 text-gray-700 rounded-lg flex items-center gap-2 transition-colors">
              <Filter className="h-4 w-4" />
              Filters
            </button>
            <button className="border border-gray-200 hover:bg-gray-50 px-3 py-2 text-gray-700 rounded-lg flex items-center gap-2 transition-colors">
              Download all
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Vendor&apos;s Name</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Product</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Contact Number</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Email</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Type</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {vendorsLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    Loading vendors...
                  </td>
                </tr>
              ) : vendorsError ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-red-500">
                    Error loading vendors: {vendorsError}
                  </td>
                </tr>
              ) : vendors && vendors.length > 0 ? (
                vendors.map((vendor) => (
                  <tr key={vendor._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4 text-sm text-gray-900">{vendor.name}</td>
                    <td className="p-4 text-sm text-gray-900">
                      {vendor.products.length > 0 ? vendor.products.join(', ') : 'No products'}
                    </td>
                    <td className="p-4 text-sm text-gray-900">{vendor.phone_number}</td>
                    <td className="p-4 text-sm text-gray-900">{vendor.email}</td>
                    <td className="p-4 text-sm">
                      {vendor.type === 'taking return' && (
                        <span className="text-green-600 font-medium">Taking Return</span>
                      )}
                      {vendor.type === 'not taking return' && (
                        <span className="text-red-500 font-medium">Not Taking Return</span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-gray-900">{vendor.quantity}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No vendors found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-t border-gray-200">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded mb-2 sm:mb-0 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600 mb-2 sm:mb-0">
            Page {pagination?.current_page || 1} of {pagination?.total_pages || 1}
          </span>
          <button 
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={currentPage >= (pagination?.total_pages || 1)}
            className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      {/* New Supplier Modal */}
      {showNewSupplierModal && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900">New Supplier</h3>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Profile Picture Section */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center mb-2">
                  <User className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 mb-1">Drag image here</p>
                <p className="text-sm text-gray-500 mb-2">or</p>
                <button className="text-blue-600 text-sm hover:underline">Browse image</button>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vendor&apos;s Name</label>
                  <input
                    type="text"
                    name="vendorName"
                    value={formData.vendorName}
                    onChange={handleInputChange}
                    placeholder="Enter Vendor's name"
                    className="w-full px-3 py-2 text-gray-700 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                  <input
                    type="text"
                    name="product"
                    value={formData.product}
                    onChange={handleInputChange}
                    placeholder="Enter product"
                    className="w-full px-3 py-2 text-gray-700 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input
                    type="text"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="Quantity"
                    className="w-full px-3 py-2 text-gray-700 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Buying Price</label>
                  <input
                    type="text"
                    name="buyingPrice"
                    value={formData.buyingPrice}
                    onChange={handleInputChange}
                    placeholder="Enter buying price"
                    className="w-full px-3 py-2 text-gray-700 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    placeholder="Enter supplier contact number"
                    className="w-full px-3 py-2 text-gray-700 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter supplier email"
                    className="w-full px-3 py-2 text-gray-700 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        setSupplierType('Not taking return');
                        setFormData(prev => ({ ...prev, type: 'Not taking return' }));
                      }}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium text-left transition-colors ${
                        supplierType === 'Not taking return'
                          ? 'border-pink-500 bg-pink-50 text-pink-700'
                          : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Not taking return
                    </button>
                    <button
                      onClick={() => {
                        setSupplierType('Taking return');
                        setFormData(prev => ({ ...prev, type: 'Taking return' }));
                      }}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium text-left transition-colors ${
                        supplierType === 'Taking return'
                          ? 'border-pink-500 bg-pink-50 text-pink-700'
                          : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Taking return
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={handleDiscard}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Discard
              </button>
              <button
                onClick={handleAddSupplier}
                className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
              >
                Add Supplier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorsDashboard;