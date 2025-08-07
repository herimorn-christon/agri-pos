import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../lib/appContext';
import { Leaf, Lock } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { loadFarms } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // In a real app, this would validate credentials against a backend
      // For this demo, we'll just simulate success and load farms
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Load farms
      await loadFarms();
      
      // Navigate to dashboard
      navigate('/');
      
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-md w-full space-y-8">
      <div className="text-center">
        <div className="mx-auto h-14 w-14 rounded-full bg-primary-100 p-3 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400">
          <Leaf className="h-8 w-8" />
        </div>
        <h2 className="mt-6 text-3xl font-bold text-neutral-900 dark:text-neutral-100">
          Welcome back
        </h2>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          Sign in to access your farm management system
        </p>
      </div>
      
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4 rounded-md shadow-sm">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="input mt-1"
              placeholder="your@email.com"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={handleChange}
              className="input mt-1"
              placeholder="••••••••"
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-700 dark:text-neutral-300">
              Remember me
            </label>
          </div>
          
          <div className="text-sm">
            <a href="#" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
              Forgot your password?
            </a>
          </div>
        </div>
        
        <div>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full flex justify-center py-2 px-4"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                  <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Sign in
              </>
            )}
          </button>
        </div>
        
        <div className="text-center text-sm">
          <span className="text-neutral-600 dark:text-neutral-400">
            Don't have a subscription yet?{' '}
          </span>
          <Link to="/activate" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
            Activate now
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;