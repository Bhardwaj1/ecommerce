"use client";

export function Pagination({ page, totalPages, total, perPage, onPageChange }) {
  if (totalPages <= 1) return null;

  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);

  // show max 5 page buttons with ellipsis logic
  const getPages = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [];
    if (page <= 4) {
      pages.push(1, 2, 3, 4, 5, "...", totalPages);
    } else if (page >= totalPages - 3) {
      pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
    }
    return pages;
  };

  return (
    <div className="px-4 py-3 border-t flex items-center justify-between" style={{ borderColor: "var(--glass-border)" }}>
      <p className="text-xs text-zinc-500">
        Showing <span className="text-white">{from}–{to}</span> of <span className="text-white">{total}</span>
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="btn btn-ghost px-3 py-1.5 text-xs disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← Prev
        </button>

        {getPages().map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="w-8 text-center text-zinc-600 text-xs">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className="w-8 h-8 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: page === p ? "var(--gold)" : "transparent",
                color: page === p ? "#09090b" : "#a1a1aa",
                border: page === p ? "none" : "1px solid var(--glass-border)",
              }}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="btn btn-ghost px-3 py-1.5 text-xs disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
