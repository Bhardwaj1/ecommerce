"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { productVariantAPI } from "../../../lib/api";
import { TableSkeleton } from "../../components/TableSkeleton";
import { Toast, useToast } from "../../components/Toast";
import { useDebounce } from "../../../hooks/useDebounce";

export default function AllVariantsPage() {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const { toasts, show: showToast, remove: removeToast } = useToast();
  const abortRef = useRef(null);
  const debouncedSearch = useDebounce(search, 400);
  const PER_PAGE = 10;

  const fetchData = useCallback(async (q, p) => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    try {
      const res = await productVariantAPI.getAll({ search: q, page: p, perPage: PER_PAGE }, controller.signal);
      if (controller.signal.aborted) return;
      setRows(res.data ?? []);
      setTotal(res.meta?.totalRecords ?? 0);
      setTotalPages(res.meta?.totalPages ?? 1);
    } catch (err) {
      if (err.name === "AbortError") return;
      showToast(err.message, "error");
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(debouncedSearch, page);
    return () => abortRef.current?.abort();
  }, [debouncedSearch, page, fetchData]);

  return (
    <div className="p-6">
      <Toast toasts={toasts} onRemove={removeToast} />

      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-white">All Variants</h1>
          <p className="text-zinc-500 text-xs mt-0.5">{loading ? "Loading..." : `${total} total variants`}</p>
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden">

        {/* Search */}
        <div className="px-4 py-3 border-b flex items-center gap-3" style={{ borderColor: "var(--glass-border)" }}>
          <span className="text-zinc-500 text-sm">🔍</span>
          <input
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-zinc-600"
            placeholder="Search by product name or SKU..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-zinc-500 hover:text-white text-xs transition-colors">✕ Clear</button>
          )}
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--glass-border)" }}>
              {["Product", "SKU", "Volume", "Price", "Stock", "Status", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs text-zinc-500 uppercase tracking-wider font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <TableSkeleton rows={10} cols={[
                { type: "avatar", textWidth: 100 },
                { width: 100 },
                { width: 60 },
                { width: 60 },
                { width: 60 },
                { type: "badge" },
                { type: "actions" },
              ]} />
            ) : rows.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-zinc-500 text-sm">
                {search ? `No results for "${search}"` : "No variants found."}
              </td></tr>
            ) : (
              rows.map((v, i) => (
                <tr key={v._id}
                  style={{ borderBottom: i < rows.length - 1 ? "1px solid var(--glass-border)" : "none", opacity: v.active ? 1 : 0.6 }}
                  className="hover:bg-white/[0.02] transition-colors">

                  <td className="px-4 py-3">
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate">{v.product?.name ?? "—"}</p>
                      <p className="text-zinc-500 text-xs truncate">{v.product?.slug ?? ""}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-zinc-300 text-xs font-mono">{v.sku}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(201,168,76,0.08)", color: "var(--gold)", border: "1px solid rgba(201,168,76,0.15)" }}>
                      {v.volume?.name ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-sm" style={{ color: "var(--gold)" }}>₹{v.price}</td>
                  <td className="px-4 py-3 text-sm font-semibold" style={{ color: v.stock > 0 ? "#4ade80" : "#f87171" }}>
                    {v.stock > 0 ? v.stock : "Out"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{
                        background: v.active ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                        color: v.active ? "#4ade80" : "#f87171",
                        border: `1px solid ${v.active ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
                      }}>
                      {v.active ? "● Active" : "● Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/products/${v.product?._id}/variants`}
                      className="text-xs px-2.5 py-1.5 rounded-lg glass text-zinc-300 hover:text-white transition-colors">
                      Manage
                    </Link>
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
                className="px-3 py-1.5 rounded-lg text-xs glass text-zinc-300 hover:text-white disabled:opacity-30">
                ← Prev
              </button>
              <button onClick={() => setPage((p) => p + 1)} disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg text-xs glass text-zinc-300 hover:text-white disabled:opacity-30">
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
