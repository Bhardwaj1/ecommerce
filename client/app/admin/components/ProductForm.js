"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { categoryAPI, subCategoryAPI, brandAPI } from "../../../lib/api";

export default function ProductForm({ initialData, onSubmit, submitLabel }) {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    brand: "",
    category: "",
    subCategory: "",
    description: "",
    alcoholPercent: "",
    active: true,
    images: [],
    ...initialData,
    alcoholPercent: initialData?.alcoholPercentage !== undefined
      ? String(initialData.alcoholPercentage)
      : (initialData?.alcoholPercent ?? ""),
  });

  const [errors, setErrors] = useState({});
  const [dragOver, setDragOver] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    categoryAPI.getAll({ perPage: 100 }).then((res) => setCategories(res.data ?? [])).catch(() => {});
    brandAPI.getAll({ perPage: 100 }).then((res) => setBrands(res.data ?? [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (!form.category) { setSubCategories([]); return; }
    subCategoryAPI.getAll({ perPage: 100 })
      .then((res) => {
        const filtered = (res.data ?? []).filter(
          (s) => (s.parentCategory?._id ?? s.parentCategory) === form.category
        );
        setSubCategories(filtered);
        if (filtered.length > 0 && !filtered.find((s) => s._id === form.subCategory)) {
          setForm((prev) => ({ ...prev, subCategory: "" }));
        }
      })
      .catch(() => {});
  }, [form.category]);

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.alcoholPercent || isNaN(Number(form.alcoholPercent))) e.alcoholPercent = "Valid % required";
    if (!form.category) e.category = "Category is required";
    if (!form.brand) e.brand = "Brand is required";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("description", form.description);
    fd.append("alcoholPercentage", form.alcoholPercent);
    fd.append("active", form.active);
    fd.append("brand", form.brand);
    fd.append("category", form.category);
    if (form.subCategory) fd.append("subCategory", form.subCategory);

    const existingImages = form.images.filter((img) => img.public_id);
    fd.append("existingImage", JSON.stringify(existingImages));
    form.images.filter((img) => img.file).forEach((img) => fd.append("images", img.file));

    await onSubmit(fd);
  }

  function field(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function handleFiles(files) {
    Array.from(files).filter((f) => f.type.startsWith("image/")).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setForm((prev) => ({
          ...prev,
          images: [...prev.images, { id: Date.now() + Math.random(), url: ev.target.result, name: file.name, file }],
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
          <select className={inputClass}
            style={{ borderColor: errors.brand ? "#f87171" : "var(--glass-border)" }}
            value={form.brand} onChange={(e) => field("brand", e.target.value)}>
            <option value="" className="bg-zinc-900">Select brand</option>
            {brands.map((b) => (
              <option key={b._id} value={b._id} className="bg-zinc-900" style={{ textTransform: "capitalize" }}>{b.name}</option>
            ))}
          </select>
          {errors.brand && <p className={errorClass}>{errors.brand}</p>}
        </div>
      </div>

      {/* Category + SubCategory */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Category *</label>
          <select className={inputClass}
            style={{ borderColor: errors.category ? "#f87171" : "var(--glass-border)" }}
            value={form.category} onChange={(e) => field("category", e.target.value)}>
            <option value="" className="bg-zinc-900">Select category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id} className="bg-zinc-900">{c.name}</option>
            ))}
          </select>
          {errors.category && <p className={errorClass}>{errors.category}</p>}
        </div>
        <div>
          <label className={labelClass}>Sub Category</label>
          <select className={inputClass} style={{ borderColor: "var(--glass-border)" }}
            value={form.subCategory} onChange={(e) => field("subCategory", e.target.value)}
            disabled={!form.category || subCategories.length === 0}>
            <option value="" className="bg-zinc-900">
              {!form.category ? "Select a category first" : subCategories.length === 0 ? "No subcategories" : "Select subcategory"}
            </option>
            {subCategories.map((s) => (
              <option key={s._id} value={s._id} className="bg-zinc-900">{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Alcohol % */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Alcohol % *</label>
          <input className={inputClass} style={{ borderColor: errors.alcoholPercent ? "#f87171" : "var(--glass-border)" }}
            placeholder="e.g. 40" value={form.alcoholPercent}
            onChange={(e) => field("alcoholPercent", e.target.value)} />
          {errors.alcoholPercent && <p className={errorClass}>{errors.alcoholPercent}</p>}
        </div>
        <div className="flex flex-col justify-center">
          <label className={labelClass}>Active</label>
          <button type="button" onClick={() => field("active", !form.active)} className="flex items-center gap-3 text-sm">
            <span className="w-10 h-6 rounded-full relative transition-colors"
              style={{ background: form.active ? "var(--gold)" : "rgba(255,255,255,0.1)" }}>
              <span className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
                style={{ left: form.active ? "22px" : "4px" }} />
            </span>
            <span className="text-zinc-300">{form.active ? "Active" : "Inactive"}</span>
          </button>
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

      {/* Image Upload */}
      <div>
        <label className={labelClass}>Product Images</label>
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center py-10 cursor-pointer transition-all"
          style={{ borderColor: dragOver ? "var(--gold)" : "var(--glass-border)", background: dragOver ? "rgba(201,168,76,0.05)" : "rgba(255,255,255,0.02)" }}>
          <span className="text-4xl mb-3">📸</span>
          <p className="text-white text-sm font-medium mb-1">{dragOver ? "Drop images here" : "Click or drag images here"}</p>
          <p className="text-zinc-600 text-xs">PNG, JPG, WEBP supported · Multiple allowed</p>
          <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
            onChange={(e) => handleFiles(e.target.files)} />
        </div>
        {form.images.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
            {form.images.map((img, index) => (
              <div key={img.id} className="relative group rounded-xl overflow-hidden aspect-square"
                style={{ border: "1px solid var(--glass-border)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                {index === 0 && (
                  <span className="absolute top-1 left-1 text-xs px-1.5 py-0.5 rounded-md font-bold"
                    style={{ background: "var(--gold)", color: "#09090b" }}>Main</span>
                )}
                <button type="button" onClick={() => removeImage(img.id)}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: "rgba(239,68,68,0.9)", color: "white" }}>✕</button>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
            <button type="button" onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all hover:border-yellow-600/50"
              style={{ borderColor: "var(--glass-border)", background: "rgba(255,255,255,0.02)" }}>
              <span className="text-2xl text-zinc-600">+</span>
              <span className="text-xs text-zinc-600 mt-1">Add more</span>
            </button>
          </div>
        )}
        {form.images.length > 0 && (
          <p className="text-xs text-zinc-600 mt-2">First image is the main display image. Hover to remove.</p>
        )}
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <button type="submit" className="gold-btn px-8 py-3 rounded-xl text-sm font-bold">{submitLabel}</button>
        <button type="button" onClick={() => router.push("/admin/products")}
          className="glass px-8 py-3 rounded-xl text-sm text-zinc-300 hover:text-white transition-colors">Cancel</button>
      </div>
    </form>
  );
}
