"use client";

import { createContext, useContext } from "react";
import { categoryAPI, productAPI } from "../lib/api";

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  // Product CRUD — delegates to API; UI state managed by useProductTable hook
  const addProduct = (formData) => productAPI.create(formData);
  const editProduct = (id, formData) => productAPI.update(id, formData);
  const deleteProduct = (id) => productAPI.delete(id);

  // Category CRUD
  const addCategory = (data) => categoryAPI.add(data);
  const editCategory = (id, data) => categoryAPI.update(id, data);
  const deleteCategory = (id) => categoryAPI.delete(id);
  const toggleCategory = (id, active) => categoryAPI.update(id, { active });

  const addSubcategory = () => {};
  const editSubcategory = () => {};
  const deleteSubcategory = () => {};
  const toggleSubcategory = () => {};

  return (
    <AdminContext.Provider value={{
      addProduct, editProduct, deleteProduct,
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
