"use client";

import { ReactNode } from "react";

interface SettingRowProps {
  label: string;
  description?: string;
  children: ReactNode;
  alignTop?: boolean;
}

export default function SettingRow({
  label,
  description,
  children,
  alignTop = false,
}: SettingRowProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-slate/20 py-4 last:border-none md:flex-row md:items-center md:justify-between">
      <div className="space-y-1">
        <p className="font-semibold text-midnight">{label}</p>
        {description && (
          <p className="text-sm text-slate">{description}</p>
        )}
      </div>
      <div className={`w-full md:w-auto ${alignTop ? "" : "md:text-right"}`}>{children}</div>
    </div>
  );
}

