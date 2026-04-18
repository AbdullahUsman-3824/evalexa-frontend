"use client";

export type JobFilterStatus = "All" | "Published" | "Draft" | "Closed";
export type JobSortOption = "Newest" | "Most Applicants" | "Deadline";

interface JobFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  activeStatus: JobFilterStatus;
  onStatusChange: (status: JobFilterStatus) => void;
  sortBy: JobSortOption;
  onSortChange: (value: JobSortOption) => void;
  counts: Record<JobFilterStatus, number>;
}

const statuses: JobFilterStatus[] = ["All", "Published", "Draft", "Closed"];
const sortOptions: JobSortOption[] = ["Newest", "Most Applicants", "Deadline"];

export default function JobFilters({
  search,
  onSearchChange,
  activeStatus,
  onStatusChange,
  sortBy,
  onSortChange,
  counts,
}: JobFiltersProps) {
  return (
    <section className="rounded-xl border border-slate/20 bg-white p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <input
          type="text"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search job titles..."
          className="h-10 w-full rounded-lg border border-slate/25 bg-white px-3 text-sm text-midnight outline-none transition-all placeholder:text-slate/70 focus:border-primary focus:ring-2 focus:ring-primary/20 lg:max-w-xs"
        />

        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-wrap gap-3 border-b border-slate/15">
            {statuses.map((status) => {
              const isActive = status === activeStatus;
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => onStatusChange(status)}
                  className={`-mb-px border-b-2 px-1 pb-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "border-primary text-primary"
                      : "border-transparent text-slate hover:text-midnight"
                  }`}
                >
                  {status} ({counts[status] ?? 0})
                </button>
              );
            })}
          </div>

          <select
            value={sortBy}
            onChange={(event) => onSortChange(event.target.value as JobSortOption)}
            className="h-10 rounded-lg border border-slate/25 bg-white px-3 text-sm text-midnight outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            {sortOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}

