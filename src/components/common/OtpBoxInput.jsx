import { useRef } from "react";

export default function OtpBoxInput({ value, onChange }) {
  const refs = useRef([]);

  const handleChange = (e, i) => {
    const v = e.target.value.replace(/\D/g, "");
    if (!v) return;

    const next = value.split("");
    next[i] = v;
    onChange(next.join("").slice(0, 6));

    if (i < 5) refs.current[i + 1].focus();
  };

  const handleBack = (e, i) => {
    if (e.key === "Backspace" && !value[i] && i > 0) {
      refs.current[i - 1].focus();
    }
  };

  return (
    <div className="flex justify-between gap-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          type="text"
          maxLength={1}
          inputMode="numeric"
          value={value[i] || ""}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleBack(e, i)}
          className="w-12 h-14 text-xl font-bold text-center rounded-xl bg-black/40 border border-white/20 text-white focus:ring-2 focus:ring-blue-500"
        />
      ))}
    </div>
  );
}
