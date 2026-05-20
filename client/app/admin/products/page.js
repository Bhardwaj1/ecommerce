"use client";

import { useState } from "react";
import Link from "next/link";
import { useAdmin } from "../../../context/AdminContext";

function StockCell({ product, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(String(product.stockQty));

  function save() {
    const q = Math.max(0, Number(val) || 0);
    onUpdate(product.id, q);
    setVal(String(q));
    setEditing(false);
  }

  if (editing) {
    return (
      <div className="flex items-center gap-1">
        <input
          type="number"
          min="0"
          autoFocus
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") setEditing(false); }}
          className="w-16 bg-zinc-900 border rounded-lg px-2 py-1 text-white text-xs outline-none"
          style={{ borderColor: "var(--gold)" }}
        />
        <button onClick={save} className="text-xs px-2 py-1 rounded-lg font-semibold"
          style={{ background: "rgba(34,197,94,0.12)", color: "#4ade80" }}>✓</button>
        <button onClick={() => setEditing(false)} className="text-xs px-2 py-1 rounded-lg text-zinc-500">✕</button>
      </div>
    );
  }

  return (
    <button onClick={() => setEditing(true)}
      className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full font-semibold transition-all group"
      style={{
        background: product.inStock ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
        color: product.inStock ? "#4ade80" : "#f87171",
        border: `1px solid ${product.inStock ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}`,
      }}
    >
      <span>{product.inStock ? "●" : "●"}</span>
      <span>{product.stockQty} units</span>
      <span className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500">✎</span>
    </button>
  );
}

export default function AdminProducts() {
  const { products, deleteProduct, updateStock } = useAdmin();

  const totalStock = products.reduce((s, p) => s + p.stockQty, 0);
  const outOfStock = products.filter((p) => !p.inStock).length;
  const lowStock = products.filter((p) => p.inStock && p.stockQty <= 5).length;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Products</h1>
          <p className="text-zinc-500 text-sm">{products.length} total products</p>
        </div>
        <Link href="/admin/products/add" className="gold-btn px-5 py-2.5 rounded-xl text-sm font-bold">
          + Add Product
        </Link>
      </div>

      {/* Stock summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Stock", value: `${totalStock} units`, color: "var(--gold)" },
          { label: "Out of Stock", value: outOfStock, color: "#f87171" },
          { label: "Low Stock (≤5)", value: lowStock, color: "#fb923c" },
        ].map((s) => (
          <div key={s.label} className="glass rounded-2xl px-5 py-4 flex items-center gap-4">
            <p className="text-xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-zinc-500 text-sm">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div
          className="grid gap-4 px-6 py-3 text-xs text-zinc-500 uppercase tracking-wider border-b"
          style={{ borderColor: "var(--glass-border)", gridTemplateColumns: "2fr 1fr 1fr 1fr auto" }}
        >
          <span>Product</span>
          <span>Category</span>
          <span>Price</span>
          <span>Stock (click to edit)</span>
          <span>Actions</span>
        </div>

        <div className="divide-y" style={{ borderColor: "var(--glass-border)" }}>
          {products.map((p) => (
            <div
              key={p.id}
              className="grid gap-4 items-center px-6 py-4 hover:bg-white/[0.02] transition-colors"
              style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr auto" }}
            >
              {/* Product */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0 overflow-hidden"
                  style={{ background: "linear-gradient(145deg, #111113, #1c1c1f)" }}
                >
                  {p.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    p.emoji
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">{p.name}</p>
                  <p className="text-zinc-500 text-xs">{p.brand}</p>
                </div>
              </div>

              <span className="text-zinc-400 text-sm truncate">{p.category}</span>
              <span className="gold-text font-semibold text-sm">₹{p.price}</span>

              {/* Stock — inline editable */}
              <StockCell product={p} onUpdate={updateStock} />

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Link href={`/admin/products/edit/${p.id}`}
                  className="text-xs px-3 py-1.5 rounded-lg glass text-zinc-300 hover:text-white transition-colors">
                  Edit
                </Link>
                <button
                  onClick={() => { if (confirm(`Delete "${p.name}"?`)) deleteProduct(p.id); }}
                  className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                  style={{ background: "rgba(239,68,68,0.05)", color: "#f87171", border: "1px solid rgba(239,68,68,0.1)" }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
