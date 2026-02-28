import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '../data/products';

interface CartItem extends Product {
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  cartId: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, color?: string, size?: string) => void;
  decreaseQuantity: (cartId: string) => void;
  removeFromCart: (cartId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  cartTotal: number;
  cartCount: number;
  shippingCost: number;
  finalTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product: Product, color?: string, size?: string) => {
    setCart(prevCart => {
      const cartId = `${product.id}-${color || 'default'}-${size || 'default'}`;
      const existingItem = prevCart.find(item => item.cartId === cartId);
      
      if (existingItem) {
        return prevCart.map(item =>
          item.cartId === cartId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1, selectedColor: color, selectedSize: size, cartId }];
    });
    setIsCartOpen(true);
  };

  const decreaseQuantity = (cartId: string) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.cartId === cartId);
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(item =>
          item.cartId === cartId ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return prevCart.filter(item => item.cartId !== cartId);
    });
  };

  const removeFromCart = (cartId: string) => {
    setCart(prevCart => prevCart.filter(item => item.cartId !== cartId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Shipping Logic
  // Base cost: $6
  // Free if: 3 or more items OR total >= $100
  const shippingCost = (cartCount >= 3 || cartTotal >= 100) ? 0 : 6;
  
  const finalTotal = cartTotal + shippingCost;

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      decreaseQuantity,
      removeFromCart,
      clearCart,
      isCartOpen,
      setIsCartOpen,
      cartTotal,
      cartCount,
      shippingCost,
      finalTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
