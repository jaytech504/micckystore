'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { Search, Plus, Download, AlertTriangle, Loader2 } from 'lucide-react';
import { useBranches } from '../../../../../hooks/useBranches';
import { superAdminProductsApi, Category } from '../../../../../api/superAdminProductsApi';
import { vendorsApi, Vendor } from '../../../../../api/vendorsApi';

const NewItemForm = () => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const { branches, loading: branchesLoading, error: branchesError } = useBranches();
  
  // Categories state
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  
  // Vendors state
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [vendorsLoading, setVendorsLoading] = useState(true);
  const [vendorsError, setVendorsError] = useState<string | null>(null);
  
  // Form submission state
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    itemName: '',
    category: '',
    quantity: '',
    imeiSku: [''],
    costPrice: '',
    sellingPrice: '',
    purchaseDescription: '',
    salesDescription: '',
    tax: '7.5% (Automated)',
    profit: '',
    supplier: '',
    selectedBranch: '',
    openingStock: '',
    closingStock: ''
  });

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        setCategoriesError(null);
        const response = await superAdminProductsApi.getCategories();
        if (response.data.categories) {
          setCategories(response.data.categories);
        }
      } catch (err: any) {
        console.error('Error fetching categories:', err);
        setCategoriesError(err.response?.data?.message || 'Failed to load categories');
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch vendors on component mount
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setVendorsLoading(true);
        setVendorsError(null);
        const response = await vendorsApi.getVendors();
        if (response.data.success && response.data.data) {
          setVendors(response.data.data);
        }
      } catch (err: any) {
        console.error('Error fetching vendors:', err);
        setVendorsError(err.response?.data?.message || 'Failed to load vendors');
      } finally {
        setVendorsLoading(false);
      }
    };

    fetchVendors();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    if (field === 'quantity') {
      const quantity = parseInt(value) || 0;
      const currentImeiCount = formData.imeiSku.length;
      
      if (quantity > currentImeiCount) {
        // Add new empty IMEI fields
        const newImeiFields = [...formData.imeiSku];
        for (let i = currentImeiCount; i < quantity; i++) {
          newImeiFields.push('');
        }
        setFormData(prev => ({ ...prev, [field]: value, imeiSku: newImeiFields }));
      } else if (quantity < currentImeiCount) {
        // Remove excess IMEI fields
        const newImeiFields = formData.imeiSku.slice(0, quantity);
        setFormData(prev => ({ ...prev, [field]: value, imeiSku: newImeiFields }));
      } else {
        setFormData(prev => ({ ...prev, [field]: value }));
      }
    } else {
    setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleImeiChange = (index: number, value: string) => {
    const newImeiFields = [...formData.imeiSku];
    newImeiFields[index] = value;
    setFormData(prev => ({ ...prev, imeiSku: newImeiFields }));
  };


  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const handleLeaveAndDiscard = () => {
    setFormData({
      itemName: '',
      category: '',
      quantity: '',
      imeiSku: [''],
      costPrice: '',
      sellingPrice: '',
      purchaseDescription: '',
      salesDescription: '',
      tax: '7.5% (Automated)',
      profit: '',
      supplier: '',
      selectedBranch: '',
      openingStock: '',
      closingStock: ''
    });
    setShowCancelModal(false);
  };

  const handleSave = async () => {
    try {
      setSaveLoading(true);
      setSaveError(null);
      setSaveSuccess(false);

      // Validate required fields
      if (!formData.itemName.trim()) {
        setSaveError('Item name is required');
        return;
      }
      if (!formData.category) {
        setSaveError('Category is required');
        return;
      }
      if (!formData.selectedBranch) {
        setSaveError('Branch selection is required');
        return;
      }
      if (!formData.costPrice) {
        setSaveError('Cost price is required');
        return;
      }
      if (!formData.supplier) {
        setSaveError('Supplier is required');
        return;
      }

      // Find selected category and vendor
      const selectedCategory = categories.find(cat => cat._id === formData.category);
      const selectedVendor = vendors.find(vendor => vendor.name === formData.supplier);

      // Calculate selling price
      const costPrice = parseFloat(formData.costPrice);
      const profit = parseFloat(formData.profit) || 0;
      const sellingPrice = costPrice + profit;

      // Build product data
      const productData = {
        itemName: formData.itemName,
        category: selectedCategory || { _id: formData.category, name: formData.category, description: '' },
        quantity: parseInt(formData.quantity) || 0,
        imeiSku: formData.imeiSku.join(', '),
        costPrice: costPrice,
        sellingPrice: sellingPrice,
        purchaseDescription: formData.purchaseDescription,
        sellingDescription: formData.salesDescription,
        tax: 7.5,
        profit: formData.profit,
        vendor: selectedVendor ? {
          _id: selectedVendor._id,
          name: selectedVendor.name,
          product: selectedVendor.products.join(', ') || '',
          phone_number: selectedVendor.phone_number || '',
          email: selectedVendor.email || '',
          type: selectedVendor.type || ''
        } : {
          _id: '',
          name: formData.supplier,
          product: '',
          phone_number: '',
          email: '',
          type: ''
        },
        stockLocation: [{
          branch: formData.selectedBranch,
          openingQuantity: parseInt(formData.openingStock) || 0,
          closingQuantity: parseInt(formData.closingStock) || 0
        }]
      };

      console.log('Creating product with data:', productData);

      const response = await superAdminProductsApi.createProduct(productData as any);
      
      if (response.data.product) {
        setSaveSuccess(true);
        
        // Reset form after successful creation
        setFormData({
          itemName: '',
          category: '',
          quantity: '',
          imeiSku: [''],
          costPrice: '',
          sellingPrice: '',
          purchaseDescription: '',
          salesDescription: '',
          tax: '7.5% (Automated)',
          profit: '',
          supplier: '',
          selectedBranch: '',
          openingStock: '',
          closingStock: ''
        });

        // Redirect to inventory page after 2 seconds
        setTimeout(() => {
          window.location.href = '/dashboard/accounting/inventory';
        }, 2000);
      }
    } catch (err: any) {
      console.error('Error creating product:', err);
      setSaveError(err.response?.data?.message || 'Failed to create product');
    } finally {
      setSaveLoading(false);
    }
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
      {/* Error Messages */}
      {saveError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
            <div className="flex-1">
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-600 text-sm">{saveError}</p>
            </div>
            <button
              onClick={() => setSaveError(null)}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Success Message */}
      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="w-5 h-5 text-green-500 mr-2">✓</div>
            <p className="text-green-800 font-medium">Product created successfully! Redirecting to inventory...</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="space-y-6">
        
        {/* Container 1: New Item */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">New Item</h2>
          
          {/* Two Column Layout - Left: Item Details, Right: Quantity & IMEI */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column: Item Details */}
            <div className="space-y-6">
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
                <label className="block text-sm font-medium text-red-600 mb-2">
                  Category*
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white"
                  disabled={categoriesLoading}
                >
                  <option value="">Select a category</option>
                  {categoriesLoading ? (
                    <option value="">Loading categories...</option>
                  ) : (
                    categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))
                  )}
                </select>
                {categoriesError && (
                  <p className="text-xs text-red-500 mt-1">Error loading categories: {categoriesError}</p>
                )}
              </div>
            </div>

            {/* Right Column: Quantity & IMEI Fields */}
            <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                  type="number"
                placeholder="Enter Quantity"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
                className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
            
              {/* Dynamic IMEI/SKU Fields */}
              {formData.quantity && parseInt(formData.quantity) > 0 && (
            <div>
              <label className="block text-sm font-medium text-red-600 mb-2">
                Imei/SKU*
              </label>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {formData.imeiSku.map((imei, index) => (
                      <div key={index}>
                        <input
                          type="text"
                          placeholder="Enter IMEI/SKU"
                          value={imei}
                          onChange={(e) => handleImeiChange(index, e.target.value)}
                          className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Container 2: Purchase Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Purchase Information</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Purchase Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Purchase Details</h3>
              
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profit NGN
                  </label>
                  <input
                    type="text"
                    placeholder="Type in the intended profit"
                    value={formData.profit}
                    onChange={(e) => handleInputChange('profit', e.target.value)}
                    className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
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
              </div>
            </div>

            {/* Sales Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Details</h3>
              
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
                    Supplier*
                  </label>
                  <select
                    value={formData.supplier}
                    onChange={(e) => handleInputChange('supplier', e.target.value)}
                    className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white"
                    disabled={vendorsLoading}
                  >
                    <option value="">Select a supplier</option>
                    {vendorsLoading ? (
                      <option value="">Loading suppliers...</option>
                    ) : (
                      vendors.map((vendor) => (
                        <option key={vendor._id} value={vendor.name}>
                          {vendor.name}
                        </option>
                      ))
                    )}
                  </select>
                  {vendorsError && (
                    <p className="text-xs text-red-500 mt-1">Error loading suppliers: {vendorsError}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-red-600 mb-2">
                    Sales Description*
                  </label>
                  <textarea
                    value={formData.salesDescription}
                    onChange={(e) => handleInputChange('salesDescription', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Container 3: Branch Information with Action Buttons */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Branch Information</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-red-600 mb-2">
                  Branch Location*
                </label>
                <select
                  value={formData.selectedBranch}
                  onChange={(e) => handleInputChange('selectedBranch', e.target.value)}
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white"
                disabled={branchesLoading}
                >
                  <option value="">Select Branch</option>
                {branchesLoading ? (
                  <option value="">Loading branches...</option>
                ) : (
                  branches.map((branch) => (
                    <option key={branch._id} value={branch._id}>
                      {branch.name}
                    </option>
                  ))
                )}
                </select>
              {branchesError && (
                <p className="text-xs text-red-500 mt-1">Error loading branches: {branchesError}</p>
              )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-red-600 mb-2">
                  Opening Stock*
                </label>
                <input
                  type="number"
                  placeholder="Enter opening stock quantity"
                  value={formData.openingStock}
                  onChange={(e) => handleInputChange('openingStock', e.target.value)}
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-red-600 mb-2">
                  Closing Stock Value*
                </label>
                <input
                  type="number"
                  placeholder="Enter closing stock quantity"
                  value={formData.closingStock}
                  onChange={(e) => handleInputChange('closingStock', e.target.value)}
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <button 
              onClick={handleSave}
              disabled={branchesLoading || categoriesLoading || vendorsLoading || saveLoading}
              className="bg-pink-500 hover:bg-pink-400 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saveLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : branchesLoading || categoriesLoading || vendorsLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading...
                </>
              ) : (
                'Save Item'
              )}
            </button>
            <button 
              onClick={handleCancel}
              disabled={saveLoading}
              className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-2 rounded-lg border border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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