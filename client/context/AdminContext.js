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
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);

  useEffect(() => {
    categoryAPI.getAll()
      .then((res) => setCategories(res.data))
      .catch((err) => setCategoriesError(err.message))
      .finally(() => setCategoriesLoading(false));
  }, []);

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
  async function addCategory(data) {
    const res = await categoryAPI.add(data);
    setCategories((prev) => [res.category, ...prev]);
  }
  async function editCategory(id, data) {
    const res = await categoryAPI.update(id, data);
    setCategories((prev) => prev.map((c) => (c._id === id ? res.category : c)));
  }
  async function deleteCategory(id) {
    await categoryAPI.delete(id);
    setCategories((prev) => prev.filter((c) => c._id !== id));
  }
  async function toggleCategory(id) {
    const cat = categories.find((c) => c._id === id);
    const res = await categoryAPI.update(id, { active: !cat.active });
    setCategories((prev) => prev.map((c) => (c._id === id ? res.category : c)));
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
      categories, categoriesLoading, categoriesError,
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
