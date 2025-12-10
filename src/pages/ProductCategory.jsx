// =========================
// src/pages/ProductCategory.jsx
// =========================

import { useState, useEffect } from "react"
import { Pencil, Trash2, Plus } from "lucide-react"
import axios from "axios"

export default function ProductCategory() {
  const API_URL = "http://localhost:5000/api/productCategories"

  const [categories, setCategories] = useState([])

  // Add Form
  const [newCategory, setNewCategory] = useState("")
  const [newDescription, setNewDescription] = useState("")

  // Edit Form
  const [editId, setEditId] = useState(null)
  const [editName, setEditName] = useState("")
  const [editDescription, setEditDescription] = useState("")

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(API_URL)
      setCategories(res.data.data)
    } catch (err) {
      console.error("Fetch Error:", err)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  // Add category
  const addCategory = async () => {
    if (!newCategory.trim()) return alert("Name is required")

    try {
      await axios.post(API_URL, {
        name: newCategory,
        description: newDescription,
      })

      setNewCategory("")
      setNewDescription("")
      fetchCategories()
    } catch (err) {
      console.error("Add Error:", err)
    }
  }

  // Start editing
  const startEdit = (cat) => {
    setEditId(cat._id)
    setEditName(cat.name)
    setEditDescription(cat.description || "")
  }

  // Save edit
  const saveEdit = async () => {
    try {
      await axios.put(`${API_URL}/${editId}`, {
        name: editName,
        description: editDescription,
      })

      setEditId(null)
      setEditName("")
      setEditDescription("")
      fetchCategories()
    } catch (err) {
      console.error("Edit Error:", err)
    }
  }

  // Delete
  const deleteCategory = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`)
      fetchCategories()
    } catch (err) {
      console.error("Delete Error:", err)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Product Categories</h2>

      {/* Add Category */}
      <div className="bg-white p-5 shadow rounded-xl mb-6">
        <h3 className="text-lg font-semibold mb-3">Add New Category</h3>

        <div className="flex flex-col gap-3">
          <input
            className="border p-2 rounded w-full"
            placeholder="Category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />

          <textarea
            className="border p-2 rounded w-full"
            placeholder="Description (optional)"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />

          <button
            onClick={addCategory}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full md:w-auto"
          >
            <Plus size={18} /> Add
          </button>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white p-5 shadow rounded-xl overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Description</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((cat) => (
              <tr key={cat._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{cat._id}</td>

                <td className="p-3">
                  {editId === cat._id ? (
                    <input
                      className="border p-2 rounded w-full"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  ) : (
                    cat.name
                  )}
                </td>

                {/* Description */}
                <td className="p-3">
                  {editId === cat._id ? (
                    <textarea
                      className="border p-2 rounded w-full"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                    />
                  ) : (
                    cat.description || "-"
                  )}
                </td>

                <td className="p-3 flex gap-3">
                  {editId === cat._id ? (
                    <button
                      onClick={saveEdit}
                      className="text-green-600 font-semibold"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => startEdit(cat)}
                      className="text-blue-600"
                    >
                      <Pencil size={18} />
                    </button>
                  )}

                  <button
                    onClick={() => deleteCategory(cat._id)}
                    className="text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  )
}
