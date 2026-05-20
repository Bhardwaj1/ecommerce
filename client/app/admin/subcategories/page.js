"use client";

import { useState } from "react";
import { useAdmin } from "../../../context/AdminContext";

export default function SubcategoriesPage() {
  const {
    categories,
    addSubcategory,
    editSubcategory,
    deleteSubcategory,
    toggleSubcategory,
  } = useAdmin();

  const [selectedCatId, setSelectedCatId] = useState("all");
  const [newName, setNewName] = useState("");
  const [newCatId, setNewCatId] = useState(categories[0]?.id || "");
  const [addError, setAddError] = useState("");
  const [editingKey, setEditingKey] = useState(null); // "catId-subId"
  const [editingName, setEditingName] = useState("");
  const [editError, setEditError] = useState("");

  // flatten all subcategories with parent info
  const allSubs = categories.flatMap((cat) =>
    cat.subcategories.map((sub) => ({ ...sub, catId: cat.id, catName: cat.name, catEmoji: cat.emoji }))
  );

  const filtered =
    selectedCatId === "all"
      ? allSubs
      : allSubs.filter((s) => s.catId === Number(selectedCatId));

  const totalActive = allSubs.filter((s) => s.active).length;

  function handleAdd(e) {
    e.preventDefault();
    if (!newName.trim()) { setAddError("Name is required"); return; }
    if (!newCatId) { setAddError("Select a category"); return; }
    const cat = categories.find((c) => c.id === Number(newCatId));
    const exists = cat?.subcategories.some(
      (s) => s.name.toLowerCase() === newName.trim().toLowerCase()
    );
    if (exists) { setAddError("Already exists in this category"); return; }
    addSubcategory(Number(newCatId), newName.trim());
    setNewName("");
    setAddError("");
  }

  function startEdit(catId, sub) {
    setEditingKey(`${catId}-${sub.id}`);
    setEditingName(sub.name);
    setEditError("");
  }

  function handleEditSave(catId, subId) {
    if (!editingName.trim()) { setEditError("Name is required"); return; }
    editSubcategory(catId, subId, editingName.trim());
    setEditingKey(null);
    setEditingName("");
    setEditError("");
  }

  function cancelEdit() {
    setEditingKey(null);
    setEditingName("");
    setEditError("");
  }

  return (
    <div className="p-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Subcategories</h1>
          <p className="text-zinc-500 text-sm">
            {allSubs.length} total · <span className="text-green-400">{totalActive} active</span>
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCatId(selectedCatId === String(cat.id) ? "all" : String(cat.id))}
            className="glass rounded-2xl px-4 py-4 flex items-center gap-3 text-left transition-all hover:-translate-y-0.5"
            style={{
              borderColor: selectedCatId === String(cat.id) ? "var(--gold)" : "var(--glass-border)",
              background: selectedCatId === String(cat.id) ? "rgba(201,168,76,0.06)" : "var(--glass-bg)",
            }}
          >
            <span className="text-2xl">{cat.emoji}</span>
            <div>
              <p className="text-white text-sm font-semibold">{cat.name}</p>
              <p className="text-zinc-500 text-xs">{cat.subcategories.length} subs</p>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left — Add form */}
        <div className="lg:col-span-1">
          <div className="glass rounded-2xl p-6 sticky top-6">
            <h2 className="text-white font-semibold text-lg mb-1">Add Subcategory</h2>
            <p className="text-zinc-500 text-xs mb-5">Choose a parent category and enter name.</p>

            <form onSubmit={handleAdd} className="flex flex-col gap-4">
              {/* Parent Category */}
              <div>
                <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-2">
                  Parent Category *
                </label>
                <select
                  className="w-full bg-zinc-900 border rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-yellow-600/60 transition-colors"
                  style={{ borderColor: "var(--glass-border)" }}
                  value={newCatId}
                  onChange={(e) => { setNewCatId(e.target.value); setAddError(""); }}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id} className="bg-zinc-900">
                      {c.emoji} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-2">
                  Subcategory Name *
                </label>
                <input
                  className="w-full bg-zinc-900 border rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-yellow-600/60 transition-colors placeholder:text-zinc-600"
                  style={{ borderColor: addError ? "#f87171" : "var(--glass-border)" }}
                  placeholder="e.g. Single Malt Whisky"
                  value={newName}
                  onChange={(e) => { setNewName(e.target.value); setAddError(""); }}
                />
                {addError && <p className="text-xs text-red-400 mt-1.5">{addError}</p>}
              </div>

              <button type="submit" className="gold-btn w-full py-3 rounded-xl text-sm font-bold">
                + Add Subcategory
              </button>
            </form>

            {/* Summary */}
            <div className="mt-6 pt-5 border-t" style={{ borderColor: "var(--glass-border)" }}>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Summary</p>
              <div className="flex flex-col gap-2">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{cat.emoji}</span>
                      <span className="text-zinc-400 text-xs">{cat.name}</span>
                    </div>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{
                        background: "rgba(201,168,76,0.08)",
                        color: "var(--gold)",
                      }}
                    >
                      {cat.subcategories.length}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right — Subcategories list */}
        <div className="lg:col-span-2">

          {/* Filter bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setSelectedCatId("all")}
                className="text-xs px-4 py-1.5 rounded-full font-semibold transition-all"
                style={{
                  background: selectedCatId === "all" ? "rgba(201,168,76,0.12)" : "rgba(255,255,255,0.04)",
                  color: selectedCatId === "all" ? "var(--gold)" : "#71717a",
                  border: `1px solid ${selectedCatId === "all" ? "rgba(201,168,76,0.3)" : "var(--glass-border)"}`,
                }}
              >
                All ({allSubs.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCatId(selectedCatId === String(cat.id) ? "all" : String(cat.id))}
                  className="text-xs px-4 py-1.5 rounded-full font-semibold transition-all"
                  style={{
                    background: selectedCatId === String(cat.id) ? "rgba(201,168,76,0.12)" : "rgba(255,255,255,0.04)",
                    color: selectedCatId === String(cat.id) ? "var(--gold)" : "#71717a",
                    border: `1px solid ${selectedCatId === String(cat.id) ? "rgba(201,168,76,0.3)" : "var(--glass-border)"}`,
                  }}
                >
                  {cat.emoji} {cat.name} ({cat.subcategories.length})
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="glass rounded-2xl overflow-hidden">
            {/* Head */}
            <div
              className="grid gap-4 px-6 py-3 text-xs text-zinc-500 uppercase tracking-wider border-b"
              style={{ borderColor: "var(--glass-border)", gridTemplateColumns: "1fr auto auto auto" }}
            >
              <span>Subcategory</span>
              <span>Category</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            {filtered.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <p className="text-4xl mb-3">📁</p>
                <p className="text-zinc-500 text-sm">No subcategories found.</p>
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: "var(--glass-border)" }}>
                {filtered.map((sub) => {
                  const key = `${sub.catId}-${sub.id}`;
                  const isEditing = editingKey === key;

                  return (
                    <div
                      key={key}
                      className="grid gap-4 items-center px-6 py-4 hover:bg-white/[0.02] transition-colors"
                      style={{
                        gridTemplateColumns: "1fr auto auto auto",
                        opacity: sub.active ? 1 : 0.5,
                        borderLeft: isEditing ? "2px solid var(--gold)" : "2px solid transparent",
                      }}
                    >
                      {/* Name */}
                      <div>
                        {isEditing ? (
                          <div>
                            <input
                              className="w-full bg-zinc-900 border rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-yellow-600/60 transition-colors"
                              style={{ borderColor: editError ? "#f87171" : "var(--gold)" }}
                              value={editingName}
                              autoFocus
                              onChange={(e) => { setEditingName(e.target.value); setEditError(""); }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleEditSave(sub.catId, sub.id);
                                if (e.key === "Escape") cancelEdit();
                              }}
                            />
                            {editError && <p className="text-xs text-red-400 mt-1">{editError}</p>}
                          </div>
                        ) : (
                          <p className="text-white text-sm font-medium">{sub.name}</p>
                        )}
                      </div>

                      {/* Parent category badge */}
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <span className="text-base">{sub.catEmoji}</span>
                        <span className="text-zinc-400 text-xs">{sub.catName}</span>
                      </div>

                      {/* Status toggle */}
                      <button
                        onClick={() => toggleSubcategory(sub.catId, sub.id)}
                        className="text-xs px-3 py-1.5 rounded-full font-semibold transition-all whitespace-nowrap"
                        style={{
                          background: sub.active ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                          color: sub.active ? "#4ade80" : "#f87171",
                          border: `1px solid ${sub.active ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}`,
                        }}
                      >
                        {sub.active ? "● Active" : "● Inactive"}
                      </button>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => handleEditSave(sub.catId, sub.id)}
                              className="text-xs px-3 py-1.5 rounded-lg font-semibold"
                              style={{ background: "rgba(34,197,94,0.12)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.25)" }}
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="text-xs px-3 py-1.5 rounded-lg glass text-zinc-400 hover:text-white transition-colors"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(sub.catId, sub)}
                              className="text-xs px-3 py-1.5 rounded-lg glass text-zinc-300 hover:text-white transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => { if (confirm(`Delete "${sub.name}"?`)) deleteSubcategory(sub.catId, sub.id); }}
                              className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                              style={{ background: "rgba(239,68,68,0.06)", color: "#f87171", border: "1px solid rgba(239,68,68,0.12)" }}
                            >
                              🗑
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
