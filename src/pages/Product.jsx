import { useState, useEffect } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import axios from "axios";

export default function Product() {
  const API_URL = "http://localhost:5000/api/products";
  const CATEGORY_URL = "http://localhost:5000/api/productCategories";
  const SUBCATEGORY_URL = "http://localhost:5000/api/product-subCategory";

  const MAX_IMAGES = 5;

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);

  /** ------------------------------
   * ADD PRODUCT FORM
   * ------------------------------ */
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    productCategory: "",
    productSubCategory: "",
    brand: "",
    stock: "",
    SKU: "",
    discount: "",
    status: true,
  });

  // Add-mode images
  const [imageFiles, setImageFiles] = useState([]); // File objects
  const [imagePreview, setImagePreview] = useState([]); // preview URLs

  /** ------------------------------
   * EDIT PRODUCT FORM
   * ------------------------------ */
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  // Existing (already uploaded) image URLs
  const [editExistingImages, setEditExistingImages] = useState([]);
  // Newly selected files in edit mode
  const [editImagesNew, setEditImagesNew] = useState([]);
  const [editImagesPreview, setEditImagesPreview] = useState([]);

  /** ------------------------------
   * FETCH PRODUCTS
   * ------------------------------ */
  const fetchProducts = async () => {
    try {
      const res = await axios.get(API_URL);
      setProducts(res.data.data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  /** ------------------------------
   * FETCH CATEGORY & SUBCATEGORY
   * ------------------------------ */
  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const res = await axios.get(CATEGORY_URL);
      setCategories(res.data.data || []);
    } catch (err) {
      console.error("Category Fetch Error:", err);
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchSubcategories = async (categoryId = null) => {
    try {
      setLoadingSubcategories(true);
      const url = categoryId
        ? `${SUBCATEGORY_URL}?category=${categoryId}`
        : SUBCATEGORY_URL;
      const res = await axios.get(url);
      setSubcategories(res.data.data || []);
    } catch (err) {
      console.error("Subcategory Fetch Error:", err);
    } finally {
      setLoadingSubcategories(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // cleanup object URLs when component unmounts or previews change
  useEffect(() => {
    return () => {
      imagePreview.forEach((u) => URL.revokeObjectURL(u));
      editImagesPreview.forEach((u) => URL.revokeObjectURL(u));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** ------------------------------
   * IMAGE HANDLERS (ADD MODE)
   * ------------------------------ */
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Append new files to existing and cap to MAX_IMAGES
    const combined = [...imageFiles, ...files].slice(0, MAX_IMAGES);
    setImageFiles(combined);

    // create previews
    const previews = combined.map((f) =>
      typeof f === "string" ? f : URL.createObjectURL(f)
    );
    setImagePreview(previews);
  };

  const removeImageFromAdd = (index) => {
    const newFiles = [...imageFiles];
    const newPreviews = [...imagePreview];
    newFiles.splice(index, 1);
    const removedUrl = newPreviews.splice(index, 1)[0];
    // revoke object URL if created
    if (removedUrl && removedUrl.startsWith("blob:")) URL.revokeObjectURL(removedUrl);
    setImageFiles(newFiles);
    setImagePreview(newPreviews);
  };

  /** ------------------------------
   * IMAGE HANDLERS (EDIT MODE)
   * ------------------------------ */
  const handleEditImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Append to existing new-files list and cap
    const combined = [...editImagesNew, ...files].slice(0, MAX_IMAGES);
    setEditImagesNew(combined);

    const previews = combined.map((f) =>
      typeof f === "string" ? f : URL.createObjectURL(f)
    );
    setEditImagesPreview(previews);
  };

  const removeEditNewImage = (index) => {
    const newFiles = [...editImagesNew];
    const newPreviews = [...editImagesPreview];
    newFiles.splice(index, 1);
    const removedUrl = newPreviews.splice(index, 1)[0];
    if (removedUrl && removedUrl.startsWith("blob:")) URL.revokeObjectURL(removedUrl);
    setEditImagesNew(newFiles);
    setEditImagesPreview(newPreviews);
  };

  const removeExistingImage = (idx) => {
    const updated = [...editExistingImages];
    updated.splice(idx, 1);
    setEditExistingImages(updated);
  };

  /** ------------------------------
   * ADD PRODUCT
   * ------------------------------ */
  const addProduct = async () => {
    if (!form.name.trim()) return alert("Product name is required");
    if (!form.productCategory) return alert("Please select a category");
    if (!form.productSubCategory) return alert("Please select a subcategory");
    if (imageFiles.length === 0) return alert("Upload at least one image");

    try {
      const fd = new FormData();

      // Append form fields (convert booleans/numbers to strings)
      Object.keys(form).forEach((key) =>
        fd.append(key, form[key] === undefined || form[key] === null ? "" : String(form[key]))
      );

      // Append files (field name must be "images" to match backend upload.array)
      imageFiles.forEach((file) => fd.append("images", file));

      await axios.post(API_URL, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // reset form & previews
      setForm({
        name: "",
        price: "",
        description: "",
        productCategory: "",
        productSubCategory: "",
        brand: "",
        stock: "",
        SKU: "",
        discount: "",
        status: true,
      });
      imagePreview.forEach((u) => { if (u && u.startsWith("blob:")) URL.revokeObjectURL(u); });
      setImageFiles([]);
      setImagePreview([]);
      fetchProducts();
    } catch (err) {
      console.error("Add Error:", err);
      alert("Failed to add product.");
    }
  };

  /** ------------------------------
   * START EDIT PRODUCT
   * ------------------------------ */
  const startEdit = (p) => {
    setEditId(p._id);
    setEditForm({
      name: p.name ?? "",
      price: p.price ?? "",
      description: p.description ?? "",
      productCategory: p.productCategory?._id ?? "",
      productSubCategory: p.productSubCategory?._id ?? "",
      brand: p.brand ?? "",
      stock: p.stock ?? "",
      SKU: p.SKU ?? "",
      discount: p.discount ?? "",
      status: !!p.status,
    });

    // existing images are URLs
    setEditExistingImages(p.images ? [...p.images] : []);
    // clear new selections
    setEditImagesNew([]);
    setEditImagesPreview([]);

    // pre-load categories & subcategories for editing
    fetchCategories();
    if (p.productCategory?._id) fetchSubcategories(p.productCategory._id);
  };

  /** ------------------------------
   * SAVE EDIT
   * ------------------------------ */
  const saveEdit = async () => {
    try {
      const fd = new FormData();

      // Append edited fields
      Object.keys(editForm).forEach((key) =>
        fd.append(key, editForm[key] === undefined || editForm[key] === null ? "" : String(editForm[key]))
      );

      // Append existing image URLs so backend can keep them
      editExistingImages.forEach((url) => fd.append("existingImages", url));

      // Append newly selected files (field name "images")
      editImagesNew.forEach((file) => fd.append("images", file));

      await axios.put(`${API_URL}/${editId}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // cleanup previews
      editImagesPreview.forEach((u) => { if (u && u.startsWith("blob:")) URL.revokeObjectURL(u); });

      // reset edit state
      setEditId(null);
      setEditForm({});
      setEditExistingImages([]);
      setEditImagesNew([]);
      setEditImagesPreview([]);

      fetchProducts();
    } catch (err) {
      console.error("Edit Error:", err);
      alert("Failed to update product.");
    }
  };

  /** ------------------------------
   * DELETE PRODUCT
   * ------------------------------ */
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Delete Error:", err);
      alert("Failed to delete product.");
    }
  };

  /** ------------------------------
   * UI START
   * ------------------------------ */
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Products</h2>

      {/* ADD PRODUCT FORM */}
      <div className="bg-white p-5 shadow rounded-xl mb-6">
        <h3 className="text-lg font-semibold mb-3">Add New Product</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Name */}
          <input
            className="border p-2 rounded"
            placeholder="Product Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          {/* Price */}
          <input
            className="border p-2 rounded"
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />

          {/* Description */}
          <textarea
            className="border p-2 rounded col-span-1 md:col-span-2"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          {/* Category */}
          <div className="relative">
            <select
              className="border p-2 rounded w-full"
              value={form.productCategory}
              onClick={() => categories.length === 0 && fetchCategories()}
              onChange={(e) => {
                setForm({
                  ...form,
                  productCategory: e.target.value,
                  productSubCategory: "",
                });
                fetchSubcategories(e.target.value);
              }}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {loadingCategories && (
              <div className="absolute right-3 top-2.5 animate-spin">
                <div className="w-5 h-5 border-2 border-t-blue-600 border-b-transparent rounded-full"></div>
              </div>
            )}
          </div>

          {/* Subcategory */}
          <div className="relative">
            <select
              className="border p-2 rounded w-full"
              value={form.productSubCategory}
              onClick={() => {
                if (!form.productCategory) fetchSubcategories();
              }}
              onChange={(e) =>
                setForm({ ...form, productSubCategory: e.target.value })
              }
            >
              <option value="">Select Subcategory</option>
              {subcategories.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.name}
                </option>
              ))}
            </select>

            {loadingSubcategories && (
              <div className="absolute right-3 top-2.5 animate-spin">
                <div className="w-5 h-5 border-2 border-t-blue-600 border-b-transparent rounded-full"></div>
              </div>
            )}
          </div>

          {/* Brand */}
          <input
            className="border p-2 rounded"
            placeholder="Brand"
            value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
          />

          {/* Stock */}
          <input
            className="border p-2 rounded"
            placeholder="Stock"
            type="number"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />

          {/* SKU */}
          <input
            className="border p-2 rounded"
            placeholder="SKU"
            value={form.SKU}
            onChange={(e) => setForm({ ...form, SKU: e.target.value })}
          />

          {/* Discount */}
          <input
            className="border p-2 rounded"
            placeholder="Discount %"
            type="number"
            value={form.discount}
            onChange={(e) => setForm({ ...form, discount: e.target.value })}
          />

          {/* Status */}
          <select
            className="border p-2 rounded"
            value={form.status ? "true" : "false"}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value === "true" })
            }
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          {/* Images (ADD) */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium mb-1">Images (max {MAX_IMAGES})</label>
            <input
              type="file"
              name="images"
              multiple
              accept="image/*"
              className="border p-2 rounded w-full"
              onChange={handleImageChange}
            />
            <div className="flex gap-3 mt-2 flex-wrap">
              {imagePreview.map((src, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={src}
                    alt={`preview-${idx}`}
                    className="w-20 h-20 rounded object-cover border"
                  />
                  <button
                    onClick={() => removeImageFromAdd(idx)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white px-1 rounded-full text-xs"
                    type="button"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={addProduct}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded mt-3 hover:bg-blue-700 transition w-full md:w-auto"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* PRODUCTS TABLE */}
      <div className="bg-white p-5 shadow rounded-xl overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Brand</th>
              <th className="p-3">Price</th>
              <th className="p-3">Category</th>
              <th className="p-3">Subcategory</th>
              <th className="p-3">Stock</th>
              <th className="p-3">SKU</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  {editId === p._id ? (
                    <input
                      className="border p-2 rounded w-full"
                      value={editForm.name || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                    />
                  ) : (
                    p.name
                  )}
                </td>

                <td className="p-3">{p.brand}</td>

                <td className="p-3">
                  {editId === p._id ? (
                    <input
                      className="border p-2 rounded w-full"
                      type="number"
                      value={editForm.price || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, price: e.target.value })
                      }
                    />
                  ) : (
                    p.price
                  )}
                </td>

                <td className="p-3">{p.productCategory?.name}</td>
                <td className="p-3">{p.productSubCategory?.name}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3">{p.SKU}</td>

                <td className="p-3 flex gap-3">
                  {editId === p._id ? (
                    <button
                      onClick={saveEdit}
                      className="text-green-600 font-semibold"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => startEdit(p)}
                      className="text-blue-600"
                    >
                      <Pencil size={18} />
                    </button>
                  )}

                  <button
                    onClick={() => deleteProduct(p._id)}
                    className="text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* EDIT IMAGE SECTION */}
        {editId && (
          <div className="mt-6 p-4 border rounded bg-gray-50">
            <h3 className="text-lg font-semibold">Edit Images</h3>

            {/* Existing Images */}
            <p className="mt-3 font-medium">Existing Images:</p>
            <div className="flex gap-3 flex-wrap">
              {editExistingImages.map((url, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={url}
                    alt={`existing-${idx}`}
                    className="w-20 h-20 border rounded object-cover"
                  />
                  <button
                    onClick={() => removeExistingImage(idx)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white px-1 rounded-full text-xs"
                    type="button"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>

            {/* New Images */}
            <div className="mt-4">
              <p className="font-medium">Upload New Images (will be appended):</p>
              <input
                type="file"
                name="images"
                multiple
                accept="image/*"
                className="border p-2 rounded"
                onChange={handleEditImageChange}
              />

              <div className="flex gap-3 mt-2 flex-wrap">
                {editImagesPreview.map((src, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={src}
                      alt={`new-${idx}`}
                      className="w-20 h-20 rounded object-cover border"
                    />
                    <button
                      onClick={() => removeEditNewImage(idx)}
                      className="absolute -top-2 -right-2 bg-red-600 text-white px-1 rounded-full text-xs"
                      type="button"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
