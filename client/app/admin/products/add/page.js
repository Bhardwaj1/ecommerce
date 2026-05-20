"use client";

import { useAdmin } from "../../../../context/AdminContext";
import ProductForm from "../../components/ProductForm";

export default function AddProductPage() {
  const { addProduct } = useAdmin();

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Add Product</h1>
        <p className="text-zinc-500 text-sm">New product will appear on the storefront instantly.</p>
      </div>
      <div className="glass rounded-2xl p-8">
        <ProductForm onSubmit={addProduct} submitLabel="Add Product" />
      </div>
    </div>
  );
}
