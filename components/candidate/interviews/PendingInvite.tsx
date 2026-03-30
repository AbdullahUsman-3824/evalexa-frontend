"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Calendar,
  Video,
  MapPin,
  Monitor,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";

export interface PendingInviteData {
  id: string;
  company: string;
  companyInitials: string;
  companyColor: string;
  jobTitle: string;
  interviewType: "AI Interview" | "Video Call" | "In-Person";
  invitedOn: string;
  responseDeadline: string;
  scheduledFor: string;
  scheduledTime: string;
}

interface PendingInviteProps {
  invite: PendingInviteData;
  onAccept: (id: string) => void;
  onDecline: (id: string, reason?: string) => void;
}

export default function PendingInvite({
  invite,
  onAccept,
  onDecline,
}: PendingInviteProps) {
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState("");

  const getDaysUntilDeadline = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffDays = Math.ceil(
      (deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );
    return diffDays;
  };

  const daysUntilDeadline = getDaysUntilDeadline(invite.responseDeadline);

  const getInterviewIcon = () => {
    switch (invite.interviewType) {
      case "AI Interview":
        return Monitor;
      case "Video Call":
        return Video;
      case "In-Person":
        return MapPin;
    }
  };

  const getInterviewColor = () => {
    switch (invite.interviewType) {
      case "AI Interview":
        return "bg-cyan/10 text-cyan border-cyan/30";
      case "Video Call":
        return "bg-primary/10 text-primary border-primary/30";
      case "In-Person":
        return "bg-success/10 text-success border-success/30";
    }
  };

  const Icon = getInterviewIcon();

  const handleAccept = () => {
    onAccept(invite.id);
    setShowAcceptModal(false);
  };

  const handleDecline = () => {
    onDecline(invite.id, declineReason);
    setShowDeclineModal(false);
    setDeclineReason("");
  };

  return (
    <>
      <motion.div
        className="rounded-xl border-t-4 border-warning bg-white p-5 shadow-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="flex items-start gap-3">
          <div
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ backgroundColor: invite.companyColor }}
          >
            {invite.companyInitials}
          </div>
          <div className="flex-1">
            <h3 className="font-display text-lg font-semibold text-midnight">
              {invite.jobTitle}
            </h3>
            <p className="text-sm text-slate">{invite.company}</p>
          </div>
          <span
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${getInterviewColor()}`}
          >
            <Icon className="h-3.5 w-3.5" />
            {invite.interviewType}
          </span>
        </div>

        {/* Info Grid */}
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate">
              Invited On
            </p>
            <p className="mt-1 text-sm text-midnight">{invite.invitedOn}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate">
              Respond By
            </p>
            <p
              className={`mt-1 flex items-center gap-1 text-sm font-semibold ${
                daysUntilDeadline <= 2 ? "text-danger" : "text-warning"
              }`}
            >
              <AlertCircle className="h-4 w-4" />
              {invite.responseDeadline}
              {daysUntilDeadline <= 2 && " (Urgent)"}
            </p>
          </div>
          <div className="md:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate">
              Scheduled For
            </p>
            <p className="mt-1 flex items-center gap-2 text-sm text-midnight">
              <Calendar className="h-4 w-4 text-primary" />
              {invite.scheduledFor} — {invite.scheduledTime}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowAcceptModal(true)}
            className="flex items-center justify-center gap-2 rounded-lg bg-success px-4 py-3 font-semibold text-white transition hover:bg-success/90"
          >
            <CheckCircle className="h-4 w-4" />
            Accept Invite
          </button>
          <button
            onClick={() => setShowDeclineModal(true)}
            className="flex items-center justify-center gap-2 rounded-lg border-2 border-danger bg-white px-4 py-3 font-semibold text-danger transition hover:bg-danger/5"
          >
            <X className="h-4 w-4" />
            Decline
          </button>
        </div>
      </motion.div>

      {/* Accept Confirmation Modal */}
      <AnimatePresence>
        {showAcceptModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-midnight/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAcceptModal(false)}
          >
            <motion.div
              className="mx-4 max-w-md rounded-xl bg-white p-6 shadow-xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
                <div>
                  <h4 className="font-display text-lg font-semibold text-midnight">
                    Confirm Interview
                  </h4>
                  <p className="text-sm text-slate">
                    {invite.company} — {invite.jobTitle}
                  </p>
                </div>
              </div>
              <p className="mb-6 text-sm text-slate">
                Confirm your availability for{" "}
                <span className="font-semibold text-midnight">
                  {invite.scheduledFor} at {invite.scheduledTime}
                </span>
                ?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAcceptModal(false)}
                  className="flex-1 rounded-lg border border-slate/20 px-4 py-2 font-semibold text-midnight hover:bg-surface transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAccept}
                  className="flex-1 rounded-lg bg-success px-4 py-2 font-semibold text-white hover:bg-success/90 transition"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decline Reason Modal */}
      <AnimatePresence>
        {showDeclineModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-midnight/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDeclineModal(false)}
          >
            <motion.div
              className="mx-4 max-w-md rounded-xl bg-white p-6 shadow-xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4">
                <h4 className="font-display text-lg font-semibold text-midnight">
                  Decline Interview
                </h4>
                <p className="text-sm text-slate">
                  Provide a reason (optional)
                </p>
              </div>
              <textarea
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="Let the recruiter know why you're declining..."
                className="mb-4 w-full rounded-lg border border-slate/20 p-3 text-sm text-midnight focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                rows={4}
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeclineModal(false)}
                  className="flex-1 rounded-lg border border-slate/20 px-4 py-2 font-semibold text-midnight hover:bg-surface transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDecline}
                  className="flex-1 rounded-lg bg-danger px-4 py-2 font-semibold text-white hover:bg-danger/90 transition"
                >
                  {declineReason ? "Submit & Decline" : "Skip & Decline"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
