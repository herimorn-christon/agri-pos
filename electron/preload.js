import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Database operations
  queryDatabase: (args) => ipcRenderer.invoke('database:query', args),
  
  // Farm profile operations
  getFarmProfiles: () => ipcRenderer.invoke('farm:getProfiles'),
  saveFarm: (farm) => ipcRenderer.invoke('farm:saveFarm', { farm }),
  
  // Dialog operations
  showDialog: (args) => ipcRenderer.invoke('dialog:show', args),
  
  // App info
  getAppVersion: () => ipcRenderer.invoke('app:getVersion'),
  
  // Subscription validation
  validateSubscription: (key) => ipcRenderer.invoke('subscription:validate', { key }),

  // Generate unique ID (uses UUID v4)
  generateId: () => crypto.randomUUID(),
});