import type { ReactNode } from "react";

interface SessionStatePanelProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  variant?: "default" | "danger" | "success" | "warning";
  icon?: ReactNode;
}

export default function SessionStatePanel({
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  variant = "default",
  icon,
}: SessionStatePanelProps) {
  const toneClasses = {
    default: "border-white/10 bg-white/5 text-slate-200",
    danger: "border-red-500/30 bg-red-500/10 text-red-100",
    success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-100",
    warning: "border-amber-500/30 bg-amber-500/10 text-amber-100",
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#090b10] px-6 text-white">
      <div
        className={`max-w-xl rounded-3xl border px-8 py-10 text-center shadow-2xl backdrop-blur-sm ${toneClasses[variant]}`}
      >
        <div className="mb-4 flex justify-center text-cyan-300">{icon}</div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
          Interview status
        </p>
        <h2 className="mt-4 font-syne text-3xl font-bold text-white">
          {title}
        </h2>
        <p className="mt-3 text-sm text-slate-300">{description}</p>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {actionLabel && onAction ? (
            <button
              type="button"
              onClick={onAction}
              className="rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              {actionLabel}
            </button>
          ) : null}

          {secondaryActionLabel && onSecondaryAction ? (
            <button
              type="button"
              onClick={onSecondaryAction}
              className="rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
            >
              {secondaryActionLabel}
            </button>
          ) : null}
        </div>
      </div>
    </main>
  );
}
