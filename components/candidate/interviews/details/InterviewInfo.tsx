"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Video,
  MapPin,
  Monitor,
  Copy,
  CheckCircle,
  Eye,
  EyeOff,
  ExternalLink,
} from "lucide-react";

interface InterviewInfoProps {
  interviewType: "AI Interview" | "Video Call" | "In-Person";
  meetingLink?: string;
  meetingId?: string;
  meetingPassword?: string;
  address?: string;
  instructions?: string[];
}

export default function InterviewInfo({
  interviewType,
  meetingLink,
  meetingId,
  meetingPassword,
  address,
  instructions,
}: InterviewInfoProps) {
  const [linkCopied, setLinkCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleCopyLink = () => {
    if (meetingLink) {
      navigator.clipboard.writeText(meetingLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  const getIcon = () => {
    switch (interviewType) {
      case "AI Interview":
        return Monitor;
      case "Video Call":
        return Video;
      case "In-Person":
        return MapPin;
    }
  };

  const getColor = () => {
    switch (interviewType) {
      case "AI Interview":
        return "text-cyan";
      case "Video Call":
        return "text-primary";
      case "In-Person":
        return "text-success";
    }
  };

  const Icon = getIcon();

  return (
    <div className="space-y-6">
      {/* Mode & Location Card */}
      <motion.div
        className="rounded-xl border border-slate/15 bg-white p-6 shadow-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full bg-${interviewType === "AI Interview" ? "cyan" : interviewType === "Video Call" ? "primary" : "success"}/10`}
          >
            <Icon className={`h-5 w-5 ${getColor()}`} />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-midnight">
              {interviewType}
            </h3>
            <p className="text-sm text-slate">Interview Mode</p>
          </div>
        </div>

        {/* Video Call Details */}
        {interviewType === "Video Call" && meetingLink && (
          <div className="space-y-3">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate">
                Meeting Link
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={meetingLink}
                  readOnly
                  className="flex-1 rounded-lg border border-slate/20 bg-surface px-3 py-2 text-sm text-midnight"
                />
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
                >
                  {linkCopied ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            {meetingId && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate">
                  Meeting ID
                </p>
                <p className="rounded-lg border border-slate/20 bg-surface px-3 py-2 text-sm font-mono text-midnight">
                  {meetingId}
                </p>
              </div>
            )}

            {meetingPassword && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate">
                  Password
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={meetingPassword}
                    readOnly
                    className="flex-1 rounded-lg border border-slate/20 bg-surface px-3 py-2 text-sm font-mono text-midnight"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="flex items-center gap-1.5 rounded-lg border border-slate/20 px-4 py-2 text-sm font-semibold text-midnight transition hover:bg-surface"
                  >
                    {showPassword ? (
                      <>
                        <EyeOff className="h-4 w-4" />
                        Hide
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4" />
                        Show
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* AI Interview Details */}
        {interviewType === "AI Interview" && (
          <div className="rounded-lg border border-cyan/20 bg-cyan/5 p-4">
            <p className="mb-3 text-sm text-midnight">
              Interview will be conducted on the Evalexa platform with
              AI-powered assessments.
            </p>
            <button className="flex items-center gap-2 rounded-lg bg-cyan px-4 py-2 font-semibold text-white transition hover:bg-cyan/90">
              <Monitor className="h-4 w-4" />
              Join AI Interview
            </button>
          </div>
        )}

        {/* In-Person Details */}
        {interviewType === "In-Person" && address && (
          <div className="space-y-3">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate">
                Location
              </p>
              <p className="rounded-lg border border-slate/20 bg-surface px-3 py-2 text-sm text-midnight">
                {address}
              </p>
            </div>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg bg-success px-4 py-2 font-semibold text-white transition hover:bg-success/90"
            >
              <MapPin className="h-4 w-4" />
              Get Directions
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        )}
      </motion.div>

      {/* Instructions Card */}
      {instructions && instructions.length > 0 && (
        <motion.div
          className="rounded-xl border border-slate/15 bg-white p-6 shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="mb-4 font-display text-lg font-semibold text-midnight">
            Interview Instructions
          </h3>
          <ul className="space-y-2">
            {instructions.map((instruction, index) => (
              <li key={index} className="flex gap-3 text-sm text-midnight">
                <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {index + 1}
                </span>
                <span>{instruction}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {!instructions ||
        (instructions.length === 0 && (
          <motion.div
            className="rounded-xl border border-slate/15 bg-white p-6 shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="mb-2 font-display text-lg font-semibold text-midnight">
              Interview Instructions
            </h3>
            <p className="text-sm text-slate">
              No special instructions provided by the recruiter.
            </p>
          </motion.div>
        ))}
    </div>
  );
}
