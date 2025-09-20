'use client';

import Link from 'next/link';
import { Download, Filter, Plus } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { frontdeskApi } from '../../../../api/frontdeskApi';

// Type definitions for API responses
interface AnalyticsData {
  period: {
    start: string;
    end: string;
    month: string;
    year: string;
  };
  inventory: {
    totalStock: number;
    lowStockAlert: {
      count: number;
      products: Array<{
        _id: string;
        itemName: string;
        quantity: number;
        category: {
          _id: string;
          name: string;
        };
        vendor: {
          _id: string;
          name: string;
        };
      }>;
    };
    totalStockValue: number;
  };
  unpaidItems: {
    sales: {
      count: number;
      total: number;
    };
    invoices: {
      count: number;
      total: number;
    };
  };
  productDetails: {
    lowStockItems: unknown[];
    unpaidItems: unknown[];
    repairItems: unknown[];
    branches: unknown[];
  };
  salesOverview: {
    onlineSalesRep: number;
    walkInCustomers: number;
    referralSystem: number;
    engineeringSystem: number;
  };
  totalStockPurchased: number;
  stockLogs: Array<{
    _id: string;
    activity_type: string;
    activity_date: string;
    product_id: {
      _id: string;
      itemName: string;
    };
    created_by: {
      _id: string;
      firstName: string;
      lastName: string;
    };
    stock_before: Array<{
      branch: {
        _id: string;
        name: string;
      };
      quantity: number;
    }>;
    stock_after: Array<{
      branch: {
        _id: string;
        name: string;
      };
      quantity: number;
    }>;
  }>;
}

interface Product {
  _id: string;
  itemName: string;
  quantity: number;
  productImages: string[];
  category: {
    _id: string;
    name: string;
    description: string;
  };
  imeiSku: string;
  costPrice: number;
  purchaseDescription: string;
  tax: number;
  profit: string;
  sellingPrice: number;
  sellingDescription: string;
  sellingTax: number;
  vendor: {
    _id: string;
    name: string;
    product: string;
    phone_number: string;
    email: string;
    type: string;
  };
  stockLocation: Array<{
    branch: {
      _id: string;
      name: string;
      address: string;
      state: string;
    };
    openingQuantity: number;
    closingQuantity: number;
  }>;
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    name: string;
    staffId: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface ProductsResponse {
  products: Product[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const AccountingDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

  // Removed dev-only auth check; allow fetch and let backend enforce auth if required.

      // Fetch all products to calculate totals
      const allProductsRes = await frontdeskApi.getProducts({ page: 1, limit: 1000 });
      const allProductsData = allProductsRes.data as ProductsResponse;
      const allProducts = allProductsData.products || [];

      // Calculate total stock and total inventory value from products
      const totalStock = allProducts.reduce((sum, product) => {
        const productQuantity = product.stockLocation?.reduce((stockSum, location) => 
          stockSum + location.closingQuantity, 0) || 0;
        return sum + productQuantity;
      }, 0);

      const totalInventoryValue = allProducts.reduce((sum, product) => {
        const productQuantity = product.stockLocation?.reduce((stockSum, location) => 
          stockSum + location.closingQuantity, 0) || 0;
        return sum + (product.costPrice * productQuantity);
      }, 0);

      // Count low stock items (quantity <= 5)
      const lowStockItems = allProducts.filter(product => {
        const productQuantity = product.stockLocation?.reduce((stockSum, location) => 
          stockSum + location.closingQuantity, 0) || 0;
        return productQuantity <= 5 && productQuantity > 0;
      });

      // Create analytics data with calculated values
      const calculatedAnalytics: AnalyticsData = {
        period: {
          start: new Date().toISOString().split('T')[0],
          end: new Date().toISOString().split('T')[0],
          month: new Date().toLocaleDateString('en-US', { month: 'long' }),
          year: new Date().getFullYear().toString()
        },
        inventory: {
          totalStock: totalStock,
          totalStockValue: totalInventoryValue,
          lowStockAlert: {
            count: lowStockItems.length,
            products: lowStockItems.map(product => ({
              _id: product._id,
              itemName: product.itemName,
              quantity: product.stockLocation?.reduce((sum, location) => sum + location.closingQuantity, 0) || 0,
              category: product.category,
              vendor: product.vendor
            }))
          }
        },
        unpaidItems: {
          sales: { count: 0, total: 0 },
          invoices: { count: 0, total: 0 }
        },
        productDetails: {
          lowStockItems: lowStockItems,
          unpaidItems: [],
          repairItems: [],
          branches: []
        },
        salesOverview: {
          onlineSalesRep: 0,
          walkInCustomers: 0,
          referralSystem: 0,
          engineeringSystem: 0
        },
        totalStockPurchased: 0,
        stockLogs: []
      };

      // Fetch paginated products for the table
      const productsRes = await frontdeskApi.getProducts({ page: currentPage, limit: 10 });
      const productsData = productsRes.data as ProductsResponse;

      setAnalyticsData(calculatedAnalytics);
      setProducts(productsData.products || []);
      setTotalPages(productsData.totalPages || 1);
      setError(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
      if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
        setError('Authentication failed. Please login again.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getAvailabilityStatus = (quantity: number) => {
    if (quantity <= 0) return { status: 'Out of stock', color: 'text-red-600' };
    if (quantity <= 5) return { status: 'Low stock', color: 'text-yellow-600' };
    return { status: 'In stock', color: 'text-green-600' };
  };

  const getTotalQuantity = (product: Product) => {
    return product.stockLocation?.reduce((sum, location) => sum + location.closingQuantity, 0) || 0;
  };

  const getPrimaryBranch = (product: Product) => {
    return product.stockLocation?.[0]?.branch?.name || 'Unknown';
  };

  

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4 gap-4">
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Hello Chineye</h2>
              <p className="text-gray-600 text-sm">Loading inventory data...</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4 gap-4">
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Hello Chineye</h2>
              <p className="text-red-600 text-sm">Error loading data: {error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            {/* Sales Overview */}
            <div className="text-center sm:text-left">
              <h3 className="text-blue-600 text-sm font-medium mb-2">Sales Overview</h3>
              <p className="text-lg text-gray-900 mb-1">
                {analyticsData?.salesOverview?.walkInCustomers || 0} Walk-ins
              </p>
              <p className="text-xs text-gray-500">
                {analyticsData?.salesOverview?.onlineSalesRep || 0} Online
              </p>
            </div>
            
            {/* Total Products */}
            <div className="text-center sm:text-left">
              <h3 className="text-orange-500 text-sm font-medium mb-2">Total Products</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4">
                <p className="text-lg text-gray-900 font-semibold">{analyticsData?.inventory?.totalStock || 0}</p>
                <p className="text-lg text-gray-900 font-semibold">₦{(analyticsData?.inventory?.totalStockValue || 0).toLocaleString()}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4">
                <p className="text-xs text-gray-500">Total Stock</p>
                <p className="text-xs text-gray-400">Total Inventory Value</p>
              </div>
            </div>
            
            {/* Referral System */}
            <div className="text-center sm:text-left">
              <h3 className="text-purple-600 text-sm font-medium mb-2">Referral System</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4">
                <p className="text-lg text-gray-900">{analyticsData?.salesOverview?.referralSystem || 0}</p>
                <p className="text-lg text-gray-600">{analyticsData?.salesOverview?.engineeringSystem || 0}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4">
                <p className="text-xs text-gray-500">Referrals</p>
                <p className="text-xs text-gray-400">Engineering</p>
              </div>
            </div>
            
            {/* Low Stocks */}
            <div className="text-center sm:text-left">
              <h3 className="text-red-500 text-sm font-medium mb-2">Low Stocks</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4">
                <p className="text-lg text-gray-900 font-semibold">{analyticsData?.inventory?.lowStockAlert?.count || 0}</p>
                <p className="text-lg text-gray-600">
                  ₦{(analyticsData?.unpaidItems?.sales?.total || 0).toLocaleString()}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4">
                <p className="text-xs text-gray-500">Low Stock Items (≤5 pieces)</p>
                <p className="text-xs text-gray-400">Unpaid Sales</p>
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
              {products.map((product) => {
                const totalQuantity = getTotalQuantity(product);
                const availability = getAvailabilityStatus(totalQuantity);
                const primaryBranch = getPrimaryBranch(product);
                
                return (
                  <Link
                    key={product._id}
                    href={`/dashboard/front-desk/inventory/inventory-details?id=${product._id}`}
                    className="table-row hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                      <span className="text-blue-600 text-sm hover:text-blue-800 cursor-pointer">
                        {product.itemName}
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-xs text-gray-900">
                      ₦{product.costPrice.toLocaleString()}
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-xs text-gray-900">
                      ₦{product.sellingPrice.toLocaleString()}
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-xs">
                      <span className={totalQuantity <= 0 ? 'text-red-600' : 'text-gray-900'}>
                        {totalQuantity} pieces
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-xs text-gray-900">
                      {primaryBranch}
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-xs">
                      <span className={availability.color}>
                        {availability.status}
                      </span>
                    </td>
                  </Link>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 md:px-6 py-4 border-t border-gray-200 gap-4">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600 text-center">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountingDashboard;