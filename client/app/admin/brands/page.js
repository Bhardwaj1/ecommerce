"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { brandAPI } from "../../../lib/api";
import { Toast, useToast } from "../../components/Toast";
import { ConfirmModal } from "../../components/ConfirmModal";
import { Loader } from "../../components/Loader";
import { useDebounce } from "../../../hooks/useDebounce";

function BrandModal({ brand, onClose, onSaved }) {
  const isEdit = !!brand;
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    name: brand?.name ?? "",
    description: brand?.description ?? "",
    active: brand?.active ?? true,
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(brand?.logo?.url ?? null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function handleFile(file) {
    if (!file || !file.type.startsWith("image/")) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) { setError("Name is required"); return; }
    if (!isEdit && !logoFile) { setError("Logo is required"); return; }

    setSaving(true);
    setError("");
    try {
      if (isEdit) {
        const body = logoFile ? new FormData() : { name: form.name, description: form.description, active: form.active };
        if (logoFile) {
          body.append("name", form.name);
          body.append("description", form.description);
          body.append("active", String(form.active));
          body.append("logo", logoFile, logoFile.name);
        }
        await brandAPI.update(brand._id, body);
      } else {
        const fd = new FormData();
        fd.append("name", form.name.trim());
        fd.append("description", form.description);
        fd.append("active", String(form.active));
        fd.append("logo", logoFile, logoFile.name);
        await brandAPI.create(fd);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "w-full bg-zinc-900 border rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-yellow-600/60 transition-colors placeholder:text-zinc-600";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}>

      {/* Full screen saving overlay */}
      {saving && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl gap-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}>
          <Loader size={40} />
          <p className="text-white text-sm font-medium">
            {isEdit ? "Updating brand..." : "Creating brand..."}
          </p>
          <p className="text-zinc-500 text-xs">Uploading image to cloud, please wait</p>
        </div>
      )}
      <div className="glass rounded-2xl p-7 w-full max-w-md" style={{ border: "1px solid var(--glass-border)" }}>
        <h2 className="text-lg font-bold text-white mb-5">{isEdit ? "Edit Brand" : "Add Brand"}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Logo upload */}
          <div>
            <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-2">
              Logo {!isEdit && "*"}
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-4 cursor-pointer"
            >
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 border-2 border-dashed transition-colors"
                style={{ borderColor: "var(--glass-border)", background: "rgba(255,255,255,0.03)" }}
              >
                {logoPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logoPreview} alt="logo" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl">🏷️</span>
                )}
              </div>
              <div>
                <p className="text-white text-sm font-medium">
                  {logoPreview ? "Change logo" : "Upload logo"}
                </p>
                <p className="text-zinc-600 text-xs mt-0.5">PNG, JPG, WEBP</p>
              </div>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => handleFile(e.target.files[0])} />
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-1.5">Name *</label>
            <input className={inputClass}
              style={{ borderColor: error && !form.name.trim() ? "#f87171" : "var(--glass-border)" }}
              placeholder="e.g. Glenfiddich"
              value={form.name}
              onChange={(e) => { setForm((p) => ({ ...p, name: e.target.value })); setError(""); }}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-1.5">Description</label>
            <input className={inputClass}
              style={{ borderColor: "var(--glass-border)" }}
              placeholder="Short description..."
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            />
          </div>

          {/* Active toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">Active on storefront</span>
            <button type="button" onClick={() => setForm((p) => ({ ...p, active: !p.active }))}
              className="w-11 h-6 rounded-full transition-all relative flex-shrink-0"
              style={{ background: form.active ? "var(--gold)" : "#3f3f46" }}>
              <span className="absolute top-0.5 w-5 h-5 rounded-full bg-zinc-950 transition-all"
                style={{ left: form.active ? "calc(100% - 22px)" : "2px" }} />
            </button>
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={saving}
              className="gold-btn flex-1 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed">
              {isEdit ? "Save Changes" : "Add Brand"}
            </button>
            <button type="button" onClick={onClose} disabled={saving}
              className="glass flex-1 py-2.5 rounded-xl text-sm text-zinc-300 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function BrandsPage() {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
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
      const res = await brandAPI.getAll({ search: q, page: p, perPage: PER_PAGE }, controller.signal);
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

  function handleSearch(val) {
    setSearch(val);
    setPage(1);
  }

  async function handleToggle(brand) {
    try {
      await brandAPI.update(brand._id, { active: !brand.active });
      showToast(`"${brand.name}" ${!brand.active ? "activated" : "deactivated"}`, "success");
      fetchData(debouncedSearch, page);
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  async function confirmDelete() {
    try {
      await brandAPI.delete(deleteTarget._id);
      showToast(`"${deleteTarget.name}" deleted`, "success");
      fetchData(debouncedSearch, page);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <div className="p-8">
      <Toast toasts={toasts} onRemove={removeToast} />
      {deleteTarget && (
        <ConfirmModal
          title="Delete Brand"
          message={`Are you sure you want to delete "${deleteTarget.name}"? This cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Brands</h1>
          <p className="text-zinc-500 text-sm">{total} total brands</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="gold-btn px-5 py-2.5 rounded-xl text-sm font-bold">
          + Add Brand
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search brands..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="bg-zinc-900 border rounded-xl px-4 py-2.5 text-white text-sm outline-none w-full max-w-sm focus:border-yellow-600/60 transition-colors placeholder:text-zinc-600"
          style={{ borderColor: "var(--glass-border)" }}
        />
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="grid gap-4 px-6 py-3 text-xs text-zinc-500 uppercase tracking-wider border-b"
          style={{ borderColor: "var(--glass-border)", gridTemplateColumns: "auto 2fr 2fr 1fr auto" }}>
          <span>Logo</span>
          <span>Name</span>
          <span>Description</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        {loading ? (
          <div className="px-6 py-10 text-center text-zinc-500 text-sm">Loading...</div>
        ) : rows.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-4xl mb-3">🏷️</p>
            <p className="text-zinc-500 text-sm">{search ? `No results for "${search}"` : "No brands yet."}</p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "var(--glass-border)" }}>
            {rows.map((brand) => (
              <div key={brand._id}
                className="grid gap-4 items-center px-6 py-4 hover:bg-white/[0.02] transition-colors"
                style={{ gridTemplateColumns: "auto 2fr 2fr 1fr auto", opacity: brand.active ? 1 : 0.6 }}>

                {/* Logo */}
                <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center"
                  style={{ background: "linear-gradient(145deg, #111113, #1c1c1f)" }}>
                  {brand.logo?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={brand.logo.url} alt={brand.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl">🏷️</span>
                  )}
                </div>

                {/* Name */}
                <p className="text-white text-sm font-medium capitalize">{brand.name}</p>

                {/* Description */}
                <p className="text-zinc-400 text-sm truncate">{brand.description || "—"}</p>

                {/* Status */}
                <span className="text-xs font-semibold px-3 py-1 rounded-full w-fit"
                  style={{
                    background: brand.active ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                    color: brand.active ? "#4ade80" : "#f87171",
                    border: `1px solid ${brand.active ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}`,
                  }}>
                  {brand.active ? "● Active" : "● Inactive"}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button onClick={() => handleToggle(brand)}
                    className="text-xs px-3 py-1.5 rounded-lg font-semibold transition-all"
                    style={{
                      background: brand.active ? "rgba(239,68,68,0.08)" : "rgba(34,197,94,0.08)",
                      color: brand.active ? "#f87171" : "#4ade80",
                      border: `1px solid ${brand.active ? "rgba(239,68,68,0.2)" : "rgba(34,197,94,0.2)"}`,
                    }}>
                    {brand.active ? "Deactivate" : "Activate"}
                  </button>
                  <button onClick={() => setEditTarget(brand)}
                    className="text-xs px-3 py-1.5 rounded-lg glass text-zinc-300 hover:text-white transition-colors">
                    Edit
                  </button>
                  <button onClick={() => setDeleteTarget(brand)}
                    className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                    style={{ background: "rgba(239,68,68,0.06)", color: "#f87171", border: "1px solid rgba(239,68,68,0.12)" }}>
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
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            className="glass px-4 py-2 rounded-lg text-sm text-zinc-300 disabled:opacity-40">
            ← Prev
          </button>
          <span className="text-zinc-500 text-sm">Page {page} of {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="glass px-4 py-2 rounded-lg text-sm text-zinc-300 disabled:opacity-40">
            Next →
          </button>
        </div>
      )}

      {showAdd && (
        <BrandModal
          onClose={() => setShowAdd(false)}
          onSaved={() => { showToast("Brand added successfully", "success"); fetchData(debouncedSearch, page); }}
        />
      )}
      {editTarget && (
        <BrandModal
          brand={editTarget}
          onClose={() => setEditTarget(null)}
          onSaved={() => { showToast("Brand updated", "success"); fetchData(debouncedSearch, page); }}
        />
      )}
    </div>
  );
}
