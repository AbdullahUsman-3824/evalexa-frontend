"use client";

import { motion } from "framer-motion";
import { Briefcase, Users, Star, CalendarCheck, Clock } from "lucide-react";
import { useEffect, useState } from "react";

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  subText: string;
  subColor: "green" | "slate" | "blue";
  delay: number;
}

function StatCard({
  icon,
  value,
  label,
  subText,
  subColor,
  delay,
}: StatCardProps) {
  const [count, setCount] = useState(0);
  const targetValue = parseFloat(value);

  useEffect(() => {
    const duration = 1500; // 1.5 seconds
    const steps = 60;
    const increment = targetValue / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= targetValue) {
        setCount(targetValue);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [targetValue]);

  const subColors = {
    green: "text-success",
    slate: "text-slate",
    blue: "text-primary",
  };

  const displayValue = value.includes(".")
    ? count.toFixed(1)
    : Math.round(count).toString();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 rounded-lg bg-surface">{icon}</div>
      </div>

      <div className="space-y-1">
        <h3 className="font-syne text-3xl font-semibold text-midnight">
          {displayValue}
        </h3>
        <p className="text-slate text-sm font-medium">{label}</p>
        <p className={`text-xs font-medium ${subColors[subColor]}`}>
          {subText}
        </p>
      </div>
    </motion.div>
  );
}

export default function StatsRow() {
  const stats = [
    {
      icon: <Briefcase className="w-5 h-5 text-primary" />,
      value: "8",
      label: "Active Job Posts",
      subText: "+2 this week",
      subColor: "green" as const,
    },
    {
      icon: <Users className="w-5 h-5 text-cyan" />,
      value: "248",
      label: "Total Applicants",
      subText: "+34 today",
      subColor: "green" as const,
    },
    {
      icon: <Star className="w-5 h-5 text-warning" />,
      value: "38",
      label: "Shortlisted",
      subText: "15% of total",
      subColor: "slate" as const,
    },
    {
      icon: <CalendarCheck className="w-5 h-5 text-success" />,
      value: "12",
      label: "Scheduled Interviews",
      subText: "3 today",
      subColor: "blue" as const,
    },
    {
      icon: <Clock className="w-5 h-5 text-primary" />,
      value: "8.4",
      label: "Avg Days to Hire",
      subText: "-2.1 days vs last month",
      subColor: "green" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} delay={index * 0.1} />
      ))}
    </div>
  );
}
