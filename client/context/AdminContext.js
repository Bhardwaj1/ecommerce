"use client";

import { createContext, useContext, useState } from "react";
import { products as initialProducts } from "../lib/products";
import { initialCategories } from "../lib/categories";

const AdminContext = createContext(null);

// inStock is always derived — never stored separately
function withInStock(product) {
  return { ...product, inStock: product.stockQty > 0 };
}

export function AdminProvider({ children }) {
  const [products, setProducts] = useState(initialProducts.map(withInStock));
  const [categories, setCategories] = useState(initialCategories);

  // ── Product CRUD ──────────────────────────────────────────
  function addProduct(data) {
    const p = withInStock({ ...data, id: Date.now(), rating: 4.0, images: data.images || [] });
    setProducts((prev) => [p, ...prev]);
  }

  function editProduct(id, data) {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? withInStock({ ...p, ...data }) : p))
    );
  }

  function deleteProduct(id) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  function updateStock(id, qty) {
    const q = Math.max(0, Number(qty));
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? withInStock({ ...p, stockQty: q }) : p))
    );
  }

  // ── Category CRUD ─────────────────────────────────────────
  function addCategory(data) {
    setCategories((prev) => [{ ...data, id: Date.now(), subcategories: [] }, ...prev]);
  }
  function editCategory(id, data) {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
  }
  function deleteCategory(id) {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }
  function toggleCategory(id) {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)));
  }

  // ── Subcategory CRUD ──────────────────────────────────────
  function addSubcategory(categoryId, name) {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId
          ? { ...c, subcategories: [...c.subcategories, { id: Date.now(), name, active: true }] }
          : c
      )
    );
  }
  function editSubcategory(categoryId, subId, name) {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId
          ? { ...c, subcategories: c.subcategories.map((s) => (s.id === subId ? { ...s, name } : s)) }
          : c
      )
    );
  }
  function deleteSubcategory(categoryId, subId) {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId
          ? { ...c, subcategories: c.subcategories.filter((s) => s.id !== subId) }
          : c
      )
    );
  }
  function toggleSubcategory(categoryId, subId) {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId
          ? { ...c, subcategories: c.subcategories.map((s) => (s.id === subId ? { ...s, active: !s.active } : s)) }
          : c
      )
    );
  }

  return (
    <AdminContext.Provider value={{
      products, addProduct, editProduct, deleteProduct, updateStock,
      categories, addCategory, editCategory, deleteCategory, toggleCategory,
      addSubcategory, editSubcategory, deleteSubcategory, toggleSubcategory,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used inside AdminProvider");
  return ctx;
}
