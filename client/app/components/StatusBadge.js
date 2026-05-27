"use client";

export function StatusBadge({ active, onClick }) {
  const style = {
    background: active ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
    color: active ? "#4ade80" : "#f87171",
    border: `1px solid ${active ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
  };

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="text-xs px-2.5 py-1 rounded-full font-semibold transition-all hover:opacity-80"
        style={style}
      >
        {active ? "● Active" : "● Inactive"}
      </button>
    );
  }

  return (
    <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={style}>
      {active ? "● Active" : "● Inactive"}
    </span>
  );
}
