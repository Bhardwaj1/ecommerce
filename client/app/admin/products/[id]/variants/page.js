"use client";

import { use, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { variantAPI, volumeAPI } from "../../../../../lib/api";
import { Toast, useToast } from "../../../../components/Toast";
import { ConfirmModal } from "../../../../components/ConfirmModal";
import { Button } from "../../../../components/Button";
import { StatusBadge } from "../../../../components/StatusBadge";
import { Loader } from "../../../../components/Loader";

function VariantModal({ productId, variant, volumes, onClose, onSubmit }) {
  const isEdit = !!variant;
  const [form, setForm] = useState({
    volume: variant?.volume?._id || "",
    price: variant?.price ? String(variant.price) : "",
    stock: variant?.stock !== undefined ? String(variant.stock) : "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.volume) { setError("Volume is required"); return; }
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) { setError("Valid price required"); return; }
    if (form.stock === "" || isNaN(Number(form.stock)) || Number(form.stock) < 0) { setError("Valid stock required"); return; }
    setSaving(true);
    try {
      await onSubmit({ volume: form.volume, price: Number(form.price), stock: Number(form.stock) });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "w-full bg-zinc-900 border rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-yellow-600/60 transition-colors placeholder:text-zinc-600";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}>
      <div className="glass rounded-2xl p-7 w-full max-w-sm" style={{ border: "1px solid var(--glass-border)" }}>
        <h2 className="text-lg font-bold text-white mb-5">{isEdit ? "Edit Variant" : "Add Variant"}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-1.5">Volume *</label>
            <select className={inputClass} style={{ borderColor: "var(--glass-border)" }}
              value={form.volume} onChange={(e) => { setForm((p) => ({ ...p, volume: e.target.value })); setError(""); }}
              disabled={isEdit}>
              <option value="" className="bg-zinc-900">Select volume</option>
              {volumes.map((v) => (
                <option key={v._id} value={v._id} className="bg-zinc-900">{v.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-1.5">Price (₹) *</label>
              <input className={inputClass} style={{ borderColor: "var(--glass-border)" }}
                placeholder="e.g. 1299" value={form.price}
                onChange={(e) => { setForm((p) => ({ ...p, price: e.target.value })); setError(""); }} />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-1.5">Stock *</label>
              <input type="number" min="0" className={inputClass} style={{ borderColor: "var(--glass-border)" }}
                placeholder="e.g. 50" value={form.stock}
                onChange={(e) => { setForm((p) => ({ ...p, stock: e.target.value })); setError(""); }} />
            </div>
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <div className="flex gap-3 pt-1">
            <Button type="submit" variant="gold" size="md" loading={saving} className="flex-1">
              {isEdit ? "Save Changes" : "Add Variant"}
            </Button>
            <Button type="button" variant="ghost" size="md" className="flex-1" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProductVariantsPage({ params }) {
  const { id: productId } = use(params);
  const [variants, setVariants] = useState([]);
  const [volumes, setVolumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productName, setProductName] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { toasts, show: showToast, remove: removeToast } = useToast();

  const fetchVariants = useCallback(async () => {
    setLoading(true);
    try {
      const res = await variantAPI.getByProduct(productId);
      const data = res.data ?? [];
      setVariants(data);
      if (data[0]?.product?.name) setProductName(data[0].product.name);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchVariants();
    volumeAPI.getAll({ perPage: 100 }).then((res) => setVolumes(res.data ?? []));
  }, [fetchVariants]);

  async function handleAdd(data) {
    await variantAPI.add(productId, data);
    showToast("Variant added", "success");
    fetchVariants();
  }

  async function handleEdit(data) {
    await variantAPI.update(editTarget._id, data);
    showToast("Variant updated", "success");
    fetchVariants();
  }

  async function handleToggle(variant) {
    setVariants((prev) => prev.map((v) => v._id === variant._id ? { ...v, active: !v.active } : v));
    try {
      await variantAPI.update(variant._id, { active: !variant.active });
      showToast(`Variant ${!variant.active ? "activated" : "deactivated"}`, !variant.active ? "success" : "warning");
    } catch (err) {
      setVariants((prev) => prev.map((v) => v._id === variant._id ? { ...v, active: variant.active } : v));
      showToast(err.message, "error");
    }
  }

  async function handleDelete() {
    const target = deleteTarget;
    setDeleteTarget(null);
    setVariants((prev) => prev.filter((v) => v._id !== target._id));
    try {
      await variantAPI.delete(productId, target._id);
      showToast("Variant deleted", "success");
    } catch (err) {
      showToast(err.message, "error");
      fetchVariants();
    }
  }

  return (
    <div className="p-6 max-w-4xl">
      <Toast toasts={toasts} onRemove={removeToast} />
      {deleteTarget && (
        <ConfirmModal
          title="Delete Variant"
          message={`Delete the "${deleteTarget.volume?.name}" variant? This cannot be undone.`}
          confirmLabel="Yes, Delete"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 text-zinc-500 text-xs mb-1">
            <Link href="/admin/products" className="hover:text-white transition-colors">Products</Link>
            <span>/</span>
            <span className="text-white">{productName || "Variants"}</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Product Variants</h1>
          <p className="text-zinc-500 text-xs mt-0.5">{variants.length} variant{variants.length !== 1 ? "s" : ""} · price & stock per volume</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/admin/products/edit/${productId}`} className="btn btn-ghost px-3 py-2 text-xs">← Edit Product</Link>
          <Button variant="gold" size="md" onClick={() => setShowAdd(true)}>+ Add Variant</Button>
        </div>
      </div>

      {/* Variants Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--glass-border)" }}>
              {["Volume", "SKU", "Price", "Stock", "Status", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs text-zinc-500 uppercase tracking-wider font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center"><Loader size={20} text="Loading variants..." /></td></tr>
            ) : variants.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center">
                  <p className="text-zinc-600 text-sm mb-3">No variants yet</p>
                  <Button variant="gold" size="sm" onClick={() => setShowAdd(true)}>+ Add First Variant</Button>
                </td>
              </tr>
            ) : (
              variants.map((v, i) => (
                <tr key={v._id}
                  style={{
                    borderBottom: i < variants.length - 1 ? "1px solid var(--glass-border)" : "none",
                    opacity: v.active ? 1 : 0.55,
                  }}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                      style={{ background: "rgba(201,168,76,0.08)", color: "var(--gold)", border: "1px solid rgba(201,168,76,0.2)" }}>
                      {v.volume?.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-400 text-xs font-mono">{v.sku}</td>
                  <td className="px-4 py-3 font-semibold" style={{ color: "var(--gold)" }}>₹{v.price}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold" style={{ color: v.stock > 0 ? "#4ade80" : "#f87171" }}>
                      {v.stock > 0 ? `${v.stock} units` : "Out of stock"}
                    </span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge active={v.active} onClick={() => handleToggle(v)} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setEditTarget(v)}>Edit</Button>
                      <Button variant="danger" size="sm" onClick={() => setDeleteTarget(v)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <VariantModal productId={productId} volumes={volumes} onClose={() => setShowAdd(false)} onSubmit={handleAdd} />
      )}
      {editTarget && (
        <VariantModal productId={productId} variant={editTarget} volumes={volumes} onClose={() => setEditTarget(null)} onSubmit={handleEdit} />
      )}
    </div>
  );
}
