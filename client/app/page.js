"use client";

import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";
import { productAPI } from "../lib/api";
import { categories } from "../lib/products";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    productAPI.getAll({ perPage: 20 })
      .then((res) => setProducts(res.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Normalize API product to shape ProductCard expects
  function normalize(p) {
    return {
      id: p._id,
      _id: p._id,
      name: p.name,
      slug: p.slug,
      category: p.category?.name ?? p.category ?? "",
      price: p.price,
      description: p.description ?? "",
      rating: p.rating ?? 4.0,
      inStock: p.active,
      stockQty: p.stock ?? 0,
      alcoholPercent: p.alcoholPercentage,
      volume: p.volume,
      images: p.thumbnails ? [{ url: p.thumbnails }] : [],
      emoji: "🍾",
    };
  }

  const filtered = products
    .map(normalize)
    .filter((p) => activeCategory === "All" || p.category.toLowerCase().includes(activeCategory.toLowerCase()));

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      {/* Hero */}
      <section className="relative px-6 py-24 text-center overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-96 h-96 rounded-full bg-yellow-600/10 blur-3xl" />
        </div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 mb-4">Premium Spirits Delivered</p>
        <h1 className="text-5xl sm:text-7xl font-bold text-white leading-tight mb-6">
          Drink the <span className="gold-gradient">Finest.</span>
        </h1>
        <p className="text-zinc-400 text-lg max-w-md mx-auto mb-10">
          Curated collection of whisky, wine, beer & more — delivered to your door.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <button className="gold-btn px-8 py-3 rounded-full text-base">Shop Now</button>
          <button className="glass px-8 py-3 rounded-full text-base text-zinc-300 hover:text-white transition-colors">
            Explore Brands
          </button>
        </div>
      </section>

      {/* Category Pills */}
      <section className="px-6 pb-10">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide justify-center flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.label}
              onClick={() => setActiveCategory(cat.label)}
              className="glass px-5 py-2 rounded-full text-sm whitespace-nowrap transition-all hover:border-yellow-600/50"
              style={{ color: activeCategory === cat.label ? "var(--gold)" : undefined, borderColor: activeCategory === cat.label ? "var(--gold)" : undefined }}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-6 pb-24 max-w-6xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">
            Featured <span className="gold-text">Products</span>
          </h2>
          <span className="text-sm text-zinc-500">{filtered.length} products</span>
        </div>
        {loading ? (
          <div className="text-center text-zinc-500 py-20">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-zinc-500 py-20">No products found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="glass border-t border-zinc-800 px-6 py-8 text-center text-zinc-500 text-sm">
        <p className="gold-gradient font-bold text-base mb-1">Spiritz</p>
        <p>© 2025 Spiritz. Drink responsibly. 21+ only.</p>
      </footer>
    </div>
  );
}
