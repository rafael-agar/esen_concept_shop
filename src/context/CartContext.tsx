import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '../data/products';

export interface CartItem extends Product {
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  cartId: string;
}

export interface Coupon {
  code: string;
  discountPercentage: number;
  isActive: boolean;
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
  
  // Coupon & Admin Logic
  discountAmount: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  toggleCouponStatus: (code: string) => void;
  deleteCoupon: (code: string) => void;
  freeShippingThreshold: number;
  setFreeShippingThreshold: (amount: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Admin Settings
  const [coupons, setCoupons] = useState<Coupon[]>([
    { code: 'ESEN10', discountPercentage: 10, isActive: true },
    { code: 'BIENVENIDA20', discountPercentage: 20, isActive: true }
  ]);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(100);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

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
    setAppliedCoupon(null);
  };

  // Coupon Logic
  const applyCoupon = (code: string) => {
    const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase() && c.isActive);
    if (coupon) {
      setAppliedCoupon(coupon);
      return true;
    }
    return false;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Admin Coupon Logic
  const addCoupon = (coupon: Coupon) => {
    setCoupons(prev => [...prev.filter(c => c.code !== coupon.code), coupon]);
  };

  const toggleCouponStatus = (code: string) => {
    setCoupons(prev => prev.map(c => c.code === code ? { ...c, isActive: !c.isActive } : c));
  };

  const deleteCoupon = (code: string) => {
    setCoupons(prev => prev.filter(c => c.code !== code));
    if (appliedCoupon?.code === code) {
      setAppliedCoupon(null);
    }
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  const discountAmount = appliedCoupon ? (cartTotal * (appliedCoupon.discountPercentage / 100)) : 0;
  const subtotalAfterDiscount = cartTotal - discountAmount;

  // Shipping Logic
  // Base cost: $6
  // Free if: 3 or more items OR subtotalAfterDiscount >= freeShippingThreshold
  const shippingCost = (cartCount >= 3 || subtotalAfterDiscount >= freeShippingThreshold) ? 0 : 6;
  
  const finalTotal = subtotalAfterDiscount + shippingCost;

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
      finalTotal,
      discountAmount,
      appliedCoupon,
      applyCoupon,
      removeCoupon,
      coupons,
      addCoupon,
      toggleCouponStatus,
      deleteCoupon,
      freeShippingThreshold,
      setFreeShippingThreshold
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
