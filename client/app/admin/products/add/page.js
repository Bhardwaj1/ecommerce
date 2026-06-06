"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { productAPI } from "../../../../lib/api";
import ProductForm from "../../components/ProductForm";

export default function AddProductPage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  async function handleSubmit(formData) {
    try {
      const res = await productAPI.create(formData);
      const productId = res.product?._id;
      router.push(productId ? `/admin/products/${productId}/variants` : "/admin/products");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Add Product</h1>
        <p className="text-zinc-500 text-sm">After saving, you can add price/stock variants.</p>
      </div>
      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
      <div className="glass rounded-2xl p-8">
        <ProductForm onSubmit={handleSubmit} submitLabel="Save & Add Variants" />
      </div>
    </div>
  );
}
