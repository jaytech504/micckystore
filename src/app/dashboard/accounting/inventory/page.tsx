import React from 'react';
import { Search, Download, Filter, Plus } from 'lucide-react';

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
    <div className="flex-1 bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Accounting dashboard</h1>
            <p className="text-gray-600">Monitor all financial activities, revenue, expenses, and invoices.</p>
          </div>
          <p className="text-sm text-gray-500">Last Update: Current date and time</p>
        </div>
        
        {/* Search and Controls */}
        <div className="flex justify-between items-center mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">⌘ K</span>
          </div>
          <div className="flex items-center space-x-4">
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none">
              <option>Location: Lekki</option>
            </select>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Download report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overall Inventory Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Overall Inventory</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Sales */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-blue-600 font-medium mb-2">Sales</h3>
            <p className="text-2xl font-bold text-gray-900">35 Products</p>
            <p className="text-sm text-gray-500 mt-1">Last 7 days</p>
          </div>
          
          {/* Total Products */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-orange-500 font-medium mb-2">Total Products</h3>
            <div className="flex items-baseline space-x-2">
              <p className="text-2xl font-bold text-gray-900">868</p>
              <p className="text-lg text-gray-600">₦12,250,000</p>
            </div>
            <p className="text-sm text-gray-500 mt-1">Last 7 days</p>
            <p className="text-xs text-gray-400">Total Inventory Cost (TIC)</p>
          </div>
          
          {/* Top Selling */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-purple-600 font-medium mb-2">Top Selling</h3>
            <div className="flex items-baseline space-x-2">
              <p className="text-lg font-semibold text-gray-900">HP 1030 g3</p>
              <p className="text-lg text-gray-600">₦GN500,000</p>
            </div>
            <p className="text-sm text-gray-500 mt-1">Last 7 days</p>
            <p className="text-xs text-gray-400">Cost</p>
          </div>
          
          {/* Low Stocks */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-red-500 font-medium mb-2">Low Stocks</h3>
            <div className="flex items-baseline space-x-2">
              <p className="text-2xl font-bold text-gray-900">12</p>
              <p className="text-lg text-gray-600">5</p>
            </div>
            <p className="text-sm text-gray-500 mt-1">Incoming</p>
            <p className="text-xs text-gray-400">Not in stock</p>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="bg-white rounded-lg shadow-sm">
        {/* Products Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Products</h2>
          <div className="flex items-center space-x-3">
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
            <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
            <button className="text-gray-600 hover:text-gray-800">
              Download all
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gadgets</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Selling price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pieces</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-blue-600 hover:text-blue-800 cursor-pointer">{product.name}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.costPrice}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.sellingPrice}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={product.pieces.includes('-') ? 'text-red-600' : 'text-gray-900'}>
                      {product.pieces}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.branch}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={product.availabilityColor}>
                      {product.availability}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page 1 of 10
          </span>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountingDashboard;