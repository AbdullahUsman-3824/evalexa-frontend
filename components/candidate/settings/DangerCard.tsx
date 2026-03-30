"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface DangerCardProps {
  title: string;
  description: string;
  bullets?: string[];
  children: ReactNode;
  tone?: "warning" | "danger";
}

export default function DangerCard({
  title,
  description,
  bullets = [],
  children,
  tone = "danger",
}: DangerCardProps) {
  const colors =
    tone === "warning"
      ? "border-warning/60 bg-warning/5"
      : "border-danger/60 bg-danger/5";

  return (
    <motion.div
      layout
      className={`rounded-2xl border px-6 py-5 shadow-sm shadow-danger/10 ${colors}`}
    >
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-midnight">{title}</h3>
          <p className="mt-1 text-sm text-slate">{description}</p>
        </div>

        {bullets.length > 0 && (
          <ul className="list-disc space-y-1 pl-5 text-sm text-danger">
            {bullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {children}
        </div>
      </div>
    </motion.div>
  );
}

