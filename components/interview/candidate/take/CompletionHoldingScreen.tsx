"use client";

import { LoaderCircle } from "lucide-react";

interface CompletionHoldingScreenProps {
  /** true once every answer (incl. the last) is saved and the interview is completed */
  isReady: boolean;
  hasFailed: boolean;
  isFatal: boolean;
  onFinish: () => void;
  onRetry: () => void;
}

export default function CompletionHoldingScreen({
  isReady,
  hasFailed,
  isFatal,
  onFinish,
  onRetry,
}: CompletionHoldingScreenProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#090b10] px-6 text-white">
      <div className="max-w-xl rounded-3xl border border-white/10 bg-white/5 px-8 py-10 text-center shadow-2xl backdrop-blur-sm">
        <h2 className="font-syne text-3xl font-bold text-white">
          Your interview is complete
        </h2>
        <p className="mt-3 text-sm text-slate-300">
          Your interview is complete. Please wait while we finish saving all
          your answers. You can press Finish once everything is ready.
        </p>

        {hasFailed && (
          <p className="mt-4 text-sm text-amber-200">
            {isFatal
              ? "Your session has expired. Please open your invitation link again to continue."
              : "Some answers could not be saved yet."}
          </p>
        )}

        {!isReady && !hasFailed && (
          <p className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-300">
            <LoaderCircle className="h-3.5 w-3.5 animate-spin text-cyan-300" />
            Saving your answers…
          </p>
        )}

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {hasFailed && !isFatal && (
            <button
              type="button"
              onClick={onRetry}
              className="rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
            >
              Retry
            </button>
          )}
          <button
            type="button"
            onClick={onFinish}
            disabled={!isReady}
            className="rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Finish
          </button>
        </div>
      </div>
    </main>
  );
}