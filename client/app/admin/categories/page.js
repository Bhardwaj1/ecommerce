"use client";

import { useState } from "react";
import Link from "next/link";
import { useAdmin } from "../../../context/AdminContext";
import { Toast, useToast } from "../../components/Toast";
import { ConfirmModal } from "../../components/ConfirmModal";
import { TableSkeleton } from "../../components/TableSkeleton";
import { Loader } from "../../components/Loader";
import { Button } from "../../components/Button";
import { Pagination } from "../../components/Pagination";
import { SearchBar } from "../../components/SearchBar";
import { StatusBadge } from "../../components/StatusBadge";
import { useCategoryTable } from "../../../hooks/useCategoryTable";

const TABLE_COLS = [
  { type: "text", width: 120 },
  { type: "text", width: "60%" },
  { type: "text", width: 80 },
  { type: "badge" },
  { type: "actions" },
];

function CategoryModal({ category, onClose, onSubmit }) {
  const isEdit = !!category;
  const [form, setForm] = useState({
    name: category?.name || "",
    description: category?.description || "",
    active: category?.active ?? true,
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) { setError("Name is required"); return; }
    setSaving(true);
    try {
      await onSubmit(form);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}>
      <div className="glass rounded-2xl p-7 w-full max-w-md" style={{ border: "1px solid var(--glass-border)" }}>
        <h2 className="text-lg font-bold text-white mb-5">{isEdit ? "Edit Category" : "Add Category"}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-1.5">Name *</label>
            <input
              className="w-full bg-zinc-900 border rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-yellow-600/60 transition-colors placeholder:text-zinc-600"
              style={{ borderColor: error ? "#f87171" : "var(--glass-border)" }}
              placeholder="e.g. Whisky"
              value={form.name}
              onChange={(e) => { setForm((p) => ({ ...p, name: e.target.value })); setError(""); }}
            />
            {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
          </div>

          <div>
            <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-1.5">Description</label>
            <input
              className="w-full bg-zinc-900 border rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-yellow-600/60 transition-colors placeholder:text-zinc-600"
              style={{ borderColor: "var(--glass-border)" }}
              placeholder="Short description..."
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">Active on storefront</span>
            <button type="button" onClick={() => setForm((p) => ({ ...p, active: !p.active }))}
              className="w-11 h-6 rounded-full transition-all relative flex-shrink-0"
              style={{ background: form.active ? "var(--gold)" : "#3f3f46" }}
            >
              <span className="absolute top-0.5 w-5 h-5 rounded-full bg-zinc-950 transition-all"
                style={{ left: form.active ? "calc(100% - 22px)" : "2px" }} />
            </button>
          </div>

          <div className="flex gap-3 pt-1">
            <Button type="submit" variant="gold" size="md" loading={saving} className="flex-1">
              {isEdit ? "Save Changes" : "Add Category"}
            </Button>
            <Button type="button" variant="ghost" size="md" className="flex-1" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  const { addCategory, editCategory, deleteCategory, toggleCategory } = useAdmin();
  const { rows, total, totalPages, page, setPage, search, setSearch, loading, error, refetch, perPage, optimisticDelete, revertDelete, optimisticToggle } = useCategoryTable();
  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { toasts, show: showToast, remove: removeToast } = useToast();

  async function handleAdd(data) {
    await addCategory(data);
    showToast("Category added successfully", "success");
    refetch();
  }

  async function handleEdit(data) {
    await editCategory(editTarget._id, data);
    showToast("Category updated", "success");
    refetch();
  }

  async function handleDelete() {
    const target = deleteTarget;
    setDeleteTarget(null);
    optimisticDelete(target._id);
    try {
      await deleteCategory(target._id);
      showToast(`"${target.name}" deleted`, "success");
      if (rows.length === 1 && page > 1) setPage((p) => p - 1);
      else refetch();
    } catch (err) {
      revertDelete(target);
      showToast(err.message || "Failed to delete", "error");
    }
  }

  async function handleToggle(cat) {
    optimisticToggle(cat._id);
    try {
      await toggleCategory(cat._id, !cat.active);
      showToast(`"${cat.name}" ${cat.active ? "deactivated" : "activated"}`, cat.active ? "warning" : "success");
    } catch {
      optimisticToggle(cat._id); // revert
      showToast("Failed to update", "error");
    }
  }

  return (
    <div className="p-6">
      <Toast toasts={toasts} onRemove={removeToast} />

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-white">Categories</h1>
          <p className="text-zinc-500 text-xs mt-0.5">
            {loading ? "Loading..." : `${total} total categories`}
          </p>
        </div>
        <Button variant="gold" size="md" onClick={() => setShowAdd(true)}>+ Add Category</Button>
      </div>

      {/* Table Container */}
      <div className="glass rounded-2xl overflow-hidden">

        <SearchBar value={search} onChange={setSearch} loading={loading} placeholder="Search categories..." />

        {/* Table */}
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--glass-border)" }}>
              {["Category", "Description", "Subcategories", "Status", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs text-zinc-500 uppercase tracking-wider font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <TableSkeleton cols={TABLE_COLS} rows={perPage} />
            ) : error ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-red-400 text-sm">
                  Error: {error}
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-zinc-600 text-sm">
                  {search ? `No results for "${search}"` : "No categories yet"}
                </td>
              </tr>
            ) : (
              rows.map((cat, i) => (
                  <tr
                    key={cat._id}
                    style={{
                      borderBottom: i < rows.length - 1 ? "1px solid var(--glass-border)" : "none",
                      opacity: cat.active ? 1 : 0.6,
                    }}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="text-white font-medium">{cat.name}</span>
                    </td>
                    <td className="px-4 py-3 text-zinc-400 max-w-xs">
                      <span className="line-clamp-1">{cat.description || "—"}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-white font-medium">{cat.totalSubCategories ?? 0}</span>
                        <span className="text-zinc-600 text-xs">total</span>
                        <span className="text-zinc-700 mx-1">·</span>
                        <span className="text-green-400 font-medium">{cat.activeSubCategories ?? 0}</span>
                        <span className="text-zinc-600 text-xs">active</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge active={cat.active} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Button variant={cat.active ? "danger" : "success"} size="sm" onClick={() => handleToggle(cat)}>
                          {cat.active ? "Deactivate" : "Activate"}
                        </Button>
                        <Link href={`/admin/categories/${cat._id}`} className="btn btn-ghost px-2.5 py-1.5 text-xs">Manage</Link>
                        <Button variant="ghost" size="sm" onClick={() => setEditTarget(cat)}>Edit</Button>
                        <Button variant="danger" size="sm" onClick={() => setDeleteTarget(cat)}>Delete</Button>
                      </div>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>

        <Pagination page={page} totalPages={totalPages} total={total} perPage={perPage} onPageChange={setPage} />
      </div>

      {/* Modals */}
      {showAdd && <CategoryModal onClose={() => setShowAdd(false)} onSubmit={handleAdd} />}
      {editTarget && <CategoryModal category={editTarget} onClose={() => setEditTarget(null)} onSubmit={handleEdit} />}
      {deleteTarget && (
        <ConfirmModal
          title="Delete Category"
          message={`Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone.`}
          confirmLabel="Yes, Delete"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
