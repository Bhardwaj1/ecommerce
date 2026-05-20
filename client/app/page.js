"use client";

import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";
import { useAdmin } from "../context/AdminContext";
import { categories } from "../lib/products";

export default function Home() {
  const { products } = useAdmin();

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
              className="glass px-5 py-2 rounded-full text-sm text-zinc-300 hover:text-white whitespace-nowrap transition-all hover:border-yellow-600/50"
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
          <span className="text-sm text-zinc-500">{products.length} products</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="glass border-t border-zinc-800 px-6 py-8 text-center text-zinc-500 text-sm">
        <p className="gold-gradient font-bold text-base mb-1">Spiritz</p>
        <p>© 2025 Spiritz. Drink responsibly. 21+ only.</p>
      </footer>
    </div>
  );
}
