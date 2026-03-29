"use client";

import { motion } from "framer-motion";
import { ClipboardList, Sparkles, Star, CalendarCheck } from "lucide-react";

interface Activity {
  id: string;
  text: string;
  time: string;
  icon: React.ElementType;
  iconColor: string;
}

const activities: Activity[] = [
  {
    id: "1",
    text: "Applied to Frontend Developer at TechCorp",
    time: "2h ago",
    icon: ClipboardList,
    iconColor: "#1E6FFF",
  },
  {
    id: "2",
    text: "Resume analyzed by AI — Score: 78/100",
    time: "1d ago",
    icon: Sparkles,
    iconColor: "#00C2D1",
  },
  {
    id: "3",
    text: "Shortlisted for UI Engineer at NovaBuild",
    time: "2d ago",
    icon: Star,
    iconColor: "#00B37E",
  },
  {
    id: "4",
    text: "Interview invite from HireIQ Solutions",
    time: "3d ago",
    icon: CalendarCheck,
    iconColor: "#FF9500",
  },
];

function ActivityItem({
  activity,
  index,
}: {
  activity: Activity;
  index: number;
}) {
  const Icon = activity.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
      className="relative flex gap-4 group hover:bg-surface/50 p-3 -mx-3 rounded-lg transition-colors cursor-pointer"
    >
      {/* Timeline dot and line */}
      <div className="relative flex flex-col items-center">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10"
          style={{ backgroundColor: `${activity.iconColor}15` }}
        >
          <Icon size={16} style={{ color: activity.iconColor }} />
        </div>
        {/* Vertical line */}
        {index < activities.length - 1 && (
          <div className="w-0.5 h-full bg-slate/10 absolute top-8" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pt-1">
        <p className="text-sm text-midnight font-medium mb-1">
          {activity.text}
        </p>
        <p className="text-xs text-slate">{activity.time}</p>
      </div>
    </motion.div>
  );
}

export default function ActivityFeed() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="bg-white rounded-xl p-6 border border-slate/10"
    >
      <h2 className="font-display text-lg font-semibold text-midnight mb-5">
        Recent Activity
      </h2>

      <div className="space-y-1">
        {activities.map((activity, index) => (
          <ActivityItem key={activity.id} activity={activity} index={index} />
        ))}
      </div>
    </motion.div>
  );
}
