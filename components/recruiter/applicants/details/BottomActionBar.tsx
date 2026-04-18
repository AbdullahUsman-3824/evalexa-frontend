import { CalendarPlus, Star, ChevronLeft, ChevronRight } from "lucide-react";

interface BottomActionBarProps {
  onPrev: () => void;
  onNext: () => void;
  onShortlist: () => void;
  onReject: () => void;
}

export default function BottomActionBar({
  onPrev,
  onNext,
  onShortlist,
  onReject,
}: BottomActionBarProps) {
  return (
    <div className="sticky bottom-0 z-30 mt-8 border-t border-slate/15 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrev}
            className="inline-flex items-center gap-1 rounded-lg border border-slate/20 px-3 py-2 text-sm font-medium text-midnight hover:bg-surface"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous Candidate
          </button>
          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center gap-1 rounded-lg border border-slate/20 px-3 py-2 text-sm font-medium text-midnight hover:bg-surface"
          >
            Next Candidate
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onShortlist}
            className="inline-flex items-center gap-1.5 rounded-lg bg-warning px-3 py-2 text-sm font-semibold text-white hover:bg-warning/90"
          >
            <Star className="h-4 w-4" />
            Shortlist
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg bg-success px-3 py-2 text-sm font-semibold text-white hover:bg-success/90"
          >
            <CalendarPlus className="h-4 w-4" />
            Schedule Interview
          </button>
          <button
            type="button"
            onClick={onReject}
            className="rounded-lg border border-danger/25 px-3 py-2 text-sm font-medium text-danger hover:bg-danger/5"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}

