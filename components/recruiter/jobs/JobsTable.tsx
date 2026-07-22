"use client";

import Link from "next/link";
import { Edit, Eye } from "lucide-react";
import { formatJobDate, formatJobStatus } from "@/repositories/job.repository";
import { JobListRecord } from "@/types/job.types";

interface JobsTableProps {
  jobs: JobListRecord[];
}

function statusClass(status: ReturnType<typeof formatJobStatus>) {
  switch (status) {
    case "Published":
      return "bg-success/10 text-success";
    case "Closed":
      return "bg-danger/10 text-danger";
    default:
      return "bg-slate/15 text-slate";
  }
}

export default function JobsTable({ jobs }: JobsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate/20 bg-white shadow-sm">
      {/* Added overflow-x-auto wrapper for horizontal scroll */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-surface">
            <tr className="text-left text-sm font-semibold text-midnight">
              <th className="px-6 py-4 whitespace-nowrap">Job Title</th>
              <th className="px-6 py-4 text-center whitespace-nowrap">
                Deadline
              </th>
              <th className="px-6 py-4 text-center whitespace-nowrap">
                Status
              </th>
              <th className="px-6 py-4 text-center whitespace-nowrap">
                Applications
              </th>
              <th className="px-6 py-4 text-right whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate/10">
            {jobs.map((job) => {
              const status = formatJobStatus(job.status);

              return (
                <tr
                  key={job.id}
                  className="transition-colors hover:bg-surface/40"
                >
                  <td className="px-6 py-4 font-medium text-midnight whitespace-nowrap">
                    {job.title}
                  </td>

                  <td className="px-6 py-4 text-slate text-center whitespace-nowrap">
                    {formatJobDate(job.applicationDeadline)}
                  </td>

                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                        status,
                      )}`}
                    >
                      {status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center font-semibold text-midnight whitespace-nowrap">
                    {job.applications}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/recruiter/jobs/${job.id}`}
                        className="rounded-lg p-2 text-slate transition hover:bg-surface hover:text-primary"
                        title="View Job Details"
                      >
                        <Eye className="h-5 w-5" />
                      </Link>

                      <Link
                        href={`/recruiter/jobs/${job.id}/edit`}
                        className="rounded-lg p-2 text-slate transition hover:bg-surface hover:text-primary"
                        title="Edit Job Post"
                      >
                        <Edit className="h-5 w-5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
