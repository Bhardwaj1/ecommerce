"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { products as initialProducts } from "../lib/products";
import { categoryAPI } from "../lib/api";

const AdminContext = createContext(null);

function withInStock(product) {
  return { ...product, inStock: product.stockQty > 0 };
}

export function AdminProvider({ children }) {
  const [products, setProducts] = useState(initialProducts.map(withInStock));
  // categories state is now managed per-page via useCategoryTable hook

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

  // ── Category CRUD (raw API calls — state managed in useCategoryTable) ──
  const addCategory = (data) => categoryAPI.add(data);
  const editCategory = (id, data) => categoryAPI.update(id, data);
  const deleteCategory = (id) => categoryAPI.delete(id);
  const toggleCategory = (id, active) => categoryAPI.update(id, { active });

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
      addCategory, editCategory, deleteCategory, toggleCategory,
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
