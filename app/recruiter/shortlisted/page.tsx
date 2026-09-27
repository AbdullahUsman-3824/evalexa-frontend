"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, Star, CheckCircle, ChevronDown } from "lucide-react";
import { useShortlist } from "@/hooks/useShortlist";
import { SORT_OPTIONS } from "@/lib/constants/shortlist.constants";
import ShortlistedCard from "@/components/recruiter/shortlisted/ShortlistedCard";
import RejectedPanel from "@/components/recruiter/shortlisted/RejectedPanel";
import FinalizeBar from "@/components/recruiter/shortlisted/FinalizeBar";
import FinalizeModal from "@/components/recruiter/shortlisted/FinalizeModal";
import RemoveConfirmModal from "@/components/recruiter/shortlisted/RemoveConfirmModal";
import SummaryBanner from "@/components/recruiter/shortlisted/SummaryBanner";
import JobContextBar from "@/components/recruiter/shortlisted/JobContextBar";

export default function ShortlistedPage() {
  const {
    job,
    jobs,
    selectedJobId,
    setSelectedJobId,
    isJobsLoading,
    jobsError,
    shortlisted,
    rejected,
    stats,
    showRejectedPanel,
    setShowRejectedPanel,
    selectedRejected,
    toggleSelectRejected,
    clearSelectedRejected,
    topNValue,
    setTopNValue,
    showFinalizeModal,
    setShowFinalizeModal,
    removeConfirmId,
    setRemoveConfirmId,
    removeConfirmName,
    sortBy,
    setSortBy,
    isFinalized,
    toast,
    handleRemoveFromShortlist,
    handleManualShortlist,
    handleTopNShortlist,
    handleBulkShortlist,
    handleFinalize,
    handleSaveDraft,
  } = useShortlist();

  const activeJobLabel =
    jobs.find((candidateJob) => candidateJob.id === selectedJobId)?.title ??
    job.title;

  return (
    <div className="min-h-screen bg-[#F4F7FF] pb-28">
      {/* ── Toast ──────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={`fixed top-5 right-5 z-60 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-white text-[13px] font-medium max-w-xs ${
              toast.type === "error"
                ? "bg-[#E63946]"
                : toast.type === "info"
                  ? "bg-[#1E6FFF]"
                  : "bg-[#00B37E]"
            }`}
          >
            <CheckCircle size={15} className="shrink-0" />
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Page header ────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-[#E2E8F0] px-6 py-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <button className="flex items-center gap-1 text-[#6B7A99] text-[12px] hover:text-[#0D1B2A] mb-2 transition-colors w-fit">
              <ChevronLeft size={14} />
              Back to {activeJobLabel}
            </button>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-syne text-[20px] font-bold text-[#0D1B2A]">
                Shortlisted Candidates
              </h1>
              {jobsError && (
                <span className="rounded-full bg-[#FFF3E0] px-3 py-1 text-[11px] font-medium text-[#854F0B]">
                  {jobsError}
                </span>
              )}
            </div>
            <span className="text-[#6B7A99] text-[13px]">
              {job.company} · {job.department}
            </span>
          </div>

          <label className="flex min-w-65 flex-col gap-1">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-[#6B7A99]">
              Select job
            </span>
            <div className="relative">
              <select
                value={
                  jobs.some((candidateJob) => candidateJob.id === selectedJobId)
                    ? selectedJobId
                    : ""
                }
                onChange={(event) => setSelectedJobId(event.target.value)}
                className="h-11 w-full appearance-none rounded-xl border border-[#E2E8F0] bg-white px-4 pr-10 text-sm font-medium text-[#0D1B2A] outline-none transition-colors hover:border-[#1E6FFF] focus:border-[#1E6FFF]"
                disabled={isJobsLoading && jobs.length === 0}
              >
                {jobs.length === 0 && (
                  <option value="" disabled>
                    Loading jobs...
                  </option>
                )}
                {jobs.map((candidateJob) => (
                  <option key={candidateJob.id} value={candidateJob.id}>
                    {candidateJob.title} · {candidateJob.applications}{" "}
                    applicants
                  </option>
                ))}
              </select>
              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7A99]"
              />
            </div>
          </label>
        </div>
      </div>

      {/* ── Content ────────────────────────────────────────────────────────── */}
      <div className="px-6 pt-4 pb-2 space-y-3">
        {/* Job context + finalize status */}
        <JobContextBar
          job={job}
          stats={stats}
          rejectedCount={rejected.length}
          showRejectedPanel={showRejectedPanel}
          onViewRejected={() => setShowRejectedPanel(!showRejectedPanel)}
        />

        {/* Status banner — only shows when finalized */}
        {isFinalized && (
          <SummaryBanner stats={stats} isFinalized={isFinalized} />
        )}

        {/* Main columns */}
        <div className="flex gap-4 items-start">
          {/* ── Candidate list ──────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Sort + count row */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-[#0D1B2A] text-[13px] font-medium">
                {shortlisted.length} candidate
                {shortlisted.length !== 1 ? "s" : ""}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[#6B7A99] text-[12px]">Sort:</span>
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSortBy(opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-150 ${
                      sortBy === opt.value
                        ? "bg-[#1E6FFF] text-white"
                        : "bg-white border border-[#E2E8F0] text-[#6B7A99] hover:border-[#1E6FFF] hover:text-[#1E6FFF]"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Cards */}
            {shortlisted.length === 0 ? (
              <div className="bg-white rounded-xl border border-[#E2E8F0] py-16 text-center">
                <div className="w-12 h-12 bg-[#F4F7FF] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star size={22} className="text-[#CBD5E1]" />
                </div>
                <p className="font-syne text-[15px] font-semibold text-[#0D1B2A]">
                  No candidates shortlisted yet
                </p>
                <p className="text-[#6B7A99] text-[13px] mt-1.5 max-w-xs mx-auto">
                  Open the rejected panel to manually add candidates the AI
                  missed
                </p>
                <button
                  onClick={() => setShowRejectedPanel(true)}
                  className="mt-5 inline-flex items-center gap-1.5 bg-[#1E6FFF] text-white text-[13px] font-medium px-5 py-2.5 rounded-xl hover:bg-[#1660E0] transition-colors"
                >
                  View Rejected Candidates
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {shortlisted.map((candidate, i) => (
                  <ShortlistedCard
                    key={candidate.id}
                    candidate={candidate}
                    onRemove={setRemoveConfirmId}
                    isFinalized={isFinalized}
                    index={i}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ── Rejected panel ──────────────────────────────────────────────── */}
          <AnimatePresence>
            {showRejectedPanel && (
              <RejectedPanel
                rejected={rejected}
                selectedIds={selectedRejected}
                topNValue={topNValue}
                onClose={() => setShowRejectedPanel(false)}
                onTopNChange={setTopNValue}
                onApplyTopN={handleTopNShortlist}
                onToggleSelect={toggleSelectRejected}
                onBulkShortlist={handleBulkShortlist}
                onClearSelection={clearSelectedRejected}
                onManualShortlist={handleManualShortlist}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Modals ─────────────────────────────────────────────────────────── */}
      <RemoveConfirmModal
        candidateId={removeConfirmId}
        candidateName={removeConfirmName}
        onConfirm={handleRemoveFromShortlist}
        onCancel={() => setRemoveConfirmId(null)}
      />

      <FinalizeModal
        isOpen={showFinalizeModal}
        stats={stats}
        onConfirm={handleFinalize}
        onCancel={() => setShowFinalizeModal(false)}
      />

      {/* ── Finalize bar ───────────────────────────────────────────────────── */}
      <FinalizeBar
        stats={stats}
        isFinalized={isFinalized}
        onSaveDraft={handleSaveDraft}
        onFinalize={() => setShowFinalizeModal(true)}
      />
    </div>
  );
}
