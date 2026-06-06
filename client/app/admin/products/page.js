"use client";

import { useState } from "react";
import Link from "next/link";
import { useProductTable } from "../../../hooks/useProductTable";
import { productAPI } from "../../../lib/api";
import { TableSkeleton } from "../../components/TableSkeleton";
import { Toast, useToast } from "../../components/Toast";
import { ConfirmModal } from "../../components/ConfirmModal";

export default function AdminProducts() {
  const { rows, total, totalPages, page, setPage, search, setSearch, loading, error, refetch, optimisticDelete } = useProductTable();
  const { toasts, show: showToast, remove: removeToast } = useToast();
  const [deleteTarget, setDeleteTarget] = useState(null);

  async function handleDelete() {
    const target = deleteTarget;
    setDeleteTarget(null);
    optimisticDelete(target._id);
    try {
      await productAPI.delete(target._id);
      showToast("Product deleted", "success");
    } catch (err) {
      showToast(err.message, "error");
      refetch();
    }
  }

  return (
    <div className="p-6">
      <Toast toasts={toasts} onRemove={removeToast} />
      {deleteTarget && (
        <ConfirmModal
          title="Delete Product"
          message={`Are you sure you want to delete "${deleteTarget.name}"? This cannot be undone.`}
          confirmLabel="Yes, Delete"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-zinc-500 text-xs mt-0.5">{loading ? "Loading..." : `${total} total products`}</p>
        </div>
        <Link href="/admin/products/add" className="gold-btn px-4 py-2 rounded-xl text-sm font-bold">
          + Add Product
        </Link>
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">

        {/* Search */}
        <div className="px-4 py-3 border-b flex items-center gap-3" style={{ borderColor: "var(--glass-border)" }}>
          <span className="text-zinc-500 text-sm">🔍</span>
          <input
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-zinc-600"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-zinc-500 hover:text-white text-xs transition-colors">✕ Clear</button>
          )}
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--glass-border)" }}>
              {["Product", "Category", "Sub Category", "Alcohol %", "Status", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs text-zinc-500 uppercase tracking-wider font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <TableSkeleton rows={10} cols={[
                { type: "avatar", textWidth: 120 },
                { width: 80 },
                { width: 80 },
                { width: 60 },
                { type: "badge" },
                { type: "actions" },
              ]} />
            ) : error ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-red-400 text-sm">{error}</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-zinc-500 text-sm">No products found.</td></tr>
            ) : (
              rows.map((p, i) => (
                <tr key={p._id}
                  style={{ borderBottom: i < rows.length - 1 ? "1px solid var(--glass-border)" : "none", opacity: p.active ? 1 : 0.6 }}
                  className="hover:bg-white/[0.02] transition-colors">

                  {/* Product */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center text-lg"
                        style={{ background: "linear-gradient(145deg, #111113, #1c1c1f)" }}>
                        {p.thumbnails
                          // eslint-disable-next-line @next/next/no-img-element
                          ? <img src={p.thumbnails} alt={p.name} className="w-full h-full object-cover" />
                          : "🍾"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-white text-sm font-medium truncate">{p.name}</p>
                        <p className="text-zinc-500 text-xs truncate">{p.slug}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-zinc-400 text-xs">{p.category?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-zinc-400 text-xs">{p.subCategory?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-zinc-400 text-xs">{p.alcoholPercentage ? `${p.alcoholPercentage}%` : "—"}</td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{
                        background: p.active ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                        color: p.active ? "#4ade80" : "#f87171",
                        border: `1px solid ${p.active ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
                      }}>
                      {p.active ? "● Active" : "● Inactive"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/products/${p._id}/variants`}
                        className="text-xs px-2.5 py-1.5 rounded-lg font-semibold transition-all"
                        style={{ background: "rgba(201,168,76,0.1)", color: "var(--gold)", border: "1px solid rgba(201,168,76,0.2)" }}>
                        Variants
                      </Link>
                      <Link href={`/admin/products/edit/${p._id}`}
                        className="text-xs px-2.5 py-1.5 rounded-lg glass text-zinc-300 hover:text-white transition-colors">
                        Edit
                      </Link>
                      <button onClick={() => setDeleteTarget(p)}
                        className="text-xs px-2.5 py-1.5 rounded-lg transition-colors"
                        style={{ background: "rgba(239,68,68,0.08)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="px-4 py-3 border-t flex items-center justify-between" style={{ borderColor: "var(--glass-border)" }}>
            <p className="text-xs text-zinc-500">Page {page} of {totalPages} · {total} total</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage((p) => p - 1)} disabled={page === 1}
                className="px-3 py-1.5 rounded-lg text-xs glass text-zinc-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed">
                ← Prev
              </button>
              <button onClick={() => setPage((p) => p + 1)} disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg text-xs glass text-zinc-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed">
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
