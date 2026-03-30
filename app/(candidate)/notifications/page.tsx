"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import NotificationGroup from "@/components/candidate/notifications/NotificationGroup";
import { Bell, ChevronDown, Loader2 } from "lucide-react";
import { Notification } from "@/components/candidate/notifications/NotificationItem";

type NotificationCategory = "All" | "Jobs" | "Applications" | "Interviews" | "Messages";

interface NotificationFeedItem extends Notification {
  group: "Today" | "Yesterday" | "This Week" | "Earlier";
  category: NotificationCategory;
}

const initialNotifications: NotificationFeedItem[] = [
  {
    id: "1",
    type: "job",
    category: "Jobs",
    group: "Today",
    title: "New job match: Frontend Developer at TechCorp — 94% match",
    body: "Based on your preferences, this role aligns strongly with your AI experience.",
    timestamp: "2h ago",
    isRead: false,
    ctaLabel: "View Job",
  },
  {
    id: "2",
    type: "shortlisted",
    category: "Applications",
    group: "Today",
    title: "Your application was shortlisted at NovaBuild",
    body: "Congrats! The hiring team moved you to the shortlist for the Product Designer role.",
    timestamp: "3h ago",
    isRead: false,
    ctaLabel: "View Application",
  },
  {
    id: "3",
    type: "interview",
    category: "Interviews",
    group: "Today",
    title: "Interview invite from HireIQ Solutions — April 8, 3PM",
    body: "Confirm your availability or propose an alternative time in the scheduler.",
    timestamp: "5h ago",
    isRead: false,
    ctaLabel: "View Invite",
  },
  {
    id: "4",
    type: "system",
    category: "Applications",
    group: "Yesterday",
    title: "Resume analyzed — Score: 78/100",
    body: "Our AI detected opportunities to improve keyword density and quantifiable impact.",
    timestamp: "18h ago",
    isRead: true,
    ctaLabel: "View Analysis",
  },
  {
    id: "5",
    type: "rejected",
    category: "Applications",
    group: "Yesterday",
    title: "Application rejected at DesignCo",
    body: "Thanks for applying. The team selected another candidate but welcomes future applications.",
    timestamp: "22h ago",
    isRead: true,
  },
  {
    id: "6",
    type: "message",
    category: "Messages",
    group: "This Week",
    title: "New message from TechCorp recruiter",
    body: "Hi Aria, thanks for applying! Let’s set up a quick chat to align expectations.",
    timestamp: "2d ago",
    isRead: false,
    ctaLabel: "Read Message",
  },
  {
    id: "7",
    type: "application",
    category: "Applications",
    group: "This Week",
    title: "Portfolio review required for UX Strategist application",
    body: "Share 2 relevant case studies to keep your application moving.",
    timestamp: "3d ago",
    isRead: true,
    ctaLabel: "Upload Work",
  },
  {
    id: "8",
    type: "job",
    category: "Jobs",
    group: "Earlier",
    title: "New job match: Lead Product Designer at LumenLabs — 89% match",
    body: "Lead high-impact AI experiences on an R&D team distributed globally.",
    timestamp: "1w ago",
    isRead: true,
    ctaLabel: "View Job",
  },
];

const filters: NotificationCategory[] = [
  "All",
  "Jobs",
  "Applications",
  "Interviews",
  "Messages",
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeFilter, setActiveFilter] = useState<NotificationCategory>("All");
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const groupedNotifications = useMemo(() => {
    const filtered = notifications.filter((notification) => {
      if (activeFilter === "All") return true;
      return notification.category === activeFilter;
    });

    return filtered.reduce<Record<NotificationFeedItem["group"], NotificationFeedItem[]>>(
      (acc, notification) => {
        if (!acc[notification.group]) acc[notification.group] = [];
        acc[notification.group].push(notification);
        return acc;
      },
      {
        Today: [],
        Yesterday: [],
        "This Week": [],
        Earlier: [],
      }
    );
  }, [notifications, activeFilter]);

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })));
  };

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setNotifications((prev) => [
        ...prev,
        {
          id: `load-${prev.length + 1}`,
          type: "system",
          category: "Applications",
          group: "Earlier",
          title: "System reminder: Update your interview availability",
          body: "Keep your availability up-to-date so recruiters can schedule faster.",
          timestamp: "2w ago",
          isRead: true,
        },
      ]);
      setIsLoadingMore(false);
    }, 1200);
  };

  const hasNotifications = Object.values(groupedNotifications).some(
    (group) => group.length > 0
  );

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 rounded-2xl bg-white/80 p-6 shadow-sm shadow-midnight/5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-heading text-2xl text-midnight">Notifications</p>
          <p className="mt-1 text-sm text-slate">Stay on top of your applications and recruiter messages.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
            {unreadCount} unread
          </span>
          <button
            onClick={handleMarkAllAsRead}
            className="text-sm font-semibold text-primary hover:text-primary/80"
          >
            Mark all as read
          </button>
        </div>
      </header>

      <div className="rounded-2xl bg-white/80 p-4 shadow-sm shadow-midnight/5">
        <div className="flex flex-wrap items-center gap-3">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                activeFilter === filter
                  ? "bg-primary text-white shadow-primary/40"
                  : "bg-surface text-slate hover:bg-surface/70"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {!hasNotifications ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate/30 bg-white/80 p-10 text-center">
          <div className="relative mb-6 h-20 w-20">
            <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
            <Bell className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 text-primary" />
            <div className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-primary text-white">
              <span className="text-xs font-semibold">0</span>
            </div>
          </div>
          <p className="font-heading text-lg text-midnight">You're all caught up!</p>
          <p className="mt-1 text-sm text-slate">No new notifications</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {Object.entries(groupedNotifications)
              .filter(([, group]) => group.length)
              .map(([label, group]) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <NotificationGroup
                    label={label as NotificationFeedItem["group"]}
                    notifications={group}
                    onMarkAsRead={handleMarkAsRead}
                    onDelete={handleDelete}
                  />
                </motion.div>
              ))}
          </AnimatePresence>
          <div className="pt-2 text-center">
            <button
              onClick={handleLoadMore}
              className="inline-flex items-center gap-2 rounded-full border border-slate/30 bg-white px-5 py-2 text-sm font-semibold text-midnight hover:border-primary hover:text-primary"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Load More
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

