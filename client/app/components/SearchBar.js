"use client";

import { Loader } from "./Loader";

const PER_PAGE_OPTIONS = [5, 10, 20, 50];

export function SearchBar({ value, onChange, loading, placeholder = "Search...", perPage, onPerPageChange }) {
  return (
    <div className="px-4 py-3 flex items-center gap-3 border-b" style={{ borderColor: "var(--glass-border)" }}>
      <span className="text-zinc-500 text-sm select-none">🔍</span>
      <input
        className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-zinc-600"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {loading && <Loader size={15} />}
      {!loading && value && (
        <button onClick={() => onChange("")} className="text-zinc-500 hover:text-white text-xs transition-colors">
          ✕ Clear
        </button>
      )}
      {onPerPageChange && (
        <>
          <div className="h-4 w-px bg-zinc-700 flex-shrink-0" />
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-zinc-500 text-xs">Rows</span>
            <select
              className="bg-zinc-900 border rounded-lg px-2 py-1 text-white text-xs outline-none"
              style={{ borderColor: "var(--glass-border)" }}
              value={perPage}
              onChange={(e) => onPerPageChange(Number(e.target.value))}
            >
              {PER_PAGE_OPTIONS.map((n) => (
                <option key={n} value={n} className="bg-zinc-900">{n}</option>
              ))}
            </select>
          </div>
        </>
      )}
    </div>
  );
}
