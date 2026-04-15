"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  type Cart,
  type CartItem,
  emptyCart,
  addToCart as addFn,
  removeFromCart as removeFn,
  updateQuantity as updateFn,
  cartTotal,
  cartItemCount,
  saveCart,
  loadCart,
} from "@/lib/cart";

interface CartContextValue {
  cart: Cart;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, qty: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export default function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>(emptyCart());
  const [isOpen, setIsOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    setCart(loadCart());
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  const addItem = useCallback(
    (item: CartItem) => {
      setCart((prev) => addFn(prev, item));
      setIsOpen(true);
    },
    []
  );

  const removeItem = useCallback((itemId: string) => {
    setCart((prev) => removeFn(prev, itemId));
  }, []);

  const updateQty = useCallback((itemId: string, qty: number) => {
    setCart((prev) => updateFn(prev, itemId, qty));
  }, []);

  const clearCart = useCallback(() => {
    setCart(emptyCart());
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        updateQuantity: updateQty,
        clearCart,
        total: cartTotal(cart),
        itemCount: cartItemCount(cart),
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
