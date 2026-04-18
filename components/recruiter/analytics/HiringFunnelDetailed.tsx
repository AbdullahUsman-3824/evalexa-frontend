"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

type FunnelStage = {
  stage: string;
  count: number;
  conversion?: string;
  color: string;
  topInset: number;
  bottomInset: number;
};

export default function HiringFunnelDetailed() {
  const stages: FunnelStage[] = [
    { stage: "Applied", count: 248, color: "#1E6FFF", topInset: 0, bottomInset: 16 },
    {
      stage: "AI Screened",
      count: 220,
      conversion: "88.7%",
      color: "#00C2D1",
      topInset: 10,
      bottomInset: 24,
    },
    {
      stage: "Shortlisted",
      count: 38,
      conversion: "17.3%",
      color: "#FF9500",
      topInset: 20,
      bottomInset: 34,
    },
    {
      stage: "Interviewed",
      count: 12,
      conversion: "31.6%",
      color: "#00B37E",
      topInset: 28,
      bottomInset: 44,
    },
    {
      stage: "Hired",
      count: 4,
      conversion: "33.3%",
      color: "#D4AF37",
      topInset: 36,
      bottomInset: 54,
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="font-syne text-xl font-semibold text-midnight">Hiring Funnel</h2>
      <div className="mt-5 space-y-2">
        {stages.map((item, index) => (
          <motion.div
            key={item.stage}
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div
              className="relative h-[62px]"
              style={{
                clipPath: `polygon(${item.topInset}% 0%, ${100 - item.topInset}% 0%, ${100 - item.bottomInset}% 100%, ${item.bottomInset}% 100%)`,
                backgroundColor: item.color,
              }}
            >
              <div className="flex h-full items-center justify-between px-5 text-white">
                <span className="font-semibold">{item.stage}</span>
                <div className="text-right">
                  <p className="font-syne text-lg font-bold">{item.count}</p>
                  <p className="text-xs text-white/90">{item.conversion ?? "—"}</p>
                </div>
              </div>
            </div>
            {item.conversion ? (
              <div className="flex items-center justify-end gap-1.5 py-1 pr-1 text-xs font-semibold text-slate">
                <ArrowDown className="h-3.5 w-3.5" />
                <span>{item.conversion}</span>
              </div>
            ) : null}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

