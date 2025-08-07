import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeDatabase } from './database.js';

// Get __dirname equivalent in ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Handle creating/removing shortcuts on Windows when installing/uninstalling
if (process.platform === 'win32') {
  app.setAppUserModelId('com.agriposplus.app');
}

// Initialize the database
const db = initializeDatabase();

let mainWindow;

const isDev = process.env.NODE_ENV === 'development';

const createWindow = () => {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    icon: path.join(__dirname, '../public/icon.png'),
    show: false,
    backgroundColor: '#f5f5f5',
  });

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    // Open the DevTools in development mode
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    const indexPath = path.join(__dirname, '../dist/index.html');
    mainWindow.loadFile(indexPath);
  }

  // Show window when ready to avoid flickering
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Handle window closing
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

// Create window when Electron is ready
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers for database operations
ipcMain.handle('database:query', async (event, { query, params }) => {
  try {
    if (query.trim().toLowerCase().startsWith('select')) {
      return db.prepare(query).all(params || {});
    } else {
      const statement = db.prepare(query);
      const result = statement.run(params || {});
      return result;
    }
  } catch (error) {
    console.error('Database query error:', error);
    return { error: error.message };
  }
});

// Handle dialog operations
ipcMain.handle('dialog:show', async (event, { type, options }) => {
  switch (type) {
    case 'open':
      return dialog.showOpenDialog(options);
    case 'save':
      return dialog.showSaveDialog(options);
    case 'message':
      return dialog.showMessageBox(options);
    default:
      throw new Error(`Unsupported dialog type: ${type}`);
  }
});

// Handle farm profile operations
ipcMain.handle('farm:getProfiles', async () => {
  try {
    return db.prepare('SELECT * FROM farm_profiles ORDER BY name').all();
  } catch (error) {
    console.error('Error getting farm profiles:', error);
    return { error: error.message };
  }
});

ipcMain.handle('farm:saveFarm', async (event, { farm }) => {
  try {
    const { id, name, address, owner, phone, email, taxId, notes, modules } = farm;
    
    if (id) {
      // Update existing farm
      db.prepare(`
        UPDATE farm_profiles 
        SET name = ?, address = ?, owner = ?, phone = ?, email = ?, tax_id = ?, notes = ?, modules = ?
        WHERE id = ?
      `).run(name, address, owner, phone, email, taxId, notes, JSON.stringify(modules), id);
      return { success: true, id };
    } else {
      // Insert new farm
      const result = db.prepare(`
        INSERT INTO farm_profiles (name, address, owner, phone, email, tax_id, notes, modules)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(name, address, owner, phone, email, taxId, notes, JSON.stringify(modules));
      return { success: true, id: result.lastInsertRowid };
    }
  } catch (error) {
    console.error('Error saving farm profile:', error);
    return { error: error.message };
  }
});