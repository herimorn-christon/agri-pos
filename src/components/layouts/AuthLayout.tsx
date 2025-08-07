import { Outlet } from 'react-router-dom';
import { Leaf } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block p-3 rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400">
            <Leaf size={32} />
          </div>
        </div>
        
        {/* Auth content */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg">
          <Outlet />
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
          <p>&copy; {new Date().getFullYear()} Agri-POS+. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;