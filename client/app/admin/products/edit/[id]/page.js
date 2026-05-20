"use client";

import { useAdmin } from "../../../../../context/AdminContext";
import ProductForm from "../../../components/ProductForm";
import { use } from "react";

export default function EditProductPage({ params }) {
  const { id } = use(params);
  const { products, editProduct } = useAdmin();
  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="p-8 flex items-center justify-center min-h-96">
        <p className="text-zinc-500">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Edit Product</h1>
        <p className="text-zinc-500 text-sm">Changes will reflect on the storefront immediately.</p>
      </div>
      <div className="glass rounded-2xl p-8">
        <ProductForm
          initialData={{ ...product, alcoholPercent: String(product.alcoholPercent) }}
          onSubmit={(data) => editProduct(product.id, data)}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
}
