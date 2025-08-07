import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Farm {
  id: number;
  name: string;
  address?: string;
  owner?: string;
  phone?: string;
  email?: string;
  taxId?: string;
  notes?: string;
  modules: string[];
}

interface AppState {
  initialized: boolean;
  subscriptionActive: boolean;
  subscriptionExpiry: string | null;
  darkMode: boolean;
  loading: boolean;
  farms: Farm[];
  activeFarm: Farm | null;
  
  // Actions
  setInitialized: (value: boolean) => void;
  setSubscriptionStatus: (active: boolean, expiry?: string) => void;
  toggleDarkMode: () => void;
  setActiveFarm: (farm: Farm | null) => void;
  addFarm: (farm: Farm) => void;
  updateFarm: (farm: Farm) => void;
  loadFarms: () => Promise<void>;
  checkSubscription: () => Promise<boolean>;
}

// Create the store
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      initialized: false,
      subscriptionActive: true, // Default to active for demo
      subscriptionExpiry: null,
      darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
      loading: true,
      farms: [],
      activeFarm: null,
      
      // Actions
      setInitialized: (value) => set({ initialized: value }),
      
      setSubscriptionStatus: (active, expiry) => set({ 
        subscriptionActive: active,
        subscriptionExpiry: expiry || null 
      }),
      
      toggleDarkMode: () => {
        const newDarkMode = !get().darkMode;
        set({ darkMode: newDarkMode });
        
        // Apply to document
        if (newDarkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
      
      setActiveFarm: (farm) => set({ activeFarm: farm }),
      
      addFarm: (farm) => set((state) => ({ 
        farms: [...state.farms, farm] 
      })),
      
      updateFarm: (farm) => set((state) => ({
        farms: state.farms.map(f => f.id === farm.id ? farm : f),
        activeFarm: state.activeFarm?.id === farm.id ? farm : state.activeFarm
      })),
      
      loadFarms: async () => {
        try {
          const farms = await window.electronAPI.getFarmProfiles();
          set({ farms, loading: false });
          
          // Set active farm to first farm if none is selected
          if (farms.length > 0 && !get().activeFarm) {
            set({ activeFarm: farms[0] });
          }
          
          return farms;
        } catch (error) {
          console.error('Failed to load farms:', error);
          set({ loading: false });
          return [];
        }
      },
      
      checkSubscription: async () => {
        // In a real app, this would validate with a server
        // For now, we'll simulate a successful check
        try {
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Set subscription as active with expiry date 1 year from now
          const expiryDate = new Date();
          expiryDate.setFullYear(expiryDate.getFullYear() + 1);
          
          set({ 
            subscriptionActive: true,
            subscriptionExpiry: expiryDate.toISOString(),
            loading: false
          });
          
          // Load farms after subscription check
          await get().loadFarms();
          
          return true;
        } catch (error) {
          console.error('Subscription check failed:', error);
          set({ 
            subscriptionActive: false,
            loading: false
          });
          return false;
        }
      }
    }),
    {
      name: 'agri-pos-storage',
      partialize: (state) => ({
        initialized: state.initialized,
        darkMode: state.darkMode,
        activeFarm: state.activeFarm?.id, // Only store the ID
      }),
    }
  )
);

// Initialize dark mode on load
if (useAppStore.getState().darkMode) {
  document.documentElement.classList.add('dark');
}