"use client";

import { motion } from "framer-motion";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  description?: string;
}

export default function ToggleSwitch({
  checked,
  onChange,
  label,
  description,
}: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="group inline-flex items-center gap-3 focus:outline-none"
    >
      <span
        className={`relative h-7 w-12 rounded-full transition-colors duration-300 ${
          checked ? "bg-primary" : "bg-slate/30"
        }`}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white shadow ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </span>
      {(label || description) && (
        <span className="text-left">
          {label && <p className="text-sm font-semibold text-midnight">{label}</p>}
          {description && <p className="text-xs text-slate">{description}</p>}
        </span>
      )}
    </button>
  );
}

