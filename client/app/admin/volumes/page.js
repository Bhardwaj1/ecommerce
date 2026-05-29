"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { volumeAPI } from "../../../lib/api";
import { Toast, useToast } from "../../components/Toast";
import { ConfirmModal } from "../../components/ConfirmModal";
import { TableSkeleton } from "../../components/TableSkeleton";
import { Button } from "../../components/Button";
import { SearchBar } from "../../components/SearchBar";
import { Pagination } from "../../components/Pagination";
import { useDebounce } from "../../../hooks/useDebounce";

const TABLE_COLS = [
  { type: "text", width: 140 },
  { type: "text", width: 100 },
  { type: "actions" },
];

function VolumeModal({ volume, onClose, onSubmit }) {
  const isEdit = !!volume;
  const [form, setForm] = useState({ name: volume?.name || "", valueInMl: volume?.valueInMl || "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) { setError("Name is required"); return; }
    if (!form.valueInMl || isNaN(Number(form.valueInMl)) || Number(form.valueInMl) <= 0) {
      setError("Valid value in ml is required"); return;
    }
    setSaving(true);
    try {
      await onSubmit({ name: form.name.trim(), valueInMl: Number(form.valueInMl) });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}>
      <div className="glass rounded-2xl p-7 w-full max-w-sm" style={{ border: "1px solid var(--glass-border)" }}>
        <h2 className="text-lg font-bold text-white mb-5">{isEdit ? "Edit Volume" : "Add Volume"}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-1.5">Name *</label>
            <input
              className="w-full bg-zinc-900 border rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-yellow-600/60 transition-colors placeholder:text-zinc-600"
              style={{ borderColor: error ? "#f87171" : "var(--glass-border)" }}
              placeholder="e.g. 750ml"
              value={form.name}
              onChange={(e) => { setForm((p) => ({ ...p, name: e.target.value })); setError(""); }}
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-1.5">Value in ML *</label>
            <input
              type="number"
              min="1"
              className="w-full bg-zinc-900 border rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-yellow-600/60 transition-colors placeholder:text-zinc-600"
              style={{ borderColor: error ? "#f87171" : "var(--glass-border)" }}
              placeholder="e.g. 750"
              value={form.valueInMl}
              onChange={(e) => { setForm((p) => ({ ...p, valueInMl: e.target.value })); setError(""); }}
            />
            {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
          </div>
          <div className="flex gap-3 pt-1">
            <Button type="submit" variant="gold" size="md" loading={saving} className="flex-1">
              {isEdit ? "Save Changes" : "Add Volume"}
            </Button>
            <Button type="button" variant="ghost" size="md" className="flex-1" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function VolumesPage() {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { toasts, show: showToast, remove: removeToast } = useToast();
  const debouncedSearch = useDebounce(search, 400);
  const abortRef = useRef(null);

  const fetchData = useCallback(async (q, p) => {
    if (abortRef.current) abortRef.current.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setLoading(true); setError(null);
    try {
      const res = await volumeAPI.getAll({ search: q, page: p, perPage }, ctrl.signal);
      if (ctrl.signal.aborted) return;
      setRows(res.data ?? []);
      const meta = res.meta ?? {};
      setTotal(meta.totalRecords ?? res.data?.length ?? 0);
      setTotalPages(meta.totalPages ?? 1);
    } catch (err) {
      if (err.name === "AbortError") return;
      setError(err.message);
    } finally {
      if (!ctrl.signal.aborted) setLoading(false);
    }
  }, [perPage]);

  useEffect(() => {
    fetchData(debouncedSearch, page);
    return () => abortRef.current?.abort();
  }, [debouncedSearch, page, fetchData]);

  function handleSearch(val) { setSearch(val); setPage(1); }
  function refetch() { fetchData(debouncedSearch, page); }

  async function handleAdd(data) {
    await volumeAPI.add(data);
    showToast("Volume added successfully", "success");
    refetch();
  }

  async function handleEdit(data) {
    await volumeAPI.update(editTarget._id, data);
    showToast("Volume updated", "success");
    refetch();
  }

  async function handleDelete() {
    const target = deleteTarget;
    setDeleteTarget(null);
    setRows((prev) => prev.filter((r) => r._id !== target._id));
    setTotal((t) => t - 1);
    try {
      await volumeAPI.delete(target._id);
      showToast(`"${target.name}" deleted`, "success");
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
          title="Delete Volume"
          message={`Are you sure you want to delete "${deleteTarget.name}"? This cannot be undone.`}
          confirmLabel="Yes, Delete"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-white">Volumes</h1>
          <p className="text-zinc-500 text-xs mt-0.5">{loading ? "Loading..." : `${total} total volumes`}</p>
        </div>
        <Button variant="gold" size="md" onClick={() => setShowAdd(true)}>+ Add Volume</Button>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <SearchBar value={search} onChange={handleSearch} loading={loading} placeholder="Search volumes..." />

        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--glass-border)" }}>
              {["Name", "Value (ml)", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs text-zinc-500 uppercase tracking-wider font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <TableSkeleton cols={TABLE_COLS} rows={perPage} />
            ) : error ? (
              <tr><td colSpan={3} className="px-4 py-10 text-center text-red-400 text-sm">Error: {error}</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={3} className="px-4 py-10 text-center text-zinc-600 text-sm">
                {search ? `No results for "${search}"` : "No volumes yet"}
              </td></tr>
            ) : (
              rows.map((vol, i) => (
                <tr
                  key={vol._id}
                  style={{ borderBottom: i < rows.length - 1 ? "1px solid var(--glass-border)" : "none" }}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-4 py-3 text-white font-medium">{vol.name}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                      style={{ background: "rgba(201,168,76,0.08)", color: "var(--gold)", border: "1px solid rgba(201,168,76,0.2)" }}>
                      {vol.valueInMl} ml
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setEditTarget(vol)}>Edit</Button>
                      <Button variant="danger" size="sm" onClick={() => setDeleteTarget(vol)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <Pagination page={page} totalPages={totalPages} total={total} perPage={perPage} onPageChange={setPage} />
      </div>

      {showAdd && <VolumeModal onClose={() => setShowAdd(false)} onSubmit={handleAdd} />}
      {editTarget && <VolumeModal volume={editTarget} onClose={() => setEditTarget(null)} onSubmit={handleEdit} />}
    </div>
  );
}
