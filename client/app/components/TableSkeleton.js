"use client";

function ShimmerCell({ width = "100%", height = 14, rounded = 8 }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: rounded,
        background: "linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.09) 50%, rgba(255,255,255,0.04) 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.4s infinite",
      }}
    />
  );
}

export function TableSkeleton({ cols, rows = 6 }) {
  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      {Array.from({ length: rows }).map((_, ri) => (
        <tr
          key={ri}
          style={{ borderBottom: ri < rows - 1 ? "1px solid var(--glass-border)" : "none" }}
        >
          {cols.map((col, ci) => (
            <td key={ci} className="px-4 py-3.5">
              {col.type === "avatar" ? (
                <div className="flex items-center gap-3">
                  <ShimmerCell width={32} height={32} rounded={8} />
                  <ShimmerCell width={col.textWidth || 100} />
                </div>
              ) : col.type === "badge" ? (
                <ShimmerCell width={70} height={22} rounded={20} />
              ) : col.type === "actions" ? (
                <div className="flex gap-2">
                  <ShimmerCell width={80} height={28} rounded={8} />
                  <ShimmerCell width={60} height={28} rounded={8} />
                  <ShimmerCell width={50} height={28} rounded={8} />
                  <ShimmerCell width={55} height={28} rounded={8} />
                </div>
              ) : (
                <ShimmerCell width={col.width || "70%"} />
              )}
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
