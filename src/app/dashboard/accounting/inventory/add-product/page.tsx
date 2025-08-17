'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { Search, Plus, Download, AlertTriangle } from 'lucide-react';

const NewItemForm = () => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [formData, setFormData] = useState({
    itemName: '',
    category: 'Good deal /Brand New /Uk Used',
    quantity: '',
    imeiSku: '',
    costPrice: '',
    sellingPrice: '',
    purchaseDescription: '',
    salesDescription: '',
    tax: '7.5% (Automated)',
    profit: '',
    supplier: '',
    branches: {
      gbagada: { opening: '', closing: '' },
      ikeja: { opening: '', closing: '' },
      lekki: { opening: '', closing: '' }
    }
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBranchChange = (branch: 'gbagada' | 'ikeja' | 'lekki', type: 'opening' | 'closing', value: string) => {
  setFormData(prev => ({
    ...prev,
    branches: {
      ...prev.branches,
      [branch]: {
        ...prev.branches[branch],
        [type]: value
      }
    }
  }));
};

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const handleLeaveAndDiscard = () => {
    setFormData({
      itemName: '',
      category: 'Good deal /Brand New /Uk Used',
      quantity: '',
      imeiSku: '',
      costPrice: '',
      sellingPrice: '',
      purchaseDescription: '',
      salesDescription: '',
      tax: '7.5% (Automated)',
      profit: '',
      supplier: '',
      branches: {
        gbagada: { opening: '', closing: '' },
        ikeja: { opening: '', closing: '' },
        lekki: { opening: '', closing: '' }
      }
    });
    setShowCancelModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Transaction</h1>
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
      {/* Main Content */}
      <div className="space-y-6">
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">New Item</h2>
          {/* Basic Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-red-600 mb-2">
                Item Name*
              </label>
              <input
                type="text"
                placeholder="Enter item name"
                value={formData.itemName}
                onChange={(e) => handleInputChange('itemName', e.target.value)}
                className="w-full px-3 text-gray-900 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="text"
                placeholder="Enter Quantity"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
                className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
            
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-red-600 mb-2">
                Category*
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white"
              >
                <option>Good deal /Brand New /Uk Used</option>
                <option>Other Category</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-red-600 mb-2">
                Imei/SKU*
              </label>
              <textarea
                placeholder="535353535353, 756466465454, 657655655858, 6565363653653
                              566747675587587, 60996431379,"
                value={formData.imeiSku}
                onChange={(e) => handleInputChange('imeiSku', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Purchase and Sales Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Purchase Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Purchase Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-red-600 mb-2">
                    Cost price*
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 bg-gray-100 px-2 py-1 rounded text-sm">
                      NGN
                    </span>
                    <input
                      type="text"
                      value={formData.costPrice}
                      onChange={(e) => handleInputChange('costPrice', e.target.value)}
                      className="w-full pl-16 pr-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-red-600 mb-2">
                    Description*
                  </label>
                  <textarea
                    value={formData.purchaseDescription}
                    onChange={(e) => handleInputChange('purchaseDescription', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tax
                  </label>
                  <input
                    type="text"
                    value="Tax 7.5% (Automated)"
                    readOnly
                    className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profit NGN
                  </label>
                  <input
                    type="text"
                    placeholder="Type in the intend profit"
                    value={formData.profit}
                    onChange={(e) => handleInputChange('profit', e.target.value)}
                    className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Sales Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-red-600 mb-2">
                    Selling Price*
                  </label>
                  <input
                    type="text"
                    placeholder="Selling Price (Automated)"
                    readOnly
                    className="w-full px-3 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-red-600 mb-2">
                    Description*
                  </label>
                  <textarea
                    value={formData.salesDescription}
                    onChange={(e) => handleInputChange('salesDescription', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-red-600 mb-2">
                    Supplier*
                  </label>
                  <input
                    type="text"
                    value={formData.supplier}
                    onChange={(e) => handleInputChange('supplier', e.target.value)}
                    className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Branch Stock Information */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-4">Branch</h4>
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">Gbagada</div>
                  <div className="text-sm text-gray-600">Ikeja</div>
                  <div className="text-sm text-gray-600">Lekki</div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium text-gray-700">Opening stock</h4>
                  <button className="text-xs text-blue-500 hover:text-blue-600">Copy to all</button>
                </div>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={formData.branches.gbagada.opening}
                    onChange={(e) => handleBranchChange('gbagada', 'opening', e.target.value)}
                    className="w-full px-3 py-2 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    value={formData.branches.ikeja.opening}
                    onChange={(e) => handleBranchChange('ikeja', 'opening', e.target.value)}
                    className="w-full px-3 py-2 border text-gray-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    value={formData.branches.lekki.opening}
                    onChange={(e) => handleBranchChange('lekki', 'opening', e.target.value)}
                    className="w-full px-3 py-2 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium text-gray-700">Closing Stock Value</h4>
                  <button className="text-xs text-blue-500 hover:text-blue-600">Copy to all</button>
                </div>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={formData.branches.gbagada.closing}
                    onChange={(e) => handleBranchChange('gbagada', 'closing', e.target.value)}
                    className="w-full px-3 py-2 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    value={formData.branches.ikeja.closing}
                    onChange={(e) => handleBranchChange('ikeja', 'closing', e.target.value)}
                    className="w-full px-3 py-2 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    value={formData.branches.lekki.closing}
                    onChange={(e) => handleBranchChange('lekki', 'closing', e.target.value)}
                    className="w-full px-3 py-2 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <button className="bg-pink-500 hover:bg-pink-400 text-white px-6 py-2 rounded-lg transition-colors">
              Save
            </button>
            <button 
              onClick={handleCancel}
              className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-2 rounded-lg border border-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-opacity-10 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-700 rounded-lg max-w-md w-full p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-orange-500" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Leave without <span className="text-orange-500">saving</span>?
              </h3>
              
              <p className="text-gray-600 mb-6">
                If you leave, your unsaved changes will be discarded.
              </p>
              
              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Stay Here
                </button>
                <button
                  onClick={handleLeaveAndDiscard}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                >
                  Leave & Discard Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewItemForm;