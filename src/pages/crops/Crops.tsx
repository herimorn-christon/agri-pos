import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import { Leaf, Plus, Filter, Search } from 'lucide-react';
import { Crop as CropType } from '../../lib/types';

const Crops = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [crops, setCrops] = useState<CropType[]>([]);
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    search: '',
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const addCrop = () => {
    navigate('/crops/add');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          Crop Management
        </h1>
        <button
          onClick={addCrop}
          className="btn btn-primary"
        >
          <Plus size={16} className="mr-2" />
          Add Crop
        </button>
      </div>

      <Card
        title="Crops Overview"
        subtitle="Manage your crops and plantations"
        icon={<Leaf size={18} />}
      >
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Crop Type
            </label>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="input"
            >
              <option value="all">All Types</option>
              <option value="cereals">Cereals</option>
              <option value="vegetables">Vegetables</option>
              <option value="fruits">Fruits</option>
              <option value="legumes">Legumes</option>
              <option value="tubers">Tubers</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Status
            </label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="input"
            >
              <option value="all">All Status</option>
              <option value="planned">Planned</option>
              <option value="planted">Planted</option>
              <option value="growing">Growing</option>
              <option value="harvested">Harvested</option>
              <option value="failed">Failed</option>
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
                placeholder="Search by name or plot..."
                className="input pl-10"
              />
              <Search size={16} className="absolute left-3 top-3 text-neutral-400" />
            </div>
          </div>
        </div>

        {/* Crops list */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50 dark:bg-neutral-800">
              <tr>
                <th className="px-4 py-2 font-medium">Name</th>
                <th className="px-4 py-2 font-medium">Type</th>
                <th className="px-4 py-2 font-medium">Plot</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Planting Date</th>
                <th className="px-4 py-2 font-medium">Expected Harvest</th>
                <th className="px-4 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-neutral-500">
                    Loading crop data...
                  </td>
                </tr>
              ) : crops.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-neutral-500">
                    No crops found. Add your first crop to get started.
                  </td>
                </tr>
              ) : (
                crops.map(crop => (
                  <tr key={crop.id} className="border-b border-neutral-200 dark:border-neutral-700">
                    <td className="px-4 py-2">{crop.name}</td>
                    <td className="px-4 py-2">{crop.crop_type}</td>
                    <td className="px-4 py-2">{crop.plot_id || '-'}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        crop.status === 'growing' ? 'bg-success-100 text-success-900' :
                        crop.status === 'harvested' ? 'bg-primary-100 text-primary-900' :
                        crop.status === 'failed' ? 'bg-error-100 text-error-900' :
                        'bg-neutral-100 text-neutral-900'
                      }`}>
                        {crop.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">{crop.planting_date || '-'}</td>
                    <td className="px-4 py-2">{crop.expected_harvest_date || '-'}</td>
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

export default Crops;