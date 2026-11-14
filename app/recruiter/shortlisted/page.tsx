"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  Star,
  CheckCircle,
  ChevronDown,
  Loader2,
  Sparkles,
  Users,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useShortlist } from "@/hooks/useShortlist";
import { SORT_OPTIONS } from "@/lib/constants/shortlist.constants";
import ShortlistedCard from "@/components/recruiter/shortlisted/ShortlistedCard";
import RejectedPanel from "@/components/recruiter/shortlisted/RejectedPanel";
import FinalizeBar from "@/components/recruiter/shortlisted/FinalizeBar";
import FinalizeModal from "@/components/recruiter/shortlisted/FinalizeModal";
import RemoveConfirmModal from "@/components/recruiter/shortlisted/RemoveConfirmModal";

export default function ShortlistedPage() {
  const router = useRouter();
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
    isFinalizing,
    toast,
    isLoadingShortlisted,
    isLoadingRejected,
    rejectedSearch,
    setRejectedSearch,
    shortlistedError,
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

  const handleBack = () => {
    if (selectedJobId) {
      router.push(`/recruiter/jobs/${selectedJobId}`);
    } else {
      router.back();
    }
  };

  return (
    // The recruiter layout already renders a 4rem top bar, so this fills the
    // remaining viewport height exactly (no extra scrolling / dead space).
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-[#F4F7FF]">
      {/* ── Toast ──────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={`fixed top-20 right-5 z-60 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-white text-[13px] font-medium max-w-xs ${
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
      <header className="border-b border-[#E2E8F0] bg-white px-4 py-4 sm:px-6">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <button
              type="button"
              onClick={handleBack}
              className="mb-1.5 inline-flex items-center gap-1 text-[12px] text-[#6B7A99] transition-colors hover:text-[#0D1B2A]"
            >
              <ChevronLeft size={14} />
              Back to {activeJobLabel}
            </button>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-syne text-[20px] font-bold leading-tight text-[#0D1B2A]">
                Shortlisted Candidates
              </h1>
              {jobsError && (
                <span className="rounded-full bg-[#FFF3E0] px-3 py-1 text-[11px] font-medium text-[#854F0B]">
                  {jobsError}
                </span>
              )}
            </div>
            <p className="mt-0.5 text-[13px] text-[#6B7A99]">
              {job.company} · {job.department} · {job.applicantsCount}{" "}
              applicants
            </p>
          </div>

          <label className="flex w-full flex-col gap-1 sm:w-72">
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
                className="h-10 w-full appearance-none rounded-xl border border-[#E2E8F0] bg-white px-4 pr-10 text-sm font-medium text-[#0D1B2A] outline-none transition-colors hover:border-[#1E6FFF] focus:border-[#1E6FFF]"
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
      </header>

      {/* ── Content ────────────────────────────────────────────────────────── */}
      <main className="flex flex-1 flex-col px-4 py-5 sm:px-6">
        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4">
          {/* Toolbar: stats · sort · candidate pool toggle */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#E1F5EE] px-3 py-1 text-[12px] font-medium text-[#0F6E56]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00B37E]" />
                {stats.totalShortlisted} shortlisted
              </span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[#E2E8F0] bg-white px-3 py-1 text-[12px] font-medium text-[#6B7A99]">
                <Sparkles size={11} className="text-[#00C2D1]" />
                {stats.aiSelected} by AI · {stats.manuallyAdded} manual
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {shortlisted.length > 1 && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[12px] text-[#6B7A99]">Sort:</span>
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSortBy(opt.value)}
                      className={`rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all duration-150 ${
                        sortBy === opt.value
                          ? "bg-[#1E6FFF] text-white"
                          : "border border-[#E2E8F0] bg-white text-[#6B7A99] hover:border-[#1E6FFF] hover:text-[#1E6FFF]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowRejectedPanel(!showRejectedPanel)}
                className={`inline-flex items-center gap-2 whitespace-nowrap rounded-xl border px-4 py-1.5 text-[13px] font-medium transition-all duration-200 ${
                  showRejectedPanel
                    ? "border-[#1E6FFF] bg-[#EEF4FF] text-[#1E6FFF]"
                    : "border-[#E2E8F0] bg-white text-[#6B7A99] hover:border-[#1E6FFF] hover:text-[#1E6FFF]"
                }`}
              >
                {showRejectedPanel ? (
                  <XCircle size={14} />
                ) : (
                  <Users size={14} />
                )}
                {showRejectedPanel
                  ? "Close Panel"
                  : `Rejected (${stats.totalRejected})`}
              </button>
            </div>
          </div>

          {/* Main columns */}
          <div className="flex flex-1 flex-col gap-4 lg:flex-row lg:items-start">
            {/* ── Candidate list ──────────────────────────────────────────── */}
            <section className="flex min-w-0 flex-1 flex-col self-stretch">
              {isLoadingShortlisted ? (
                <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-[#E2E8F0] bg-white p-8">
                  <Loader2 className="h-6 w-6 animate-spin text-[#1E6FFF]" />
                  <p className="mt-3 text-[13px] text-[#6B7A99]">
                    Loading shortlisted candidates…
                  </p>
                </div>
              ) : shortlistedError ? (
                <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-[#E63946]/30 bg-white p-8 text-center">
                  <p className="font-syne text-[15px] font-semibold text-[#E63946]">
                    Failed to load shortlisted candidates
                  </p>
                  <p className="mt-1.5 text-[13px] text-[#6B7A99]">
                    {shortlistedError}
                  </p>
                </div>
              ) : shortlisted.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-[#E2E8F0] bg-white p-8 text-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#F4F7FF]">
                    <Star size={22} className="text-[#CBD5E1]" />
                  </div>
                  <p className="font-syne text-[15px] font-semibold text-[#0D1B2A]">
                    No candidates shortlisted yet
                  </p>
                  <p className="mx-auto mt-1.5 max-w-xs text-[13px] text-[#6B7A99]">
                    Open the candidate pool to manually add candidates the AI
                    missed
                  </p>
                  <button
                    onClick={() => setShowRejectedPanel(true)}
                    className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-[#1E6FFF] px-5 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-[#1660E0]"
                  >
                    View Candidate Pool
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
            </section>

            {/* ── Candidate pool / rejected panel ─────────────────────────── */}
            <AnimatePresence>
              {showRejectedPanel && (
                <RejectedPanel
                  rejected={rejected}
                  selectedIds={selectedRejected}
                  topNValue={topNValue}
                  search={rejectedSearch}
                  isLoading={isLoadingRejected}
                  onClose={() => setShowRejectedPanel(false)}
                  onTopNChange={setTopNValue}
                  onApplyTopN={handleTopNShortlist}
                  onToggleSelect={toggleSelectRejected}
                  onBulkShortlist={handleBulkShortlist}
                  onClearSelection={clearSelectedRejected}
                  onManualShortlist={handleManualShortlist}
                  onSearchChange={setRejectedSearch}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

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
        isLoading={isFinalizing}
        onConfirm={handleFinalize}
        onCancel={() => setShowFinalizeModal(false)}
      />

      {/* ── Finalize bar (sticks to the bottom of the viewport) ────────────── */}
      <FinalizeBar
        stats={stats}
        isFinalized={isFinalized}
        onSaveDraft={handleSaveDraft}
        onFinalize={() => setShowFinalizeModal(true)}
        onScheduleInterviews={() =>
          router.push("/recruiter/interviews/invites")
        }
      />
    </div>
  );
}