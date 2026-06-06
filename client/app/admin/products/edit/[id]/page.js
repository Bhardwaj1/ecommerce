"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { productAPI } from "../../../../../lib/api";
import ProductForm from "../../../components/ProductForm";

export default function EditProductPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    productAPI.getAll({ perPage: 100 })
      .then((res) => {
        const found = (res.data ?? []).find((p) => p._id === id);
        if (found) setProduct(found);
        else setError("Product not found");
      })
      .catch((err) => setError(err.message));
  }, [id]);

  async function handleSubmit(formData) {
    try {
      await productAPI.update(id, formData);
      router.push("/admin/products");
    } catch (err) {
      setError(err.message);
    }
  }

  if (error) return <div className="p-8 text-red-400 text-sm">{error}</div>;
  if (!product) return <div className="p-8 text-zinc-500 text-sm">Loading...</div>;

  const initialData = {
    name: product.name ?? "",
    description: product.description ?? "",
    brand: product.brand?._id ?? product.brand ?? "",
    alcoholPercent: String(product.alcoholPercentage ?? ""),
    category: product.category?._id ?? product.category ?? "",
    subCategory: product.subCategory?._id ?? product.subCategory ?? "",
    active: product.active ?? true,
    images: product.thumbnails
      ? [{ id: "thumb", url: product.thumbnails, name: "thumbnail" }]
      : (product.images ?? []).map((img) => ({ id: img.public_id, url: img.url, name: img.public_id, public_id: img.public_id })),
  };

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Edit Product</h1>
          <p className="text-zinc-500 text-sm">Changes will reflect on the storefront immediately.</p>
        </div>
        <Link
          href={`/admin/products/${id}/variants`}
          className="glass px-4 py-2 rounded-xl text-sm text-zinc-300 hover:text-white transition-colors"
        >
          Manage Variants →
        </Link>
      </div>
      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
      <div className="glass rounded-2xl p-8">
        <ProductForm initialData={initialData} onSubmit={handleSubmit} submitLabel="Save Changes" />
      </div>
    </div>
  );
}
