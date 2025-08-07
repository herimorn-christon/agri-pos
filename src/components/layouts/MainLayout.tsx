import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../lib/appContext';

// Components
import Sidebar from '../ui/Sidebar';
import Header from '../ui/Header';

// Icons
import { Menu, X } from 'lucide-react';

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { activeFarm, farms, loadFarms, setActiveFarm } = useAppStore();
  
  useEffect(() => {
    // Close sidebar on route change on mobile
    setSidebarOpen(false);
  }, [location]);
  
  useEffect(() => {
    // Load farms if needed
    if (farms.length === 0) {
      loadFarms();
    }
  }, [farms.length, loadFarms]);
  
  // Handle farm switching
  const handleFarmChange = (farmId: number) => {
    const selectedFarm = farms.find(farm => farm.id === farmId);
    if (selectedFarm) {
      setActiveFarm(selectedFarm);
      // Navigate to dashboard when switching farms
      navigate('/');
    }
  };
  
  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50 dark:bg-neutral-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-neutral-900/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white dark:bg-neutral-800 shadow-lg transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700">
          <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">Agri-POS+</h1>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-md text-neutral-500 hover:bg-neutral-100 lg:hidden dark:hover:bg-neutral-700"
          >
            <X size={20} />
          </button>
        </div>
        <Sidebar activeFarm={activeFarm} farms={farms} onFarmChange={handleFarmChange} />
      </div>
      
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header>
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 mr-2 rounded-md text-neutral-500 hover:bg-neutral-100 lg:hidden dark:hover:bg-neutral-700"
          >
            <Menu size={20} />
          </button>
        </Header>
        
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;