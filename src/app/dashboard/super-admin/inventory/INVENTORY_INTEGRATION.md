# Super Admin Inventory Integration Guide

This guide shows how to integrate the products API with the Super Admin inventory page.

## 📁 File Structure

```
src/
├── api/
│   └── superAdminProductsApi.ts          # Products API functions
├── app/dashboard/super-admin/
│   ├── hooks/
│   │   └── useProducts.ts                # Custom hooks for products
│   └── inventory/
│       └── page.tsx                      # Inventory page component
```

## 🚀 Quick Start

### 1. Import the API and Hooks

```typescript
import { superAdminProductsApi } from '../../../../api/superAdminProductsApi';
import { 
  useProducts, 
  useProductSearch, 
  useCategories, 
  useProductStats,
  useProductOperations 
} from '../../hooks/useProducts';
```

### 2. Basic Usage Examples

#### Get All Products with Pagination

```typescript
const InventoryPage = () => {
  const [searchParams, setSearchParams] = useState<ProductSearchParams>({
    limit: 20,
    page: 1,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const { 
    products, 
    loading, 
    error, 
    pagination, 
    refetch 
  } = useProducts(searchParams);

  return (
    <div>
      {loading && <div>Loading products...</div>}
      {error && <div>Error: {error}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      
      <Pagination 
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={(page) => setSearchParams(prev => ({ ...prev, page }))}
      />
    </div>
  );
};
```

#### Search Products

```typescript
const ProductSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<AdvancedSearchParams>({
    q: '',
    category: '',
    inStock: 'true',
    sortBy: 'itemName',
    sortOrder: 'asc'
  });

  const { 
    products, 
    loading, 
    error, 
    searchInfo, 
    searchProducts 
  } = useProductSearch(filters);

  const handleSearch = () => {
    searchProducts();
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products..."
          className="flex-1 px-3 py-2 border rounded"
        />
        <button 
          onClick={() => {
            setFilters(prev => ({ ...prev, q: searchQuery }));
            handleSearch();
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Search
        </button>
      </div>
      
      {searchInfo && (
        <div className="mb-4 text-sm text-gray-600">
          Found {searchInfo.totalCount} products
        </div>
      )}
      
      {/* Product list */}
    </div>
  );
};
```

#### Get Categories

```typescript
const CategoryFilter = () => {
  const { categories, loading, error } = useCategories();

  if (loading) return <div>Loading categories...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <select className="px-3 py-2 border rounded">
      <option value="">All Categories</option>
      {categories.map(category => (
        <option key={category._id} value={category._id}>
          {category.name}
        </option>
      ))}
    </select>
  );
};
```

#### Product Statistics

```typescript
const InventoryStats = () => {
  const { stats, loading, error } = useProductStats();

  if (loading) return <div>Loading stats...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold">Total Products</h3>
        <p className="text-3xl font-bold text-blue-600">{stats.totalProducts}</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold">Total Value</h3>
        <p className="text-3xl font-bold text-green-600">
          ₦{stats.totalValue.toLocaleString()}
        </p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold">Low Stock</h3>
        <p className="text-3xl font-bold text-yellow-600">{stats.lowStockProducts}</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold">Out of Stock</h3>
        <p className="text-3xl font-bold text-red-600">{stats.outOfStockProducts}</p>
      </div>
    </div>
  );
};
```

#### Product Operations

```typescript
const ProductManagement = () => {
  const { 
    loading, 
    error, 
    createProduct, 
    updateProduct, 
    deleteProduct 
  } = useProductOperations();

  const handleCreateProduct = async (productData: Partial<Product>) => {
    try {
      const result = await createProduct(productData);
      console.log('Product created:', result);
      // Refresh the product list
    } catch (err) {
      console.error('Failed to create product:', err);
    }
  };

  const handleUpdateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      const result = await updateProduct(id, productData);
      console.log('Product updated:', result);
      // Refresh the product list
    } catch (err) {
      console.error('Failed to update product:', err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const result = await deleteProduct(id);
        console.log('Product deleted:', result);
        // Refresh the product list
      } catch (err) {
        console.error('Failed to delete product:', err);
      }
    }
  };

  return (
    <div>
      {/* Product management UI */}
    </div>
  );
};
```

## 🔧 Advanced Features

### Filtering and Sorting

```typescript
const [filters, setFilters] = useState<ProductSearchParams>({
  search: '',
  category: '',
  vendor: '',
  minPrice: undefined,
  maxPrice: undefined,
  inStock: 'true',
  branch: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  limit: 20,
  page: 1
});

// Apply filters
const applyFilters = (newFilters: Partial<ProductSearchParams>) => {
  setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
};
```

### Export Products

```typescript
const handleExportProducts = async () => {
  try {
    const response = await superAdminProductsApi.exportProducts(filters);
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'products.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error('Export failed:', error);
  }
};
```

### Real-time Updates

```typescript
const { products, refetch } = useProducts(searchParams);

// Refresh data every 30 seconds
useEffect(() => {
  const interval = setInterval(() => {
    refetch();
  }, 30000);

  return () => clearInterval(interval);
}, [refetch]);
```

## 📊 Data Types

### Product Interface

```typescript
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
```

## 🎯 Best Practices

1. **Use the custom hooks** instead of calling the API directly
2. **Handle loading and error states** in your components
3. **Implement proper pagination** for large datasets
4. **Use debouncing** for search inputs
5. **Cache data** when appropriate to reduce API calls
6. **Implement optimistic updates** for better UX
7. **Add proper error boundaries** for error handling

## 🔗 API Endpoints

- `GET /api/categories` - Get all categories
- `GET /api/categories/{id}` - Get category by ID
- `GET /api/products` - Get all products with filtering
- `GET /api/products/search` - Advanced product search
- `GET /api/products/branch/{branchId}` - Get products by branch
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product
- `GET /api/products/stats` - Get product statistics
- `GET /api/products/export` - Export products

## 🚨 Error Handling

All API calls return proper error responses:

```typescript
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error description"
}
```

Handle errors appropriately in your components:

```typescript
if (error) {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      Error: {error}
    </div>
  );
}
```
