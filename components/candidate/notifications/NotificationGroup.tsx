"use client";

import { motion } from "framer-motion";
import NotificationItem, {
  Notification,
} from "@/components/candidate/notifications/NotificationItem";

interface NotificationGroupProps {
  label: string;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function NotificationGroup({
  label,
  notifications,
  onMarkAsRead,
  onDelete,
}: NotificationGroupProps) {
  if (!notifications.length) return null;

  return (
    <motion.section
      layout
      className="space-y-4 rounded-2xl bg-white/60 p-4 shadow-sm shadow-midnight/5"
    >
      <div className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate">
        <div className="h-px flex-1 bg-slate/30" />
        <span>{label}</span>
        <div className="h-px flex-1 bg-slate/30" />
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onMarkAsRead={onMarkAsRead}
            onDelete={onDelete}
          />
        ))}
      </div>
    </motion.section>
  );
}

