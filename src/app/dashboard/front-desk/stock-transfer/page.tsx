'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Plus, Download } from 'lucide-react';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function StockTransferForm() {
  const [deviceName, setDeviceName] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [fromBranch, setFromBranch] = useState('');
  const [toBranch, setToBranch] = useState('');
  const [transferReason, setTransferReason] = useState('');
  const [transferDate, setTransferDate] = useState('');
  const [approval, setApproval] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted');
  };

  const handleCancel = () => {
    // Handle cancel action
    console.log('Form cancelled');
  };

  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4 gap-4">
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Hello Chineye</h2>
            <p className="text-gray-600 text-sm">Monitor all sales, repairs, and orders.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <Link
            href="/dashboard/front-desk/new-reciept"
            className="bg-[#E866B7] text-white px-4 py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            New Reciept
          </Link>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2 text-sm">
            <Download className="h-4 w-4" />
            Download Report
          </button>
          </div>
        </div>

      </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-white rounded-lg border border-gray-200 p-4">
          {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <span>Inventory</span>
          <span>›</span>
          <span>Stock Transfer</span>
          <span>›</span>
          <span className="text-gray-900">New Transfer</span>
        </nav>

        {/* Page Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-4">New Stock Transfer</h3>
          {/* Item Info and IMEI Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 border-t border-gray-200">
            {/* Item Info */}
            <div className="p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Item Info</h4>
              <div>
                <label htmlFor="deviceName" className="block text-sm font-medium text-red-600 mb-2">
                  Device Name
                </label>
                <input
                  type="text"
                  id="deviceName"
                  value={deviceName}
                  onChange={(e) => setDeviceName(e.target.value)}
                  placeholder="Device Name"
                  className="w-full px-3 py-2 border text-gray-700 text-sm border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* IMEI */}
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Imei</h2>
              <div>
                <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Serial Number / IMEI (required)
                </label>
                <input
                  type="text"
                  id="serialNumber"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  placeholder="Serial Number / IMEI (required)"
                  required
                  className="w-full px-3 py-2 text-gray-700 text-sm border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Transfer Details */}
          <div className="bg-white border-t border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Transfer Details</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* From Branch */}
              <div>
                <label htmlFor="fromBranch" className="block text-sm font-medium text-gray-700 mb-2">
                  From Branch:
                </label>
                <div className="relative">
                  <select
                    id="fromBranch"
                    value={fromBranch}
                    onChange={(e) => setFromBranch(e.target.value)}
                    className="w-full px-3 py-2 text-gray-700 text-sm border border-gray-300 rounded-md shadow-sm bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="" className="text-gray-400">Select branch</option>
                    <option value="branch1">Lekki</option>
                    <option value="branch2">Gbagada</option>
                    <option value="branch3">Ikeja</option>
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* To Branch */}
              <div>
                <label htmlFor="toBranch" className="block text-sm font-medium text-gray-700 mb-2">
                  To Branch:
                </label>
                <div className="relative">
                  <select
                    id="toBranch"
                    value={toBranch}
                    onChange={(e) => setToBranch(e.target.value)}
                    className="w-full px-3 py-2 text-gray-700 text-sm border border-gray-300 rounded-md shadow-sm bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="" className="text-gray-400">Select branch</option>
                    <option value="branch1">Lekki</option>
                    <option value="branch2">Gbagada</option>
                    <option value="branch3">Ikeja</option>
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Reason for Transfer */}
              <div>
                <label htmlFor="transferReason" className="block text-sm font-medium text-red-600 mb-2">
                  Reason for Transfer
                </label>
                <div className="relative">
                  <textarea
                    id="transferReason"
                    value={transferReason}
                    onChange={(e) => setTransferReason(e.target.value)}
                    placeholder="State the issue of the device here"
                    rows={4}
                    className="w-full px-3 py-2 text-gray-700 text-sm border border-gray-300 rounded-md shadow-sm placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Date of Transfer Request */}
              <div>
                <label htmlFor="transferDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Transfer Request
                </label>
                <input
                  type="text"
                  id="transferDate"
                  value="Autofill (Following current date)"
                  readOnly
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Assignment and Approval */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Assignment */}
            <div className="bg-white border-t border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Assignment</h2>
              <div>
                <label htmlFor="transferInitiatedBy" className="block text-sm font-medium text-gray-700 mb-2">
                  Transfer Initiated By
                </label>
                <input
                  type="text"
                  id="transferInitiatedBy"
                  value="Auto-filled with current staff"
                  readOnly
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="border-t border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Approval</h2>
              <div>
                <label htmlFor="approval" className="block text-sm font-medium text-gray-700 mb-2">
                  Accountant Approval
                </label>
                <div className="relative">
                  <select
                    id="approval"
                    value={approval}
                    onChange={(e) => setApproval(e.target.value)}
                    className="w-full px-3 py-2 text-gray-700 text-sm border border-gray-300 rounded-md shadow-sm bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="" className="text-gray-400">Approval</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-start">
            <button
              type="submit"
              className="bg-[#E866B7] text-white px-4 py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              Submit Transfer Request
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}