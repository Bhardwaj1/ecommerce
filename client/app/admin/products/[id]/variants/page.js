"use client";

import { use, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { productVariantAPI, volumeAPI, productAPI } from "../../../../../lib/api";
import { Toast, useToast } from "../../../../components/Toast";
import { ConfirmModal } from "../../../../components/ConfirmModal";

function VariantModal({ productId, variant, volumes, onClose, onSaved }) {
  const isEdit = !!variant;
  const [form, setForm] = useState({
    volume: variant?.volume?._id ?? "",
    price: variant?.price ? String(variant.price) : "",
    stock: variant?.stock ? String(variant.stock) : "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.volume) { setError("Volume is required"); return; }
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) { setError("Valid price required"); return; }
    if (form.stock === "" || isNaN(Number(form.stock)) || Number(form.stock) < 0) { setError("Valid stock required"); return; }
    setSaving(true);
    setError("");
    try {
      if (isEdit) {
        await productVariantAPI.update(variant._id, {
          price: Number(form.price),
          stock: Number(form.stock),
        });
      } else {
        await productVariantAPI.create(productId, {
          volume: form.volume,
          price: Number(form.price),
          stock: Number(form.stock),
        });
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
      <div className="glass rounded-2xl p-7 w-full max-w-sm" style={{ border: "1px solid var(--glass-border)" }}>
        <h2 className="text-lg font-bold text-white mb-5">{isEdit ? "Edit Variant" : "Add Variant"}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Volume — only on create */}
          {!isEdit && (
            <div>
              <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-1.5">Volume *</label>
              <select className={inputClass} style={{ borderColor: "var(--glass-border)" }}
                value={form.volume} onChange={(e) => setForm((p) => ({ ...p, volume: e.target.value }))}>
                <option value="" className="bg-zinc-900">Select volume</option>
                {volumes.map((v) => (
                  <option key={v._id} value={v._id} className="bg-zinc-900">{v.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Price */}
          <div>
            <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-1.5">Price (₹) *</label>
            <input className={inputClass} style={{ borderColor: "var(--glass-border)" }}
              placeholder="e.g. 1299" type="number" min="0" value={form.price}
              onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} />
          </div>

          {/* Stock */}
          <div>
            <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-1.5">Stock *</label>
            <input className={inputClass} style={{ borderColor: "var(--glass-border)" }}
              placeholder="e.g. 50" type="number" min="0" value={form.stock}
              onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))} />
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={saving}
              className="gold-btn flex-1 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50">
              {saving ? "Saving..." : isEdit ? "Save Changes" : "Add Variant"}
            </button>
            <button type="button" onClick={onClose}
              className="glass flex-1 py-2.5 rounded-xl text-sm text-zinc-300 hover:text-white transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProductVariantsPage({ params }) {
  const { id: productId } = use(params);
  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [volumes, setVolumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { toasts, show: showToast, remove: removeToast } = useToast();

  const fetchVariants = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productVariantAPI.getByProduct(productId);
      // API returns either array or { data: [] }
      setVariants(Array.isArray(res) ? res : (res.data ?? []));
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    // Fetch product name + volumes in parallel
    Promise.all([
      productAPI.getAll({ perPage: 100 }),
      volumeAPI.getAll({ perPage: 100 }),
    ]).then(([prodRes, volRes]) => {
      const found = (prodRes.data ?? []).find((p) => p._id === productId);
      setProduct(found ?? null);
      setVolumes(volRes.data ?? []);
    }).catch(() => {});

    fetchVariants();
  }, [productId, fetchVariants]);

  async function handleToggle(variant) {
    try {
      await productVariantAPI.update(variant._id, { active: !variant.active });
      showToast(`Variant ${!variant.active ? "activated" : "deactivated"}`, "success");
      fetchVariants();
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  async function confirmDelete() {
    try {
      await productVariantAPI.delete(productId, deleteTarget._id);
      showToast("Variant deleted", "success");
      fetchVariants();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <div className="p-6">
      <Toast toasts={toasts} onRemove={removeToast} />
      {deleteTarget && (
        <ConfirmModal
          title="Delete Variant"
          message={`Delete variant "${deleteTarget.sku}"? This cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Link href="/admin/products" className="text-zinc-500 hover:text-white text-sm transition-colors">← Products</Link>
            <span className="text-zinc-700">/</span>
            <span className="text-zinc-400 text-sm">{product?.name ?? "..."}</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Product Variants</h1>
          <p className="text-zinc-500 text-xs mt-0.5">{variants.length} variant{variants.length !== 1 ? "s" : ""} · price & stock per volume</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/admin/products/edit/${productId}`}
            className="glass px-4 py-2 rounded-xl text-sm text-zinc-300 hover:text-white transition-colors">
            Edit Product
          </Link>
          <button onClick={() => setShowAdd(true)} className="gold-btn px-4 py-2 rounded-xl text-sm font-bold">
            + Add Variant
          </button>
        </div>
      </div>

      {/* Variants table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="grid gap-4 px-6 py-3 text-xs text-zinc-500 uppercase tracking-wider border-b"
          style={{ borderColor: "var(--glass-border)", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr auto" }}>
          <span>SKU</span>
          <span>Volume</span>
          <span>Price</span>
          <span>Stock</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        {loading ? (
          <div className="px-6 py-10 text-center text-zinc-500 text-sm">Loading...</div>
        ) : variants.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-4xl mb-3">📦</p>
            <p className="text-zinc-500 text-sm mb-4">No variants yet. Add volume + price + stock.</p>
            <button onClick={() => setShowAdd(true)} className="gold-btn px-5 py-2 rounded-xl text-sm font-bold">
              + Add First Variant
            </button>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "var(--glass-border)" }}>
            {variants.map((v) => (
              <div key={v._id}
                className="grid gap-4 items-center px-6 py-4 hover:bg-white/[0.02] transition-colors"
                style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr auto", opacity: v.active ? 1 : 0.6 }}>

                <span className="text-zinc-300 text-xs font-mono">{v.sku}</span>
                <span className="text-zinc-300 text-sm">{v.volume?.name ?? "—"}</span>
                <span className="font-semibold text-sm" style={{ color: "var(--gold)" }}>₹{v.price}</span>
                <span className="text-sm font-semibold" style={{ color: v.stock > 0 ? "#4ade80" : "#f87171" }}>
                  {v.stock > 0 ? `${v.stock} units` : "Out of stock"}
                </span>

                {/* Status */}
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full w-fit"
                  style={{
                    background: v.active ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                    color: v.active ? "#4ade80" : "#f87171",
                    border: `1px solid ${v.active ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
                  }}>
                  {v.active ? "● Active" : "● Inactive"}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button onClick={() => handleToggle(v)}
                    className="text-xs px-2.5 py-1.5 rounded-lg font-semibold transition-all"
                    style={{
                      background: v.active ? "rgba(239,68,68,0.08)" : "rgba(34,197,94,0.08)",
                      color: v.active ? "#f87171" : "#4ade80",
                      border: `1px solid ${v.active ? "rgba(239,68,68,0.2)" : "rgba(34,197,94,0.2)"}`,
                    }}>
                    {v.active ? "Deactivate" : "Activate"}
                  </button>
                  <button onClick={() => setEditTarget(v)}
                    className="text-xs px-2.5 py-1.5 rounded-lg glass text-zinc-300 hover:text-white transition-colors">
                    Edit
                  </button>
                  <button onClick={() => setDeleteTarget(v)}
                    className="text-xs px-2.5 py-1.5 rounded-lg transition-colors"
                    style={{ background: "rgba(239,68,68,0.08)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAdd && (
        <VariantModal
          productId={productId}
          volumes={volumes}
          onClose={() => setShowAdd(false)}
          onSaved={() => { showToast("Variant added", "success"); fetchVariants(); }}
        />
      )}
      {editTarget && (
        <VariantModal
          productId={productId}
          variant={editTarget}
          volumes={volumes}
          onClose={() => setEditTarget(null)}
          onSaved={() => { showToast("Variant updated", "success"); fetchVariants(); }}
        />
      )}
    </div>
  );
}
