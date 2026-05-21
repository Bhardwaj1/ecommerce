"use client";

import { useState } from "react";
import Link from "next/link";
import { useAdmin } from "../../../context/AdminContext";

const emojiOptions = ["🥃", "🍺", "🍷", "🍸", "🍹", "🍾", "🫗", "🧊", "🍶", "🥂"];

function AddCategoryModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: "", emoji: "🍾", description: "", active: true });
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) { setError("Name is required"); return; }
    onAdd(form);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
      <div className="glass rounded-2xl p-8 w-full max-w-md" style={{ border: "1px solid var(--glass-border)" }}>
        <h2 className="text-xl font-bold text-white mb-6">Add Category</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Name */}
          <div>
            <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-2">Name *</label>
            <input
              className="w-full bg-zinc-900 border rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-yellow-600/60 transition-colors placeholder:text-zinc-600"
              style={{ borderColor: error ? "#f87171" : "var(--glass-border)" }}
              placeholder="e.g. Whisky"
              value={form.name}
              onChange={(e) => { setForm((p) => ({ ...p, name: e.target.value })); setError(""); }}
            />
            {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
          </div>

          {/* Emoji */}
          <div>
            <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-2">Emoji</label>
            <div className="flex gap-2 flex-wrap">
              {emojiOptions.map((em) => (
                <button key={em} type="button" onClick={() => setForm((p) => ({ ...p, emoji: em }))}
                  className="w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all"
                  style={{
                    background: form.emoji === em ? "rgba(201,168,76,0.15)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${form.emoji === em ? "var(--gold)" : "var(--glass-border)"}`,
                  }}
                >{em}</button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-2">Description</label>
            <input
              className="w-full bg-zinc-900 border rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-yellow-600/60 transition-colors placeholder:text-zinc-600"
              style={{ borderColor: "var(--glass-border)" }}
              placeholder="Short description..."
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            />
          </div>

          {/* Active */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">Active on storefront</span>
            <button type="button" onClick={() => setForm((p) => ({ ...p, active: !p.active }))}
              className="w-12 h-6 rounded-full transition-all relative"
              style={{ background: form.active ? "var(--gold)" : "#3f3f46" }}
            >
              <span className="absolute top-0.5 w-5 h-5 rounded-full bg-zinc-950 transition-all"
                style={{ left: form.active ? "calc(100% - 22px)" : "2px" }} />
            </button>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="gold-btn flex-1 py-3 rounded-xl text-sm font-bold">Add Category</button>
            <button type="button" onClick={onClose} className="glass flex-1 py-3 rounded-xl text-sm text-zinc-300 hover:text-white transition-colors">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditCategoryModal({ category, onClose, onEdit }) {
  const [form, setForm] = useState({ name: category.name, emoji: category.emoji, description: category.description });
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) { setError("Name is required"); return; }
    onEdit(category.id, form);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
      <div className="glass rounded-2xl p-8 w-full max-w-md" style={{ border: "1px solid var(--glass-border)" }}>
        <h2 className="text-xl font-bold text-white mb-6">Edit Category</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-2">Name *</label>
            <input
              className="w-full bg-zinc-900 border rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-yellow-600/60 transition-colors"
              style={{ borderColor: error ? "#f87171" : "var(--glass-border)" }}
              value={form.name}
              onChange={(e) => { setForm((p) => ({ ...p, name: e.target.value })); setError(""); }}
            />
            {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
          </div>
          <div>
            <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-2">Emoji</label>
            <div className="flex gap-2 flex-wrap">
              {emojiOptions.map((em) => (
                <button key={em} type="button" onClick={() => setForm((p) => ({ ...p, emoji: em }))}
                  className="w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all"
                  style={{
                    background: form.emoji === em ? "rgba(201,168,76,0.15)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${form.emoji === em ? "var(--gold)" : "var(--glass-border)"}`,
                  }}
                >{em}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-2">Description</label>
            <input
              className="w-full bg-zinc-900 border rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-yellow-600/60 transition-colors"
              style={{ borderColor: "var(--glass-border)" }}
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="gold-btn flex-1 py-3 rounded-xl text-sm font-bold">Save Changes</button>
            <button type="button" onClick={onClose} className="glass flex-1 py-3 rounded-xl text-sm text-zinc-300 hover:text-white transition-colors">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  const { categories, categoriesLoading, categoriesError, addCategory, editCategory, deleteCategory, toggleCategory } = useAdmin();
  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  const totalActive = categories.filter((c) => c.active).length;
  const totalSubs = categories.reduce((sum, c) => sum + (c.subcategories?.length || 0), 0);

  if (categoriesLoading) return <div className="p-8 text-zinc-400">Loading categories...</div>;
  if (categoriesError) return <div className="p-8 text-red-400">Error: {categoriesError}</div>;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Categories</h1>
          <p className="text-zinc-500 text-sm">{categories.length} categories · {totalSubs} subcategories</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="gold-btn px-5 py-2.5 rounded-xl text-sm font-bold">
          + Add Category
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Categories", value: categories.length, color: "var(--gold)" },
          { label: "Active", value: totalActive, color: "#4ade80" },
          { label: "Total Subcategories", value: totalSubs, color: "#818cf8" },
        ].map((s) => (
          <div key={s.label} className="glass rounded-2xl px-6 py-4 flex items-center gap-4">
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-zinc-500 text-sm">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Category Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {categories.map((cat) => {
          const activeSubs = (cat.subcategories || []).filter((s) => s.active).length;
          return (
            <div
              key={cat._id}
              className="glass rounded-2xl overflow-hidden flex flex-col transition-all"
              style={{ opacity: cat.active ? 1 : 0.55 }}
            >
              {/* Card Top */}
              <div className="p-5 flex items-start gap-4 border-b" style={{ borderColor: "var(--glass-border)" }}>
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
                  style={{ background: "linear-gradient(145deg, #111113, #1c1c1f)" }}
                >
                  {cat.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-white font-semibold text-base">{cat.name}</h3>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        background: cat.active ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                        color: cat.active ? "#4ade80" : "#f87171",
                      }}
                    >
                      {cat.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-zinc-500 text-xs line-clamp-1">{cat.description}</p>
                </div>
              </div>

              {/* Subcategory count */}
              <div className="px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-zinc-400">
                    <span className="text-white font-medium">{(cat.subcategories || []).length}</span> subcategories
                  </span>
                  <span className="text-zinc-600">·</span>
                  <span className="text-zinc-400">
                    <span className="text-green-400 font-medium">{activeSubs}</span> active
                  </span>
                </div>
                <Link
                  href={`/admin/categories/${cat._id}`}
                  className="text-xs gold-text hover:text-yellow-300 transition-colors font-medium"
                >
                  Manage →
                </Link>
              </div>

              {/* Actions */}
              <div className="px-5 pb-5 flex items-center gap-2">
                <button
                  onClick={() => toggleCategory(cat._id)}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
                  style={{
                    background: cat.active ? "rgba(239,68,68,0.08)" : "rgba(34,197,94,0.08)",
                    color: cat.active ? "#f87171" : "#4ade80",
                    border: `1px solid ${cat.active ? "rgba(239,68,68,0.2)" : "rgba(34,197,94,0.2)"}`,
                  }}
                >
                  {cat.active ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={() => setEditTarget({ ...cat, id: cat._id })}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold glass text-zinc-300 hover:text-white transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => { if (confirm(`Delete "${cat.name}"?`)) deleteCategory(cat._id); }}
                  className="py-2 px-3 rounded-xl text-xs font-semibold transition-colors"
                  style={{ background: "rgba(239,68,68,0.05)", color: "#f87171", border: "1px solid rgba(239,68,68,0.15)" }}
                >
                  🗑
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      {showAdd && <AddCategoryModal onClose={() => setShowAdd(false)} onAdd={addCategory} />}
      {editTarget && <EditCategoryModal category={editTarget} onClose={() => setEditTarget(null)} onEdit={editCategory} />}
    </div>
  );
}
