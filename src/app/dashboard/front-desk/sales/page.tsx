'use client';

import Link from 'next/link';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Search, Download, Calendar, ChevronDown, Plus, Image as ImageIcon, MoreHorizontal } from 'lucide-react';
import { frontdeskApi } from '../../../../api/frontdeskApi';

interface Customer {
  id: string;
  name: string;
  email: string;
  initials: string;
  color: string;
}

interface ProductOption {
  id: string;
  name: string;
  costPrice?: number;
  stock?: number;
}

interface LineItem {
  id: string;
  description: string;
  imei: string;
  quantity: number;
  price: number;
  discount: number;
  tax: number;
  amount: number;
  productId?: string;
}

// API response shapes (best-effort)
interface CustomerApi {
  id?: string;
  name?: string;
  email?: string;
  loyaltyId?: string;
}

interface LoyaltyDiscountApi {
  id?: string;
  discount?: number;
}

interface ProductApi {
  id?: string;
  itemName?: string;
  costPrice?: number;
  stock?: number;
}

export default function NewSalesReceipt() {
  const [activeTab, setActiveTab] = useState<'sales' | 'swap'>('sales');
  const [customerName, setCustomerName] = useState('');
  const [customerNumber, setCustomerNumber] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [showProductDropdown, setShowProductDropdown] = useState<string | null>(null);
  const [date, setDate] = useState('17/03/2025');
  const [loyaltyId, setLoyaltyId] = useState('');
  const [branch, setBranch] = useState('Gbagada');
  const [salesReceipt, setSalesReceipt] = useState('S-R/709743');
  const [salesperson, setSalesperson] = useState('Chineye');
  
  const [lineItems, setLineItems] = useState<LineItem[]>([
    {
      id: '1',
      description: 'Type or click to select an Item',
      imei: '00000',
      quantity: 0,
      price: 0,
      discount: 0,
      tax: 0,
      amount: 0
    },
    {
      id: '2',
      description: 'GREELION LEATHER CASE IP 15 PRO',
      imei: '457647929382B',
      quantity: 4,
      price: 800000.00,
      discount: 300000,
      tax: 50000.00,
      amount: 1500000.00
    }
  ]);

  const [swapItems, setSwapItems] = useState<LineItem[]>([
    {
      id: '1',
      description: 'Seller\'s Item',
      imei: '00000',
      quantity: 0,
      price: 0,
      discount: 0,
      tax: 0,
      amount: 0
    },
    {
      id: '2',
      description: 'Buyer\'s Item',
      imei: '00000',
      quantity: 0,
      price: 0,
      discount: 0,
      tax: 0,
      amount: 0
    }
  ]);

  const [loyaltyDiscount, setLoyaltyDiscount] = useState<number>(0);
  const [deliveryFee, setDeliveryFee] = useState(5000.00);
  const [customerNote, setCustomerNote] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  const [bank, setBank] = useState('');
  const [reference, setReference] = useState('');
  const [branchSold, setBranchSold] = useState('');

  // API-driven state
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customersLoading, setCustomersLoading] = useState(false);

  const [products, setProducts] = useState<ProductOption[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const normalizeArray = useCallback(function normalizeArray<T>(payload: unknown): T[] {
    if (Array.isArray(payload)) return payload as T[];
    if (payload && typeof payload === 'object' && Array.isArray((payload as { data?: unknown[] }).data)) {
      return ((payload as { data?: unknown[] }).data || []) as T[];
    }
    return [] as T[];
  }, []);

  const fetchCustomers = useCallback(async (query: string) => {
    try {
      setCustomersLoading(true);
      const res = await frontdeskApi.getCustomers({ search: query, limit: 10 });
      const arr = normalizeArray<CustomerApi>(res.data);
      const mapped: Customer[] = arr.map((c, idx) => ({
        id: c.id || String(idx),
        name: c.name || 'Unknown',
        email: c.email || '',
        initials: (c.name || 'U').charAt(0).toUpperCase(),
        color: 'bg-orange-400',
      }));
      setCustomers(mapped);
    } catch {
      setCustomers([]);
    } finally {
      setCustomersLoading(false);
    }
  }, [normalizeArray]);

  const fetchProducts = useCallback(async (params: { itemName?: string; costPrice?: number }) => {
    try {
      setProductsLoading(true);
      const res = await frontdeskApi.getProducts(params);
      const arr = normalizeArray<ProductApi>(res.data);
      const mapped: ProductOption[] = arr.map((p, idx) => ({
        id: p.id || String(idx),
        name: p.itemName || 'Product',
        costPrice: p.costPrice ?? 0,
        stock: p.stock ?? 0,
      }));
      setProducts(mapped);
    } catch {
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  }, [normalizeArray]);

  useEffect(() => {
    fetchCustomers('');
    fetchProducts({});
  }, [fetchCustomers, fetchProducts]);

  const handleCustomerSelect = async (customer: Customer) => {
    setCustomerName(customer.name);
    setShowCustomerDropdown(false);

    try {
      const res = await frontdeskApi.getLoyaltyDiscountById(customer.id);
      const data = (res.data || {}) as LoyaltyDiscountApi;
      setLoyaltyId(data.id || '');
      setLoyaltyDiscount(Number(data.discount || 0));
    } catch {
      setLoyaltyId('');
      setLoyaltyDiscount(0);
    }
  };

  const addNewItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: activeTab === 'sales' ? 'Type or click to select an Item' : (lineItems.length % 2 === 0 ? 'Seller\'s Item' : 'Buyer\'s Item'),
      imei: '00000',
      quantity: 0,
      price: 0,
      discount: 0,
      tax: 0,
      amount: 0
    };
    
    if (activeTab === 'sales') {
      setLineItems([...lineItems, newItem]);
    } else {
      setSwapItems([...swapItems, newItem]);
    }
  };

  const currentItems = useMemo(() => (activeTab === 'sales' ? lineItems : swapItems), [activeTab, lineItems, swapItems]);

  const handleCustomerNameChange = (value: string) => {
    setCustomerName(value);
    setShowCustomerDropdown(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchCustomers(value);
    }, 300);
  };

  const handleSelectProductForItem = (lineId: string, product: ProductOption) => {
    const update = (items: LineItem[]): LineItem[] =>
      items.map((li) =>
        li.id === lineId
          ? {
              ...li,
              productId: product.id,
              description: product.name,
              price: Number(product.costPrice || 0),
              amount: Number(product.costPrice || 0) * (li.quantity || 0),
            }
          : li
      );

    if (activeTab === 'sales') setLineItems(update);
    else setSwapItems(update);

    setShowProductDropdown(null);
  };

  const subTotal = useMemo(() => {
    const items = activeTab === 'sales' ? lineItems : swapItems;
    return items.reduce((sum, li) => sum + (li.amount || 0), 0);
  }, [activeTab, lineItems, swapItems]);

  const total = useMemo(() => {
    return Math.max(0, subTotal - loyaltyDiscount) + (deliveryFee || 0);
  }, [subTotal, loyaltyDiscount, deliveryFee]);

  const handleSubmit = async () => {
    const emailReceipt: string[] = [];

    const mapItemsToPayload = (items: LineItem) => ({
      product_id: items.productId || '',
      quantity: items.quantity || 0,
    });

    const payload: Record<string, unknown> = {
      customer_name: customerName,
      customer_phone_number: customerNumber,
      customer_address: '',
      loyalty_id: loyaltyId || undefined,
      branch: branchSold || branch,
      sales_type: activeTab === 'swap' ? 'swap' : 'sales',
      seller_item:
        activeTab === 'swap'
          ? swapItems.slice(0, 1).map(mapItemsToPayload)
          : lineItems.map(mapItemsToPayload),
      buyer_item:
        activeTab === 'swap' ? swapItems.slice(1, 2).map(mapItemsToPayload) : [],
      customer_note: customerNote,
      delivery_fee: deliveryFee,
      payment_mode: paymentMode || undefined,
      bank: bank || undefined,
      reference: reference || undefined,
      email_receipt: emailReceipt,
      points: 0,
      delivery_status: undefined,
    };

    try {
      const res = await frontdeskApi.createProductSale(payload);
      if (res.status >= 200 && res.status < 300) {
        alert('Sale saved successfully');
      } else {
        alert('Failed to save sale');
      }
    } catch {
      alert('Failed to save sale');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4 gap-4">
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Hello Chineye</h2>
            <p className="text-gray-600 text-sm">Monitor all sales, repairs, and orders.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <Link
            href="/dashboard/front-desk/sales"
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

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Form Header */}
        <h3 className="text-lg font-semibold text-gray-900 mb-6">New Sales Receipt</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Customer Name */}
            <div className="relative">
              <label className="block text-sm font-medium text-red-600 mb-2">Customer&apos;s Name</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter customer's name"
                  value={customerName}
                  onChange={(e) => handleCustomerNameChange(e.target.value)}
                  onFocus={() => setShowCustomerDropdown(true)}
                  onBlur={() => setTimeout(() => setShowCustomerDropdown(false), 200)}
                  className="w-full px-3 py-2 text-gray-800 text-sm pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                
                {showCustomerDropdown && (
                  <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                    {(customersLoading ? [] : customers).map((customer, index) => (
                      <div
                        key={customer.id}
                        onClick={() => handleCustomerSelect(customer)}
                        className={`flex items-center gap-3 p-3 text-black hover:bg-orange-400 hover:text-white cursor-pointer ${
                          index === 0 ? 'bg-orange-400 text-white' : ''
                        }`}
                      >
                        <div className={`w-8 h-8 ${customer.color} rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
                          {customer.initials}
                        </div>
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm opacity-75">{customer.email}</div>
                        </div>
                      </div>
                    ))}
                    <div className="p-3 border-t border-gray-200">
                      <button className="text-orange-500 text-sm font-medium flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        New Customer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Date of Receipt */}
            <div>
              <label className="block text-sm font-medium text-red-600 mb-2">Date of receipt</label>
              <div className="relative">
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 text-gray-800 text-sm pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>

            {/* Branch */}
            <div>
              <label className="block text-sm font-medium text-red-600 mb-2">Branch</label>
              <div className="relative">
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border text-gray-800 text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent appearance-none"
                >
                  <option value="Gbagada">Gbagada</option>
                  <option value="Lekki">Lekki</option>
                  <option value="Ikeja">Ikeja</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Customer Number */}
            <div>
              <label className="block text-sm font-medium text-red-600 mb-2">Customer&apos;s Number</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search customer's number"
                  value={customerNumber}
                  onChange={(e) => setCustomerNumber(e.target.value)}
                  className="w-full px-3 py-2 text-gray-800 text-sm pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>

            {/* Loyalty ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loyalty ID</label>
              <input
                type="text"
                value={loyaltyId}
                onChange={(e) => setLoyaltyId(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 text-orange-500 font-medium"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Sales Receipt and Salesperson */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sales Receipt</label>
            <input
              type="text"
              value={salesReceipt}
              onChange={(e) => setSalesReceipt(e.target.value)}
              className="w-full px-3 py-2 text-gray-800 text-sm border border-gray-300 rounded-lg bg-gray-50"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Salesperson</label>
            <div className="relative">
              <select
                value={salesperson}
                onChange={(e) => setSalesperson(e.target.value)}
                className="w-full px-3 py-2 text-gray-800 text-sm pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent appearance-none"
              >
                <option value="Chineye">Chineye</option>
                <option value="Dennis">Dennis</option>
                <option value="Michael">Michael</option>
                <option value="Margret">Margret</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('sales')}
            className={`px-4 py-2 font-medium text-sm border-b-2 ${
              activeTab === 'sales'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Sales
          </button>
          <button
            onClick={() => setActiveTab('swap')}
            className={`px-4 py-2 font-medium text-sm border-b-2 ${
              activeTab === 'swap'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Swap deal
          </button>
        </div>

        {/* Item Table */}
        <div className="mb-8">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-3 text-sm font-medium border-r border-gray-200 text-gray-700 min-w-[200px]">Item Details</th>
                  <th className="text-left p-3 text-sm font-medium border-r border-gray-200 text-gray-700 min-w-[100px]">Imei/Sku</th>
                  <th className="text-left p-3 text-sm font-medium border-r border-gray-200 text-gray-700 min-w-[80px]">Quantity</th>
                  <th className="text-left p-3 text-sm font-medium border-r border-gray-200 text-gray-700 min-w-[100px]">Price</th>
                  <th className="text-left p-3 text-sm font-medium border-r border-gray-200 text-gray-700 min-w-[100px]">Discount</th>
                  <th className="text-left p-3 text-sm font-medium border-r border-gray-200 text-gray-700 min-w-[80px]">Tax</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700 min-w-[120px]">{activeTab === 'sales' ? 'Total Amount' : 'Amount'}</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item) => (
                  <React.Fragment key={item.id}>
                    <tr className="border-b">
                      <td className="p-3 border-r border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                            <ImageIcon className="h-6 w-6 text-gray-400" />
                          </div>
                          {item.description === 'Type or click to select an Item' ? (
                            <button
                              onClick={async () => {
                                setShowProductDropdown(item.id);
                                if (!products.length) await fetchProducts({});
                              }}
                              className="flex-1 text-left px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 text-gray-500"
                            >
                              {item.description}
                            </button>
                          ) : (
                            <div className="flex-1">
                              <div className="font-medium text-sm text-gray-900">{item.description}</div>
                              <textarea
                                placeholder="Add a description"
                                className="w-full mt-2 px-3 py-2 text-gray-600 border border-gray-300 rounded resize-none"
                                rows={2}
                              />
                              <button className="mt-2 p-1">
                                <MoreHorizontal className="h-4 w-4 text-gray-400" />
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-gray-700 border-r border-gray-200">
                        <input type="text" value={item.imei} className="w-full px-2 py-1 border border-gray-300 rounded text-center" />
                      </td>
                      <td className="p-3 text-gray-700 border-r border-gray-200">
                        <input type="number" value={item.quantity} className="w-full px-2 py-1 border border-gray-300 rounded text-center" />
                      </td>
                      <td className="p-3 text-gray-700 border-r border-gray-200">
                        <input type="text" value={item.price.toLocaleString()} className="w-full px-2 py-1 border border-gray-300 rounded text-center" />
                      </td>
                      <td className="p-3 text-gray-700 border-r border-gray-200">
                        <input type="text" value={item.discount.toLocaleString()} className="w-full px-2 py-1 border border-gray-300 rounded text-center" />
                      </td>
                      <td className="p-3 text-gray-700 border-r border-gray-200">
                        <input type="text" value={item.tax.toLocaleString()} className="w-full px-2 py-1 border border-gray-300 rounded text-center" />
                      </td>
                      <td className="p-3 text-gray-700">
                        <input type="text" value={item.amount.toLocaleString()} className="w-full px-2 py-1 border border-gray-300 rounded text-center" />
                      </td>
                    </tr>

                    {/* Product Selection Dropdown */}
                    {showProductDropdown === item.id && (
                      <tr>
                        <td colSpan={7} className="p-0">
                          <div className="bg-white border border-gray-300 rounded-lg shadow-lg mx-3 mb-3">
                            {(productsLoading ? [] : products).map((product, productIndex) => (
                              <div
                                key={product.id}
                                onClick={() => handleSelectProductForItem(item.id, product)}
                                className={`flex justify-between items-center p-3 hover:bg-gray-50 cursor-pointer ${
                                  productIndex === 0 ? 'bg-yellow-400 text-white' : ''
                                } ${productIndex < products.length - 1 ? 'border-b border-gray-200' : ''}`}
                              >
                                <div>
                                  <div className="font-medium text-sm text-gray-600">{product.name}</div>
                                  <div className="text-sm text-gray-600">Price: {(product.costPrice || 0).toLocaleString()}</div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm text-gray-600">Available Stock</div>
                                  <div className={`text-sm font-medium ${(product.stock || 0) > 3 ? 'text-green-600' : 'text-red-600'}`}>
                                    {product.stock || 0} pcs
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={addNewItem}
            className="flex items-center gap-2 bg-[#E866B7] hover:bg-pink-400 text-white px-4 py-2 rounded-lg mt-4 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add New Row
          </button>
        </div>

        {/* Customer Notes */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">Add a note for your customer</label>
          <div className="relative">
            <textarea
              value={customerNote}
              onChange={(e) => setCustomerNote(e.target.value)}
              className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              rows={4}
              placeholder="Enter customer notes..."
            />
            <button className="absolute bottom-3 right-3 p-1">
              <MoreHorizontal className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Summary and Payment */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Payment Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-red-600 mb-2">Payment Mode</label>
              <div className="relative">
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="w-full px-3 py-2 pr-10 text-gray-700 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent appearance-none"
                >
                  <option value="">Choose the Payment Mode</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reference</label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="w-full px-3 py-2 text-gray-700 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bank</label>
              <input
                type="text"
                placeholder="Type the receiving Bank"
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                className="w-full px-3 py-2 text-gray-700 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
              <input
                type="text"
                placeholder="Type the Branch Sold from"
                value={branchSold}
                onChange={(e) => setBranchSold(e.target.value)}
                className="w-full px-3 py-2 text-gray-700 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Loyalty Discount</span>
              <span className="text-red-600">- {loyaltyDiscount.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-700">Sub Total</span>
              <span className="text-gray-900">{subTotal.toLocaleString()}</span>
            </div>

            <div className="text-sm text-gray-500">(Including Tax)</div>

            <div className="flex justify-between items-center">
              <span className="text-gray-700">Delivery Fee</span>
              <input
                type="text"
                value={deliveryFee.toLocaleString()}
                onChange={(e) => setDeliveryFee(parseFloat(e.target.value.replace(/,/g, '')) || 0)}
                className="text-right text-gray-700 border-b border-gray-300 bg-transparent focus:border-pink-500 focus:outline-none w-24"
              />
            </div>

            <hr className="my-4" />

            <div className="flex justify-between items-center font-semibold text-lg">
              <span className="text-gray-900">Total (NGN)</span>
              <span className="text-gray-900">{total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button onClick={handleSubmit} className="bg-[#E866B7] hover:bg-pink-400 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Save
          </button>
          <button onClick={handleSubmit} className="bg-[#E866B7] hover:bg-pink-400 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Save and Print
          </button>
        </div>

        {/* Email Receipt Section */}
        <div className="border border-gray-300 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Email receipt</h3>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <button className="flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium">
              <Plus className="h-4 w-4" />
              Add New
            </button>
            
            <div className="flex items-center gap-3 bg-gray-100 px-3 py-1.5 rounded-lg">
              <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                S
              </div>
              <span className="text-gray-900">Samuelmonday857@gmail.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}