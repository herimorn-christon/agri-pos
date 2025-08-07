import { useState } from 'react';
import Card from '../components/ui/Card';
import { Settings as SettingsIcon, Moon, Sun, Bell, Shield, Key } from 'lucide-react';
import { useAppStore } from '../lib/appContext';

const Settings = () => {
  const { darkMode, toggleDarkMode } = useAppStore();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    critical: true,
  });

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
        Settings
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Appearance */}
        <Card
          title="Appearance"
          subtitle="Customize your application theme"
          icon={<SettingsIcon size={18} />}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  Dark Mode
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Switch between light and dark themes
                </p>
              </div>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-md text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700"
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card
          title="Notifications"
          subtitle="Manage your notification preferences"
          icon={<Bell size={18} />}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  Email Notifications
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Receive updates via email
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={() => handleNotificationChange('email')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  Push Notifications
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Receive desktop notifications
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.push}
                  onChange={() => handleNotificationChange('push')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  Critical Alerts
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Important system notifications
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.critical}
                  onChange={() => handleNotificationChange('critical')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </Card>

        {/* Security */}
        <Card
          title="Security"
          subtitle="Manage your security settings"
          icon={<Shield size={18} />}
        >
          <div className="space-y-4">
            <button className="btn btn-outline w-full justify-start">
              <Key size={16} className="mr-2" />
              Change Password
            </button>
          </div>
        </Card>

        {/* About */}
        <Card
          title="About"
          subtitle="Application information"
          icon={<SettingsIcon size={18} />}
        >
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">Version:</span>{' '}
              <span className="text-neutral-600 dark:text-neutral-400">1.0.0</span>
            </p>
            <p className="text-sm">
              <span className="font-medium">Build:</span>{' '}
              <span className="text-neutral-600 dark:text-neutral-400">2024.03.12</span>
            </p>
            <p className="text-sm">
              <span className="font-medium">License:</span>{' '}
              <span className="text-neutral-600 dark:text-neutral-400">Commercial</span>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;