import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product, products } from '../data/products';
import { CartItem } from './CartContext';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: 'Pendiente' | 'Procesando' | 'Enviado' | 'Entregado';
  items: CartItem[];
  paymentMethod: 'pago-movil' | 'transferencia';
  isGift?: boolean;
  giftDetails?: {
    recipientName: string;
    recipientEmail: string;
    message: string;
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => void;
  
  // Favorites
  favorites: number[];
  toggleFavorite: (productId: number) => void;
  isFavorite: (productId: number) => boolean;
  
  // Orders
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedFavorites = localStorage.getItem('favorites');
    const storedOrders = localStorage.getItem('orders');

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedFavorites) setFavorites(JSON.parse(storedFavorites));
    if (storedOrders) setOrders(JSON.parse(storedOrders));
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const login = async (email: string, password: string) => {
    // Mock login
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setUser({
          id: '1',
          name: 'Usuario Demo',
          email: email,
          phone: '0414-1234567',
          address: 'Av. Principal, Edif. Central',
          city: 'Caracas',
          postalCode: '1010'
        });
        resolve();
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    // Optional: clear favorites/orders on logout if desired, but usually kept for device
  };

  const register = async (name: string, email: string, password: string) => {
    // Mock register
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setUser({
          id: Date.now().toString(),
          name,
          email,
        });
        resolve();
      }, 1000);
    });
  };

  const updateProfile = (data: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...data } : null);
  };

  const toggleFavorite = (productId: number) => {
    setFavorites(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      }
      return [...prev, productId];
    });
  };

  const isFavorite = (productId: number) => favorites.includes(productId);

  const addOrder = (orderData: Omit<Order, 'id' | 'date' | 'status'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString(),
      status: 'Pendiente'
    };
    setOrders(prev => [newOrder, ...prev]);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      register,
      updateProfile,
      favorites,
      toggleFavorite,
      isFavorite,
      orders,
      addOrder
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};
