"use client";

import { motion } from "framer-motion";

interface FunnelStage {
  stage: string;
  count: number;
  color: string;
  bgColor: string;
}

export default function HiringFunnel() {
  const stages: FunnelStage[] = [
    {
      stage: "Applied",
      count: 248,
      color: "bg-primary",
      bgColor: "bg-primary/10",
    },
    {
      stage: "Screened",
      count: 180,
      color: "bg-cyan",
      bgColor: "bg-cyan/10",
    },
    {
      stage: "Shortlisted",
      count: 38,
      color: "bg-warning",
      bgColor: "bg-warning/10",
    },
    {
      stage: "Interviews",
      count: 12,
      color: "bg-success",
      bgColor: "bg-success/10",
    },
    {
      stage: "Hired",
      count: 4,
      color: "bg-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
  ];

  const maxCount = stages[0].count;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      {/* Header */}
      <h2 className="font-syne text-xl font-semibold text-midnight mb-6">
        Hiring Funnel — This Month
      </h2>

      {/* Funnel Visualization */}
      <div className="space-y-4">
        {stages.map((stage, index) => {
          const percentage = (stage.count / maxCount) * 100;

          return (
            <div key={stage.stage} className="space-y-2">
              {/* Stage Label and Stats */}
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-midnight min-w-[100px]">
                  {stage.stage}
                </span>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate font-medium">
                    {percentage.toFixed(1)}%
                  </span>
                  <span className="font-semibold text-midnight min-w-[40px] text-right">
                    {stage.count}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div
                className={`h-10 ${stage.bgColor} rounded-lg overflow-hidden`}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{
                    duration: 1,
                    delay: index * 0.15,
                    ease: "easeOut",
                  }}
                  className={`h-full ${stage.color} rounded-lg flex items-center px-4`}
                >
                  <span className="text-white text-xs font-semibold">
                    {stage.count} candidates
                  </span>
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Conversion Metrics */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-xs text-slate mb-1">Applied → Screened</p>
            <p className="font-semibold text-midnight">
              {((180 / 248) * 100).toFixed(1)}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate mb-1">Screened → Shortlisted</p>
            <p className="font-semibold text-midnight">
              {((38 / 180) * 100).toFixed(1)}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate mb-1">Shortlisted → Interview</p>
            <p className="font-semibold text-midnight">
              {((12 / 38) * 100).toFixed(1)}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate mb-1">Interview → Hired</p>
            <p className="font-semibold text-midnight">
              {((4 / 12) * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
