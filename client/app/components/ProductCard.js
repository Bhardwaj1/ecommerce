"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "../../context/CartContext";

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rating >= star;
        const half = !filled && rating >= star - 0.5;
        return (
          <span key={star} className="text-sm" style={{ color: filled || half ? "var(--gold)" : "#3f3f46" }}>
            {half ? "½" : "★"}
          </span>
        );
      })}
      <span className="text-xs text-zinc-500 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function ProductCard({ product }) {
  const { id, name, category, price, badge, emoji, description, rating, inStock, stockQty, images } = product;
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  function handleAddToCart(e) {
    e.preventDefault();
    if (!inStock) return;
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <Link href={`/product/${id}`} className="block">
      <div
        className="glass rounded-2xl overflow-hidden cursor-pointer group relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          transition: "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.35s ease, border-color 0.35s ease",
          transform: isHovered ? "translateY(-8px) scale(1.01)" : "translateY(0) scale(1)",
          boxShadow: isHovered
            ? "0 24px 48px rgba(0,0,0,0.6), 0 0 30px rgba(201,168,76,0.15)"
            : "0 4px 16px rgba(0,0,0,0.3)",
          borderColor: isHovered ? "var(--gold)" : "var(--glass-border)",
        }}
      >
        {/* Image Area */}
        <div
          className="relative h-56 overflow-hidden flex items-center justify-center"
          style={{ background: "linear-gradient(145deg, #111113, #1c1c1f)" }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: isHovered
                ? "radial-gradient(circle at 50% 60%, rgba(201,168,76,0.12) 0%, transparent 70%)"
                : "radial-gradient(circle at 50% 60%, rgba(201,168,76,0.05) 0%, transparent 70%)",
              transition: "background 0.4s ease",
            }}
          />
          {images?.[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={images[0].url}
              alt={name}
              className="w-full h-full object-cover"
              style={{
                transition: "transform 0.4s ease",
                transform: isHovered ? "scale(1.08)" : "scale(1)",
              }}
            />
          ) : (
            <div
              className="text-8xl select-none z-10"
              style={{
                transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.4s ease",
                transform: isHovered ? "scale(1.18) translateY(-4px)" : "scale(1) translateY(0)",
                filter: isHovered ? "drop-shadow(0 8px 20px rgba(201,168,76,0.3))" : "none",
              }}
            >
              {emoji}
            </div>
          )}
          <div
            className="absolute inset-0 flex items-end justify-center pb-4 z-20"
            style={{
              opacity: isHovered ? 1 : 0,
              transition: "opacity 0.3s ease",
              background: "linear-gradient(to top, rgba(9,9,11,0.7) 0%, transparent 60%)",
            }}
          >
            <span className="text-xs text-zinc-400 tracking-widest uppercase">View Details</span>
          </div>
          {badge && (
            <span className="absolute top-3 left-3 z-30 gold-btn text-xs px-3 py-1 rounded-full">{badge}</span>
          )}
          {!inStock && (
            <div
              className="absolute inset-0 z-30 flex items-center justify-center"
              style={{ background: "rgba(9,9,11,0.65)", backdropFilter: "blur(2px)" }}
            >
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 border border-zinc-700 px-4 py-2 rounded-full">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-500 uppercase tracking-widest">{category}</p>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{
                background: inStock ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                color: inStock ? "#4ade80" : "#f87171",
                border: `1px solid ${inStock ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
              }}
            >
              {inStock ? `● ${stockQty} in stock` : "● Sold Out"}
            </span>
          </div>
          <h3 className="text-white font-semibold text-lg leading-tight">{name}</h3>
          <StarRating rating={rating} />
          <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2">{description}</p>
          <div className="flex items-center justify-between pt-1">
            <span className="gold-gradient text-2xl font-bold">₹{price}</span>
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className="relative px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300"
              style={{
                background: !inStock
                  ? "rgba(63,63,70,0.5)"
                  : added
                  ? "linear-gradient(135deg, #16a34a, #22c55e)"
                  : "linear-gradient(135deg, var(--gold-dark), var(--gold))",
                color: !inStock ? "#71717a" : "#09090b",
                cursor: !inStock ? "not-allowed" : "pointer",
                transform: added ? "scale(0.96)" : "scale(1)",
                boxShadow: added
                  ? "0 0 16px rgba(34,197,94,0.4)"
                  : isHovered && inStock
                  ? "0 6px 20px rgba(201,168,76,0.4)"
                  : "none",
              }}
            >
              {added ? "✓ Added!" : inStock ? "Add to Cart" : "Unavailable"}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
