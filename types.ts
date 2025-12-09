export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  trackStock: boolean;
  image?: string;
}

export interface LineItem {
  id: string;
  productId?: string;
  description: string;
  quantity: number;
  price: number;
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
}

export interface Invoice {
  id: string;
  number: string;
  date: string; // ISO string
  customer: Customer;
  items: LineItem[];
  notes?: string;
  status: 'draft' | 'paid' | 'sent';
  currency: string;
  
  // Financials
  subtotal: number;
  discount: number; // Fixed amount
  taxRate: number; // Percentage
  shipping: number; // Fixed amount
  handling?: number; // Fixed amount
  packaging?: number; // Fixed amount
  total: number;
}

export interface BusinessProfile {
  name: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  taxNumber?: string; // GST, VAT, etc.
  currency: string;
  defaultTaxRate?: number;
  defaultHandling?: number;
  defaultPackaging?: number;
}

export interface User {
  id: string;
  email: string;
  password?: string; // In a real app, never store plain text
  name: string;
  role: 'super_admin' | 'user';
  status: 'pending' | 'approved' | 'rejected';
  registeredAt: string;
}

export type AppState = {
  users: User[];
  currentUser: User | null;
  invoices: Invoice[];
  customers: Customer[];
  products: Product[];
  profile: BusinessProfile;
};