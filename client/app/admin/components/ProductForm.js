"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

const emojiOptions = ["🥃", "🍺", "🍷", "🍸", "🍹", "🍾", "🫗"];
const categoryOptions = [
  "Single Malt Whisky", "Blended Whisky", "Tennessee Whiskey",
  "Premium Beer", "Craft Beer",
  "Red Wine", "White Wine", "Sparkling Wine",
  "Premium Vodka",
  "Dark Rum", "White Rum",
  "Gin", "Tequila", "Brandy",
];

export default function ProductForm({ initialData, onSubmit, submitLabel }) {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    brand: "",
    category: categoryOptions[0],
    price: "",
    emoji: "🍾",
    description: "",
    alcoholPercent: "",
    volume: "750ml",
    badge: "",
    stockQty: "",
    images: [],
    ...initialData,
    stockQty: initialData?.stockQty !== undefined ? String(initialData.stockQty) : "",
  });

  const [errors, setErrors] = useState({});
  const [dragOver, setDragOver] = useState(false);

  const inStock = Number(form.stockQty) > 0;

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.brand.trim()) e.brand = "Brand is required";
    if (!form.price || isNaN(Number(String(form.price).replace(/,/g, "")))) e.price = "Valid price required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.alcoholPercent || isNaN(Number(form.alcoholPercent))) e.alcoholPercent = "Valid % required";
    if (form.stockQty === "" || isNaN(Number(form.stockQty)) || Number(form.stockQty) < 0) e.stockQty = "Valid quantity required";
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSubmit({
      ...form,
      badge: form.badge?.trim() || null,
      alcoholPercent: Number(form.alcoholPercent),
      stockQty: Number(form.stockQty),
    });
    router.push("/admin/products");
  }

  function field(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  // ── Image handling ────────────────────────────────────────
  function handleFiles(files) {
    const fileArr = Array.from(files).filter((f) => f.type.startsWith("image/"));
    fileArr.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setForm((prev) => ({
          ...prev,
          images: [...prev.images, { id: Date.now() + Math.random(), url: e.target.result, name: file.name }],
        }));
      };
      reader.readAsDataURL(file);
    });
  }

  function removeImage(id) {
    setForm((prev) => ({ ...prev, images: prev.images.filter((img) => img.id !== id) }));
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }

  const inputClass = "w-full bg-zinc-900 border rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-yellow-600/60 transition-colors placeholder:text-zinc-600";
  const labelClass = "block text-xs text-zinc-400 uppercase tracking-wider mb-2";
  const errorClass = "text-xs text-red-400 mt-1";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

      {/* Name + Brand */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Product Name *</label>
          <input className={inputClass} style={{ borderColor: errors.name ? "#f87171" : "var(--glass-border)" }}
            placeholder="e.g. Glenfiddich 12 Year" value={form.name}
            onChange={(e) => field("name", e.target.value)} />
          {errors.name && <p className={errorClass}>{errors.name}</p>}
        </div>
        <div>
          <label className={labelClass}>Brand *</label>
          <input className={inputClass} style={{ borderColor: errors.brand ? "#f87171" : "var(--glass-border)" }}
            placeholder="e.g. Glenfiddich" value={form.brand}
            onChange={(e) => field("brand", e.target.value)} />
          {errors.brand && <p className={errorClass}>{errors.brand}</p>}
        </div>
      </div>

      {/* Category + Emoji */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Category *</label>
          <select className={inputClass} style={{ borderColor: "var(--glass-border)" }}
            value={form.category} onChange={(e) => field("category", e.target.value)}>
            {categoryOptions.map((c) => <option key={c} value={c} className="bg-zinc-900">{c}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Emoji Icon</label>
          <div className="flex gap-2 flex-wrap">
            {emojiOptions.map((em) => (
              <button key={em} type="button" onClick={() => field("emoji", em)}
                className="w-11 h-11 rounded-xl text-2xl flex items-center justify-center transition-all"
                style={{
                  background: form.emoji === em ? "rgba(201,168,76,0.15)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${form.emoji === em ? "var(--gold)" : "var(--glass-border)"}`,
                }}>
                {em}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Price + Volume + Alcohol */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div>
          <label className={labelClass}>Price (₹) *</label>
          <input className={inputClass} style={{ borderColor: errors.price ? "#f87171" : "var(--glass-border)" }}
            placeholder="e.g. 1299" value={form.price}
            onChange={(e) => field("price", e.target.value)} />
          {errors.price && <p className={errorClass}>{errors.price}</p>}
        </div>
        <div>
          <label className={labelClass}>Volume</label>
          <input className={inputClass} style={{ borderColor: "var(--glass-border)" }}
            placeholder="e.g. 750ml" value={form.volume}
            onChange={(e) => field("volume", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Alcohol % *</label>
          <input className={inputClass} style={{ borderColor: errors.alcoholPercent ? "#f87171" : "var(--glass-border)" }}
            placeholder="e.g. 40" value={form.alcoholPercent}
            onChange={(e) => field("alcoholPercent", e.target.value)} />
          {errors.alcoholPercent && <p className={errorClass}>{errors.alcoholPercent}</p>}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>Description *</label>
        <textarea className={inputClass}
          style={{ borderColor: errors.description ? "#f87171" : "var(--glass-border)", resize: "vertical", minHeight: "100px" }}
          placeholder="Describe the product..." value={form.description}
          onChange={(e) => field("description", e.target.value)} />
        {errors.description && <p className={errorClass}>{errors.description}</p>}
      </div>

      {/* Badge + Stock Quantity */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Badge (optional)</label>
          <input className={inputClass} style={{ borderColor: "var(--glass-border)" }}
            placeholder="e.g. Bestseller, New, Classic" value={form.badge || ""}
            onChange={(e) => field("badge", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Stock Quantity *</label>
          <div className="relative">
            <input
              type="number"
              min="0"
              className={inputClass}
              style={{ borderColor: errors.stockQty ? "#f87171" : inStock ? "rgba(34,197,94,0.4)" : "rgba(239,68,68,0.4)", paddingRight: "110px" }}
              placeholder="e.g. 50"
              value={form.stockQty}
              onChange={(e) => field("stockQty", e.target.value)}
            />
            {/* Live status badge inside input */}
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold px-2 py-0.5 rounded-full pointer-events-none"
              style={{
                background: form.stockQty === "" ? "rgba(255,255,255,0.04)" : inStock ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
                color: form.stockQty === "" ? "#52525b" : inStock ? "#4ade80" : "#f87171",
              }}
            >
              {form.stockQty === "" ? "Enter qty" : inStock ? `● In Stock` : "● Out of Stock"}
            </span>
          </div>
          {errors.stockQty && <p className={errorClass}>{errors.stockQty}</p>}
          {form.stockQty !== "" && !errors.stockQty && (
            <p className="text-xs mt-1" style={{ color: inStock ? "#4ade80" : "#f87171" }}>
              {inStock ? `${form.stockQty} units available` : "Product will be marked as Out of Stock"}
            </p>
          )}
        </div>
      </div>

      {/* ── Image Upload ─────────────────────────────────── */}
      <div>
        <label className={labelClass}>Product Images</label>

        {/* Drop zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center py-10 cursor-pointer transition-all"
          style={{
            borderColor: dragOver ? "var(--gold)" : "var(--glass-border)",
            background: dragOver ? "rgba(201,168,76,0.05)" : "rgba(255,255,255,0.02)",
          }}
        >
          <span className="text-4xl mb-3">📸</span>
          <p className="text-white text-sm font-medium mb-1">
            {dragOver ? "Drop images here" : "Click or drag images here"}
          </p>
          <p className="text-zinc-600 text-xs">PNG, JPG, WEBP supported · Multiple allowed</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        {/* Image previews */}
        {form.images.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
            {form.images.map((img, index) => (
              <div key={img.id} className="relative group rounded-xl overflow-hidden aspect-square"
                style={{ border: "1px solid var(--glass-border)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={img.name} className="w-full h-full object-cover" />

                {/* Primary badge */}
                {index === 0 && (
                  <span className="absolute top-1 left-1 text-xs px-1.5 py-0.5 rounded-md font-bold"
                    style={{ background: "var(--gold)", color: "#09090b" }}>
                    Main
                  </span>
                )}

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeImage(img.id)}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: "rgba(239,68,68,0.9)", color: "white" }}
                >
                  ✕
                </button>

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}

            {/* Add more tile */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all hover:border-yellow-600/50"
              style={{ borderColor: "var(--glass-border)", background: "rgba(255,255,255,0.02)" }}
            >
              <span className="text-2xl text-zinc-600">+</span>
              <span className="text-xs text-zinc-600 mt-1">Add more</span>
            </button>
          </div>
        )}

        {form.images.length > 0 && (
          <p className="text-xs text-zinc-600 mt-2">
            First image is used as the main display image. Hover to remove.
          </p>
        )}
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <button type="submit" className="gold-btn px-8 py-3 rounded-xl text-sm font-bold">
          {submitLabel}
        </button>
        <button type="button" onClick={() => router.push("/admin/products")}
          className="glass px-8 py-3 rounded-xl text-sm text-zinc-300 hover:text-white transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}
