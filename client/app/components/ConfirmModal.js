"use client";

import { Button } from "./Button";

export function ConfirmModal({ title, message, confirmLabel = "Delete", onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
    >
      <div className="glass rounded-2xl p-7 w-full max-w-sm flex flex-col gap-5" style={{ border: "1px solid rgba(239,68,68,0.25)" }}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <h2 className="text-white font-bold text-lg">{title}</h2>
        </div>
        <p className="text-zinc-400 text-sm leading-relaxed">{message}</p>
        <div className="flex gap-3">
          <Button variant="danger" size="md" className="flex-1" onClick={onConfirm}>{confirmLabel}</Button>
          <Button variant="ghost" size="md" className="flex-1" onClick={onCancel}>Cancel</Button>
        </div>
      </div>
    </div>
  );
}
