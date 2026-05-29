"use client";

import { useState } from "react";
import Link from "next/link";
import { useProductTable } from "../../../hooks/useProductTable";
import { productAPI } from "../../../lib/api";
import { TableSkeleton } from "../../components/TableSkeleton";
import { Toast, useToast } from "../../components/Toast";
import { Button } from "../../components/Button";
import { SearchBar } from "../../components/SearchBar";
import { Pagination } from "../../components/Pagination";
import { StatusBadge } from "../../components/StatusBadge";
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
        <Link href="/admin/products/add" className="gold-btn px-4 py-2 rounded-xl text-sm font-bold inline-flex items-center gap-1">
          + Add Product
        </Link>
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <SearchBar value={search} onChange={setSearch} loading={loading} placeholder="Search products..." />

        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--glass-border)" }}>
              {["Product", "Category", "Volume", "Price", "Stock", "Status", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs text-zinc-500 uppercase tracking-wider font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <TableSkeleton rows={10} cols={[
                { type: "avatar", textWidth: 120 },
                { width: 80 },
                { width: 60 },
                { width: 60 },
                { width: 60 },
                { type: "badge" },
                { type: "actions" },
              ]} />
            ) : error ? (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-red-400 text-sm">{error}</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-zinc-500 text-sm">No products found.</td></tr>
            ) : (
              rows.map((p, i) => (
                <tr
                  key={p._id}
                  style={{
                    borderBottom: i < rows.length - 1 ? "1px solid var(--glass-border)" : "none",
                    opacity: p.active ? 1 : 0.6,
                  }}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center text-lg"
                        style={{ background: "linear-gradient(145deg, #111113, #1c1c1f)" }}>
                        {p.images?.[0]?.url
                          // eslint-disable-next-line @next/next/no-img-element
                          ? <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover" />
                          : "🍾"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-white text-sm font-medium truncate">{p.name}</p>
                        <p className="text-zinc-500 text-xs truncate">{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-zinc-400 text-xs">{p.category?.name ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(201,168,76,0.08)", color: "var(--gold)", border: "1px solid rgba(201,168,76,0.15)" }}>
                      {p.volume?.name ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold" style={{ color: "var(--gold)" }}>₹{p.price}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold" style={{ color: p.stock > 0 ? "#4ade80" : "#f87171" }}>
                      {p.stock > 0 ? p.stock : "Out"}
                    </span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge active={p.active} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/products/edit/${p._id}`} className="btn btn-ghost px-2.5 py-1.5 text-xs">Edit</Link>
                      <Button variant="danger" size="sm" onClick={() => setDeleteTarget(p)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <Pagination page={page} totalPages={totalPages} total={total} perPage={10} onPageChange={setPage} />
      </div>
    </div>
  );
}
