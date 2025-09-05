'use client';

import Link from 'next/link';
import { Download, Filter, Plus } from 'lucide-react';

const AccountingDashboard = () => {
  
  const products = [
    {
      name: 'Apple Watch Series 4',
      costPrice: '00000',
      sellingPrice: '00000',
      pieces: '12 Pieces',
      branch: 'Lekki',
      availability: 'In- stock',
      availabilityColor: 'text-green-600'
    },
    {
      name: 'Headset',
      costPrice: '00000',
      sellingPrice: '00000',
      pieces: '0',
      branch: 'Gbagada',
      availability: 'Out of stock',
      availabilityColor: 'text-red-600'
    },
    {
      name: 'Jbl Charge 5 Bull',
      costPrice: '00000',
      sellingPrice: '00000',
      pieces: '12 Pieces',
      branch: 'Ikeja',
      availability: 'In- stock',
      availabilityColor: 'text-green-600'
    },
    {
      name: 'Samsung A50',
      costPrice: '00000',
      sellingPrice: '00000',
      pieces: '0',
      branch: 'Lekki',
      availability: 'Out of stock',
      availabilityColor: 'text-red-600'
    },
    {
      name: 'Hp 1030 G3',
      costPrice: '00000',
      sellingPrice: '00000',
      pieces: '12 Pieces',
      branch: 'Ikeja',
      availability: 'In- stock',
      availabilityColor: 'text-green-600'
    },
    {
      name: 'Ps 5 Console',
      costPrice: '00000',
      sellingPrice: '00000',
      pieces: '12 Pieces',
      branch: 'Gbagada',
      availability: 'In- stock',
      availabilityColor: 'text-green-600'
    },
    {
      name: 'iPhone 12',
      costPrice: '00000',
      sellingPrice: '00000',
      pieces: '-5 Pieces',
      branch: 'Lekki',
      availability: 'Out of stock',
      availabilityColor: 'text-red-600'
    },
    {
      name: 'iPhone 16promax',
      costPrice: '00000',
      sellingPrice: '00000',
      pieces: '12 Pieces',
      branch: 'Gbagada',
      availability: 'In- stock',
      availabilityColor: 'text-green-600'
    },
    {
      name: 'Google Pixel',
      costPrice: '00000',
      sellingPrice: '00000',
      pieces: '12 Pieces',
      branch: 'Lekki',
      availability: 'Low stock',
      availabilityColor: 'text-yellow-600'
    }
  ];

  

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

      {/* Overall Inventory Section */}
      <div className="mb-8">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
          <h2 className="text-lg text-gray-900 font-semibold mb-4">Overall Inventory</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8">
            {/* Sales */}
            <div className="text-center sm:text-left">
              <h3 className="text-blue-600 text-sm font-medium mb-2">Sales</h3>
              <p className="text-lg text-gray-900 mb-1">35 Products</p>
              <p className="text-xs text-gray-500">Last 7 days</p>
            </div>
            
            {/* Total Products */}
            <div className="text-center sm:text-left">
              <h3 className="text-orange-500 text-sm font-medium mb-2">Total Products</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4">
                <p className="text-lg text-gray-900">868</p>
                <p className="text-lg text-gray-900">₦12,250,000</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4">
                <p className="text-xs text-gray-500">Last 7 days</p>
                <p className="text-xs text-gray-400">Total Inventory Cost (TIC)</p>
              </div>
            </div>
            
            {/* Top Selling */}
            <div className="text-center sm:text-left">
              <h3 className="text-purple-600 text-sm font-medium mb-2">Top Selling</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4">
                <p className="text-lg text-gray-900">HP 1030</p>
                <p className="text-lg text-gray-600">₦GN500,000</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4">
                <p className="text-xs text-gray-500">Last 7 days</p>
                <p className="text-xs text-gray-400">Cost</p>
              </div>
            </div>
            
            {/* Low Stocks */}
            <div className="text-center sm:text-left">
              <h3 className="text-red-500 text-sm font-medium mb-2">Low Stocks</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4">
                <p className="text-lg text-gray-900">12</p>
                <p className="text-lg text-gray-600">5</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4">
                <p className="text-xs text-gray-500">Incoming</p>
                <p className="text-xs text-gray-400">Not in stock</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="bg-white rounded-lg shadow-sm">
        {/* Products Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center p-4 md:p-6 border-b border-gray-200 gap-4">
          <h2 className="text-xl text-gray-800 font-semibold">Products</h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link 
            href="/dashboard/front-desk/inventory/addproduct"
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
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gadgets</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost price</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Selling price</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pieces</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product, index) => (
                <Link
                  key={index}
                  href={`/dashboard/front-desk/inventory/inventory-details`}
                  className="table-row hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                    <span className="text-blue-600 text-sm hover:text-blue-800 cursor-pointer">{product.name}</span>
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap text-xs text-gray-900">{product.costPrice}</td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap text-xs text-gray-900">{product.sellingPrice}</td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap text-xs">
                    <span className={product.pieces.includes('-') ? 'text-red-600' : 'text-gray-900'}>
                      {product.pieces}
                    </span>
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap text-xs text-gray-900">{product.branch}</td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap text-xs">
                    <span className={product.availabilityColor}>
                      {product.availability}
                    </span>
                  </td>
                </Link>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 md:px-6 py-4 border-t border-gray-200 gap-4">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 text-sm">
            Previous
          </button>
          <span className="text-sm text-gray-600 text-center">
            Page 1 of 10
          </span>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 text-sm">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountingDashboard;