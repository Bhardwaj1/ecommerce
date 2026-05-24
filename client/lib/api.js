import { queryCache } from "./queryCache";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
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

export const categoryAPI = {
  getAll({ search = "", page = 1, perPage = 8 } = {}, signal) {
    const params = new URLSearchParams({ page, perPage });
    if (search) params.set("search", search);
    const path = `/api/category?${params}`;
    const cacheKey = `category:list:${path}`;

    const cached = queryCache.get(cacheKey);
    if (cached) return Promise.resolve(cached);

    return queryCache.dedupe(cacheKey, async () => {
      const data = await request(path, { signal });
      queryCache.set(cacheKey, data);
      return data;
    });
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
