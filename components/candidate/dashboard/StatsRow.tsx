"use client";

import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useMotionValueEvent,
} from "framer-motion";
import { ClipboardList, CalendarCheck, Star, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

interface StatCardProps {
  icon: React.ElementType;
  iconColor: string;
  value: number;
  label: string;
  trend?: {
    text: string;
    color: string;
  };
  link?: {
    text: string;
    href: string;
  };
  highlight?: boolean;
  index: number;
  suffix?: string;
}

function StatCard({
  icon: Icon,
  iconColor,
  value,
  label,
  trend,
  link,
  highlight,
  index,
  suffix = "",
}: StatCardProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = useState(0);

  useMotionValueEvent(rounded, "change", (latest) => {
    setDisplayValue(latest);
  });

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 1.5,
      delay: index * 0.1,
      ease: "easeOut",
    });
    return controls.stop;
  }, [count, value, index]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -2 }}
      className={`bg-white rounded-xl p-6 border transition-all duration-300 hover:shadow-lg ${
        highlight ? "border-cyan" : "border-slate/10"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div
            className={`inline-flex items-center justify-center w-10 h-10 rounded-lg mb-4`}
            style={{ backgroundColor: `${iconColor}15` }}
          >
            <Icon size={20} style={{ color: iconColor }} />
          </div>

          <motion.div className="text-3xl font-bold text-midnight mb-1">
            {displayValue}
            {suffix}
          </motion.div>

          <p className="text-sm text-slate font-medium">{label}</p>

          {trend && (
            <p
              className={`text-xs mt-2 font-medium`}
              style={{ color: trend.color }}
            >
              {trend.text}
            </p>
          )}

          {link && (
            <a
              href={link.href}
              className="inline-flex items-center text-xs text-primary font-medium mt-2 hover:underline"
            >
              {link.text} →
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function StatsRow() {
  const stats = [
    {
      icon: ClipboardList,
      iconColor: "#1E6FFF",
      value: 12,
      label: "Jobs Applied",
      trend: {
        text: "+3 this week",
        color: "#00B37E",
      },
    },
    {
      icon: CalendarCheck,
      iconColor: "#00C2D1",
      value: 2,
      label: "Pending Invites",
      highlight: true,
    },
    {
      icon: Star,
      iconColor: "#FF9500",
      value: 4,
      label: "Shortlisted",
    },
    {
      icon: Sparkles,
      iconColor: "#00B37E",
      value: 78,
      label: "AI Resume Score",
      suffix: "/100",
      link: {
        text: "View full analysis",
        href: "/ai-analysis",
      },
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatCard key={stat.label} {...stat} index={index} />
      ))}
    </div>
  );
}
