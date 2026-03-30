"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Eye,
  Download,
  Upload,
  Trash2,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

interface ResumeDetails {
  name: string;
  sizeLabel: string;
  uploadedAtLabel: string;
  lastAnalyzedLabel: string;
  score: number;
}

interface ResumeCardProps {
  resume: ResumeDetails;
  onView: () => void;
  onDownload: () => void;
  onReplace: () => void;
  onDelete: () => void;
}

export default function ResumeCard({
  resume,
  onView,
  onDownload,
  onReplace,
  onDelete,
}: ResumeCardProps) {
  return (
    <div className="rounded-3xl border border-slate/15 bg-white shadow-sm">
      <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-danger/10">
            <FileText className="h-8 w-8 text-danger" />
          </div>

          <div>
            <p className="font-display text-xl text-midnight">
              {resume.name}
            </p>
            <p className="text-sm text-slate">
              {resume.sizeLabel} • {resume.uploadedAtLabel}
            </p>
            <p className="text-sm text-slate/80">
              Last analyzed {resume.lastAnalyzedLabel}
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-wrap items-center gap-3 lg:justify-end">
          <button
            onClick={onView}
            className="inline-flex items-center gap-2 rounded-full border border-slate/20 px-4 py-2 text-sm font-semibold text-midnight transition hover:border-midnight/40"
          >
            <Eye className="h-4 w-4" />
            View
          </button>
          <button
            onClick={onDownload}
            className="inline-flex items-center gap-2 rounded-full border border-slate/20 px-4 py-2 text-sm font-semibold text-midnight transition hover:border-midnight/40"
          >
            <Download className="h-4 w-4" />
            Download
          </button>
          <button
            onClick={onReplace}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-primary/30 transition hover:bg-primary/90"
          >
            <Upload className="h-4 w-4" />
            Replace
          </button>
          <button
            onClick={onDelete}
            className="inline-flex items-center gap-2 rounded-full border border-danger/30 px-4 py-2 text-sm font-semibold text-danger transition hover:bg-danger/5"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      <div className="border-t border-slate/10 p-6">
        <div className="grid gap-4 lg:grid-cols-[1fr,200px] lg:items-center">
          <div className="rounded-2xl bg-gradient-to-r from-midnight to-[#1A2E45] p-5 text-white">
            <div className="flex items-center justify-between">
              <p className="font-display text-lg">Resume Score</p>
              <span className="rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
                {resume.score}/100
              </span>
            </div>
            <div className="mt-4 h-2 rounded-full bg-white/20">
              <motion.div
                className="h-full rounded-full bg-cyan"
                initial={{ width: 0 }}
                animate={{ width: `${resume.score}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
            <Link
              href="/resume/analysis"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan"
            >
              View Full AI Analysis
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="rounded-2xl border border-slate/15 bg-surface p-4">
            <p className="text-sm font-semibold text-midnight">
              AI highlights
            </p>
            <p className="mt-2 text-sm text-slate">
              Strong experience with product design systems. Consider adding
              quantified wins for recent roles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
