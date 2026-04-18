"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserCheck,
  UserX,
  Clock3,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

type KPIItem = {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: ReactNode;
};

function CountUpValue({ value }: { value: string }) {
  const numeric = useMemo(() => Number.parseFloat(value.replace(/[^0-9.]/g, "")), [value]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1200;
    const steps = 50;
    const increment = numeric / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= numeric) {
        setCount(numeric);
        clearInterval(timer);
        return;
      }
      setCount(current);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [numeric]);

  if (value.includes("days")) {
    return `${count.toFixed(1)} days`;
  }
  if (value.includes("%")) {
    return `${count.toFixed(1).replace(".0", "")}%`;
  }
  return Math.round(count).toString();
}

export default function KPICards() {
  const kpis: KPIItem[] = [
    {
      label: "Total Applicants",
      value: "248",
      change: "+18% vs last month",
      trend: "up",
      icon: <Users className="h-5 w-5 text-primary" />,
    },
    {
      label: "Shortlisted Rate",
      value: "15.3%",
      change: "+2.1% vs last month",
      trend: "up",
      icon: <UserCheck className="h-5 w-5 text-cyan" />,
    },
    {
      label: "Rejection Rate",
      value: "72%",
      change: "-3% vs last month",
      trend: "down",
      icon: <UserX className="h-5 w-5 text-warning" />,
    },
    {
      label: "Avg Time to Hire",
      value: "8.4 days",
      change: "-2.1 days",
      trend: "down",
      icon: <Clock3 className="h-5 w-5 text-success" />,
    },
    {
      label: "Offer Acceptance Rate",
      value: "83%",
      change: "+5% vs last month",
      trend: "up",
      icon: <CheckCircle2 className="h-5 w-5 text-primary" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {kpis.map((kpi, index) => (
        <motion.div
          key={kpi.label}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: index * 0.08 }}
          className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-lg bg-surface p-2.5">{kpi.icon}</div>
            <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-xs font-semibold text-success">
              {kpi.trend === "up" ? (
                <ArrowUpRight className="h-3.5 w-3.5" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5" />
              )}
              Trend
            </span>
          </div>
          <p className="font-syne text-[30px] font-semibold leading-none text-midnight">
            <CountUpValue value={kpi.value} />
          </p>
          <p className="mt-2 text-sm font-medium text-slate">{kpi.label}</p>
          <p className="mt-1 text-xs font-semibold text-success">{kpi.change}</p>
        </motion.div>
      ))}
    </div>
  );
}

