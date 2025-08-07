import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../lib/appContext';
import { Leaf, KeyRound, CheckCircle } from 'lucide-react';

const Activate = () => {
  const navigate = useNavigate();
  const { setSubscriptionStatus } = useAppStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [activationKey, setActivationKey] = useState('');
  
  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // In a real app, this would validate the activation key against a backend
      // For this demo, we'll just simulate success
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Set subscription as active with expiry date 1 year from now
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      setSubscriptionStatus(true, expiryDate.toISOString());
      
      // Move to success step
      setStep(2);
      
    } catch (error) {
      console.error('Activation failed:', error);
      alert('Activation failed. Please check your activation key.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleContinue = () => {
    navigate('/');
  };
  
  // Render activation form
  const renderActivationForm = () => (
    <>
      <div className="text-center">
        <div className="mx-auto h-14 w-14 rounded-full bg-primary-100 p-3 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400">
          <KeyRound className="h-8 w-8" />
        </div>
        <h2 className="mt-6 text-3xl font-bold text-neutral-900 dark:text-neutral-100">
          Activate Your Subscription
        </h2>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          Enter your activation key to get started with Agri-POS+
        </p>
      </div>
      
      <form className="mt-8 space-y-6" onSubmit={handleActivate}>
        <div>
          <label htmlFor="activation-key" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Activation Key
          </label>
          <input
            id="activation-key"
            type="text"
            value={activationKey}
            onChange={(e) => setActivationKey(e.target.value)}
            className="input mt-1"
            placeholder="XXXX-XXXX-XXXX-XXXX"
            required
          />
          <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
            You can find your activation key in your purchase email or on your customer portal.
          </p>
        </div>
        
        <div>
          <button
            type="submit"
            disabled={loading || !activationKey}
            className="btn btn-primary w-full flex justify-center py-2 px-4"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                  <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Activating...
              </>
            ) : 'Activate Subscription'}
          </button>
        </div>
        
        <div className="text-center text-sm">
          <span className="text-neutral-600 dark:text-neutral-400">
            Already have an account?{' '}
          </span>
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
            Sign in
          </Link>
        </div>
      </form>
    </>
  );
  
  // Render success message
  const renderSuccess = () => (
    <div className="text-center">
      <div className="mx-auto h-16 w-16 rounded-full bg-success-100 flex items-center justify-center text-success-600 dark:bg-success-900/20 dark:text-success-400">
        <CheckCircle className="h-8 w-8" />
      </div>
      <h2 className="mt-6 text-3xl font-bold text-neutral-900 dark:text-neutral-100">
        Activation Successful!
      </h2>
      <p className="mt-4 text-neutral-600 dark:text-neutral-400">
        Your Agri-POS+ subscription has been activated successfully. You now have access to all features until June 12, 2026.
      </p>
      
      <div className="mt-8">
        <button
          onClick={handleContinue}
          className="btn btn-primary w-full flex justify-center py-2 px-4"
        >
          Continue to Dashboard
        </button>
      </div>
      
      <div className="mt-4">
        <Link to="/login" className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
          Go to login →
        </Link>
      </div>
    </div>
  );
  
  return (
    <div className="max-w-md w-full space-y-8">
      {step === 1 ? renderActivationForm() : renderSuccess()}
    </div>
  );
};

export default Activate;