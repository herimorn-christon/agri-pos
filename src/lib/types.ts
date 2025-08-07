// Common Types
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at?: string;
}

export interface FarmProfile {
  id: number;
  name: string;
  address?: string;
  owner?: string;
  phone?: string;
  email?: string;
  tax_id?: string;
  notes?: string;
  modules: string[];
  created_at?: string;
  updated_at?: string;
}

// Livestock Types
export interface Livestock extends BaseEntity {
  farm_id: number;
  name?: string;
  species: string;
  breed?: string;
  tag_id?: string;
  status: 'active' | 'sold' | 'deceased' | 'transferred';
  birth_date?: string;
  acquisition_date?: string;
  acquisition_cost?: number;
  group_id?: string;
  parent_female?: string;
  parent_male?: string;
  notes?: string;
  image?: string;
}

export interface LivestockEvent extends BaseEntity {
  livestock_id: string;
  event_type: 'birth' | 'purchase' | 'sale' | 'health' | 'feed' | 'weight' | 'breeding' | 'vaccination' | 'medication' | 'death' | 'other';
  event_date: string;
  description?: string;
  value?: number;
  notes?: string;
}

// Crop Types
export interface Crop extends BaseEntity {
  farm_id: number;
  name: string;
  crop_type: string;
  variety?: string;
  plot_id?: string;
  status: 'planned' | 'planted' | 'growing' | 'harvested' | 'failed';
  planting_date?: string;
  expected_harvest_date?: string;
  actual_harvest_date?: string;
  seed_quantity?: number;
  seed_unit?: string;
  notes?: string;
}

export interface CropEvent extends BaseEntity {
  crop_id: string;
  event_type: 'planting' | 'irrigation' | 'fertilization' | 'pesticide' | 'weeding' | 'pruning' | 'harvest' | 'other';
  event_date: string;
  description?: string;
  product_used?: string;
  quantity?: number;
  unit?: string;
  notes?: string;
}

export interface Plot extends BaseEntity {
  farm_id: number;
  name: string;
  size?: number;
  size_unit?: string;
  location?: string;
  soil_type?: string;
  status?: 'available' | 'in_use' | 'fallow' | 'unavailable';
  notes?: string;
}

// Inventory Types
export interface Product extends BaseEntity {
  farm_id: number;
  name: string;
  category: string;
  type: 'input' | 'output' | 'asset' | 'service';
  description?: string;
  sku?: string;
  unit?: string;
  price: number;
  cost: number;
  quantity: number;
  min_quantity?: number;
  image?: string;
}

export interface InventoryTransaction extends BaseEntity {
  farm_id: number;
  product_id: string;
  transaction_type: 'purchase' | 'sale' | 'adjustment' | 'transfer' | 'production' | 'loss';
  quantity: number;
  unit_price: number;
  total_price: number;
  date: string;
  source?: string;
  notes?: string;
}

// Sales Types
export interface Sale extends BaseEntity {
  farm_id: number;
  invoice_number?: string;
  customer_name?: string;
  customer_contact?: string;
  sale_date: string;
  total_amount: number;
  discount_amount?: number;
  tax_amount?: number;
  final_amount: number;
  payment_method?: string;
  payment_status: 'paid' | 'partial' | 'pending' | 'cancelled';
  notes?: string;
}

export interface SaleItem extends BaseEntity {
  sale_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  discount_percentage?: number;
  tax_percentage?: number;
  total_price: number;
}

// Dashboard Types
export interface DashboardStats {
  livestock_count: number;
  crop_count: number;
  low_inventory_count: number;
  sales_today: number;
  revenue_today: number;
  revenue_month: number;
  expenses_month: number;
  profit_month: number;
}

// Chart data types
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

// Report Types
export interface ReportFilters {
  dateFrom?: string;
  dateTo?: string;
  category?: string;
  type?: string;
  status?: string;
}

export interface ReportData {
  title: string;
  subtitle?: string;
  columns: { key: string; label: string }[];
  data: Record<string, any>[];
  summary?: Record<string, any>;
}