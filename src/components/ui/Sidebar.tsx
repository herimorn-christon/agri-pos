import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Tractor, 
  Store, 
  Leaf, 
  Fish, 
  BadgeDollarSign, 
  LineChart, 
  Settings, 
  Building, 
  TrendingUp
} from 'lucide-react';
import { FarmProfile } from '../../lib/types';

interface SidebarProps {
  activeFarm: FarmProfile | null;
  farms: FarmProfile[];
  onFarmChange: (farmId: number) => void;
}

const Sidebar = ({ activeFarm, farms, onFarmChange }: SidebarProps) => {
  const location = useLocation();
  const modules = activeFarm?.modules || [];
  
  const getActiveClass = (path: string) => {
    return location.pathname.startsWith(path) 
      ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400" 
      : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700/50";
  };
  
  // Farm selector
  const renderFarmSelector = () => {
    if (farms.length <= 1) return null;
    
    return (
      <div className="px-3 py-2">
        <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
          Current Farm
        </label>
        <select 
          className="w-full rounded-md border border-neutral-300 bg-white px-3 py-1 text-sm dark:bg-neutral-700 dark:border-neutral-600"
          value={activeFarm?.id || ''}
          onChange={(e) => onFarmChange(Number(e.target.value))}
        >
          {farms.map(farm => (
            <option key={farm.id} value={farm.id}>{farm.name}</option>
          ))}
        </select>
      </div>
    );
  };
  
  return (
    <div className="flex flex-col h-full overflow-y-auto py-2">
      {renderFarmSelector()}
      
      <nav className="flex-1 px-2 py-3 space-y-1">
        <Link 
          to="/" 
          className={`flex items-center px-3 py-2 text-sm rounded-md ${getActiveClass('/')}`}
        >
          <LayoutDashboard size={18} className="mr-3" />
          Dashboard
        </Link>
        
        <Link 
          to="/farm-profile" 
          className={`flex items-center px-3 py-2 text-sm rounded-md ${getActiveClass('/farm-profile')}`}
        >
          <Building size={18} className="mr-3" />
          Farm Profile
        </Link>
        
        {modules.includes('livestock') && (
          <Link 
            to="/livestock" 
            className={`flex items-center px-3 py-2 text-sm rounded-md ${getActiveClass('/livestock')}`}
          >
            <Tractor size={18} className="mr-3" />
            Livestock
          </Link>
        )}
        
        {modules.includes('crops') && (
          <Link 
            to="/crops" 
            className={`flex items-center px-3 py-2 text-sm rounded-md ${getActiveClass('/crops')}`}
          >
            <Leaf size={18} className="mr-3" />
            Crops
          </Link>
        )}
        
        {modules.includes('aquaculture') && (
          <Link 
            to="/aquaculture" 
            className={`flex items-center px-3 py-2 text-sm rounded-md ${getActiveClass('/aquaculture')}`}
          >
            <Fish size={18} className="mr-3" />
            Aquaculture
          </Link>
        )}
        
        <Link 
          to="/inventory" 
          className={`flex items-center px-3 py-2 text-sm rounded-md ${getActiveClass('/inventory')}`}
        >
          <Store size={18} className="mr-3" />
          Inventory
        </Link>
        
        <Link 
          to="/sales" 
          className={`flex items-center px-3 py-2 text-sm rounded-md ${getActiveClass('/sales')}`}
        >
          <BadgeDollarSign size={18} className="mr-3" />
          Sales & POS
        </Link>
        
        <Link 
          to="/reports" 
          className={`flex items-center px-3 py-2 text-sm rounded-md ${getActiveClass('/reports')}`}
        >
          <LineChart size={18} className="mr-3" />
          Reports
        </Link>
        
        <Link 
          to="/settings" 
          className={`flex items-center px-3 py-2 text-sm rounded-md ${getActiveClass('/settings')}`}
        >
          <Settings size={18} className="mr-3" />
          Settings
        </Link>
      </nav>
      
      {/* Version info */}
      <div className="px-4 py-3 mt-auto text-xs text-neutral-500 border-t dark:text-neutral-400 dark:border-neutral-700">
        <div className="flex items-center">
          <TrendingUp size={14} className="mr-1" />
          <span>Agri-POS+ v1.0.0</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;