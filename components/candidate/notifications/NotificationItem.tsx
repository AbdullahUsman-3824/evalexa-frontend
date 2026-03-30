"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  ClipboardList,
  Star,
  CalendarCheck,
  MessageSquare,
  XCircle,
  Bell,
  Trash2,
  CheckCircle,
} from "lucide-react";

export type NotificationType =
  | "job"
  | "application"
  | "shortlisted"
  | "interview"
  | "message"
  | "rejected"
  | "system";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  timestamp: string;
  isRead: boolean;
  ctaLabel?: string;
  ctaAction?: () => void;
}

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
}: NotificationItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getIconAndColor = () => {
    switch (notification.type) {
      case "job":
        return { Icon: Briefcase, color: "#1E6FFF", bg: "bg-primary/10" };
      case "application":
        return { Icon: ClipboardList, color: "#FF9500", bg: "bg-warning/10" };
      case "shortlisted":
        return { Icon: Star, color: "#00C2D1", bg: "bg-cyan/10" };
      case "interview":
        return { Icon: CalendarCheck, color: "#00B37E", bg: "bg-success/10" };
      case "message":
        return { Icon: MessageSquare, color: "#1E6FFF", bg: "bg-primary/10" };
      case "rejected":
        return { Icon: XCircle, color: "#E63946", bg: "bg-danger/10" };
      case "system":
      default:
        return { Icon: Bell, color: "#6B7A99", bg: "bg-slate/10" };
    }
  };

  const { Icon, color, bg } = getIconAndColor();

  return (
    <motion.div
      className={`relative rounded-xl border border-transparent p-4 transition-all ${
        notification.isRead
          ? "bg-white hover:bg-surface"
          : "border-l-[3px] border-primary bg-[#EEF4FF] hover:bg-[#e0ebff]"
      }`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      layout
    >
      <div className="flex gap-3">
        {/* Icon */}
        <div
          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${bg}`}
        >
          <Icon className="h-5 w-5" style={{ color }} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4
              className={`text-sm ${
                notification.isRead
                  ? "text-midnight"
                  : "font-semibold text-midnight"
              }`}
            >
              {notification.title}
            </h4>
            {!notification.isRead && (
              <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
            )}
          </div>
          <p className="mt-1 text-xs text-slate line-clamp-2">
            {notification.body}
          </p>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-xs text-slate">{notification.timestamp}</span>
            {notification.ctaLabel && (
              <button
                onClick={notification.ctaAction}
                className="text-xs font-semibold text-primary hover:text-primary/80"
              >
                {notification.ctaLabel}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Hover Actions */}
      {isHovered && (
        <motion.div
          className="absolute right-4 top-4 flex items-center gap-2"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          {!notification.isRead && (
            <button
              onClick={() => onMarkAsRead(notification.id)}
              className="flex items-center gap-1 rounded-lg bg-white px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10 transition"
            >
              <CheckCircle className="h-3 w-3" />
              Mark as read
            </button>
          )}
          <button
            onClick={() => onDelete(notification.id)}
            className="rounded-lg bg-white p-1.5 text-slate hover:bg-danger/10 hover:text-danger transition"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
