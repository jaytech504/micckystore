'use client';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { Search, Download, Plus, Filter, User, X, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useCustomers } from '../../../../hooks/useCustomers';
import { CreateCustomerRequest } from '../../../../api/customersApi';

const AccountingDashboard = () => {
  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);
  const [customerType, setCustomerType] = useState('Business');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    email: '',
    contactNumber: '',
    type: 'Business'
  });

  // Use the customers hook
  const {
    customers,
    loading,
    error,
    searchLoading,
    createLoading,
    searchCustomers,
    createCustomer,
    clearError
  } = useCustomers();

  // Handle search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchCustomers(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchCustomers]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleAddCustomer = async () => {
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.contactNumber) {
      return;
    }

    const customerData: CreateCustomerRequest = {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phoneNumber: formData.contactNumber,
      address: formData.address,
      type: customerType.toLowerCase() as 'individual' | 'business'
    };

    const success = await createCustomer(customerData);
    
    if (success) {
      setShowNewCustomerModal(false);
      setFormData({
        firstName: '',
        lastName: '',
        address: '',
        email: '',
        contactNumber: '',
        type: 'Business'
      });
      setCustomerType('Business');
      
      // Show success message
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    }
  };

  const handleDiscard = () => {
    setShowNewCustomerModal(false);
    setFormData({
      firstName: '',
      lastName: '',
      address: '',
      email: '',
      contactNumber: '',
      type: 'Business'
    });
    setCustomerType('Business');
    clearError();
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#E866B7]" />
          <p className="text-gray-600">Loading customers...</p>
        </div>
      </div>
    );
  }

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

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <div className="flex-1">
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
            <button
              onClick={clearError}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            <p className="text-green-800 font-medium">Customer added successfully!</p>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        {/* Search */}
        <div className="relative w-full sm:flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-900 w-4 h-4" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-16 py-2.5 text-black border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E866B7] focus:border-transparent"
          />
          {searchLoading && (
            <Loader2 className="absolute right-10 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
          )}
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

      {/* Customers Section */}
      <div className="bg-white rounded-lg shadow-sm">
        {/* Table Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <h2 className="text-lg font-medium text-gray-900">Customers</h2>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setShowNewCustomerModal(true)}
              className="bg-[#FBB906] text-white px-4 py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              New Customer
            </button>
            <button className="border border-gray-200 hover:bg-gray-50 px-4 py-2 text-gray-700 rounded-lg flex items-center gap-2 transition-colors">
              <Filter className="h-4 w-4" />
              Filters
            </button>
            <button className="border border-gray-200 hover:bg-gray-50 px-4 py-2 text-gray-700 rounded-lg flex items-center gap-2 transition-colors">
              Download all
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-8 p-4">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">First name</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Last name</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Address</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Email</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Contact number</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Type</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Paid</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Unpaid</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <User className="w-12 h-12 text-gray-300 mb-2" />
                      <p className="text-lg font-medium mb-1">No customers found</p>
                      <p className="text-sm">
                        {searchQuery ? 'Try adjusting your search terms' : 'Get started by adding your first customer'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                customers.map((customer) => {
                  // Split name into first and last name
                  const nameParts = customer.name.split(' ');
                  const firstName = nameParts[0] || '';
                  const lastName = nameParts.slice(1).join(' ') || '';
                  
                  return (
                    <Link
                      key={customer._id} 
                      href={`/dashboard/accounting/customers/customer-profile?id=${customer._id}`}
                      className="table-row border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4">
                        <input type="checkbox" className="rounded border-gray-300" />
                      </td>
                      <td className="p-4 text-blue-600 text-sm font-medium">{firstName}</td>
                      <td className="p-4 text-sm text-gray-900">{lastName}</td>
                      <td className="p-4 text-sm text-gray-900">{customer.address}</td>
                      <td className="p-4 text-sm text-gray-900">{customer.email}</td>
                      <td className="p-4 text-sm text-gray-900">{customer.phoneNumber}</td>
                      <td className="p-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          customer.type === 'business' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {customer.type.charAt(0).toUpperCase() + customer.type.slice(1)}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-teal-600 font-medium">
                        NGN 0 {/* This would come from customer analytics API */}
                      </td>
                      <td className="p-4 text-sm font-medium">
                        <span className="text-gray-900">
                          NGN 0 {/* This would come from customer analytics API */}
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-t border-gray-200">
          <button className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded mb-2 sm:mb-0 transition-colors">
            Previous
          </button>
          <span className="text-sm text-gray-600 mb-2 sm:mb-0">Page 1 of 10</span>
          <button className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded transition-colors">
            Next
          </button>
        </div>
      </div>

      {/* New Customer Modal */}
      {showNewCustomerModal && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900">New Customer</h3>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="First Name"
                    className="w-full px-3 py-2 text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Last Name"
                    className="w-full px-3 py-2 text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Address"
                    className="w-full px-3 py-2 text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email Address"
                    className="w-full px-3 py-2 text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    placeholder="Contact Number"
                    className="w-full px-3 py-2 text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setCustomerType('Business');
                        setFormData(prev => ({ ...prev, type: 'Business' }));
                      }}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        customerType === 'Business'
                          ? 'border-pink-500 bg-pink-50 text-pink-700'
                          : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Business
                    </button>
                    <button
                      onClick={() => {
                        setCustomerType('Individual');
                        setFormData(prev => ({ ...prev, type: 'Individual' }));
                      }}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        customerType === 'Individual'
                          ? 'border-pink-500 bg-pink-50 text-pink-700'
                          : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Individual
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={handleDiscard}
                disabled={createLoading}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Discard
              </button>
              <button
                onClick={handleAddCustomer}
                disabled={createLoading || !formData.firstName || !formData.lastName || !formData.email || !formData.contactNumber}
                className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {createLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  'Add Customer'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountingDashboard;