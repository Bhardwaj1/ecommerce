"use client";

import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // [{ product, qty }]

  function addToCart(product) {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { product, qty: 1 }];
    });
  }

  function removeFromCart(productId) {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }

  function updateQty(productId, qty) {
    if (qty < 1) return removeFromCart(productId);
    setItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, qty } : i))
    );
  }

  function clearCart() {
    setItems([]);
  }

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);

  const totalPrice = items.reduce((sum, i) => {
    const price = Number(i.product.price.replace(/,/g, ""));
    return sum + price * i.qty;
  }, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQty, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
