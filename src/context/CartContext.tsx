'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartItem, Product, CouponCode } from '@/types';
import { couponCodes } from '@/data/products';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, weight: string, price: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  appliedCoupon: CouponCode | null;
  subtotal: number;
  discount: number;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponCode | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('elite-tea-cart');
    const savedCoupon = localStorage.getItem('elite-tea-coupon');
    if (savedCart) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setItems(JSON.parse(savedCart));
      } catch {
        localStorage.removeItem('elite-tea-cart');
      }
    }
    if (savedCoupon) {
      try {
        setAppliedCoupon(JSON.parse(savedCoupon));
      } catch {
        localStorage.removeItem('elite-tea-coupon');
      }
    }
    setIsHydrated(true);
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('elite-tea-cart', JSON.stringify(items));
    }
  }, [items, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      if (appliedCoupon) {
        localStorage.setItem('elite-tea-coupon', JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem('elite-tea-coupon');
      }
    }
  }, [appliedCoupon, isHydrated]);

  const addToCart = useCallback((product: Product, weight: string, price: number) => {
    setItems((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && item.selectedWeight === weight
      );
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.selectedWeight === weight
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, selectedWeight: weight, selectedPrice: price }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.product.id !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setAppliedCoupon(null);
  }, []);

  const subtotal = items.reduce(
    (sum, item) => sum + item.selectedPrice * item.quantity,
    0
  );

  const applyCoupon = useCallback(
    (code: string) => {
      const coupon = couponCodes.find(
        (c) => c.code.toUpperCase() === code.toUpperCase()
      );
      if (!coupon) {
        return { success: false, message: 'Invalid coupon code.' };
      }
      if (subtotal < coupon.minOrder) {
        return {
          success: false,
          message: `Minimum order of ₹${coupon.minOrder} required for this coupon.`,
        };
      }
      setAppliedCoupon(coupon);
      return { success: true, message: `🎉 ${coupon.description} applied!` };
    },
    [subtotal]
  );

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
  }, []);

  const discount = appliedCoupon
    ? Math.round(subtotal * (appliedCoupon.discount / 100))
    : 0;

  const total = subtotal - discount;

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        appliedCoupon,
        subtotal,
        discount,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
