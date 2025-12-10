import { useState, useEffect } from "react"
import { Pencil, Trash2, Plus } from "lucide-react"
import axios from "axios"

export default function ProductSubcategory() {
  const API_URL = "http://localhost:5000/api/product-subCategory"
  const CATEGORY_URL = "http://localhost:5000/api/productCategories"

  const [subcategories, setSubcategories] = useState([])
  const [categories, setCategories] = useState([])

  // Add Form
  const [newName, setNewName] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [newCategory, setNewCategory] = useState("")

  // Edit Form
  const [editId, setEditId] = useState(null)
  const [editName, setEditName] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [editCategory, setEditCategory] = useState("")

  // Fetch subcategories
  const fetchSubcategories = async () => {
    try {
      const res = await axios.get(API_URL);
      console.log(res);
      setSubcategories(res.data.data);
    } catch (err) {
      console.error("Fetch Error:", err)
    }
  }

  // Fetch categories for dropdown
  const fetchCategories = async () => {
    try {
      const res = await axios.get(CATEGORY_URL)
      setCategories(res.data.data)
    } catch (err) {
      console.error("Category Fetch Error:", err)
    }
  }

  useEffect(() => {
    fetchSubcategories()
    fetchCategories()
  }, [])

  // Add Subcategory
  const addSubcategory = async () => {
    if (!newName.trim()) return alert("Name is required")
    if (!newCategory) return alert("Please select a category")

    try {
      await axios.post(API_URL, {
        name: newName,
        description: newDescription,
        productCategory: newCategory,
      })

      setNewName("")
      setNewDescription("")
      setNewCategory("")
      fetchSubcategories()
    } catch (err) {
      console.error("Add Error:", err)
    }
  }

  // Start edit
  const startEdit = (sub) => {
    setEditId(sub._id)
    setEditName(sub.name)
    setEditDescription(sub.description || "")
    setEditCategory(sub.productCategory?._id || "")
  }

  // Save edit
  const saveEdit = async () => {
    try {
      await axios.put(`${API_URL}/${editId}`, {
        name: editName,
        description: editDescription,
        productCategory: editCategory,
      })

      setEditId(null)
      setEditName("")
      setEditDescription("")
      setEditCategory("")
      fetchSubcategories()
    } catch (err) {
      console.error("Edit Error:", err)
    }
  }

  // Delete
  const deleteSubcategory = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`)
      fetchSubcategories()
    } catch (err) {
      console.error("Delete Error:", err)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Product Sub Categories</h2>

      {/* Add Subcategory */}
      <div className="bg-white p-5 shadow rounded-xl mb-6">
        <h3 className="text-lg font-semibold mb-3">Add New Sub Category</h3>

        <div className="flex flex-col gap-3">
          <input
            className="border p-2 rounded w-full"
            placeholder="Subcategory name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />

          <textarea
            className="border p-2 rounded w-full"
            placeholder="Description (optional)"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />

          <select
            className="border p-2 rounded w-full"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          <button
            onClick={addSubcategory}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full md:w-auto"
          >
            <Plus size={18} /> Add
          </button>
        </div>
      </div>

      {/* Subcategories Table */}
      <div className="bg-white p-5 shadow rounded-xl overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Description</th>
              <th className="p-3">Category</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {subcategories.map((sub) => (
              <tr key={sub._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{sub._id}</td>

                <td className="p-3">
                  {editId === sub._id ? (
                    <input
                      className="border p-2 rounded w-full"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  ) : (
                    sub.name
                  )}
                </td>

                <td className="p-3">
                  {editId === sub._id ? (
                    <textarea
                      className="border p-2 rounded w-full"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                    />
                  ) : (
                    sub.description || "-"
                  )}
                </td>

                <td className="p-3">
                  {editId === sub._id ? (
                    <select
                      className="border p-2 rounded w-full"
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    sub?.productCategory?.name || "-"
                  )}
                </td>

                <td className="p-3 flex gap-3">
                  {editId === sub._id ? (
                    <button
                      onClick={saveEdit}
                      className="text-green-600 font-semibold"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => startEdit(sub)}
                      className="text-blue-600"
                    >
                      <Pencil size={18} />
                    </button>
                  )}

                  <button
                    onClick={() => deleteSubcategory(sub._id)}
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
