"use client";

import { Sparkles } from "lucide-react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type AccuracyPoint = {
  month: string;
  rate: number;
};

export default function AIScreeningPerf() {
  const history: AccuracyPoint[] = [
    { month: "Nov", rate: 87 },
    { month: "Dec", rate: 88 },
    { month: "Jan", rate: 90 },
    { month: "Feb", rate: 91 },
    { month: "Mar", rate: 93 },
    { month: "Apr", rate: 94 },
  ];

  const topSkills = [
    "React.js (14 hires)",
    "TypeScript (11 hires)",
    "Node.js (9 hires)",
    "AWS (8 hires)",
    "System Design (6 hires)",
  ];

  return (
    <div className="rounded-xl border-2 border-cyan/40 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-cyan" />
        <h3 className="font-syne text-xl font-semibold text-midnight">
          AI Screening Performance
        </h3>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div>
          <p className="text-sm text-slate">AI Accuracy rate</p>
          <p className="font-syne text-4xl font-bold text-success">94%</p>
          <p className="mt-2 text-sm text-slate">
            Candidates hired from AI top-10 recommendations
          </p>
          <div className="mt-4 h-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <XAxis dataKey="month" tick={{ fill: "#6B7A99", fontSize: 12 }} />
                <YAxis domain={[80, 100]} tick={{ fill: "#6B7A99", fontSize: 12 }} />
                <Tooltip
                  formatter={(value: number) => `${value}%`}
                  contentStyle={{ borderRadius: "10px", border: "1px solid #E5E7EB" }}
                />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#00C2D1"
                  strokeWidth={3}
                  dot={{ r: 3, fill: "#00C2D1" }}
                  animationDuration={900}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-midnight">Top AI-recommended skills</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {topSkills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1 text-xs font-medium text-cyan-700"
              >
                {skill}
              </span>
            ))}
          </div>
          <div className="mt-6 flex items-start gap-2 rounded-lg bg-cyan/10 p-3">
            <Sparkles className="mt-0.5 h-4 w-4 text-cyan" />
            <p className="text-sm font-medium text-cyan-700">
              AI saved <span className="font-bold">42 hours</span> of manual screening this
              month.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

