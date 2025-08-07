import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../lib/appContext';
import { DashboardStats, ChartData } from '../lib/types';
import Card from '../components/ui/Card';

// Charts
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Icons
import { 
  Tractor, 
  Leaf, 
  Store, 
  BadgeDollarSign, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  Calendar
} from 'lucide-react';

const Dashboard = () => {
  const { activeFarm } = useAppStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [salesData, setSalesData] = useState<ChartData | null>(null);
  const [inventoryData, setInventoryData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        // In a real app, fetch data from database
        // Simulating data for demo purposes
        
        // Simulated stats
        const demoStats: DashboardStats = {
          livestock_count: 48,
          crop_count: 12,
          low_inventory_count: 5,
          sales_today: 3,
          revenue_today: 450,
          revenue_month: 8750,
          expenses_month: 3200,
          profit_month: 5550
        };
        
        // Simulated sales data
        const demoSalesData: ChartData = {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              label: 'Revenue',
              data: [4500, 5200, 6800, 5900, 6300, 8750],
              backgroundColor: '#4CAF50',
            },
            {
              label: 'Expenses',
              data: [2300, 2800, 3100, 2700, 3000, 3200],
              backgroundColor: '#FF9800',
            }
          ]
        };
        
        // Simulated inventory data
        const demoInventoryData: ChartData = {
          labels: ['Feed', 'Seeds', 'Fertilizer', 'Medicine', 'Tools', 'Other'],
          datasets: [
            {
              label: 'Inventory Value',
              data: [3500, 1200, 900, 600, 1800, 500],
              backgroundColor: [
                '#2196F3', '#4CAF50', '#FFC107', '#F44336', '#9C27B0', '#607D8B'
              ],
              borderWidth: 1,
            }
          ]
        };
        
        setStats(demoStats);
        setSalesData(demoSalesData);
        setInventoryData(demoInventoryData);
        
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadDashboardData();
  }, [activeFarm]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-120px)]">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-primary-600 mx-auto mb-4\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
            <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-neutral-600 dark:text-neutral-400">Loading dashboard data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          Farm Dashboard
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Overview of {activeFarm?.name || 'your farm'}
        </p>
      </div>
      
      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Livestock" 
          value={stats?.livestock_count || 0} 
          icon={<Tractor />} 
          link="/livestock"
          color="bg-livestock-100 text-livestock-900"
        />
        
        <StatCard 
          title="Crops" 
          value={stats?.crop_count || 0} 
          icon={<Leaf />} 
          link="/crops"
          color="bg-crops-100 text-crops-900"
        />
        
        <StatCard 
          title="Low Inventory" 
          value={stats?.low_inventory_count || 0} 
          icon={<Store />} 
          link="/inventory"
          color="bg-warning-100 text-warning-900"
        />
        
        <StatCard 
          title="Today's Sales" 
          value={stats?.sales_today || 0} 
          subvalue={`$${stats?.revenue_today || 0}`}
          icon={<BadgeDollarSign />} 
          link="/sales"
          color="bg-secondary-100 text-secondary-900"
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Financial summary */}
        <Card 
          title="Monthly Financial Summary"
          className="lg:col-span-2"
          icon={<TrendingUp size={18} />}
        >
          <div className="flex flex-wrap justify-between mb-4">
            <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-3 mb-2">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Revenue</p>
              <p className="text-xl font-semibold text-primary-600">${stats?.revenue_month || 0}</p>
              <div className="flex items-center text-xs text-success-600 mt-1">
                <TrendingUp size={14} className="mr-1" />
                <span>+12% from last month</span>
              </div>
            </div>
            
            <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-3 mb-2">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Expenses</p>
              <p className="text-xl font-semibold text-warning-600">${stats?.expenses_month || 0}</p>
              <div className="flex items-center text-xs text-error-600 mt-1">
                <TrendingUp size={14} className="mr-1" />
                <span>+5% from last month</span>
              </div>
            </div>
            
            <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-3 mb-2">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Profit</p>
              <p className="text-xl font-semibold text-success-600">${stats?.profit_month || 0}</p>
              <div className="flex items-center text-xs text-success-600 mt-1">
                <TrendingUp size={14} className="mr-1" />
                <span>+18% from last month</span>
              </div>
            </div>
          </div>
          
          {salesData && (
            <div className="h-64">
              <Bar 
                data={salesData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                    }
                  }
                }} 
              />
            </div>
          )}
          
          <div className="mt-4 text-center">
            <Link 
              to="/reports" 
              className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              View detailed reports →
            </Link>
          </div>
        </Card>
        
        {/* Inventory breakdown */}
        <Card 
          title="Inventory Value"
          icon={<Store size={18} />}
        >
          {inventoryData && (
            <div className="h-64">
              <Pie 
                data={inventoryData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                }} 
              />
            </div>
          )}
          
          <div className="mt-4 text-center">
            <Link 
              to="/inventory" 
              className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              Manage inventory →
            </Link>
          </div>
        </Card>
      </div>
      
      {/* Upcoming activities and alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card 
          title="Upcoming Activities"
          icon={<Calendar size={18} />}
        >
          <div className="space-y-3">
            <ActivityItem 
              date="Today" 
              title="Vaccinate cattle herd" 
              type="livestock" 
            />
            <ActivityItem 
              date="Tomorrow" 
              title="Fertilize corn fields" 
              type="crops" 
            />
            <ActivityItem 
              date="Jun 15" 
              title="Harvest wheat" 
              type="crops" 
            />
            <ActivityItem 
              date="Jun 18" 
              title="Veterinary checkup" 
              type="livestock" 
            />
          </div>
          
          <div className="mt-4 text-center">
            <button className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              View all scheduled activities →
            </button>
          </div>
        </Card>
        
        <Card 
          title="Alerts & Notifications"
          icon={<AlertTriangle size={18} />}
        >
          <div className="space-y-3">
            <AlertItem 
              severity="high" 
              message="5 inventory items below minimum threshold" 
              actionLink="/inventory" 
              actionText="View inventory" 
            />
            <AlertItem 
              severity="medium" 
              message="Cattle feed will last for only 5 more days" 
              actionLink="/inventory" 
              actionText="Order feed" 
            />
            <AlertItem 
              severity="low" 
              message="Weather alert: Heavy rain expected next week" 
              actionText="Prepare fields" 
            />
            <AlertItem 
              severity="info" 
              message="Annual subscription will renew in 15 days" 
              actionLink="/settings" 
              actionText="Manage subscription" 
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

// Helper components
interface StatCardProps {
  title: string;
  value: number;
  subvalue?: string;
  icon: React.ReactNode;
  link?: string;
  color: string;
}

const StatCard = ({ title, value, subvalue, icon, link, color }: StatCardProps) => {
  const content = (
    <div className="card p-4 transition-all hover:shadow-md">
      <div className="flex items-center">
        <div className={`p-3 rounded-full mr-4 ${color}`}>
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">{title}</h3>
          <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{value}</p>
          {subvalue && <p className="text-sm text-neutral-500 dark:text-neutral-400">{subvalue}</p>}
        </div>
      </div>
    </div>
  );
  
  if (link) {
    return <Link to={link}>{content}</Link>;
  }
  
  return content;
};

interface ActivityItemProps {
  date: string;
  title: string;
  type: 'livestock' | 'crops' | 'general';
}

const ActivityItem = ({ date, title, type }: ActivityItemProps) => {
  const getTypeColor = () => {
    switch (type) {
      case 'livestock':
        return 'bg-livestock-100 text-livestock-900';
      case 'crops':
        return 'bg-crops-100 text-crops-900';
      default:
        return 'bg-neutral-100 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300';
    }
  };
  
  return (
    <div className="flex items-center p-2 hover:bg-neutral-50 rounded-md dark:hover:bg-neutral-800">
      <div className="text-center mr-4 w-16">
        <span className="text-sm font-medium block text-neutral-600 dark:text-neutral-400">{date}</span>
      </div>
      <div className="flex-1">
        <p className="font-medium text-neutral-900 dark:text-neutral-100">{title}</p>
      </div>
      <div className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor()}`}>
        {type}
      </div>
    </div>
  );
};

interface AlertItemProps {
  severity: 'high' | 'medium' | 'low' | 'info';
  message: string;
  actionLink?: string;
  actionText?: string;
}

const AlertItem = ({ severity, message, actionLink, actionText }: AlertItemProps) => {
  const getSeverityColor = () => {
    switch (severity) {
      case 'high':
        return 'bg-error-100 text-error-900';
      case 'medium':
        return 'bg-warning-100 text-warning-900';
      case 'low':
        return 'bg-secondary-100 text-secondary-900';
      case 'info':
        return 'bg-neutral-100 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300';
    }
  };
  
  return (
    <div className="flex items-start p-2 hover:bg-neutral-50 rounded-md dark:hover:bg-neutral-800">
      <div className={`px-2 py-1 rounded text-xs font-medium mr-3 ${getSeverityColor()}`}>
        {severity}
      </div>
      <div className="flex-1">
        <p className="font-medium text-neutral-900 dark:text-neutral-100">{message}</p>
        {actionText && (
          <div className="mt-1">
            {actionLink ? (
              <Link to={actionLink} className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                {actionText} →
              </Link>
            ) : (
              <button className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                {actionText} →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;