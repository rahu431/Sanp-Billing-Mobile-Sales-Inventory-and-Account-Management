import { useState, useEffect, useCallback } from 'react';
import { Invoice, Customer, BusinessProfile, Product, User } from './types';

const STORAGE_KEY = 'snapbill_data_v6_demo';
const SUPER_ADMIN_EMAIL = 'rahu431@gmail.com';

// Helper for currency detection
const getDetectedCurrency = () => {
  if (typeof navigator === 'undefined') return '$';
  const lang = navigator.language;
  // Simple heuristic for common currencies
  if (lang.includes('IN') || lang.includes('hi')) return '₹';
  if (lang.includes('GB') || lang.includes('UK')) return '£';
  if (lang.includes('JP')) return '¥';
  if (lang.match(/^(de|fr|it|es|nl|pt)/)) return '€';
  return '$';
};

const DEFAULT_PROFILE: BusinessProfile = {
  name: 'Bean & Spice Traders',
  email: SUPER_ADMIN_EMAIL,
  taxNumber: 'GST-882910',
  currency: '$', // Default fallback, overridden on init
  defaultTaxRate: 0,
  defaultHandling: 0,
  defaultPackaging: 0,
};

const SAMPLE_PRODUCTS: Product[] = [
  { 
    id: 'p1', 
    name: 'Ethiopian Yirgacheffe (250g)', 
    description: 'Floral and citrus notes, medium roast', 
    price: 18.00, 
    stock: 45, 
    trackStock: true,
    image: 'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?auto=format&fit=crop&q=80&w=200'
  },
  { 
    id: 'p2', 
    name: 'Colombian Supremo (1kg)', 
    description: 'Rich and nutty, dark roast', 
    price: 45.00, 
    stock: 15, 
    trackStock: true,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=200'
  },
];

const SAMPLE_CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'Alice Walker', email: 'alice@example.com' },
];

const SAMPLE_INVOICES: Invoice[] = [
  {
    id: 'inv1',
    number: 'INV-0001',
    date: new Date(Date.now() - 172800000).toISOString(),
    customer: SAMPLE_CUSTOMERS[0],
    items: [
      { id: 'i1', productId: 'p1', description: 'Ethiopian Yirgacheffe (250g)', quantity: 1, price: 18.00 },
    ],
    status: 'paid',
    currency: '$', // Will be updated on init
    subtotal: 18.00,
    discount: 0,
    taxRate: 0,
    shipping: 0,
    total: 18.00
  },
];

export const useStore = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [profile, setProfile] = useState<BusinessProfile>(DEFAULT_PROFILE);
  const [loaded, setLoaded] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setInvoices(parsed.invoices || []);
        setCustomers(parsed.customers || []);
        setProducts(parsed.products || []);
        setProfile({ ...DEFAULT_PROFILE, ...parsed.profile });
        setUsers(parsed.users || []);
        // Re-hydrate session if valid
        if (parsed.currentUser) {
           setCurrentUser(parsed.currentUser);
        }
      } catch (e) {
        console.error("Failed to parse storage", e);
      }
    } else {
      // Initialize Default Data
      const detectedCurrency = getDetectedCurrency();
      
      // Update samples with detected currency
      const currencyInvoices = SAMPLE_INVOICES.map(inv => ({
        ...inv,
        currency: detectedCurrency
      }));

      setInvoices(currencyInvoices);
      setCustomers(SAMPLE_CUSTOMERS);
      setProducts(SAMPLE_PRODUCTS);
      setProfile({ ...DEFAULT_PROFILE, currency: detectedCurrency });
      
      // Initialize Super Admin
      const superAdmin: User = {
        id: 'admin_01',
        name: 'Rahul (Super Admin)',
        email: SUPER_ADMIN_EMAIL,
        password: 'admin', // Demo password
        role: 'super_admin',
        status: 'approved',
        registeredAt: new Date().toISOString()
      };
      setUsers([superAdmin]);
    }
    setLoaded(true);
  }, []);

  // Save to local storage
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ 
        invoices, customers, products, profile, users, currentUser 
      }));
    }
  }, [invoices, customers, products, profile, users, currentUser, loaded]);

  // Auth Actions
  const register = useCallback((email: string, password: string, name: string) => {
    const isSuperAdmin = email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
    
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        return { success: false, message: 'Email already registered.' };
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      password,
      name,
      role: isSuperAdmin ? 'super_admin' : 'user',
      status: isSuperAdmin ? 'approved' : 'pending',
      registeredAt: new Date().toISOString()
    };

    setUsers(prev => [...prev, newUser]);
    return { success: true, message: isSuperAdmin ? 'Welcome back, Super Admin.' : 'Registration successful! Waiting for approval.' };
  }, [users]);

  const login = useCallback((email: string, password: string) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    
    if (!user) {
      return { success: false, message: 'Invalid credentials' };
    }
    
    if (user.status !== 'approved') {
      return { success: false, message: 'Account pending approval by Admin.' };
    }

    setCurrentUser(user);
    return { success: true };
  }, [users]);

  const socialLogin = useCallback((email: string, name: string) => {
      // Simplified mock social login
      const isSuperAdmin = email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
      let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
          user = {
            id: Math.random().toString(36).substr(2, 9),
            email,
            name,
            role: isSuperAdmin ? 'super_admin' : 'user',
            status: isSuperAdmin ? 'approved' : 'pending',
            registeredAt: new Date().toISOString()
          };
          setUsers(prev => [...prev, user!]);
      }

      if (user.status !== 'approved') {
          return { success: false, message: 'Account pending approval by Admin.' };
      }

      setCurrentUser(user);
      return { success: true };
  }, [users]);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const approveUser = useCallback((userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'approved' } : u));
  }, []);

  const rejectUser = useCallback((userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'rejected' } : u));
  }, []);

  // Data Actions
  const addInvoice = useCallback((invoice: Invoice) => {
    setInvoices(prev => [invoice, ...prev]);
    setCustomers(prev => {
      if (!prev.find(c => c.name.toLowerCase() === invoice.customer.name.toLowerCase())) {
        return [...prev, invoice.customer];
      }
      return prev;
    });
    setProducts(prevProducts => {
      const newProducts = [...prevProducts];
      invoice.items.forEach(item => {
        if (item.productId) {
          const productIndex = newProducts.findIndex(p => p.id === item.productId);
          if (productIndex >= 0 && newProducts[productIndex].trackStock) {
            newProducts[productIndex] = {
              ...newProducts[productIndex],
              stock: newProducts[productIndex].stock - item.quantity
            };
          }
        }
      });
      return newProducts;
    });
  }, []);

  const updateInvoice = useCallback((updated: Invoice) => {
    setInvoices(prev => prev.map(inv => inv.id === updated.id ? updated : inv));
  }, []);

  const deleteInvoice = useCallback((id: string) => {
    setInvoices(prev => prev.filter(inv => inv.id !== id));
  }, []);

  const addProduct = useCallback((product: Product) => {
    setProducts(prev => [...prev, product]);
  }, []);

  const updateProduct = useCallback((updated: Product) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  const updateProfile = useCallback((newProfile: BusinessProfile) => {
    setProfile(newProfile);
  }, []);

  return {
    invoices,
    customers,
    products,
    profile,
    users,
    currentUser,
    register,
    login,
    socialLogin,
    logout,
    approveUser,
    rejectUser,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    addProduct,
    updateProduct,
    deleteProduct,
    updateProfile,
    loaded
  };
};