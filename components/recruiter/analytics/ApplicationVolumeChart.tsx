"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type DayPoint = {
  date: string;
  applicants: number;
};

export default function ApplicationVolumeChart() {
  const data = useMemo<DayPoint[]>(() => {
    const counts = [
      8, 10, 14, 12, 9, 11, 15, 19, 17, 14, 13, 16, 18, 21, 20, 16, 13, 11, 9,
      12, 15, 22, 25, 24, 19, 17, 15, 14, 18, 20,
    ];
    return counts.map((applicants, i) => ({
      date: `Day ${i + 1}`,
      applicants,
    }));
  }, []);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="font-syne text-xl font-semibold text-midnight">
          Application Volume Over Time
        </h2>
        <p className="mt-1 text-sm text-slate">
          Daily applicants for the selected period
        </p>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 12, right: 18, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="applicantFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1E6FFF" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#1E6FFF" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fill: "#6B7A99", fontSize: 12 }} />
            <YAxis tick={{ fill: "#6B7A99", fontSize: 12 }} />
            <Tooltip
              cursor={{ stroke: "#1E6FFF", strokeDasharray: "4 4" }}
              contentStyle={{
                borderRadius: "10px",
                border: "1px solid #E5E7EB",
                boxShadow: "0 8px 20px rgba(13, 27, 42, 0.08)",
              }}
            />
            <Area
              type="monotone"
              dataKey="applicants"
              stroke="#1E6FFF"
              fill="url(#applicantFill)"
              strokeWidth={3}
              dot={{ fill: "#1E6FFF", strokeWidth: 0, r: 4 }}
              activeDot={{ r: 5 }}
              animationDuration={900}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

