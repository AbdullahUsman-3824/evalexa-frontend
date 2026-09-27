"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getJob, getJobs } from "@/services/job.service";
import {
  DEFAULT_TOP_N,
  MOCK_JOB,
  TOAST_DURATION,
} from "@/lib/constants/shortlist.constants";
import {
  calculateStats,
  canFinalize,
  getCandidateName,
  getTopNRejected,
  sortShortlisted,
  toRejected,
  toShortlisted,
} from "@/lib/helpers/shortlist.helpers";
import type {
  JobContext,
  RejectedCandidate,
  ShortlistedCandidate,
  ShortlistStats,
  SortOption,
  ToastState,
} from "@/lib/types/shortlist.types";
import type { JobListRecord, JobRecord } from "@/types/job.types";

interface ShortlistJobState {
  shortlisted: ShortlistedCandidate[];
  rejected: RejectedCandidate[];
  showRejectedPanel: boolean;
  selectedRejected: string[];
  topNValue: number;
  isFinalized: boolean;
  showFinalizeModal: boolean;
  removeConfirmId: string | null;
  sortBy: SortOption;
}

const FALLBACK_JOBS: JobListRecord[] = [
  {
    id: "job-1",
    title: "Frontend Developer",
    applicationDeadline: "2026-10-15",
    status: "OPEN",
    applications: 42,
  },
  {
    id: "job-2",
    title: "Backend Engineer",
    applicationDeadline: "2026-10-18",
    status: "OPEN",
    applications: 31,
  },
  {
    id: "job-3",
    title: "Product Designer",
    applicationDeadline: "2026-10-22",
    status: "OPEN",
    applications: 27,
  },
];

const FALLBACK_JOB_CONTEXTS: Record<string, JobContext> = {
  "job-1": {
    id: "job-1",
    title: "Frontend Developer",
    company: "TechCorp Inc.",
    department: "Engineering",
    applicantsCount: 42,
  },
  "job-2": {
    id: "job-2",
    title: "Backend Engineer",
    company: "TechCorp Inc.",
    department: "Platform",
    applicantsCount: 31,
  },
  "job-3": {
    id: "job-3",
    title: "Product Designer",
    company: "TechCorp Inc.",
    department: "Design",
    applicantsCount: 27,
  },
};

const SHORTLIST_NAMES = [
  "Ayesha Khan",
  "Usman Hassan",
  "Sara Malik",
  "Ali Raza",
  "Hina Shah",
  "Bilal Ahmed",
  "Mariam Iqbal",
  "Omar Farooq",
];

const REJECTED_NAMES = [
  "Kamran Iqbal",
  "Zara Siddiqui",
  "Noor Fatima",
  "Saad Rahman",
  "Hira Iqbal",
  "Taimur Abbas",
  "Kiran Bashir",
  "Fahad Ali",
];

const SHORTLIST_ROLES = ["Lead", "Engineer", "Specialist", "Associate"];
const REJECTED_ROLES = ["Junior", "Associate", "Apprentice", "Trainee"];

const SHORTLIST_COLORS = [
  "from-[#1E6FFF] to-[#00C2D1]",
  "from-[#00C2D1] to-[#00B37E]",
  "from-[#FF9500] to-[#E63946]",
  "from-[#534AB7] to-[#1E6FFF]",
];

const REJECTED_COLORS = [
  "from-[#6B7A99] to-[#4A5568]",
  "from-[#00B37E] to-[#00C2D1]",
  "from-[#FF9500] to-[#1E6FFF]",
  "from-[#E63946] to-[#FF9500]",
];

const JOB_SKILLS: Record<string, string[]> = {
  frontend: ["React", "TypeScript", "Next.js", "Tailwind"],
  backend: ["Node.js", "NestJS", "PostgreSQL", "Redis"],
  design: ["Figma", "UX Research", "Wireframing", "Design Systems"],
  product: [
    "Roadmapping",
    "Stakeholder Communication",
    "Analytics",
    "Prioritization",
  ],
  general: ["Communication", "Problem Solving", "Ownership", "Collaboration"],
};

function hashString(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function rotate<T>(items: T[], offset: number) {
  if (items.length === 0) return items;
  return items.map((_, index) => items[(index + offset) % items.length] as T);
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part.trim().charAt(0))
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getJobSkills(title: string) {
  const normalized = title.toLowerCase();
  if (
    normalized.includes("frontend") ||
    normalized.includes("ui") ||
    normalized.includes("react")
  ) {
    return JOB_SKILLS.frontend;
  }
  if (
    normalized.includes("backend") ||
    normalized.includes("api") ||
    normalized.includes("node")
  ) {
    return JOB_SKILLS.backend;
  }
  if (normalized.includes("design") || normalized.includes("product")) {
    return JOB_SKILLS.design;
  }
  if (normalized.includes("data") || normalized.includes("analytics")) {
    return JOB_SKILLS.product;
  }
  return JOB_SKILLS.general;
}

function buildShortlistedCandidates(job: JobContext): ShortlistedCandidate[] {
  const seed = hashString(`${job.id}:${job.title}`);
  const names = rotate(SHORTLIST_NAMES, seed % SHORTLIST_NAMES.length);
  const skills = getJobSkills(job.title);

  return names.slice(0, 4).map((name, index) => ({
    id: `${job.id}-shortlisted-${index + 1}`,
    name,
    initials: getInitials(name),
    role: `${job.title} ${SHORTLIST_ROLES[index] ?? "Specialist"}`,
    avatarColor:
      SHORTLIST_COLORS[(seed + index) % SHORTLIST_COLORS.length] ??
      SHORTLIST_COLORS[0],
    matchScore: Math.max(76, 95 - index * 3 - (seed % 4)),
    skills: skills.slice(0, 3 + (index % 2)),
    experience:
      ["5 years", "4 years", "3 years", "2 years"][index] ?? "2 years",
    source: index < 3 ? "ai_shortlisted" : "manually_added",
  }));
}

function buildRejectedCandidates(job: JobContext): RejectedCandidate[] {
  const seed = hashString(`rejected:${job.id}:${job.title}`);
  const names = rotate(REJECTED_NAMES, seed % REJECTED_NAMES.length);
  const skills = getJobSkills(job.title);

  return names.slice(0, 5).map((name, index) => ({
    id: `${job.id}-rejected-${index + 1}`,
    name,
    initials: getInitials(name),
    role: `${job.title} ${REJECTED_ROLES[index] ?? "Candidate"}`,
    avatarColor:
      REJECTED_COLORS[(seed + index) % REJECTED_COLORS.length] ??
      REJECTED_COLORS[0],
    matchScore: Math.max(45, 72 - index * 4 - (seed % 5)),
    skills: skills.slice(0, 2 + (index % 2)),
    experience:
      ["2 years", "1.5 years", "1 year", "10 months", "6 months"][index] ??
      "1 year",
    rejectedSource: index === 2 ? "manually_rejected" : "ai_rejected",
  }));
}

function buildDefaultJobState(job: JobContext): ShortlistJobState {
  return {
    shortlisted: buildShortlistedCandidates(job),
    rejected: buildRejectedCandidates(job),
    showRejectedPanel: false,
    selectedRejected: [],
    topNValue: DEFAULT_TOP_N,
    isFinalized: false,
    showFinalizeModal: false,
    removeConfirmId: null,
    sortBy: "match_score",
  };
}

function resolveStateValue<T>(
  nextValue: React.SetStateAction<T>,
  previousValue: T,
) {
  return typeof nextValue === "function"
    ? (nextValue as (currentValue: T) => T)(previousValue)
    : nextValue;
}

function buildDerivedJobContext(
  jobId: string,
  jobSummary: JobListRecord | null,
) {
  const fallback = FALLBACK_JOB_CONTEXTS[jobId];
  if (fallback) return fallback;

  return {
    id: jobId,
    title: jobSummary?.title ?? MOCK_JOB.title,
    company: MOCK_JOB.company,
    department: MOCK_JOB.department,
    applicantsCount: jobSummary?.applications ?? MOCK_JOB.applicantsCount,
  };
}

function toJobContext(
  job: JobRecord,
  fallbackApplicantsCount: number,
): JobContext {
  return {
    id: job.id,
    title: job.title,
    company: job.company?.name ?? MOCK_JOB.company,
    department: job.department || MOCK_JOB.department,
    applicantsCount: fallbackApplicantsCount,
  };
}

export function useShortlist() {
  const [jobs, setJobs] = useState<JobListRecord[]>([]);
  const [selectedJobId, setSelectedJobId] = useState(MOCK_JOB.id);
  const [jobContexts, setJobContexts] = useState<Record<string, JobContext>>(
    {},
  );
  const [jobStates, setJobStates] = useState<Record<string, ShortlistJobState>>(
    {},
  );
  const [isJobsLoading, setIsJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState<string | null>(null);
  const [usingFallbackJobs, setUsingFallbackJobs] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [rejectedSearch, setRejectedSearch] = useState("");

  useEffect(() => {
    let isActive = true;

    const loadJobs = async () => {
      setIsJobsLoading(true);

      try {
        const data = await getJobs();
        if (!isActive) return;

        if (data.length > 0) {
          setJobs(data);
          setJobsError(null);
          setUsingFallbackJobs(false);
          setSelectedJobId((previous) =>
            data.some((job) => job.id === previous) ? previous : data[0].id,
          );
        } else {
          setJobs(FALLBACK_JOBS);
          setJobsError(
            "No jobs returned from the server. Showing sample job data.",
          );
          setUsingFallbackJobs(true);
          setSelectedJobId((previous) => previous || FALLBACK_JOBS[0].id);
        }
      } catch {
        if (!isActive) return;

        setJobs(FALLBACK_JOBS);
        setJobsError("Could not load live jobs. Showing sample job data.");
        setUsingFallbackJobs(true);
        setSelectedJobId((previous) => previous || FALLBACK_JOBS[0].id);
      } finally {
        if (isActive) {
          setIsJobsLoading(false);
        }
      }
    };

    void loadJobs();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedJobId) return;

    const cached = jobContexts[selectedJobId];
    if (cached) return;

    const selectedSummary =
      jobs.find((job) => job.id === selectedJobId) ?? null;
    let isActive = true;

    const loadJobContext = async () => {
      if (usingFallbackJobs) {
        if (!isActive) return;
        setJobContexts((prev) => ({
          ...prev,
          [selectedJobId]: buildDerivedJobContext(
            selectedJobId,
            selectedSummary,
          ),
        }));
        return;
      }

      try {
        const job = await getJob(selectedJobId);
        if (!isActive) return;
        setJobContexts((prev) => ({
          ...prev,
          [selectedJobId]: toJobContext(
            job,
            selectedSummary?.applications ?? job.applications ?? 0,
          ),
        }));
      } catch {
        if (!isActive) return;
        setJobContexts((prev) => ({
          ...prev,
          [selectedJobId]: buildDerivedJobContext(
            selectedJobId,
            selectedSummary,
          ),
        }));
      }
    };

    void loadJobContext();

    return () => {
      isActive = false;
    };
  }, [jobContexts, jobs, selectedJobId, usingFallbackJobs]);

  useEffect(() => {
    if (!jobs.length) return;

    setSelectedJobId((previous) =>
      jobs.some((job) => job.id === previous) ? previous : jobs[0].id,
    );
  }, [jobs]);

  const currentJobSummary = useMemo(
    () => jobs.find((job) => job.id === selectedJobId) ?? jobs[0] ?? null,
    [jobs, selectedJobId],
  );

  const job = useMemo<JobContext>(() => {
    return (
      jobContexts[selectedJobId] ??
      buildDerivedJobContext(selectedJobId, currentJobSummary)
    );
  }, [currentJobSummary, jobContexts, selectedJobId]);

  const currentState = useMemo<ShortlistJobState>(
    () => jobStates[selectedJobId] ?? buildDefaultJobState(job),
    [job, jobStates, selectedJobId],
  );

  const updateCurrentJobState = useCallback(
    (updater: (currentState: ShortlistJobState) => ShortlistJobState) => {
      setJobStates((prev) => {
        const existing = prev[selectedJobId] ?? buildDefaultJobState(job);
        return {
          ...prev,
          [selectedJobId]: updater(existing),
        };
      });
    },
    [job, selectedJobId],
  );

  const shortlisted = useMemo(
    () => sortShortlisted(currentState.shortlisted, currentState.sortBy),
    [currentState.shortlisted, currentState.sortBy],
  );

  const rejected = currentState.rejected;

  const stats: ShortlistStats = useMemo(
    () => calculateStats(shortlisted, rejected),
    [shortlisted, rejected],
  );

  const removeConfirmName = useMemo(
    () => getCandidateName(currentState.removeConfirmId, shortlisted),
    [currentState.removeConfirmId, shortlisted],
  );

  const isFinalizeEnabled = useMemo(
    () => canFinalize(shortlisted, currentState.isFinalized),
    [currentState.isFinalized, shortlisted],
  );

  const showToast = useCallback(
    (message: string, type: ToastState["type"] = "success") => {
      setToast({ message, type });
      setTimeout(() => setToast(null), TOAST_DURATION);
    },
    [],
  );

  const handleRemoveFromShortlist = useCallback(
    (id: string) => {
      const candidate = currentState.shortlisted.find((c) => c.id === id);
      if (!candidate) return;

      updateCurrentJobState((state) => ({
        ...state,
        shortlisted: state.shortlisted.filter((c) => c.id !== id),
        rejected: state.rejected.some((c) => c.id === id)
          ? state.rejected
          : [...state.rejected, toRejected(candidate)],
        removeConfirmId: null,
        selectedRejected: state.selectedRejected.filter(
          (candidateId) => candidateId !== id,
        ),
      }));

      showToast(`${candidate.name} moved to rejected`);
    },
    [currentState.shortlisted, showToast, updateCurrentJobState],
  );

  const handleManualShortlist = useCallback(
    (id: string) => {
      const candidate = currentState.rejected.find((c) => c.id === id);
      if (!candidate) return;

      updateCurrentJobState((state) => ({
        ...state,
        rejected: state.rejected.filter((c) => c.id !== id),
        shortlisted: state.shortlisted.some((c) => c.id === id)
          ? state.shortlisted
          : [...state.shortlisted, toShortlisted(candidate)],
        selectedRejected: state.selectedRejected.filter(
          (candidateId) => candidateId !== id,
        ),
      }));

      showToast(`${candidate.name} added to shortlist`);
    },
    [currentState.rejected, showToast, updateCurrentJobState],
  );

  const handleTopNShortlist = useCallback(() => {
    const topCandidates = getTopNRejected(
      currentState.rejected,
      currentState.topNValue,
    );
    if (topCandidates.length === 0) return;

    const ids = topCandidates.map((candidate) => candidate.id);
    const newShortlisted = topCandidates.map((candidate) =>
      toShortlisted(candidate),
    );

    updateCurrentJobState((state) => ({
      ...state,
      shortlisted: [...state.shortlisted, ...newShortlisted],
      rejected: state.rejected.filter(
        (candidate) => !ids.includes(candidate.id),
      ),
      selectedRejected: state.selectedRejected.filter(
        (candidateId) => !ids.includes(candidateId),
      ),
    }));

    showToast(`${topCandidates.length} candidates added to shortlist`);
  }, [
    currentState.rejected,
    currentState.topNValue,
    showToast,
    updateCurrentJobState,
  ]);

  const handleBulkShortlist = useCallback(() => {
    if (currentState.selectedRejected.length === 0) return;

    const toAdd = currentState.rejected.filter((candidate) =>
      currentState.selectedRejected.includes(candidate.id),
    );
    const ids = toAdd.map((candidate) => candidate.id);
    const newShortlisted = toAdd.map((candidate) => toShortlisted(candidate));

    updateCurrentJobState((state) => ({
      ...state,
      shortlisted: [...state.shortlisted, ...newShortlisted],
      rejected: state.rejected.filter(
        (candidate) => !ids.includes(candidate.id),
      ),
      selectedRejected: [],
    }));

    showToast(`${toAdd.length} candidates shortlisted`);
  }, [
    currentState.rejected,
    currentState.selectedRejected,
    showToast,
    updateCurrentJobState,
  ]);

  const toggleSelectRejected = useCallback(
    (id: string) => {
      updateCurrentJobState((state) => ({
        ...state,
        selectedRejected: state.selectedRejected.includes(id)
          ? state.selectedRejected.filter((candidateId) => candidateId !== id)
          : [...state.selectedRejected, id],
      }));
    },
    [updateCurrentJobState],
  );

  const clearSelectedRejected = useCallback(() => {
    updateCurrentJobState((state) => ({
      ...state,
      selectedRejected: [],
    }));
  }, [updateCurrentJobState]);

  const setShowRejectedPanel = useCallback(
    (nextValue: React.SetStateAction<boolean>) => {
      updateCurrentJobState((state) => ({
        ...state,
        showRejectedPanel: resolveStateValue(
          nextValue,
          state.showRejectedPanel,
        ),
      }));
    },
    [updateCurrentJobState],
  );

  const setTopNValue = useCallback(
    (nextValue: React.SetStateAction<number>) => {
      updateCurrentJobState((state) => ({
        ...state,
        topNValue: resolveStateValue(nextValue, state.topNValue),
      }));
    },
    [updateCurrentJobState],
  );

  const setShowFinalizeModal = useCallback(
    (nextValue: React.SetStateAction<boolean>) => {
      updateCurrentJobState((state) => ({
        ...state,
        showFinalizeModal: resolveStateValue(
          nextValue,
          state.showFinalizeModal,
        ),
      }));
    },
    [updateCurrentJobState],
  );

  const setRemoveConfirmId = useCallback(
    (nextValue: React.SetStateAction<string | null>) => {
      updateCurrentJobState((state) => ({
        ...state,
        removeConfirmId: resolveStateValue(nextValue, state.removeConfirmId),
      }));
    },
    [updateCurrentJobState],
  );

  const setSortBy = useCallback(
    (value: SortOption) => {
      updateCurrentJobState((state) => ({
        ...state,
        sortBy: value,
      }));
    },
    [updateCurrentJobState],
  );

  const handleFinalize = useCallback(() => {
    updateCurrentJobState((state) => ({
      ...state,
      isFinalized: true,
      showFinalizeModal: false,
      showRejectedPanel: false,
    }));
    showToast(
      `Shortlist finalized! ${currentState.shortlisted.length} candidates notified.`,
    );
  }, [currentState.shortlisted.length, showToast, updateCurrentJobState]);

  const handleSaveDraft = useCallback(() => {
    showToast(`Draft saved for ${job.title}`);
  }, [job.title, showToast]);

  return {
    job,
    jobs,
    selectedJobId,
    setSelectedJobId,
    isJobsLoading,
    jobsError,
    shortlisted,
    rejected,
    stats,
    showRejectedPanel: currentState.showRejectedPanel,
    setShowRejectedPanel,
    selectedRejected: currentState.selectedRejected,
    toggleSelectRejected,
    clearSelectedRejected,
    topNValue: currentState.topNValue,
    setTopNValue,
    showFinalizeModal: currentState.showFinalizeModal,
    setShowFinalizeModal,
    removeConfirmId: currentState.removeConfirmId,
    setRemoveConfirmId,
    removeConfirmName,
    sortBy: currentState.sortBy,
    setSortBy,
    rejectedSearch,
    setRejectedSearch,
    isFinalized: currentState.isFinalized,
    isFinalizeEnabled,
    toast,
    handleRemoveFromShortlist,
    handleManualShortlist,
    handleTopNShortlist,
    handleBulkShortlist,
    handleFinalize,
    handleSaveDraft,
  };
}
