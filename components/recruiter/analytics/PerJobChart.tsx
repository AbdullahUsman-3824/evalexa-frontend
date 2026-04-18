"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type JobDatum = {
  name: string;
  shortlisted: number;
  rejected: number;
};

type SourceDatum = {
  source: string;
  value: number;
  color: string;
};

export default function PerJobChart() {
  const jobs = useMemo<JobDatum[]>(
    () => [
      { name: "Frontend", shortlisted: 12, rejected: 37 },
      { name: "UX Design", shortlisted: 8, rejected: 26 },
      { name: "Data Sci.", shortlisted: 7, rejected: 19 },
      { name: "DevOps", shortlisted: 5, rejected: 14 },
      { name: "PM", shortlisted: 6, rejected: 21 },
    ],
    [],
  );

  const sources = useMemo<SourceDatum[]>(
    () => [
      { source: "Direct", value: 62, color: "#1E6FFF" },
      { source: "LinkedIn", value: 74, color: "#00C2D1" },
      { source: "Indeed", value: 49, color: "#FF9500" },
      { source: "Referral", value: 38, color: "#00B37E" },
      { source: "Other", value: 25, color: "#9CA3AF" },
    ],
    [],
  );

  const total = sources.reduce((sum, s) => sum + s.value, 0);

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="font-syne text-xl font-semibold text-midnight">Per Job Performance</h3>
        <div className="mt-5 h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={jobs}>
              <XAxis dataKey="name" tick={{ fill: "#6B7A99", fontSize: 12 }} />
              <YAxis tick={{ fill: "#6B7A99", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  borderRadius: "10px",
                  border: "1px solid #E5E7EB",
                }}
              />
              <Legend verticalAlign="bottom" />
              <Bar dataKey="shortlisted" fill="#1E6FFF" radius={[4, 4, 0, 0]} />
              <Bar dataKey="rejected" fill="#E63946" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="font-syne text-xl font-semibold text-midnight">
          Where Candidates Come From
        </h3>
        <div className="mt-3 h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sources}
                dataKey="value"
                nameKey="source"
                innerRadius={56}
                outerRadius={85}
                paddingAngle={2}
                animationDuration={850}
              >
                {sources.map((entry) => (
                  <Cell key={entry.source} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => `${value} applicants`}
                contentStyle={{ borderRadius: "10px", border: "1px solid #E5E7EB" }}
              />
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-midnight text-sm font-semibold"
              >
                {`${total} total`}
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          {sources.map((source) => (
            <div key={source.source} className="flex items-center gap-2 text-sm">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: source.color }}
              />
              <span className="text-slate">{source.source}</span>
              <span className="ml-auto font-semibold text-midnight">
                {Math.round((source.value / total) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

