'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { Search, Download, Plus, Filter, User, X } from 'lucide-react';

const AccountingDashboard = () => {
  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);
  const [customerType, setCustomerType] = useState('Business');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    email: '',
    contactNumber: '',
    type: 'Business'
  });

  // Sample customer data
  const customers = [
    { id: 1, firstName: 'First name', lastName: 'Last name', address: 'Home address', email: 'Email', contact: '09048142949', type: 'Business', paid: 'NGN2,000,000', unpaid: '00000' },
    { id: 2, firstName: 'First name', lastName: 'Last name', address: 'Home address', email: 'Email', contact: '09048142949', type: 'Business', paid: 'NGN2,000,000', unpaid: '00000' },
    { id: 3, firstName: 'First name', lastName: 'Last name', address: 'Home address', email: 'Email', contact: '09048142949', type: 'Business', paid: 'NGN2,000,000', unpaid: '00000' },
    { id: 4, firstName: 'First name', lastName: 'Last name', address: 'Home address', email: 'Email', contact: '09048142949', type: 'Business', paid: 'NGN2,000,000', unpaid: '00000' },
    { id: 5, firstName: 'First name', lastName: 'Last name', address: 'Home address', email: 'Email', contact: '09048142949', type: 'Business', paid: 'NGN2,000,000', unpaid: 'NGN200,000' },
    { id: 6, firstName: 'First name', lastName: 'Last name', address: 'Home address', email: 'Email', contact: '09048142949', type: 'Business', paid: 'NGN2,000,000', unpaid: 'NGN200,000' },
    { id: 7, firstName: 'First name', lastName: 'Last name', address: 'Home address', email: 'Email', contact: '09048142949', type: 'Business', paid: 'NGN2,000,000', unpaid: 'NGN200,000' },
    { id: 8, firstName: 'First name', lastName: 'Last name', address: 'Home address', email: 'Email', contact: '09048142949', type: 'Business', paid: 'NGN2,000,000', unpaid: '00000' },
    { id: 9, firstName: 'First name', lastName: 'Last name', address: 'Home address', email: 'Email', contact: '09048142949', type: 'Business', paid: 'NGN2,000,000', unpaid: 'NGN200,000' },
    { id: 10, firstName: 'First name', lastName: 'Last name', address: 'Home address', email: 'Email', contact: '09048142949', type: 'Business', paid: 'NGN2,000,000', unpaid: '00000' },
    { id: 11, firstName: 'First name', lastName: 'Last name', address: 'Home address', email: 'Email', contact: '09048142949', type: 'Business', paid: 'NGN200,000', unpaid: 'NGN200,000' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddCustomer = () => {
    console.log('Adding customer:', formData);
    setShowNewCustomerModal(false);
    setFormData({
      firstName: '',
      lastName: '',
      address: '',
      email: '',
      contactNumber: '',
      type: 'Business'
    });
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
              New Receipt
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
              {customers.map((customer, index) => (
                <Link
                 key={customer.id} 
                 href={`/dashboard/accounting/customers/customer-profile`}
                 className="table-row border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </td>
                  <td className="p-4 text-blue-600 text-sm">{customer.firstName}</td>
                  <td className="p-4 text-sm text-gray-900">{customer.lastName}</td>
                  <td className="p-4 text-sm text-gray-900">{customer.address}</td>
                  <td className="p-4 text-sm text-gray-900">{customer.email}</td>
                  <td className="p-4 text-sm text-gray-900">{customer.contact}</td>
                  <td className="p-4 text-sm text-gray-900">{customer.type}</td>
                  <td className="p-4 text-sm text-teal-600 font-medium">{customer.paid}</td>
                  <td className="p-4 text-sm font-medium">
                    <span className={customer.unpaid === '00000' ? 'text-gray-900' : 'text-red-500'}>
                      {customer.unpaid}
                    </span>
                  </td>
                </Link>
              ))}
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
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Discard
              </button>
              <button
                onClick={handleAddCustomer}
                className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
              >
                Add Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountingDashboard;