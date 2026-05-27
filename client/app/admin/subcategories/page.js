"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { categoryAPI, subCategoryAPI } from "../../../lib/api";
import { Toast, useToast } from "../../components/Toast";
import { ConfirmModal } from "../../components/ConfirmModal";
import { TableSkeleton } from "../../components/TableSkeleton";
import { Button } from "../../components/Button";
import { Pagination } from "../../components/Pagination";
import { SearchBar } from "../../components/SearchBar";
import { StatusBadge } from "../../components/StatusBadge";
import { useDebounce } from "../../../hooks/useDebounce";

const TABLE_COLS = [
  { type: "text", width: 140 },
  { type: "text", width: "50%" },
  { type: "text", width: 100 },
  { type: "badge" },
  { type: "actions" },
];

export default function SubcategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [selectedCatId, setSelectedCatId] = useState("all");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCatId, setNewCatId] = useState("");
  const [addError, setAddError] = useState("");
  const [adding, setAdding] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [editingDesc, setEditingDesc] = useState("");
  const [editError, setEditError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { toasts, show: showToast, remove: removeToast } = useToast();
  const debouncedSearch = useDebounce(search, 400);
  const abortRef = useRef(null);

  // fetch categories once for filter pills + add form
  useEffect(() => {
    categoryAPI.getAll({ perPage: 100 }).then((res) => setCategories(res.data ?? []));
  }, []);

  const fetchSubs = useCallback(async (q, catId, p, pp) => {
    if (abortRef.current) abortRef.current.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setLoading(true);
    setError(null);
    try {
      const res = await subCategoryAPI.getAll(
        { search: q, parentCategory: catId === "all" ? "" : catId, page: p, perPage: pp },
        ctrl.signal
      );
      if (ctrl.signal.aborted) return;
      setRows(res.data ?? []);
      const meta = res.meta ?? {};
      const totalCount = meta.totalRecords ?? res.total ?? res.data?.length ?? 0;
      setTotal(totalCount);
      setTotalPages(meta.totalPages ?? res.totalPages ?? Math.max(1, Math.ceil(totalCount / pp)));
    } catch (err) {
      if (err.name === "AbortError") return;
      setError(err.message);
    } finally {
      if (!ctrl.signal.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubs(debouncedSearch, selectedCatId, page, perPage);
    return () => abortRef.current?.abort();
  }, [debouncedSearch, selectedCatId, page, perPage, fetchSubs]);

  function handleSearch(val) { setSearch(val); setPage(1); }
  function handleCatFilter(id) { setSelectedCatId(id); setPage(1); }
  function handlePerPage(val) { setPerPage(Number(val)); setPage(1); }
  function refetch() { fetchSubs(debouncedSearch, selectedCatId, page, perPage); }

  async function handleAdd(e) {
    e.preventDefault();
    if (!newName.trim()) { setAddError("Name is required"); return; }
    if (!newCatId) { setAddError("Select a category"); return; }
    setAdding(true);
    try {
      await subCategoryAPI.add({ name: newName.trim(), description: newDesc.trim(), parentCategory: newCatId, active: true });
      setNewName(""); setNewDesc(""); setAddError("");
      showToast("Subcategory added", "success");
      refetch();
    } catch (err) {
      setAddError(err.message);
    } finally {
      setAdding(false);
    }
  }

  function startEdit(sub) {
    setEditingId(sub._id);
    setEditingName(sub.name);
    setEditingDesc(sub.description ?? "");
    setEditError("");
  }

  function cancelEdit() { setEditingId(null); setEditingName(""); setEditingDesc(""); setEditError(""); }

  async function handleEditSave(sub) {
    if (!editingName.trim()) { setEditError("Name is required"); return; }
    try {
      await subCategoryAPI.update(sub._id, { name: editingName.trim(), description: editingDesc.trim() });
      cancelEdit();
      showToast("Subcategory updated", "success");
      refetch();
    } catch (err) {
      setEditError(err.message);
    }
  }

  async function handleToggle(sub) {
    // optimistic
    setRows((prev) => prev.map((r) => r._id === sub._id ? { ...r, active: !r.active } : r));
    try {
      await subCategoryAPI.update(sub._id, { active: !sub.active });
      showToast(`"${sub.name}" ${!sub.active ? "activated" : "deactivated"}`, !sub.active ? "success" : "warning");
    } catch (err) {
      setRows((prev) => prev.map((r) => r._id === sub._id ? { ...r, active: sub.active } : r));
      showToast(err.message, "error");
    }
  }

  async function confirmDelete() {
    const target = deleteTarget;
    setDeleteTarget(null);
    setRows((prev) => prev.filter((r) => r._id !== target._id));
    setTotal((t) => t - 1);
    try {
      await subCategoryAPI.delete(target._id);
      showToast(`"${target.name}" deleted`, "success");
    } catch (err) {
      showToast(err.message, "error");
      refetch();
    }
  }

  const totalActive = rows.filter((s) => s.active).length;

  return (
    <div className="p-6">
      <Toast toasts={toasts} onRemove={removeToast} />
      {deleteTarget && (
        <ConfirmModal
          title="Delete Subcategory"
          message={`Are you sure you want to delete "${deleteTarget.name}"? This cannot be undone.`}
          confirmLabel="Yes, Delete"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-white">Subcategories</h1>
          <p className="text-zinc-500 text-xs mt-0.5">
            {loading ? "Loading..." : `${total} total · ${totalActive} active on this page`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ── Add Form ── */}
        <div className="lg:col-span-1">
          <div className="glass rounded-2xl p-5 sticky top-6">
            <h2 className="text-white font-semibold mb-1">Add Subcategory</h2>
            <p className="text-zinc-500 text-xs mb-4">Fill in details and choose a parent category.</p>

            <form onSubmit={handleAdd} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-1.5">Parent Category *</label>
                <select
                  className="w-full bg-zinc-900 border rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-yellow-600/60 transition-colors"
                  style={{ borderColor: "var(--glass-border)" }}
                  value={newCatId}
                  onChange={(e) => { setNewCatId(e.target.value); setAddError(""); }}
                >
                  <option value="" className="bg-zinc-900">Select category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id} className="bg-zinc-900">{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-1.5">Name *</label>
                <input
                  className="w-full bg-zinc-900 border rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-yellow-600/60 transition-colors placeholder:text-zinc-600"
                  style={{ borderColor: addError && !newName.trim() ? "#f87171" : "var(--glass-border)" }}
                  placeholder="e.g. Single Malt"
                  value={newName}
                  onChange={(e) => { setNewName(e.target.value); setAddError(""); }}
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-1.5">Description</label>
                <textarea
                  className="w-full bg-zinc-900 border rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-yellow-600/60 transition-colors placeholder:text-zinc-600"
                  style={{ borderColor: "var(--glass-border)", resize: "none", height: 72 }}
                  placeholder="Short description..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                />
                {addError && <p className="text-xs text-red-400 mt-1">{addError}</p>}
              </div>

              <Button type="submit" variant="gold" size="md" loading={adding} className="w-full">+ Add Subcategory</Button>
            </form>

            {/* Category summary */}
            <div className="mt-5 pt-4 border-t" style={{ borderColor: "var(--glass-border)" }}>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">By Category</p>
              <div className="flex flex-col gap-1.5">
                {categories.map((cat) => (
                  <div key={cat._id} className="flex items-center justify-between">
                    <span className="text-zinc-400 text-xs">{cat.name}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(201,168,76,0.08)", color: "var(--gold)" }}>
                      {rows.filter((s) => (s.parentCategory?._id ?? s.parentCategory) === cat._id).length}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Table ── */}
        <div className="lg:col-span-2 flex flex-col gap-3">

          {/* Toolbar: search + perPage + filter pills */}
          <div className="glass rounded-2xl overflow-hidden">

            <SearchBar
              value={search}
              onChange={handleSearch}
              loading={loading}
              placeholder="Search subcategories..."
              perPage={perPage}
              onPerPageChange={handlePerPage}
            />

            {/* Filter pills */}
            <div className="px-4 py-2.5 flex items-center gap-2 flex-wrap border-b" style={{ borderColor: "var(--glass-border)" }}>
              {[{ _id: "all", name: "All" }, ...categories].map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => handleCatFilter(cat._id)}
                  className="text-xs px-3 py-1 rounded-full font-semibold transition-all"
                  style={{
                    background: selectedCatId === cat._id ? "rgba(201,168,76,0.12)" : "rgba(255,255,255,0.04)",
                    color: selectedCatId === cat._id ? "var(--gold)" : "#71717a",
                    border: `1px solid ${selectedCatId === cat._id ? "rgba(201,168,76,0.3)" : "var(--glass-border)"}`,
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Table */}
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--glass-border)" }}>
                  {["Name", "Description", "Category", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs text-zinc-500 uppercase tracking-wider font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <TableSkeleton cols={TABLE_COLS} rows={perPage > 10 ? 10 : perPage} />
                ) : error ? (
                  <tr><td colSpan={5} className="px-4 py-10 text-center text-red-400 text-sm">Error: {error}</td></tr>
                ) : rows.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-12 text-center text-zinc-600 text-sm">
                    {search ? `No results for "${search}"` : "No subcategories found"}
                  </td></tr>
                ) : (
                  rows.map((sub, i) => {
                    const isEditing = editingId === sub._id;
                    const parentName = sub.parentCategory?.name ?? "";
                    return (
                      <tr
                        key={sub._id}
                        style={{
                          borderBottom: i < rows.length - 1 ? "1px solid var(--glass-border)" : "none",
                          opacity: sub.active ? 1 : 0.55,
                          borderLeft: isEditing ? "2px solid var(--gold)" : "2px solid transparent",
                        }}
                        className="hover:bg-white/[0.02] transition-colors"
                      >
                        {/* Name */}
                        <td className="px-4 py-3">
                          {isEditing ? (
                            <input
                              autoFocus
                              className="w-full bg-zinc-900 border rounded-lg px-3 py-1.5 text-white text-sm outline-none"
                              style={{ borderColor: editError ? "#f87171" : "var(--gold)" }}
                              value={editingName}
                              onChange={(e) => { setEditingName(e.target.value); setEditError(""); }}
                              onKeyDown={(e) => e.key === "Escape" && cancelEdit()}
                            />
                          ) : (
                            <span className="text-white font-medium">{sub.name}</span>
                          )}
                        </td>

                        {/* Description */}
                        <td className="px-4 py-3">
                          {isEditing ? (
                            <div>
                              <input
                                className="w-full bg-zinc-900 border rounded-lg px-3 py-1.5 text-white text-sm outline-none"
                                style={{ borderColor: "var(--glass-border)" }}
                                value={editingDesc}
                                placeholder="Description"
                                onChange={(e) => setEditingDesc(e.target.value)}
                                onKeyDown={(e) => e.key === "Escape" && cancelEdit()}
                              />
                              {editError && <p className="text-xs text-red-400 mt-1">{editError}</p>}
                            </div>
                          ) : (
                            <span className="text-zinc-400 text-xs line-clamp-1">{sub.description || "—"}</span>
                          )}
                        </td>

                        {/* Parent category */}
                        <td className="px-4 py-3">
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{ background: "rgba(201,168,76,0.08)", color: "var(--gold)", border: "1px solid rgba(201,168,76,0.15)" }}>
                            {parentName}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <StatusBadge active={sub.active} onClick={() => handleToggle(sub)} />
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {isEditing ? (
                              <>
                                <Button variant="success" size="sm" onClick={() => handleEditSave(sub)}>Save</Button>
                                <Button variant="ghost" size="sm" onClick={cancelEdit}>Cancel</Button>
                              </>
                            ) : (
                              <>
                                <Button variant="ghost" size="sm" onClick={() => startEdit(sub)}>Edit</Button>
                                <Button variant="danger" size="sm" onClick={() => setDeleteTarget(sub)}>Delete</Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            <Pagination page={page} totalPages={totalPages} total={total} perPage={perPage} onPageChange={setPage} />
          </div>
        </div>
      </div>
    </div>
  );
}
