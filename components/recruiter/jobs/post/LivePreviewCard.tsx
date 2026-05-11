"use client";

import { CalendarDays, MapPin } from "lucide-react";
import type { JobPostFormData } from "./types";

interface LivePreviewCardProps {
  data: JobPostFormData;
}

export default function LivePreviewCard({ data }: LivePreviewCardProps) {
  const title = data.jobTitle.trim() || "Job title will appear here";
  const location =
    data.workMode === "Remote"
      ? "Remote"
      : data.location.trim() || "Location not specified";

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-slate">Your post will look like this →</p>
      <div className="rounded-xl border border-slate/20 bg-white p-5 shadow-sm">
        <h3 className="font-syne text-lg font-semibold text-midnight">{title}</h3>
        <p className="mt-1 text-sm text-slate">Evalexa • Recruitment Team</p>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary">
            {data.jobType}
          </span>
          <span className="rounded-full bg-slate/10 px-3 py-1 font-semibold text-slate">
            {data.workMode}
          </span>
          {data.urgentHiring && (
            <span className="rounded-full bg-warning/10 px-3 py-1 font-semibold text-warning">
              Urgently Hiring
            </span>
          )}
        </div>

        <div className="mt-4 space-y-2 text-sm text-slate">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" />
            <span>
              Deadline:{" "}
              {data.applicationDeadline
                ? new Date(data.applicationDeadline).toLocaleDateString()
                : "Not selected"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

