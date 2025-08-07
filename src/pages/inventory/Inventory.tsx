import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import { Store, Plus, Filter, Search, AlertTriangle } from 'lucide-react';
import { Product } from '../../lib/types';

const Inventory = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState({
    category: 'all',
    type: 'all',
    search: '',
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const addProduct = () => {
    navigate('/inventory/add');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          Inventory Management
        </h1>
        <button
          onClick={addProduct}
          className="btn btn-primary"
        >
          <Plus size={16} className="mr-2" />
          Add Product
        </button>
      </div>

      <Card
        title="Inventory Overview"
        subtitle="Manage your products and stock levels"
        icon={<Store size={18} />}
      >
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Category
            </label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="input"
            >
              <option value="all">All Categories</option>
              <option value="feed">Feed</option>
              <option value="seeds">Seeds</option>
              <option value="fertilizer">Fertilizer</option>
              <option value="medicine">Medicine</option>
              <option value="tools">Tools</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Type
            </label>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="input"
            >
              <option value="all">All Types</option>
              <option value="input">Input</option>
              <option value="output">Output</option>
              <option value="asset">Asset</option>
              <option value="service">Service</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search by name or SKU..."
                className="input pl-10"
              />
              <Search size={16} className="absolute left-3 top-3 text-neutral-400" />
            </div>
          </div>
        </div>

        {/* Products list */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50 dark:bg-neutral-800">
              <tr>
                <th className="px-4 py-2 font-medium">Name</th>
                <th className="px-4 py-2 font-medium">Category</th>
                <th className="px-4 py-2 font-medium">Type</th>
                <th className="px-4 py-2 font-medium">SKU</th>
                <th className="px-4 py-2 font-medium">Quantity</th>
                <th className="px-4 py-2 font-medium">Unit</th>
                <th className="px-4 py-2 font-medium">Price</th>
                <th className="px-4 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-neutral-500">
                    Loading inventory data...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-neutral-500">
                    No products found. Add your first product to get started.
                  </td>
                </tr>
              ) : (
                products.map(product => (
                  <tr key={product.id} className="border-b border-neutral-200 dark:border-neutral-700">
                    <td className="px-4 py-2">
                      <div className="flex items-center">
                        {product.quantity <= (product.min_quantity || 0) && (
                          <AlertTriangle size={16} className="text-warning-500 mr-2" />
                        )}
                        {product.name}
                      </div>
                    </td>
                    <td className="px-4 py-2">{product.category}</td>
                    <td className="px-4 py-2">{product.type}</td>
                    <td className="px-4 py-2">{product.sku || '-'}</td>
                    <td className="px-4 py-2">{product.quantity}</td>
                    <td className="px-4 py-2">{product.unit || '-'}</td>
                    <td className="px-4 py-2">${product.price}</td>
                    <td className="px-4 py-2">
                      <button className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Inventory;