"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getJobs } from "@/services/job.service";
import {
  bulkShortlistCandidates,
  getRejectedPoolForJob,
  getShortlistedForJob,
  shortlistCandidate,
  shortlistSortParams,
  shortlistTopN,
  unshortlistCandidate,
} from "@/services/application.service";
import {
  DEFAULT_TOP_N,
  MOCK_JOB,
  REJECTED_SEARCH_DEBOUNCE,
  SHORTLIST_PAGE_LIMIT,
  TOAST_DURATION,
} from "@/lib/constants/shortlist.constants";
import {
  canFinalize,
  getCandidateName,
  jobInfoToContext,
  mapRejectedCandidate,
  mapShortlistedCandidate,
  statsApiToStats,
} from "@/lib/helpers/shortlist.helpers";
import type {
  JobContext,
  RejectedCandidate,
  ShortlistPagination,
  ShortlistStats,
  ShortlistedCandidate,
  SortOption,
  ToastState,
} from "@/lib/types/shortlist.types";
import type { JobListRecord } from "@/types/job.types";

const EMPTY_STATS: ShortlistStats = {
  totalShortlisted: 0,
  aiSelected: 0,
  manuallyAdded: 0,
  totalRejected: 0,
  isFinalized: false,
  finalizedAt: null,
};

function errMsg(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong";
}

export function useShortlist() {
  // ── Job list ──────────────────────────────────────────────────────
  const [jobs, setJobs] = useState<JobListRecord[]>([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [isJobsLoading, setIsJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState<string | null>(null);

  // ── Shortlisted list (API) ─────────────────────────────────────────
  const [shortlisted, setShortlisted] = useState<ShortlistedCandidate[]>([]);
  const [shortlistedPagination, setShortlistedPagination] =
    useState<ShortlistPagination | null>(null);
  const [job, setJob] = useState<JobContext>(MOCK_JOB);
  const [stats, setStats] = useState<ShortlistStats>(EMPTY_STATS);
  const [isLoadingShortlisted, setIsLoadingShortlisted] = useState(false);
  const [shortlistedError, setShortlistedError] = useState<string | null>(
    null,
  );

  // ── Rejected / pool list (API) ─────────────────────────────────────
  const [rejected, setRejected] = useState<RejectedCandidate[]>([]);
  const [rejectedPagination, setRejectedPagination] =
    useState<ShortlistPagination | null>(null);
  const [isLoadingRejected, setIsLoadingRejected] = useState(false);
  const [rejectedError, setRejectedError] = useState<string | null>(null);
  const [rejectedSearch, setRejectedSearch] = useState("");

  // ── UI state (local) ───────────────────────────────────────────────
  const [sortBy, setSortBy] = useState<SortOption>("match_score");
  const [showRejectedPanel, setShowRejectedPanel] = useState(false);
  const [selectedRejected, setSelectedRejected] = useState<string[]>([]);
  const [topNValue, setTopNValue] = useState(DEFAULT_TOP_N);
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);
  const [removeConfirmId, setRemoveConfirmId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  /**
   * No finalize endpoint is exposed on the controller yet, so this local
   * flag drives the finalized UX until the backend reports `isFinalized`.
   */
  const [locallyFinalized, setLocallyFinalized] = useState(false);

  // Keep a ref of the current job title so the rejected fetch (which does
  // not return a job block) can still map candidate roles sensibly.
  const jobTitleRef = useRef("");

  // ── Toast helper ──────────────────────────────────────────────────
  const showToast = useCallback(
    (message: string, type: ToastState["type"] = "success") => {
      setToast({ message, type });
      setTimeout(() => setToast(null), TOAST_DURATION);
    },
    [],
  );

  // ── Load job titles ───────────────────────────────────────────────
  useEffect(() => {
    let active = true;

    const loadJobs = async () => {
      setIsJobsLoading(true);
      try {
        const data = await getJobs();
        if (!active) return;

        if (data.length > 0) {
          setJobs(data);
          setJobsError(null);
          setSelectedJobId((prev) =>
            data.some((j) => j.id === prev) ? prev : data[0].id,
          );
        } else {
          setJobsError("No jobs found for your company.");
        }
      } catch (error) {
        if (!active) return;
        setJobsError(errMsg(error));
      } finally {
        if (active) setIsJobsLoading(false);
      }
    };

    void loadJobs();

    return () => {
      active = false;
    };
  }, []);

  // ── Reset UI state when the selected job changes ───────────────────
  useEffect(() => {
    setLocallyFinalized(false);
    setSelectedRejected([]);
    setRemoveConfirmId(null);
    setShowRejectedPanel(false);
  }, [selectedJobId]);

  // Keep the title ref in sync with the jobs list / API job block.
  useEffect(() => {
    const fromList = jobs.find((j) => j.id === selectedJobId)?.title;
    jobTitleRef.current =
      fromList ?? (job.id === selectedJobId ? job.title : "") ?? "";
  }, [jobs, selectedJobId, job]);

  // ── Fetch shortlisted list ────────────────────────────────────────
  const fetchShortlisted = useCallback(
    async (jobId: string, sortByValue: SortOption) => {
      setIsLoadingShortlisted(true);
      setShortlistedError(null);
      try {
        const { sortBy: sb, order } = shortlistSortParams(sortByValue);
        const res = await getShortlistedForJob(jobId, {
          page: 1,
          limit: SHORTLIST_PAGE_LIMIT,
          sortBy: sb,
          order,
        });

        const jobTitle = res.data.job.title;
        setJob(jobInfoToContext(res.data.job));
        setShortlisted(
          res.data.candidates.map((c) => mapShortlistedCandidate(c, jobTitle)),
        );
        setStats(statsApiToStats(res.data.stats));
        setShortlistedPagination(res.data.pagination);
      } catch (error) {
        setShortlistedError(errMsg(error));
        setShortlisted([]);
        setStats(EMPTY_STATS);
      } finally {
        setIsLoadingShortlisted(false);
      }
    },
    [],
  );

  // ── Fetch rejected / pool list ────────────────────────────────────
  const fetchRejected = useCallback(
    async (jobId: string, search: string) => {
      setIsLoadingRejected(true);
      setRejectedError(null);
      try {
        const res = await getRejectedPoolForJob(jobId, {
          page: 1,
          limit: SHORTLIST_PAGE_LIMIT,
          sortBy: "match_score",
          order: "desc",
          search: search.trim() || undefined,
        });

        const jobTitle = jobTitleRef.current || "Candidate";
        setRejected(
          res.data.candidates.map((c) => mapRejectedCandidate(c, jobTitle)),
        );
        setRejectedPagination(res.data.pagination);
      } catch (error) {
        setRejectedError(errMsg(error));
        setRejected([]);
      } finally {
        setIsLoadingRejected(false);
      }
    },
    [],
  );

  // Refetch shortlisted when the job or sort changes.
  useEffect(() => {
    if (!selectedJobId) {
      setShortlisted([]);
      setStats(EMPTY_STATS);
      setJob(MOCK_JOB);
      return;
    }
    void fetchShortlisted(selectedJobId, sortBy);
  }, [selectedJobId, sortBy, fetchShortlisted]);

  // Refetch rejected (debounced) when the job or search changes.
  useEffect(() => {
    if (!selectedJobId) {
      setRejected([]);
      return;
    }

    const handle = setTimeout(() => {
      void fetchRejected(selectedJobId, rejectedSearch);
    }, REJECTED_SEARCH_DEBOUNCE);

    return () => clearTimeout(handle);
  }, [selectedJobId, rejectedSearch, fetchRejected]);

  // ── Refresh both lists after a mutation ───────────────────────────
  const refresh = useCallback(() => {
    if (!selectedJobId) return;
    void fetchShortlisted(selectedJobId, sortBy);
    void fetchRejected(selectedJobId, rejectedSearch);
  }, [fetchRejected, fetchShortlisted, rejectedSearch, selectedJobId, sortBy]);

  // ── Derived values ────────────────────────────────────────────────
  const isFinalized = stats.isFinalized || locallyFinalized;

  const removeConfirmName = useMemo(
    () => getCandidateName(removeConfirmId, shortlisted),
    [removeConfirmId, shortlisted],
  );

  const isFinalizeEnabled = useMemo(
    () => canFinalize(shortlisted, isFinalized),
    [shortlisted, isFinalized],
  );

  // ── Selection helpers ─────────────────────────────────────────────
  const toggleSelectRejected = useCallback((id: string) => {
    setSelectedRejected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }, []);

  const clearSelectedRejected = useCallback(() => {
    setSelectedRejected([]);
  }, []);

  // ── Actions ────────────────────────────────────────────────────────
  const handleRemoveFromShortlist = useCallback(
    async (id: string) => {
      setRemoveConfirmId(null);
      setActionLoading(true);
      try {
        await unshortlistCandidate(id);
        showToast("Candidate moved back to the pool");
        refresh();
      } catch (error) {
        showToast(errMsg(error) || "Failed to remove candidate", "error");
      } finally {
        setActionLoading(false);
      }
    },
    [refresh, showToast],
  );

  const handleManualShortlist = useCallback(
    async (id: string) => {
      setActionLoading(true);
      try {
        await shortlistCandidate(id);
        showToast("Candidate added to shortlist");
        setSelectedRejected((prev) => prev.filter((x) => x !== id));
        refresh();
      } catch (error) {
        showToast(errMsg(error) || "Failed to shortlist candidate", "error");
      } finally {
        setActionLoading(false);
      }
    },
    [refresh, showToast],
  );

  const handleTopNShortlist = useCallback(async () => {
    setActionLoading(true);
    try {
      const res = await shortlistTopN(selectedJobId, topNValue);
      if (res.shortlisted > 0) {
        showToast(
          `${res.shortlisted} candidate${res.shortlisted === 1 ? "" : "s"} added to shortlist`,
        );
      } else if (res.skippedReason === "RANKING_NOT_READY") {
        showToast("Ranking is not ready yet", "info");
      } else if (res.skippedReason === "NO_QUALIFIED_APPLICATIONS") {
        showToast("No qualified candidates to shortlist", "info");
      }
      refresh();
    } catch (error) {
      showToast(errMsg(error) || "Failed to shortlist top candidates", "error");
    } finally {
      setActionLoading(false);
    }
  }, [refresh, selectedJobId, showToast, topNValue]);

  const handleBulkShortlist = useCallback(async () => {
    if (selectedRejected.length === 0) return;
    setActionLoading(true);
    try {
      const res = await bulkShortlistCandidates(selectedJobId, selectedRejected);
      showToast(res.message, res.failedCount > 0 ? "info" : "success");
      setSelectedRejected([]);
      refresh();
    } catch (error) {
      showToast(errMsg(error) || "Failed to bulk shortlist", "error");
    } finally {
      setActionLoading(false);
    }
  }, [refresh, selectedJobId, selectedRejected, showToast]);

  const handleFinalize = useCallback(() => {
    setShowFinalizeModal(false);
    setShowRejectedPanel(false);
    setLocallyFinalized(true);
    showToast(
      `Shortlist finalized! ${shortlisted.length} candidate${shortlisted.length === 1 ? "" : "s"} notified.`,
    );
  }, [shortlisted.length, showToast]);

  const handleSaveDraft = useCallback(() => {
    showToast(`Draft saved for ${job.title || "this job"}`);
  }, [job.title, showToast]);

  return {
    // job list
    job,
    jobs,
    selectedJobId,
    setSelectedJobId,
    isJobsLoading,
    jobsError,

    // shortlisted list
    shortlisted,
    shortlistedPagination,
    isLoadingShortlisted,
    shortlistedError,

    // rejected / pool
    rejected,
    rejectedPagination,
    isLoadingRejected,
    rejectedError,
    rejectedSearch,
    setRejectedSearch,

    // stats + finalize
    stats,
    isFinalized,
    isFinalizeEnabled,

    // UI state
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
    actionLoading,
    toast,

    // actions
    handleRemoveFromShortlist,
    handleManualShortlist,
    handleTopNShortlist,
    handleBulkShortlist,
    handleFinalize,
    handleSaveDraft,
  };
}
