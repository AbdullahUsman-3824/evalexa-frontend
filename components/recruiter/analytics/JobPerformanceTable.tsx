"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

type JobStatus = "Open" | "In Review" | "Filled";

type JobRow = {
  jobTitle: string;
  applicants: number;
  screened: number;
  shortlisted: number;
  interviews: number;
  hired: number;
  avgMatch: number;
  timeToFill: number;
  status: JobStatus;
};

type SortKey = keyof Omit<JobRow, "status"> | "status";
type SortDirection = "asc" | "desc";

const statusClassMap: Record<JobStatus, string> = {
  Open: "bg-primary/10 text-primary",
  "In Review": "bg-warning/10 text-warning",
  Filled: "bg-success/10 text-success",
};

export default function JobPerformanceTable() {
  const rows: JobRow[] = [
    {
      jobTitle: "Senior Frontend Engineer",
      applicants: 84,
      screened: 76,
      shortlisted: 14,
      interviews: 6,
      hired: 1,
      avgMatch: 87,
      timeToFill: 11,
      status: "In Review",
    },
    {
      jobTitle: "UX/UI Designer",
      applicants: 56,
      screened: 49,
      shortlisted: 9,
      interviews: 4,
      hired: 1,
      avgMatch: 82,
      timeToFill: 13,
      status: "Filled",
    },
    {
      jobTitle: "Data Scientist",
      applicants: 42,
      screened: 38,
      shortlisted: 7,
      interviews: 2,
      hired: 1,
      avgMatch: 85,
      timeToFill: 16,
      status: "In Review",
    },
    {
      jobTitle: "DevOps Engineer",
      applicants: 35,
      screened: 31,
      shortlisted: 5,
      interviews: 2,
      hired: 0,
      avgMatch: 78,
      timeToFill: 18,
      status: "Open",
    },
    {
      jobTitle: "Product Manager",
      applicants: 31,
      screened: 26,
      shortlisted: 3,
      interviews: 1,
      hired: 1,
      avgMatch: 81,
      timeToFill: 10,
      status: "Filled",
    },
  ];

  const [sortKey, setSortKey] = useState<SortKey>("applicants");
  const [direction, setDirection] = useState<SortDirection>("desc");

  const sortedRows = useMemo(() => {
    return [...rows].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      const comparison =
        typeof aVal === "number" && typeof bVal === "number"
          ? aVal - bVal
          : String(aVal).localeCompare(String(bVal));
      return direction === "asc" ? comparison : -comparison;
    });
  }, [rows, sortKey, direction]);

  const requestSort = (key: SortKey) => {
    if (key === sortKey) {
      setDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setDirection("desc");
  };

  const columns: { key: SortKey; label: string }[] = [
    { key: "jobTitle", label: "Job Title" },
    { key: "applicants", label: "Applicants" },
    { key: "screened", label: "Screened" },
    { key: "shortlisted", label: "Shortlisted" },
    { key: "interviews", label: "Interviews" },
    { key: "hired", label: "Hired" },
    { key: "avgMatch", label: "Avg Match" },
    { key: "timeToFill", label: "Time to Fill" },
    { key: "status", label: "Status" },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="font-syne text-xl font-semibold text-midnight">Job Post Performance</h3>
      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0 text-sm">
          <thead className="sticky top-0 z-10 bg-white">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  onClick={() => requestSort(column.key)}
                  className="cursor-pointer border-b border-gray-200 px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate"
                >
                  {column.label}
                </th>
              ))}
              <th className="border-b border-gray-200 px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row, index) => (
              <motion.tr
                key={row.jobTitle}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.06 }}
                className={index % 2 === 0 ? "bg-white" : "bg-surface/70"}
              >
                <td className="px-3 py-3 font-medium text-midnight">{row.jobTitle}</td>
                <td className="px-3 py-3 text-slate">{row.applicants}</td>
                <td className="px-3 py-3 text-slate">{row.screened}</td>
                <td className="px-3 py-3 text-slate">{row.shortlisted}</td>
                <td className="px-3 py-3 text-slate">{row.interviews}</td>
                <td className="px-3 py-3 text-slate">{row.hired}</td>
                <td
                  className={`px-3 py-3 font-semibold ${
                    row.avgMatch > 80 ? "text-success" : "text-midnight"
                  }`}
                >
                  {row.avgMatch}%
                </td>
                <td
                  className={`px-3 py-3 font-semibold ${
                    row.timeToFill > 14 ? "text-danger" : "text-midnight"
                  }`}
                >
                  {row.timeToFill} days
                </td>
                <td className="px-3 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClassMap[row.status]}`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <button className="text-xs font-semibold text-primary hover:underline">
                    View Details
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

