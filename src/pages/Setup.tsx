import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../lib/appContext';
import { Leaf, CheckCircle2 } from 'lucide-react';

interface FormData {
  name: string;
  owner: string;
  address: string;
  phone: string;
  email: string;
  taxId: string;
  modules: string[];
  notes: string;
}

const Setup = () => {
  const navigate = useNavigate();
  const { setInitialized, addFarm, setActiveFarm, loadFarms } = useAppStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    owner: '',
    address: '',
    phone: '',
    email: '',
    taxId: '',
    modules: ['livestock', 'crops'],
    notes: '',
  });
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle checkbox changes
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
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Save farm profile to database
      const result = await window.electronAPI.saveFarm(formData);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      // Create farm object with ID from result
      const farm = {
        id: result.id,
        ...formData
      };
      
      // Add farm to store and set as active
      addFarm(farm);
      setActiveFarm(farm);
      
      // Mark app as initialized
      setInitialized(true);
      
      // Load farms to ensure state is updated
      await loadFarms();
      
      // Navigate to dashboard
      navigate('/');
      
    } catch (error) {
      console.error('Error setting up farm:', error);
      alert('Failed to set up farm. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Render welcome step
  const renderWelcome = () => (
    <div className="text-center">
      <div className="p-3 rounded-full bg-primary-100 text-primary-600 w-16 h-16 flex items-center justify-center mx-auto mb-6">
        <Leaf size={32} />
      </div>
      
      <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
        Welcome to Agri-POS+
      </h1>
      
      <p className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-md mx-auto">
        Your comprehensive farm management solution. Let's set up your farm profile to get started.
      </p>
      
      <button
        onClick={() => setStep(2)}
        className="btn btn-primary btn-lg"
      >
        Get Started
      </button>
    </div>
  );
  
  // Render farm setup form
  const renderFarmSetup = () => (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
        Set Up Your Farm
      </h1>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
        
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="btn btn-outline"
          >
            Back
          </button>
          
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !formData.name}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                  <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Setting Up...
              </>
            ) : (
              'Create Farm Profile'
            )}
          </button>
        </div>
      </form>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-8">
        {step === 1 ? renderWelcome() : renderFarmSetup()}
        
        {/* Version info */}
        <div className="mt-8 pt-4 border-t border-neutral-200 dark:border-neutral-700 text-center text-xs text-neutral-500 dark:text-neutral-400">
          <p>Agri-POS+ v1.0.0 — Your complete farm management solution</p>
        </div>
      </div>
    </div>
  );
};

export default Setup;