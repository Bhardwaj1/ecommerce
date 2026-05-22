"use client";

import { useEffect, useState, useCallback } from "react";

const CONFIG = {
  success: {
    icon: "✓",
    accent: "#4ade80",
    bg: "#0a1f12",
    border: "#4ade80",
    glow: "0 0 24px rgba(74,222,128,0.35), 0 8px 32px rgba(0,0,0,0.9)",
    iconBg: "rgba(74,222,128,0.2)",
  },
  error: {
    icon: "✕",
    accent: "#f87171",
    bg: "#1f0a0a",
    border: "#f87171",
    glow: "0 0 24px rgba(248,113,113,0.35), 0 8px 32px rgba(0,0,0,0.9)",
    iconBg: "rgba(248,113,113,0.2)",
  },
  warning: {
    icon: "⚠",
    accent: "#c9a84c",
    bg: "#1a1200",
    border: "#c9a84c",
    glow: "0 0 24px rgba(201,168,76,0.35), 0 8px 32px rgba(0,0,0,0.9)",
    iconBg: "rgba(201,168,76,0.2)",
  },
};

export function Toast({ toasts, onRemove }) {
  return (
    <div className="fixed top-5 right-5 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }) {
  const c = CONFIG[toast.type] || CONFIG.success;

  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 3500);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  return (
    <div
      className="pointer-events-auto flex items-center gap-3 px-4 py-3.5 rounded-2xl"
      style={{
        background: c.bg,
        border: `1.5px solid ${c.border}`,
        boxShadow: c.glow,
        minWidth: 300,
      }}
    >
      <span
        className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0"
        style={{ background: c.iconBg, color: c.accent }}
      >
        {c.icon}
      </span>
      <span className="flex-1 text-white font-semibold text-sm">{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-opacity opacity-60 hover:opacity-100 text-xs"
        style={{ color: c.accent }}
      >
        ✕
      </button>
    </div>
  );
}

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, show, remove };
}
