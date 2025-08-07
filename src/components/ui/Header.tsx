import { ReactNode } from 'react';
import { useAppStore } from '../../lib/appContext';
import { Sun, Moon, Bell, User } from 'lucide-react';

interface HeaderProps {
  children?: ReactNode;
}

const Header = ({ children }: HeaderProps) => {
  const { darkMode, toggleDarkMode, activeFarm } = useAppStore();
  
  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          {children}
          <h2 className="text-lg font-semibold truncate">
            {activeFarm?.name || 'Agri-POS+'}
          </h2>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Dark mode toggle */}
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          {/* Notifications */}
          <button 
            className="p-2 rounded-full text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700"
            aria-label="Notifications"
          >
            <Bell size={18} />
          </button>
          
          {/* User menu */}
          <button 
            className="flex items-center text-sm bg-neutral-100 hover:bg-neutral-200 rounded-full p-1 dark:bg-neutral-700 dark:hover:bg-neutral-600"
            aria-label="User menu"
          >
            <User size={24} className="text-neutral-600 dark:text-neutral-300" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;