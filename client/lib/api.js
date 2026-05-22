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
  getAll: ({ search = "", page = 1, perPage = 8 } = {}) => {
    const params = new URLSearchParams({ page, perPage });
    if (search) params.set("search", search);
    return request(`/api/category?${params}`);
  },
  add: (body) => request("/api/category", { method: "POST", body: JSON.stringify(body) }),
  update: (id, body) => request(`/api/category/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  delete: (id) => request(`/api/category/${id}`, { method: "DELETE" }),
};
