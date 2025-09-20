'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { Search, ChevronDown, Plus, MoreHorizontal, Printer, Save, FileText, Mail, UserPlus } from 'lucide-react';
import { useInvoices } from '../../../../../hooks/useInvoices';

export default function NewInvoice() {
  const [formData, setFormData] = useState({
    customerName: '',
    customerNumber: '',
    dateOfInvoice: new Date().toISOString().split('T')[0], // Current date
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
    branch: '',
    invoiceReceipt: `INV${Date.now().toString().slice(-6)}`, // Auto-generate receipt number
    invoiceType: 'sales' as 'sales' | 'repair' | 'service' | 'rental' | 'consultation',
    salesperson: '',
    deliveryFee: '0.00',
    paymentType: '' as 'pos' | 'cash' | 'bank transfer' | '',
    bank: '',
    reference: '',
    emailRecipient: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Invoice API hook
  const { createInvoice } = useInvoices();

  const [items, setItems] = useState([
    {
      id: 1,
      product_id: '',
      name: '',
      description: '',
      itemSku: '00000',
      quantity: 0,
      price: 0,
      discount: 0,
      tax: 0,
      totalAmount: 0
    }
  ]);

  const [customerNote, setCustomerNote] = useState('');

  // Calculate totals dynamically
  const subTotal = items.reduce((sum, item) => sum + (item.totalAmount || 0), 0);
  const deliveryFee = parseFloat(formData.deliveryFee.replace(/,/g, '')) || 0;
  const totalWithDelivery = subTotal + deliveryFee;

  const addNewItem = () => {
    const newItem = {
      id: items.length + 1,
      product_id: '',
      name: '',
      description: '',
      itemSku: '00000',
      quantity: 0,
      price: 0,
      discount: 0,
      tax: 0,
      totalAmount: 0
    };
    setItems([...items, newItem]);
  };

  const updateItem = (id: number, field: string, value: string | number) => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Recalculate total amount when quantity or price changes
        if (field === 'quantity' || field === 'price') {
          const quantity = field === 'quantity' ? Number(value) : updatedItem.quantity;
          const price = field === 'price' ? Number(value) : updatedItem.price;
          updatedItem.totalAmount = quantity * price - (updatedItem.discount || 0) + (updatedItem.tax || 0);
        }
        
        return updatedItem;
      }
      return item;
    });
    
    setItems(updatedItems);
  };

  // Form validation
  const validateForm = () => {
    const errors: string[] = [];
    
    if (!formData.customerName.trim()) errors.push('Customer name is required');
    if (!formData.customerNumber.trim()) errors.push('Customer number is required');
    if (!formData.branch.trim()) errors.push('Branch is required');
    if (!formData.salesperson.trim()) errors.push('Salesperson is required');
    if (!formData.paymentType) errors.push('Payment type is required');
    
    // Validate items
    const validItems = items.filter(item => item.product_id && item.quantity > 0);
    if (validItems.length === 0) errors.push('At least one item with product ID and quantity is required');
    
    return errors;
  };

  // Save invoice (create)
  const handleSaveInvoice = async () => {
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Prepare invoice data
      const invoiceData = {
        customer_name: formData.customerName,
        customer_number: formData.customerNumber,
        date_of_invoice: formData.dateOfInvoice,
        due_date: formData.dueDate,
        branch: formData.branch, // This should be branch ID in real implementation
        invoice_type: formData.invoiceType,
        invoice_items: items
          .filter(item => item.product_id && item.quantity > 0)
          .map(item => ({
            product_id: item.product_id,
            quantity: item.quantity
          })),
        customer_note: customerNote,
        sub_total: subTotal,
        delivery_fee: deliveryFee,
        payment_type: formData.paymentType as 'pos' | 'cash' | 'bank transfer',
        bank: formData.bank,
        reference: formData.reference,
        email_receipt: formData.emailRecipient ? [formData.emailRecipient] : [],
        sales_person: formData.salesperson // This should be salesperson ID in real implementation
      };

      const response = await createInvoice(invoiceData);
      setSuccess('Invoice created successfully!');
      
      // Reset form after successful creation
      setTimeout(() => {
        window.location.href = '/dashboard/accounting/transaction';
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  // Save as draft (you can modify status or add draft field)
  const handleSaveAsDraft = async () => {
    // For now, we'll save with unpaid status as "draft"
    await handleSaveInvoice();
  };

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6 sm:space-y-6">
      <div className="max-w-7xl mx-auto">
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
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2 text-sm">
              <Printer className="h-4 w-4" />
              Print Invoice
            </button>

            <Link
              href="/dashboard/accounting/transaction/new-invoice"
              className="bg-[#E866B7] text-white px-4 py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              New Invoice
            </Link>
          </div>
        </div>
            
        {/* Invoice Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          {/* Form Title */}
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">New Invoice</h2>
          
          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              {success}
            </div>
          )}
          
          {/* Customer Information Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer&apos;s Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter customer's name"
                  className="w-full pl-3 pr-10 py-2 text-gray-600 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E866B7] focus:border-transparent"
                  value={formData.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                />
                <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer&apos;s Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search customer's number"
                  className="w-full pl-3 pr-10 py-2 text-gray-600 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E866B7] focus:border-transparent"
                  value={formData.customerNumber}
                  onChange={(e) => handleInputChange('customerNumber', e.target.value)}
                />
                <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Date Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div>
              <label className="block text-sm font-medium text-red-600 mb-2">
                Date of Invoice
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.dateOfInvoice}
                  onChange={(e) => handleInputChange('dateOfInvoice', e.target.value)}
                  className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E866B7] focus:border-transparent pr-10"
                />
                <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  className="w-full px-3 text-gray-600 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E866B7] focus:border-transparent pr-10"
                />
                <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Branch and Invoice Type Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div>
              <label className="block text-sm font-medium text-red-600 mb-2">
                Branch
              </label>
              <div className="relative">
                <select 
                  className="w-full text-gray-600 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E866B7] focus:border-transparent appearance-none pr-10"
                  value={formData.branch}
                  onChange={(e) => handleInputChange('branch', e.target.value)}
                >
                  <option value="">Select Branch</option>
                  <option value="Gbagada">Gbagada</option>
                  <option value="Lagos">Lagos</option>
                  <option value="Abuja">Abuja</option>
                </select>
                <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invoice Type
              </label>
              <div className="relative">
                <select 
                  className="w-full text-gray-600 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E866B7] focus:border-transparent appearance-none pr-10"
                  value={formData.invoiceType}
                  onChange={(e) => handleInputChange('invoiceType', e.target.value)}
                >
                  <option value="sales">Sales</option>
                  <option value="repair">Repair</option>
                  <option value="service">Service</option>
                  <option value="rental">Rental</option>
                  <option value="consultation">Consultation</option>
                </select>
                <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Invoice Receipt and Salesperson Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invoice Receipt
              </label>
              <input
                type="text"
                value={formData.invoiceReceipt}
                className="w-full px-3 py-2 text-gray-600 bg-gray-100 border border-gray-300 rounded-lg"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salesperson
              </label>
              <div className="relative">
                <select 
                  className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E866B7] focus:border-transparent appearance-none pr-10"
                  value={formData.salesperson}
                  onChange={(e) => handleInputChange('salesperson', e.target.value)}
                >
                  <option value="">Select Salesperson</option>
                  <option value="Chineye">Chineye</option>
                  <option value="John">John</option>
                  <option value="Sarah">Sarah</option>
                </select>
                <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-4 sm:mb-6">
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left p-3 text-sm font-medium text-gray-700 w-80">Item Details</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-700">Product ID</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-700">Quantity</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-700">Price</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-700">Total Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={item.id} className="border-b border-gray-200">
                        <td className="p-3 border-r border-gray-200">
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 bg-gray-100 border-2 border-dashed border-gray-300 rounded flex items-center justify-center flex-shrink-0 mt-1">
                              <div className="w-6 h-4 bg-gray-300 rounded"></div>
                            </div>
                            <div className="flex-1 space-y-2">
                              {index === 0 ? (
                                <textarea
                                  placeholder="Type or click to select an Item"
                                  className="w-full text-gray-600 text-sm border border-gray-300 rounded p-2 h-10 resize-none"
                                  value={item.name}
                                  onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                                />
                              ) : (
                                <div>
                                  <span className='text-xs text-gray-700'>GREELION LEATHER CASE IP 15 PRO</span>
                                  <textarea
                                    placeholder="Add a description"
                                    className="w-full text-sm text-gray-600 border border-gray-300 bg-transparent p-0 h-10 resize-none focus:ring-0"
                                    value={item.description}
                                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-3 border-r border-gray-200">
                          <input
                            type="text"
                            placeholder="Product ID"
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            value={item.product_id}
                            onChange={(e) => updateItem(item.id, 'product_id', e.target.value)}
                          />
                        </td>
                        <td className="p-3 border-r border-gray-200">
                          <input
                            type="number"
                            placeholder="0"
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                          />
                        </td>
                        <td className="p-3 border-r border-gray-200">
                          <input
                            type="number"
                            placeholder="0.00"
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            value={item.price}
                            onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                          />
                        </td>
                        <td className="p-3 text-gray-600 text-sm font-medium">₦{item.totalAmount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card Layout */}
              <div className="lg:hidden space-y-4 p-4">
                {items.map((item, index) => (
                  <div key={item.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    {/* Item Details */}
                    <div className="mb-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 bg-gray-100 border-2 border-dashed border-gray-300 rounded flex items-center justify-center flex-shrink-0">
                          <div className="w-6 h-4 bg-gray-300 rounded"></div>
                        </div>
                        <div className="flex-1">
                          {index === 0 ? (
                            <textarea
                              placeholder="Type or click to select an Item"
                              className="w-full text-gray-600 text-sm border border-gray-300 rounded p-2 h-10 resize-none"
                              value={item.name}
                              onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                            />
                          ) : (
                            <div>
                              <span className='text-xs text-gray-700 block mb-1'>GREELION LEATHER CASE IP 15 PRO</span>
                              <textarea
                                placeholder="Add a description"
                                className="w-full text-sm text-gray-600 border border-gray-300 bg-transparent p-2 h-8 resize-none focus:ring-0"
                                value={item.description}
                                onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Item Details Grid */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500 font-medium">SKU:</span>
                        <div className="text-gray-700">{item.itemSku}</div>
                      </div>
                      <div>
                        <span className="text-gray-500 font-medium">Quantity:</span>
                        <div className="text-gray-700">{item.quantity}</div>
                      </div>
                      <div>
                        <span className="text-gray-500 font-medium">Price:</span>
                        <div className="text-gray-700">{item.price.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-gray-500 font-medium">Discount:</span>
                        <div className="text-gray-700">{item.discount.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-gray-500 font-medium">Tax:</span>
                        <div className="text-gray-700">{item.tax.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-gray-500 font-medium">Total:</span>
                        <div className="text-gray-700 font-semibold">{item.totalAmount.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={addNewItem}
              className="mt-4 w-full sm:w-auto px-4 py-2 bg-[#E866B7] text-white hover:bg-pink-600 transition-colors flex items-center justify-center gap-2 rounded-lg"
            >
              <Plus className="h-4 w-4" />
              Add Another Item
            </button>
          </div>

          {/* Customer Note */}
          <div className="mb-4 sm:mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add a note for your customer
            </label>
            <div className="relative">
              <textarea
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 resize-none"
                value={customerNote}
                onChange={(e) => setCustomerNote(e.target.value)}
              />
              <MoreHorizontal className="absolute bottom-3 right-3 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Bottom Section with Payment and Totals */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-4 sm:mb-6">
            {/* Left Side - Payment Details */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-red-600 mb-2">
                    Payment Status
                  </label>
                  <div className="relative">
                    <select 
                      className="w-full px-3 text-gray-600 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E866B7] focus:border-transparent appearance-none pr-10"
                      value={formData.paymentType}
                      onChange={(e) => handleInputChange('paymentType', e.target.value)}
                    >
                      <option value="">Choose the Payment Mode</option>
                      <option value="cash">Cash</option>
                      <option value="pos">POS</option>
                      <option value="bank transfer">Bank Transfer</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank
                  </label>
                  <input
                    type="text"
                    placeholder="Type the receiving Bank"
                    className="w-full px-3 py-2 border text-gray-600 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E866B7] focus:border-transparent"
                    value={formData.bank}
                    onChange={(e) => handleInputChange('bank', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reference
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border text-gray-600 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E866B7] focus:border-transparent"
                    value={formData.reference}
                    onChange={(e) => handleInputChange('reference', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <input
                    type="text"
                    placeholder="Any additional notes"
                    className="w-full px-3 py-2 border text-gray-600 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E866B7] focus:border-transparent"
                    value={formData.reference}
                    onChange={(e) => handleInputChange('reference', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Right Side - Totals */}
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Sub Total</span>
                <span className="text-sm text-gray-800 font-medium">₦{subTotal.toLocaleString()}</span>
              </div>
              <div className="text-xs text-gray-500 text-right">(Including Tax)</div>

              <div className="flex justify-between items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Delivery Fee</span>
                <input
                  type="text"
                  className="w-24 px-2 py-1 border text-gray-600 border-gray-300 rounded text-sm text-right"
                  value={formData.deliveryFee}
                  onChange={(e) => handleInputChange('deliveryFee', e.target.value)}
                />
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-800">Total (NGN)</span>
                  <span className="text-lg text-gray-800 font-semibold">₦{totalWithDelivery.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4 sm:mb-6">
            <button 
              onClick={handleSaveAsDraft}
              disabled={loading}
              className="px-6 py-2 bg-[#E866B7] text-white rounded-lg hover:bg-pink-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              {loading ? 'Saving...' : 'Save Invoice'}
            </button>
            <button 
              onClick={() => window.print()}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Generate PDF
            </button>
          </div>

          {/* Email Receipt Section */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Email receipt</h3>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <button className="text-orange-500 hover:text-orange-600 text-sm font-medium flex items-center gap-1">
                <UserPlus className="h-4 w-4" />
                Add New
              </button>
              <input
                type="email"
                placeholder="Enter email address"
                className="flex-1 px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E866B7] focus:border-transparent text-sm"
                value={formData.emailRecipient}
                onChange={(e) => handleInputChange('emailRecipient', e.target.value)}
              />
              <button 
                onClick={() => alert('Email functionality not implemented yet')}
                className="w-full sm:w-auto px-4 py-2 bg-[#E866B7] text-white rounded-lg hover:bg-pink-600 transition-colors text-sm flex items-center justify-center gap-2"
              >
                <Mail className="h-4 w-4" />
                Send to Email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}