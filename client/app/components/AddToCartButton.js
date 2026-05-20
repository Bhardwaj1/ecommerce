"use client";

import { useState } from "react";
import { useCart } from "../../context/CartContext";

export default function AddToCartButton({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    if (!product.inStock) return;
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <button
      onClick={handleClick}
      disabled={!product.inStock}
      className="flex-[2] py-4 rounded-2xl text-base font-bold transition-all duration-300"
      style={{
        background: !product.inStock
          ? "rgba(63,63,70,0.5)"
          : added
          ? "linear-gradient(135deg, #16a34a, #22c55e)"
          : "linear-gradient(135deg, var(--gold-dark), var(--gold))",
        color: !product.inStock ? "#71717a" : "#09090b",
        cursor: !product.inStock ? "not-allowed" : "pointer",
        boxShadow: added
          ? "0 0 24px rgba(34,197,94,0.4)"
          : product.inStock
          ? "0 8px 24px rgba(201,168,76,0.3)"
          : "none",
        transform: added ? "scale(0.98)" : "scale(1)",
      }}
    >
      {added ? "✓ Added to Cart!" : product.inStock ? "🛒 Add to Cart" : "Unavailable"}
    </button>
  );
}
