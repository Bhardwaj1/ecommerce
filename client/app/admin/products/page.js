"use client";

import { useState } from "react";
import Link from "next/link";
import { useProductTable } from "../../../hooks/useProductTable";
import { productAPI } from "../../../lib/api";
import { TableSkeleton } from "../../components/TableSkeleton";
import { Toast, useToast } from "../../components/Toast";

export default function AdminProducts() {
  const { rows, total, totalPages, page, setPage, search, setSearch, loading, error, refetch, optimisticDelete } = useProductTable();
  const { toasts, show: showToast, remove: removeToast } = useToast();

  async function handleDelete(product) {
    if (!confirm(`Delete "${product.name}"?`)) return;
    optimisticDelete(product._id);
    try {
      await productAPI.delete(product._id);
      showToast("Product deleted", "success");
    } catch (err) {
      showToast(err.message, "error");
      refetch();
    }
  }

  return (
    <div className="p-8">
      <Toast toasts={toasts} onRemove={removeToast} />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Products</h1>
          <p className="text-zinc-500 text-sm">{total} total products</p>
        </div>
        <Link href="/admin/products/add" className="gold-btn px-5 py-2.5 rounded-xl text-sm font-bold">
          + Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-zinc-900 border rounded-xl px-4 py-2.5 text-white text-sm outline-none w-full max-w-sm focus:border-yellow-600/60 transition-colors placeholder:text-zinc-600"
          style={{ borderColor: "var(--glass-border)" }}
        />
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
          <span>Status</span>
          <span>Actions</span>
        </div>

        {loading ? (
          <table className="w-full"><tbody>
            <TableSkeleton rows={6} cols={[
              { type: "avatar", textWidth: 120 },
              { width: "80%" },
              { width: "60%" },
              { type: "badge" },
              { type: "actions" },
            ]} />
          </tbody></table>
        ) : error ? (
          <div className="px-6 py-10 text-center text-red-400 text-sm">{error}</div>
        ) : rows.length === 0 ? (
          <div className="px-6 py-10 text-center text-zinc-500 text-sm">No products found.</div>
        ) : (
          <div className="divide-y" style={{ borderColor: "var(--glass-border)" }}>
            {rows.map((p) => (
              <div
                key={p._id}
                className="grid gap-4 items-center px-6 py-4 hover:bg-white/[0.02] transition-colors"
                style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr auto" }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0 overflow-hidden"
                    style={{ background: "linear-gradient(145deg, #111113, #1c1c1f)" }}
                  >
                    {p.thumbnails ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.thumbnails} alt={p.name} className="w-full h-full object-cover" />
                    ) : "🍾"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">{p.name}</p>
                    <p className="text-zinc-500 text-xs">{p.volume}</p>
                  </div>
                </div>

                <span className="text-zinc-400 text-sm truncate">{p.category?.name ?? p.category}</span>
                <span className="gold-text font-semibold text-sm">₹{p.price}</span>

                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full w-fit"
                  style={{
                    background: p.active ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                    color: p.active ? "#4ade80" : "#f87171",
                    border: `1px solid ${p.active ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}`,
                  }}
                >
                  {p.active ? "● Active" : "● Inactive"}
                </span>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/products/edit/${p._id}`}
                    className="text-xs px-3 py-1.5 rounded-lg glass text-zinc-300 hover:text-white transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(p)}
                    className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                    style={{ background: "rgba(239,68,68,0.05)", color: "#f87171", border: "1px solid rgba(239,68,68,0.1)" }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="glass px-4 py-2 rounded-lg text-sm text-zinc-300 disabled:opacity-40"
          >
            ← Prev
          </button>
          <span className="text-zinc-500 text-sm">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="glass px-4 py-2 rounded-lg text-sm text-zinc-300 disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
