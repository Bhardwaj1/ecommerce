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

  // ── Subcategory CRUD (local state — to be wired to API when ready) ──
  const addSubcategory = () => {};
  const editSubcategory = () => {};
  const deleteSubcategory = () => {};
  const toggleSubcategory = () => {};

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
