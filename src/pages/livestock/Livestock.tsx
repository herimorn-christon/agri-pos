import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Card from '../../components/ui/Card';
import { Tractor, Plus, Filter, Search } from 'lucide-react';
import { Livestock as LivestockType } from '../../lib/types';

const Livestock = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [livestock, setLivestock] = useState<LivestockType[]>([]);
  const [filters, setFilters] = useState({
    species: 'all',
    status: 'all',
    search: '',
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const addLivestock = () => {
    navigate('/livestock/add');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          Livestock Management
        </h1>
        <button
          onClick={addLivestock}
          className="btn btn-primary"
        >
          <Plus size={16} className="mr-2" />
          Add Livestock
        </button>
      </div>

      <Card
        title="Livestock Overview"
        subtitle="Manage your livestock inventory"
        icon={<Tractor size={18} />}
      >
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Species
            </label>
            <select
              name="species"
              value={filters.species}
              onChange={handleFilterChange}
              className="input"
            >
              <option value="all">All Species</option>
              <option value="cattle">Cattle</option>
              <option value="sheep">Sheep</option>
              <option value="goats">Goats</option>
              <option value="poultry">Poultry</option>
              <option value="pigs">Pigs</option>
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
              <option value="active">Active</option>
              <option value="sold">Sold</option>
              <option value="deceased">Deceased</option>
              <option value="transferred">Transferred</option>
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
                placeholder="Search by ID, name, or tag..."
                className="input pl-10"
              />
              <Search size={16} className="absolute left-3 top-3 text-neutral-400" />
            </div>
          </div>
        </div>

        {/* Livestock list */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50 dark:bg-neutral-800">
              <tr>
                <th className="px-4 py-2 font-medium">ID/Tag</th>
                <th className="px-4 py-2 font-medium">Species</th>
                <th className="px-4 py-2 font-medium">Breed</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Birth/Acquisition</th>
                <th className="px-4 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-neutral-500">
                    Loading livestock data...
                  </td>
                </tr>
              ) : livestock.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-neutral-500">
                    No livestock records found. Add your first livestock to get started.
                  </td>
                </tr>
              ) : (
                livestock.map(animal => (
                  <tr key={animal.id} className="border-b border-neutral-200 dark:border-neutral-700">
                    <td className="px-4 py-2">{animal.tag_id || animal.id}</td>
                    <td className="px-4 py-2">{animal.species}</td>
                    <td className="px-4 py-2">{animal.breed || '-'}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        animal.status === 'active' ? 'bg-success-100 text-success-900' :
                        animal.status === 'sold' ? 'bg-primary-100 text-primary-900' :
                        animal.status === 'deceased' ? 'bg-error-100 text-error-900' :
                        'bg-neutral-100 text-neutral-900'
                      }`}>
                        {animal.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      {animal.birth_date || animal.acquisition_date || '-'}
                    </td>
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

export default Livestock;