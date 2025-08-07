import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import { BadgeDollarSign, Plus, Filter, Search } from 'lucide-react';
import { Sale } from '../../lib/types';

const Sales = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [sales, setSales] = useState<Sale[]>([]);
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: '7days',
    search: '',
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const newSale = () => {
    navigate('/sales/new');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          Sales & POS
        </h1>
        <button
          onClick={newSale}
          className="btn btn-primary"
        >
          <Plus size={16} className="mr-2" />
          New Sale
        </button>
      </div>

      <Card
        title="Sales Overview"
        subtitle="Manage your sales and transactions"
        icon={<BadgeDollarSign size={18} />}
      >
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Payment Status
            </label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="input"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="partial">Partial</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Date Range
            </label>
            <select
              name="dateRange"
              value={filters.dateRange}
              onChange={handleFilterChange}
              className="input"
            >
              <option value="today">Today</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="custom">Custom Range</option>
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
                placeholder="Search by invoice number or customer..."
                className="input pl-10"
              />
              <Search size={16} className="absolute left-3 top-3 text-neutral-400" />
            </div>
          </div>
        </div>

        {/* Sales list */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50 dark:bg-neutral-800">
              <tr>
                <th className="px-4 py-2 font-medium">Invoice #</th>
                <th className="px-4 py-2 font-medium">Date</th>
                <th className="px-4 py-2 font-medium">Customer</th>
                <th className="px-4 py-2 font-medium">Amount</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Payment</th>
                <th className="px-4 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-neutral-500">
                    Loading sales data...
                  </td>
                </tr>
              ) : sales.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-neutral-500">
                    No sales found. Create your first sale to get started.
                  </td>
                </tr>
              ) : (
                sales.map(sale => (
                  <tr key={sale.id} className="border-b border-neutral-200 dark:border-neutral-700">
                    <td className="px-4 py-2">{sale.invoice_number || '-'}</td>
                    <td className="px-4 py-2">{sale.sale_date}</td>
                    <td className="px-4 py-2">{sale.customer_name || 'Walk-in Customer'}</td>
                    <td className="px-4 py-2">${sale.final_amount}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        sale.payment_status === 'paid' ? 'bg-success-100 text-success-900' :
                        sale.payment_status === 'partial' ? 'bg-warning-100 text-warning-900' :
                        sale.payment_status === 'pending' ? 'bg-primary-100 text-primary-900' :
                        'bg-error-100 text-error-900'
                      }`}>
                        {sale.payment_status}
                      </span>
                    </td>
                    <td className="px-4 py-2">{sale.payment_method || '-'}</td>
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

export default Sales;