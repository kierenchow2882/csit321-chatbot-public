export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType?: string;
  fuel_type?: string;
  transmission: string;
  color: string;
  imageUrl?: string;
  image_url?: string;
  featured: boolean;
  description: string;
  status?: string;
  vin?: string;
  engine?: string;
  drivetrain?: string;
  exterior_color?: string;
  interior_color?: string;
  mpg_city?: number;
  mpg_highway?: number;
  range?: number; // For electric vehicles
  charging_time?: string; // For electric vehicles
  features?: string[];
  created_at?: string;
  updated_at?: string;
}

export type NavigationLink = {
  name: string;
  path: string;
  icon?: string;
};

export interface TestDrive {
  id: string;
  user_id: string;
  vehicle_id: string;
  booking_date: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  notes?: string;
  admin_notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface ChatMessage {
  id: string;
  user_id?: string;
  session_id: string;
  message: string;
  sender: 'user' | 'bot';
  created_at: string;
}

export interface Feedback {
  id: string;
  user_id?: string;
  vehicle_id?: string;
  rating: number;
  comment: string;
  category: string;
  status: 'active' | 'archived' | 'flagged';
  created_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  phone?: string;
  status: 'active' | 'inactive';
  hire_date?: string;
  bio?: string;
  created_at?: string;
  updated_at?: string;
}

export interface KnowledgeBaseItem {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  status: 'active' | 'inactive' | 'draft';
  is_featured: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface ChatbotSettings {
  id: string;
  setting_key: string;
  setting_value: any;
  description?: string;
  is_active: boolean;
  updated_at: string;
  updated_by?: string;
}

export interface FinancingApplication {
  id: string;
  user_id: string;
  vehicle_id: string;
  loan_amount: number;
  down_payment: number;
  loan_term: number;
  interest_rate: number;
  monthly_payment: number;
  annual_income: number;
  employment_status: string;
  credit_score?: number;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  created_at: string;
  updated_at: string;
}

export interface VehicleImage {
  id: string;
  vehicle_id: string;
  image_url: string;
  alt_text: string;
  is_primary: boolean;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: 'user' | 'admin' | 'manager' | 'sales';
  phone?: string;
  address?: string;
  date_of_birth?: string;
  created_at: string;
  updated_at: string;
}

export interface VehicleFilters {
  make?: string;
  model?: string;
  year?: number;
  min_price?: number;
  max_price?: number;
  fuel_type?: string;
  transmission?: string;
  color?: string;
  max_mileage?: number;
  featured?: boolean;
  status?: string;
  search?: string;
  sort_by?: 'price_asc' | 'price_desc' | 'year_desc' | 'mileage_asc' | 'featured';
}