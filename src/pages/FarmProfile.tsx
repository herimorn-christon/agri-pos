import { useState, useEffect } from 'react';
import { useAppStore } from '../lib/appContext';
import Card from '../components/ui/Card';
import { Building, Save } from 'lucide-react';

const FarmProfile = () => {
  const { activeFarm, updateFarm } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    owner: '',
    address: '',
    phone: '',
    email: '',
    taxId: '',
    notes: '',
    modules: [] as string[],
  });

  useEffect(() => {
    if (activeFarm) {
      setFormData({
        name: activeFarm.name || '',
        owner: activeFarm.owner || '',
        address: activeFarm.address || '',
        phone: activeFarm.phone || '',
        email: activeFarm.email || '',
        taxId: activeFarm.tax_id || '',
        notes: activeFarm.notes || '',
        modules: activeFarm.modules || [],
      });
    }
  }, [activeFarm]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleModuleToggle = (module: string) => {
    setFormData(prev => {
      const modules = [...prev.modules];
      if (modules.includes(module)) {
        return { ...prev, modules: modules.filter(m => m !== module) };
      } else {
        return { ...prev, modules: [...modules, module] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFarm) return;

    setLoading(true);
    try {
      const result = await window.electronAPI.saveFarm({
        id: activeFarm.id,
        ...formData,
      });

      if (result.error) {
        throw new Error(result.error);
      }

      // Update farm in store
      updateFarm({
        ...activeFarm,
        ...formData,
        tax_id: formData.taxId,
      });

      alert('Farm profile updated successfully!');
    } catch (error) {
      console.error('Error updating farm profile:', error);
      alert('Failed to update farm profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!activeFarm) {
    return (
      <div className="text-center p-8">
        <p className="text-neutral-600 dark:text-neutral-400">No farm profile selected.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
        Farm Profile
      </h1>

      <Card
        title="Farm Information"
        subtitle="Manage your farm's basic information and settings"
        icon={<Building size={18} />}
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Farm Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div>
              <label htmlFor="owner" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Owner Name
              </label>
              <input
                type="text"
                id="owner"
                name="owner"
                value={formData.owner}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Phone
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Farm Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label htmlFor="taxId" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Tax ID / Business Registration
              </label>
              <input
                type="text"
                id="taxId"
                name="taxId"
                value={formData.taxId}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Farm Modules
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.modules.includes('livestock')}
                    onChange={() => handleModuleToggle('livestock')}
                    className="mr-2"
                  />
                  <span>Livestock Management</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.modules.includes('crops')}
                    onChange={() => handleModuleToggle('crops')}
                    className="mr-2"
                  />
                  <span>Crop & Fruit Farming</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.modules.includes('aquaculture')}
                    onChange={() => handleModuleToggle('aquaculture')}
                    className="mr-2"
                  />
                  <span>Aquaculture</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.modules.includes('apiculture')}
                    onChange={() => handleModuleToggle('apiculture')}
                    className="mr-2"
                  />
                  <span>Beekeeping (Apiculture)</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.modules.includes('insects')}
                    onChange={() => handleModuleToggle('insects')}
                    className="mr-2"
                  />
                  <span>Insect Farming</span>
                </label>
              </div>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="notes" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Additional Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="input h-24"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                    <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default FarmProfile;