"use client";

import { Hourglass } from "lucide-react";

export default function ActiveCompletedTab() {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate/25 bg-white py-16 text-center">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-slate-100">
        <Hourglass className="h-5 w-5 text-slate-400" />
      </div>
      <p className="font-syne text-base font-semibold text-[#0D1B2A]">
        Active &amp; Completed interviews
      </p>
      <p className="mt-1 max-w-xs text-sm text-slate-500">
        Interviews in progress and finished ones will show up here soon.
      </p>
    </div>
  );
}