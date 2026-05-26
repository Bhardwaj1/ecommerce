import { queryCache } from "./queryCache";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function request(path, options = {}) {
  const isFormData = options.body instanceof FormData;
  const res = await fetch(`${BASE_URL}${path}`, {
    ...(!isFormData && { headers: { "Content-Type": "application/json" } }),
    ...options,
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Server error (${res.status})`);
  }
  if (!res.ok) throw new Error(data.error || "Something went wrong");
  return data;
}

export const productAPI = {
  getAll({ search = "", page = 1, perPage = 10 } = {}, signal) {
    const params = new URLSearchParams({ page, perPage });
    if (search) params.set("search", search);
    const path = `/api/product?${params}`;
    return request(path, { signal });
  },

  async create(formData) {
    const data = await request("/api/product", { method: "POST", body: formData });
    queryCache.invalidate("product:list:");
    return data;
  },

  async update(id, formData) {
    const data = await request(`/api/product/${id}`, { method: "PUT", body: formData });
    queryCache.invalidate("product:list:");
    return data;
  },

  async delete(id) {
    const data = await request(`/api/product/${id}`, { method: "DELETE" });
    queryCache.invalidate("product:list:");
    return data;
  },
};

export const subCategoryAPI = {
  getAll({ search = "", parentCategory = "", page = 1, perPage = 10 } = {}, signal) {
    const params = new URLSearchParams({ page, perPage });
    if (search) params.set("search", search);
    if (parentCategory) params.set("parentCategory", parentCategory);
    const path = `/api/subCategory?${params}`;
    return request(path, { signal });
  },

  async add(body) {
    const data = await request("/api/subCategory", { method: "POST", body: JSON.stringify(body) });
    queryCache.invalidate("subCategory:list:");
    return data;
  },

  async update(id, body) {
    const data = await request(`/api/subCategory/${id}`, { method: "PUT", body: JSON.stringify(body) });
    queryCache.invalidate("subCategory:list:");
    return data;
  },

  async delete(id) {
    const data = await request(`/api/subCategory/${id}`, { method: "DELETE" });
    queryCache.invalidate("subCategory:list:");
    return data;
  },
};

export const categoryAPI = {
  getAll({ search = "", page = 1, perPage = 8 } = {}, signal) {
    const params = new URLSearchParams({ page, perPage });
    if (search) params.set("search", search);
    const path = `/api/category?${params}`;
    return request(path, { signal });
  },

  async add(body) {
    const data = await request("/api/category", { method: "POST", body: JSON.stringify(body) });
    queryCache.invalidate("category:list:");
    return data;
  },

  async update(id, body) {
    const data = await request(`/api/category/${id}`, { method: "PUT", body: JSON.stringify(body) });
    queryCache.invalidate("category:list:");
    return data;
  },

  async delete(id) {
    const data = await request(`/api/category/${id}`, { method: "DELETE" });
    queryCache.invalidate("category:list:");
    return data;
  },
};
