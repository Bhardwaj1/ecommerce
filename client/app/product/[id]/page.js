"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useAdmin } from "../../../context/AdminContext";
import Navbar from "../../components/Navbar";
import AddToCartButton from "../../components/AddToCartButton";

function ImageGallery({ images }) {
  const [active, setActive] = useState(0);
  return (
    <div className="w-full h-full flex flex-col">
      {/* Main image */}
      <div className="flex-1 flex items-center justify-center p-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[active].url}
          alt={images[active].name}
          className="max-h-80 max-w-full object-contain rounded-2xl"
          style={{ filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.5))" }}
        />
      </div>
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 justify-center px-6 pb-5">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActive(i)}
              className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 transition-all"
              style={{
                border: `2px solid ${active === i ? "var(--gold)" : "var(--glass-border)"}`,
                opacity: active === i ? 1 : 0.5,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductPage({ params }) {
  const { id } = use(params);
  const { products } = useAdmin();
  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">🍾</p>
          <h1 className="text-2xl font-bold text-white mb-2">Product not found</h1>
          <Link href="/" className="gold-text hover:text-yellow-300 transition-colors text-sm">← Back to Home</Link>
        </div>
      </div>
    );
  }

  const { name, brand, category, price, badge, emoji, description, rating, inStock, alcoholPercent, volume, stockQty, images } = product;
  const related = products.filter((p) => p.id !== product.id && p.category === category).slice(0, 2);

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-zinc-500 mb-10">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <span className="text-zinc-400">{category}</span>
          <span>/</span>
          <span className="text-white">{name}</span>
        </div>

        {/* Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">

          {/* Image gallery */}
          <div className="relative rounded-3xl overflow-hidden flex items-center justify-center"
            style={{
              background: "linear-gradient(145deg, #111113, #1c1c1f)",
              minHeight: "480px",
              border: "1px solid var(--glass-border)",
            }}
          >
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(circle at 50% 55%, rgba(201,168,76,0.1) 0%, transparent 65%)" }}
            />
            {badge && (
              <span className="absolute top-5 left-5 z-10 gold-btn text-sm px-4 py-1.5 rounded-full">{badge}</span>
            )}
            {!inStock && (
              <div className="absolute inset-0 z-10 flex items-center justify-center"
                style={{ background: "rgba(9,9,11,0.6)", backdropFilter: "blur(3px)" }}>
                <span className="text-sm font-bold uppercase tracking-widest text-zinc-400 border border-zinc-700 px-6 py-3 rounded-full">
                  Out of Stock
                </span>
              </div>
            )}
            {images?.[0] ? (
              <ImageGallery images={images} />
            ) : (
              <div className="text-[160px] select-none leading-none"
                style={{ filter: "drop-shadow(0 16px 40px rgba(201,168,76,0.2))" }}>
                {emoji}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-500 uppercase tracking-widest">{category}</span>
              <span
                className="text-xs font-semibold px-3 py-1 rounded-full"
                style={{
                  background: inStock ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                  color: inStock ? "#4ade80" : "#f87171",
                  border: `1px solid ${inStock ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
                }}
              >
                {inStock ? (
                  <span style={{ color: "#4ade80" }}>● {stockQty} in stock</span>
                ) : (
                  <span style={{ color: "#f87171" }}>● Sold Out</span>
                )}
              </span>
            </div>

            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-2">{name}</h1>
              <p className="text-zinc-400 text-base">by <span className="gold-text font-medium">{brand}</span></p>
            </div>

            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-xl" style={{ color: rating >= star ? "var(--gold)" : "#3f3f46" }}>★</span>
              ))}
              <span className="text-zinc-400 text-sm ml-1">{rating?.toFixed(1)} / 5.0</span>
            </div>

            <div>
              <span className="gold-gradient text-5xl font-bold">₹{price}</span>
              <span className="text-zinc-500 text-sm ml-2">incl. taxes</span>
            </div>

            <p className="text-zinc-400 text-base leading-relaxed">{description}</p>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Volume", value: volume, icon: "📦" },
                { label: "Alcohol", value: `${alcoholPercent}% ABV`, icon: "🔥" },
                { label: "Brand", value: brand, icon: "🏷️" },
                { label: "Type", value: category, icon: "🍾" },
              ].map((spec) => (
                <div key={spec.label} className="glass rounded-xl px-4 py-3 flex items-center gap-3">
                  <span className="text-xl">{spec.icon}</span>
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider">{spec.label}</p>
                    <p className="text-white text-sm font-medium">{spec.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <AddToCartButton product={product} />
              <button className="glass flex-1 py-4 rounded-2xl text-zinc-300 font-semibold hover:text-white transition-colors">
                ♡ Wishlist
              </button>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              You might also <span className="gold-text">like</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/product/${p.id}`}
                  className="glass rounded-2xl p-5 flex items-center gap-5 hover:border-yellow-600/50 transition-all hover:-translate-y-1"
                >
                  <div
                    className="w-20 h-20 rounded-xl flex items-center justify-center text-4xl flex-shrink-0"
                    style={{ background: "linear-gradient(145deg, #111113, #1c1c1f)" }}
                  >
                    {p.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">{p.category}</p>
                    <h3 className="text-white font-semibold truncate">{p.name}</h3>
                    <span className="gold-gradient font-bold text-lg">₹{p.price}</span>
                  </div>
                  <span className="gold-text text-xl">→</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <footer className="glass border-t border-zinc-800 px-6 py-8 text-center text-zinc-500 text-sm mt-12">
        <p className="gold-gradient font-bold text-base mb-1">Spiritz</p>
        <p>© 2025 Spiritz. Drink responsibly. 21+ only.</p>
      </footer>
    </div>
  );
}
