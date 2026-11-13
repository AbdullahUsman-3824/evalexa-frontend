"use client";

import Link from "next/link";
import { ChevronDown, Loader2 } from "lucide-react";

export function CandidateCell({
  name,
  email,
  applicationId,
}: {
  name: string;
  email: string;
  applicationId?: string;
}) {
  const content = (
    <>
      <p className="font-medium text-[#0D1B2A] group-hover:text-[#1E6FFF]">
        {name}
      </p>
      <p className="text-xs text-slate-500">{email}</p>
    </>
  );

  if (!applicationId) return <div>{content}</div>;

  return (
    <Link
      href={`/recruiter/applicants/${applicationId}`}
      className="group block w-fit"
    >
      {content}
    </Link>
  );
}

export function JobCell({
  title,
  jobId,
}: {
  title: string;
  jobId?: string;
}) {
  if (!jobId) return <span className="text-sm text-[#0D1B2A]">{title}</span>;

  return (
    <Link
      href={`/recruiter/jobs/${jobId}`}
      className="text-sm text-[#0D1B2A] hover:text-[#1E6FFF] hover:underline"
    >
      {title}
    </Link>
  );
}

export function StatusFilter<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { label: string; value: T }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="relative w-fit">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        aria-label="Filter by status"
        className="h-9 appearance-none rounded-lg border border-slate/20 bg-white pl-3 pr-8 text-sm text-slate-600 outline-none focus:border-[#1E6FFF]"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  );
}

export function TableLoading({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-2xl border border-slate/15 bg-white py-14 text-sm text-slate-600 shadow-sm">
      <Loader2 className="h-4 w-4 animate-spin" />
      {label}
    </div>
  );
}

export function TableEmpty({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate/25 bg-white py-12 text-center text-sm text-slate-600">
      {label}
    </div>
  );
}

export const tableWrapperClass =
  "overflow-x-auto rounded-2xl border border-slate/15 bg-white shadow-sm";
export const thClass =
  "px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500";
export const tdClass = "px-5 py-4 align-middle";