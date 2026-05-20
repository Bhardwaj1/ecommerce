"use client";

import Link from "next/link";
import { useAdmin } from "../../context/AdminContext";

export default function AdminDashboard() {
  const { products } = useAdmin();

  const inStock = products.filter((p) => p.inStock).length;
  const outOfStock = products.filter((p) => !p.inStock).length;
  const categories = [...new Set(products.map((p) => p.category))].length;

  const stats = [
    { label: "Total Products", value: products.length, icon: "🍾", color: "var(--gold)" },
    { label: "In Stock", value: inStock, icon: "✅", color: "#4ade80" },
    { label: "Out of Stock", value: outOfStock, icon: "❌", color: "#f87171" },
    { label: "Categories", value: categories, icon: "📂", color: "#818cf8" },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-zinc-500 text-sm">Welcome back. Here's what's happening.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-12">
        {stats.map((stat) => (
          <div key={stat.label} className="glass rounded-2xl p-6 flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              {stat.icon}
            </div>
            <div>
              <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-3xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Products */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--glass-border)" }}>
          <h2 className="text-white font-semibold">Recent Products</h2>
          <Link href="/admin/products" className="text-sm gold-text hover:text-yellow-300 transition-colors">
            View all →
          </Link>
        </div>
        <div className="divide-y" style={{ borderColor: "var(--glass-border)" }}>
          {products.slice(0, 5).map((p) => (
            <div key={p.id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: "linear-gradient(145deg, #111113, #1c1c1f)" }}
              >
                {p.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{p.name}</p>
                <p className="text-zinc-500 text-xs">{p.category}</p>
              </div>
              <span className="gold-gradient font-bold text-sm">₹{p.price}</span>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{
                  background: p.inStock ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                  color: p.inStock ? "#4ade80" : "#f87171",
                }}
              >
                {p.inStock ? "In Stock" : "Sold Out"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 flex gap-4">
        <Link href="/admin/products/add" className="gold-btn px-6 py-3 rounded-xl text-sm font-bold">
          + Add New Product
        </Link>
        <Link href="/admin/products" className="glass px-6 py-3 rounded-xl text-sm text-zinc-300 hover:text-white transition-colors">
          Manage Products
        </Link>
      </div>
    </div>
  );
}
