import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { app } from 'electron';
import { v4 as uuidv4 } from 'uuid';

// Get user data path for storing the database
const getUserDataPath = () => {
  const userDataPath = app.getPath('userData');
  const dbPath = path.join(userDataPath, 'data');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath, { recursive: true });
  }
  
  return dbPath;
};

// Database initialization
export const initializeDatabase = () => {
  const dbPath = path.join(getUserDataPath(), 'agripos.db');
  const db = new Database(dbPath, { verbose: process.env.NODE_ENV === 'development' ? console.log : null });
  
  // Enable foreign keys
  db.pragma('foreign_keys = ON');
  
  // Create tables if they don't exist
  createTables(db);
  
  return db;
};

// Create database tables
const createTables = (db) => {
  // Farm profiles table
  db.exec(`
    CREATE TABLE IF NOT EXISTS farm_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      address TEXT,
      owner TEXT,
      phone TEXT,
      email TEXT,
      tax_id TEXT,
      notes TEXT,
      modules TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Products table (for inventory and sales)
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      farm_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      type TEXT NOT NULL,
      description TEXT,
      sku TEXT,
      unit TEXT,
      price REAL DEFAULT 0,
      cost REAL DEFAULT 0,
      quantity REAL DEFAULT 0,
      min_quantity REAL DEFAULT 0,
      image TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (farm_id) REFERENCES farm_profiles(id) ON DELETE CASCADE
    )
  `);

  // Livestock table
  db.exec(`
    CREATE TABLE IF NOT EXISTS livestock (
      id TEXT PRIMARY KEY,
      farm_id INTEGER NOT NULL,
      name TEXT,
      species TEXT NOT NULL,
      breed TEXT,
      tag_id TEXT,
      status TEXT NOT NULL,
      birth_date TEXT,
      acquisition_date TEXT,
      acquisition_cost REAL DEFAULT 0,
      group_id TEXT,
      parent_female TEXT,
      parent_male TEXT,
      notes TEXT,
      image TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (farm_id) REFERENCES farm_profiles(id) ON DELETE CASCADE
    )
  `);

  // Livestock events table
  db.exec(`
    CREATE TABLE IF NOT EXISTS livestock_events (
      id TEXT PRIMARY KEY,
      livestock_id TEXT NOT NULL,
      event_type TEXT NOT NULL,
      event_date TEXT NOT NULL,
      description TEXT,
      value REAL DEFAULT 0,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (livestock_id) REFERENCES livestock(id) ON DELETE CASCADE
    )
  `);

  // Crops table
  db.exec(`
    CREATE TABLE IF NOT EXISTS crops (
      id TEXT PRIMARY KEY,
      farm_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      crop_type TEXT NOT NULL,
      variety TEXT,
      plot_id TEXT,
      status TEXT NOT NULL,
      planting_date TEXT,
      expected_harvest_date TEXT,
      actual_harvest_date TEXT,
      seed_quantity REAL DEFAULT 0,
      seed_unit TEXT,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (farm_id) REFERENCES farm_profiles(id) ON DELETE CASCADE
    )
  `);

  // Crop events table
  db.exec(`
    CREATE TABLE IF NOT EXISTS crop_events (
      id TEXT PRIMARY KEY,
      crop_id TEXT NOT NULL,
      event_type TEXT NOT NULL,
      event_date TEXT NOT NULL,
      description TEXT,
      product_used TEXT,
      quantity REAL DEFAULT 0,
      unit TEXT,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (crop_id) REFERENCES crops(id) ON DELETE CASCADE
    )
  `);

  // Plot/land table
  db.exec(`
    CREATE TABLE IF NOT EXISTS plots (
      id TEXT PRIMARY KEY,
      farm_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      size REAL DEFAULT 0,
      size_unit TEXT,
      location TEXT,
      soil_type TEXT,
      status TEXT,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (farm_id) REFERENCES farm_profiles(id) ON DELETE CASCADE
    )
  `);

  // Inventory transactions
  db.exec(`
    CREATE TABLE IF NOT EXISTS inventory_transactions (
      id TEXT PRIMARY KEY,
      farm_id INTEGER NOT NULL,
      product_id TEXT NOT NULL,
      transaction_type TEXT NOT NULL,
      quantity REAL NOT NULL,
      unit_price REAL DEFAULT 0,
      total_price REAL DEFAULT 0,
      date TEXT NOT NULL,
      source TEXT,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (farm_id) REFERENCES farm_profiles(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )
  `);

  // Sales/invoices
  db.exec(`
    CREATE TABLE IF NOT EXISTS sales (
      id TEXT PRIMARY KEY,
      farm_id INTEGER NOT NULL,
      invoice_number TEXT,
      customer_name TEXT,
      customer_contact TEXT,
      sale_date TEXT NOT NULL,
      total_amount REAL DEFAULT 0,
      discount_amount REAL DEFAULT 0,
      tax_amount REAL DEFAULT 0,
      final_amount REAL DEFAULT 0,
      payment_method TEXT,
      payment_status TEXT,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (farm_id) REFERENCES farm_profiles(id) ON DELETE CASCADE
    )
  `);

  // Sale items
  db.exec(`
    CREATE TABLE IF NOT EXISTS sale_items (
      id TEXT PRIMARY KEY,
      sale_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      quantity REAL NOT NULL,
      unit_price REAL NOT NULL,
      discount_percentage REAL DEFAULT 0,
      tax_percentage REAL DEFAULT 0,
      total_price REAL NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )
  `);

  // Check if we need to add sample data
  const farmCount = db.prepare('SELECT COUNT(*) as count FROM farm_profiles').get();
  if (farmCount.count === 0) {
    // Add a sample farm profile
    db.prepare(`
      INSERT INTO farm_profiles (name, address, owner, phone, email, modules)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      'Sample Farm',
      '123 Farm Road, Countryside',
      'John Farmer',
      '555-123-4567',
      'john@samplefarm.com',
      JSON.stringify(['livestock', 'crops'])
    );
  }
};