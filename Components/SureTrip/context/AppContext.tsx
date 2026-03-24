import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Role = 'buyer' | 'seller' | null;

export interface MockUser {
  name: string;
  email: string;
  role: Role;
  points: number;
  shopName?: string;
  shopCategory?: string;
  shopAddress?: string;
}

export interface MockRequest {
  id: string;
  product: string;
  buyerName: string;
  distance: string;
  time: string;
  responded: boolean;
  response?: 'yes' | 'no';
  quantity?: string;
  price?: string;
}

export interface StockItem {
  id: string;
  product: string;
  quantity: string;
  price: string;
  confirmedAt: string;
}

interface AppContextType {
  user: MockUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  activeRole: Role;
  pendingRequests: MockRequest[];
  activeStock: StockItem[];
  login: (name: string, email: string, role?: Role) => void;
  logout: () => void;
  setRole: (role: Role) => void;
  switchRole: () => void;
  respondToRequest: (id: string, response: 'yes' | 'no', quantity?: string, price?: string) => void;
  removeStockItem: (id: string) => void;
  addStockItem: (product: string, quantity: string, price: string) => void;
  setupShop: (shopName: string, category: string, address: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const MOCK_REQUESTS: MockRequest[] = [
  { id: '1', product: 'PVC Pipe 1 inch', buyerName: 'Rahul S.', distance: '320m away', time: '2 min ago', responded: false },
  { id: '2', product: 'Crocin Advance 500mg', buyerName: 'Priya K.', distance: '800m away', time: '5 min ago', responded: false },
  { id: '3', product: 'Electrical Wire 2.5mm', buyerName: 'Amit V.', distance: '1.1km away', time: '12 min ago', responded: false },
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeRole, setActiveRole] = useState<Role>(null);
  const [pendingRequests, setPendingRequests] = useState<MockRequest[]>(MOCK_REQUESTS);
  const [activeStock, setActiveStock] = useState<StockItem[]>([]);

  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = async () => {
    try {
      const stored = await AsyncStorage.getItem('suretrip_user');
      if (stored) {
        const parsedUser: MockUser = JSON.parse(stored);
        setUser(parsedUser);
        setIsLoggedIn(true);
        setActiveRole(parsedUser.role);
      }
    } catch {} finally {
      setIsLoading(false);
    }
  };

  const login = async (name: string, email: string, role?: Role) => {
    const newUser: MockUser = { name, email, role: role || null, points: 120 };
    setUser(newUser);
    setIsLoggedIn(true);
    if (role) setActiveRole(role);
    await AsyncStorage.setItem('user', JSON.stringify(newUser)); // Handle saving full object to standard key
  };

  const logout = async () => {
    
    await AsyncStorage.removeItem('suretrip_user'); // Match loadSession and login
    console.log("user removed from async storage");
    setUser(null);
    setIsLoggedIn(false);
    setActiveRole(null);
  };

  const setRole = async (role: Role) => {
    if (!user) return;
    const updated = { ...user, role };
    setUser(updated);
    setActiveRole(role);
    await AsyncStorage.setItem('suretrip_user', JSON.stringify(updated));
  };

  const switchRole = () => {
    const newRole = activeRole === 'buyer' ? 'seller' : 'buyer';
    setRole(newRole);
  };

  const setupShop = async (shopName: string, category: string, address: string) => {
    if (!user) return;
    const updated = { ...user, shopName, shopCategory: category, shopAddress: address, role: 'seller' as Role };
    setUser(updated);
    setActiveRole('seller');
    await AsyncStorage.setItem('suretrip_user', JSON.stringify(updated));
  };

  const respondToRequest = (id: string, response: 'yes' | 'no', quantity?: string, price?: string) => {
    setPendingRequests(prev =>
      prev.map(r => r.id === id ? { ...r, responded: true, response, quantity, price } : r)
    );
    if (response === 'yes') {
      const req = pendingRequests.find(r => r.id === id);
      if (req) {
        const newItem: StockItem = {
          id: Date.now().toString(),
          product: req.product,
          quantity: quantity || '—',
          price: price || '—',
          confirmedAt: 'Just now',
        };
        setActiveStock(prev => [newItem, ...prev]);
      }
    }
  };

  const removeStockItem = (id: string) => {
    setActiveStock(prev => prev.filter(i => i.id !== id));
  };

  const addStockItem = (product: string, quantity: string, price: string) => {
    if (!product.trim()) return;
    const newItem: StockItem = {
      id: Date.now().toString(),
      product,
      quantity: quantity || '-',
      price: price || '-',
      confirmedAt: 'Just now',
    };
    setActiveStock(prev => [newItem, ...prev]);
  };

  return (
    <AppContext.Provider value={{
      user, isLoggedIn, isLoading, activeRole, pendingRequests, activeStock,
      login, logout, setRole, switchRole, respondToRequest, removeStockItem, addStockItem, setupShop
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
