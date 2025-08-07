import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './lib/appContext';

// Layout components
import MainLayout from './components/layouts/MainLayout';
import AuthLayout from './components/layouts/AuthLayout';

// Pages
import Dashboard from './pages/Dashboard';
import FarmProfile from './pages/FarmProfile';
import Livestock from './pages/livestock/Livestock';
import Crops from './pages/crops/Crops';
import Inventory from './pages/inventory/Inventory';
import Sales from './pages/sales/Sales';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Setup from './pages/Setup';

// Authentication
import Login from './pages/auth/Login';
import Activate from './pages/auth/Activate';

function App() {
  const { initialized, activeFarm, loading, checkSubscription } = useAppStore();
  const [subscriptionChecked, setSubscriptionChecked] = useState(false);

  useEffect(() => {
    // Check subscription status on startup
    const checkStatus = async () => {
      await checkSubscription();
      setSubscriptionChecked(true);
    };
    
    checkStatus();
  }, [checkSubscription]);

  if (loading || !subscriptionChecked) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-50 dark:bg-neutral-900">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-primary-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <h2 className="text-xl font-medium text-neutral-900 dark:text-neutral-100">Loading Agri-POS+</h2>
          <p className="text-neutral-600 dark:text-neutral-400">Please wait while we prepare your farm management system...</p>
        </div>
      </div>
    );
  }

  // If not initialized, show setup
  if (!initialized) {
    return (
      <Routes>
        <Route path="/" element={<Setup />} />
        <Route path="/activate" element={<Activate />} />
        <Route path="*" element={<Navigate to="/\" replace />} />
      </Routes>
    );
  }

  // If subscription inactive, show login/activate
  if (!activeFarm) {
    return (
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/activate" element={<Activate />} />
          <Route path="*" element={<Navigate to="/login\" replace />} />
        </Route>
      </Routes>
    );
  }

  // Main application routes
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/farm-profile" element={<FarmProfile />} />
        <Route path="/livestock/*" element={<Livestock />} />
        <Route path="/crops/*" element={<Crops />} />
        <Route path="/inventory/*" element={<Inventory />} />
        <Route path="/sales/*" element={<Sales />} />
        <Route path="/reports/*" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/\" replace />} />
      </Route>
    </Routes>
  );
}

export default App;