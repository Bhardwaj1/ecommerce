"use client";

import { use } from "react";
import Link from "next/link";
import { useAdmin } from "../../../../context/AdminContext";

export default function CategoryDetailPage({ params }) {
  const { id } = use(params);
  const { categories, toggleCategory, toggleSubcategory } = useAdmin();
  const category = categories.find((c) => c.id === Number(id));

  if (!category) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-96 gap-4">
        <p className="text-6xl">📂</p>
        <p className="text-white font-semibold text-xl">Category not found</p>
        <Link href="/admin/categories" className="gold-text text-sm hover:text-yellow-300 transition-colors">
          ← Back to Categories
        </Link>
      </div>
    );
  }

  const activeSubs = category.subcategories.filter((s) => s.active).length;

  return (
    <div className="p-8 max-w-3xl">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-zinc-500 mb-8">
        <Link href="/admin" className="hover:text-white transition-colors">Dashboard</Link>
        <span>/</span>
        <Link href="/admin/categories" className="hover:text-white transition-colors">Categories</Link>
        <span>/</span>
        <span className="text-white font-medium">{category.name}</span>
      </div>

      {/* Header */}
      <div className="glass rounded-2xl p-6 mb-6 flex items-center gap-5">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center text-5xl flex-shrink-0"
          style={{ background: "linear-gradient(145deg, #111113, #1c1c1f)", border: "1px solid var(--glass-border)" }}
        >
          {category.emoji}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-white">{category.name}</h1>
            <span
              className="text-xs px-3 py-1 rounded-full font-semibold"
              style={{
                background: category.active ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                color: category.active ? "#4ade80" : "#f87171",
                border: `1px solid ${category.active ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
              }}
            >
              {category.active ? "● Active" : "● Inactive"}
            </span>
          </div>
          <p className="text-zinc-500 text-sm mb-3">{category.description}</p>
          <button
            onClick={() => toggleCategory(category.id)}
            className="text-xs px-4 py-1.5 rounded-lg font-semibold transition-all"
            style={{
              background: category.active ? "rgba(239,68,68,0.08)" : "rgba(34,197,94,0.08)",
              color: category.active ? "#f87171" : "#4ade80",
              border: `1px solid ${category.active ? "rgba(239,68,68,0.2)" : "rgba(34,197,94,0.2)"}`,
            }}
          >
            {category.active ? "Deactivate Category" : "Activate Category"}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Subcategories", value: category.subcategories.length, color: "var(--gold)" },
          { label: "Active", value: activeSubs, color: "#4ade80" },
          { label: "Inactive", value: category.subcategories.length - activeSubs, color: "#f87171" },
        ].map((s) => (
          <div key={s.label} className="glass rounded-2xl px-5 py-4 text-center">
            <p className="text-2xl font-bold mb-1" style={{ color: s.color }}>{s.value}</p>
            <p className="text-zinc-500 text-xs">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Subcategories preview */}
      <div className="glass rounded-2xl overflow-hidden mb-6">
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: "var(--glass-border)" }}
        >
          <h2 className="text-white font-semibold">Subcategories</h2>
          <Link
            href="/admin/subcategories"
            className="text-xs gold-text hover:text-yellow-300 transition-colors font-medium"
          >
            Manage all →
          </Link>
        </div>

        {category.subcategories.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <p className="text-zinc-600 text-sm">No subcategories yet.</p>
            <Link href="/admin/subcategories" className="text-xs gold-text mt-2 inline-block hover:text-yellow-300 transition-colors">
              + Add from Subcategories page
            </Link>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "var(--glass-border)" }}>
            {category.subcategories.map((sub) => (
              <div
                key={sub.id}
                className="flex items-center justify-between px-6 py-3.5 hover:bg-white/[0.02] transition-colors"
                style={{ opacity: sub.active ? 1 : 0.5 }}
              >
                <p className="text-white text-sm font-medium">{sub.name}</p>
                <button
                  onClick={() => toggleSubcategory(category.id, sub.id)}
                  className="text-xs px-3 py-1 rounded-full font-semibold transition-all"
                  style={{
                    background: sub.active ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                    color: sub.active ? "#4ade80" : "#f87171",
                    border: `1px solid ${sub.active ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
                  }}
                >
                  {sub.active ? "● Active" : "● Inactive"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="flex gap-3">
        <Link href="/admin/subcategories" className="gold-btn px-6 py-3 rounded-xl text-sm font-bold">
          + Add / Manage Subcategories
        </Link>
        <Link href="/admin/categories" className="glass px-6 py-3 rounded-xl text-sm text-zinc-300 hover:text-white transition-colors">
          ← Back to Categories
        </Link>
      </div>
    </div>
  );
}
