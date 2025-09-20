'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Plus, Download, Edit } from 'lucide-react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

type Vendor = {
  name?: string;
  phone_number?: string;
};

type StockLocation = {
  branchName?: string;
  openingQuantity?: number;
  closingQuantity?: number;
  createdAt?: string;
};

type Product = {
  _id?: string;
  itemName?: string;
  imeiSku?: string;
  vendor?: Vendor;
  costPrice?: number;
  sellingPrice?: number;
  sellingTax?: number;
  productImages?: string[];
  stockLocation?: StockLocation[];
  createdAt?: string;
};

const tabs = ['Overview', 'Purchases', 'History'];

const formatCurrency = (value?: number) => {
  if (value == null) return 'NGN0.00';
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(value);
};

const ProductDetailsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [product, setProduct] = useState<Product | null>(null);
  const searchParams = useSearchParams();
  const productId = searchParams?.get('id');

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${productId}`);
        const data = await res.json();
        // API returns { products: [product] }
        setProduct(data?.products?.[0] ?? null);
      } catch (err) {
        console.error('Failed to fetch product', err);
      }
    };

    fetchProduct();
  }, [productId]);

  const sumOpening = product?.stockLocation?.reduce((s, l) => s + (l.openingQuantity ?? 0), 0) ?? 0;
  const sumClosing = product?.stockLocation?.reduce((s, l) => s + (l.closingQuantity ?? 0), 0) ?? 0;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Overview':
        return (
          <div className="space-y-6">
            {/* Primary Details */}
            <div>
              <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">Primary Details</h3>
              <div className="space-y-3 lg:space-y-4">
                <div className="grid grid-cols-2 gap-3 lg:gap-4">
                  <div>
                    <span className="text-gray-500 text-sm block">Product name</span>
                  </div>
                  <div className="text-gray-900 font-medium">{product?.itemName ?? '—'}</div>
                </div>

                <div className="grid grid-cols-2 gap-3 lg:gap-4">
                  <span className="text-gray-500 text-sm block mb-1">IMEI/SKU</span>
                  <div className="text-blue-500 text-sm break-all">
                    {product?.imeiSku ?? '—'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 lg:gap-4">
                  <span className="text-gray-500 text-sm block">Product category</span>
                  <div className="text-gray-900 font-medium">{product?.vendor?.name ?? '—'}</div>
                </div>

                <div className="grid grid-cols-2 gap-3 lg:gap-4">
                  <span className="text-gray-500 text-sm block">Input Date</span>
                  <div className="text-gray-900 font-medium">{product?.createdAt ? new Date(product.createdAt).toLocaleDateString() : '—'}</div>
                </div>

                <div className="grid grid-cols-2 gap-3 lg:gap-4">
                  <span className="text-gray-500 text-sm block">Quantity</span>
                  <div className="text-gray-900 font-medium">{sumClosing}</div>
                </div>
              </div>
            </div>

            {/* Supplier Details */}
            <div>
              <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">Supplier Details</h3>

              <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 lg:gap-4 mb-2">
                <span className="text-gray-500 text-sm block">Supplier name</span>
                <div className="text-gray-700 font-medium">{product?.vendor?.name ?? '—'}</div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 lg:gap-4">
                <span className="text-gray-500 text-sm block">Contact Number</span>
                <div className="text-gray-700 font-medium">{product?.vendor?.phone_number ?? '—'}</div>
              </div>
            </div>

            {/* Stock Locations */}
            <div>
              <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">Stock Locations</h3>
              <div className="rounded-lg p-3 lg:p-4">
                <div className="grid grid-cols-2 gap-4 mb-3 lg:mb-4 bg-gray-50 p-3 pl-0">
                  <span className="text-gray-700 text-sm font-medium">Store Name</span>
                  <span className="text-gray-700 text-sm font-medium">Stock in hand</span>
                </div>

                <div className="space-y-2 lg:space-y-3">
                  {product?.stockLocation?.map((loc, idx) => (
                    <div key={idx} className="grid grid-cols-2 gap-4">
                      <span className="text-gray-700 text-xs lg:text-base">{loc.branchName ?? 'Branch'}</span>
                      <span className="text-orange-500 font-medium text-xs lg:text-base">{loc.closingQuantity ?? 0}</span>
                    </div>
                  )) ?? (
                    <div className="text-gray-500">No stock locations</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'Purchases':
        return (
          <div className="w-full">
            {/* Mobile Card View */}
            <div className="block lg:hidden space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Date</p>
                      <p className="font-medium text-gray-900 text-sm">{product?.createdAt ? new Date(product.createdAt).toLocaleDateString() : '—'}</p>
                    </div>
                    <div className="flex-1 text-right">
                      <p className="text-xs text-gray-500">Receipt #</p>
                      <p className="font-medium text-gray-900 text-sm">{product?._id ?? '—'}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Customer</p>
                      <p className="font-medium text-gray-900 text-sm">{product?.vendor?.name ?? '—'}</p>
                    </div>
                    <div className="flex-1 text-right">
                      <p className="text-xs text-gray-500">Quantity</p>
                      <p className="font-medium text-gray-900 text-sm">{sumClosing}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Price</p>
                      <p className="font-medium text-gray-900 text-sm">{formatCurrency(product?.sellingPrice)}</p>
                    </div>
                    <div className="flex-1 text-right">
                      <p className="text-xs text-gray-500">Total</p>
                      <p className="font-medium text-gray-900 text-sm">{formatCurrency((product?.sellingPrice ?? 0) * sumClosing)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block">
              <div className="overflow-x-auto">
                <div className="min-w-full inline-block align-middle">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-100">
                        <th className="text-left py-2 px-1 lg:px-4 text-gray-600 text-xs font-medium">Date</th>
                        <th className="text-left py-2 px-1 lg:px-4 text-gray-600 text-xs font-medium">Sales receipt #</th>
                        <th className="text-left py-2 px-1 lg:px-4 text-gray-600 text-xs font-medium">Customer&apos;s name</th>
                        <th className="text-left py-2 px-1 lg:px-4 text-gray-600 text-xs font-medium">Quantity sold</th>
                        <th className="text-left py-2 px-1 lg:px-4 text-gray-600 text-xs font-medium">Price</th>
                        <th className="text-left py-2 px-1 lg:px-4 text-gray-600 text-xs font-medium">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-2 lg:px-4 text-gray-900 text-xs">{product?.createdAt ? new Date(product.createdAt).toLocaleDateString() : '—'}</td>
                        <td className="py-4 px-2 lg:px-4 text-gray-900 text-xs">{product?._id ?? '—'}</td>
                        <td className="py-4 px-2 lg:px-4 text-gray-900 text-xs">{product?.vendor?.name ?? '—'}</td>
                        <td className="py-4 px-2 lg:px-4 text-gray-900 text-xs">{sumClosing}</td>
                        <td className="py-4 px-2 lg:px-4 text-gray-900 text-xs">{formatCurrency(product?.sellingPrice)}</td>
                        <td className="py-4 px-2 lg:px-4 text-gray-900 text-xs">{formatCurrency((product?.sellingPrice ?? 0) * sumClosing)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );

      case 'History':
        return (
          <div className="text-center py-8 lg:py-12">
            <p className="text-gray-500 text-sm lg:text-base">History of this particular product</p>
          </div>
        );

      default:
        return null;
    }
  };

  if (!productId) {
    return (
      <div className="flex-1 bg-gray-50 min-h-screen flex items-center justify-center">
        <p className="text-gray-500">No product selected.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
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

      {/* Main Content */}
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Product Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 lg:mb-2 gap-3 lg:gap-4 p-4">
            <h2 className="text-lg lg:text-xl font-semibold text-gray-900">{product?.itemName ?? 'Product'}</h2>
            <div className="flex items-center gap-2 lg:gap-3 w-full sm:w-auto">
              <Link
                href="/dashboard/accounting/inventory/add-product"
                className="bg-[#E866B7] text-white px-4 py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <Edit className="w-4 h-4" />
                Edit Stock
              </Link>
              <button className="flex-1 sm:flex-none bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 lg:px-4 py-2.5 rounded-lg transition-colors text-sm">
                Download
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 overflow-x-auto">
            <nav className="flex space-x-4 lg:space-x-8 px-4 lg:px-6 min-w-max">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 lg:py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab
                      ? 'border-yellow-400 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="flex flex-col xl:flex-row">
            {/* Main Content Area */}
            <div className="flex-1 p-4 lg:p-6 min-w-0">{renderTabContent()}</div>

            {/* Right Sidebar */}
            <div className="w-full xl:w-80 p-4 lg:p-6">
              {/* Product Image */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 lg:p-4 mb-4 lg:mb-6 bg-white">
                <div className="flex items-center justify-center">
                  <Image
                    src={product?.productImages?.[0] ?? '/watch.jpg'}
                    alt={product?.itemName ?? 'Product image'}
                    width={120}
                    height={120}
                    className="object-contain lg:w-[120px] lg:h-[120px]"
                  />
                </div>
              </div>

              {/* Stock Information */}
              <div className="space-y-3 lg:space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm lg:text-base">Opening Stock</span>
                  <span className="text-green-500 font-semibold text-sm lg:text-base">{sumOpening}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm lg:text-base">{activeTab === 'Overview' ? 'Closing Stock' : activeTab === 'Purchases' ? 'Remaining Stock' : 'Remaining Stock'}</span>
                  <span className="text-blue-500 font-semibold text-sm lg:text-base">{sumClosing}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm lg:text-base">{activeTab === 'Overview' ? 'Pending' : 'On the way'}</span>
                  <span className="text-pink-500 font-semibold text-sm lg:text-base">{Math.max(sumOpening - sumClosing, 0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;