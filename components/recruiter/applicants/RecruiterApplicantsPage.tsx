"use client";

import { useEffect, useMemo, useState } from "react";
import RecruiterApplicantsHeader from "@/components/recruiter/applicants/RecruiterApplicantsHeader";
import RecruiterApplicantsWorkspace, {
  type StatusFilter,
  type TableSortKey,
} from "@/components/recruiter/applicants/RecruiterApplicantsWorkspace";
import {
  getApplicationsForJob,
  getJobSummary,
  getJobProcessingStatus,
  getJobTitles,
  retryFailedApplicationsForJob,
} from "@/repositories/job.repository";
import {
  Application,
  ApplicationListResponse,
  JobProcessingStatusResponse,
  JobTitleRecord,
  JobSummaryRecord,
} from "@/types/job.types";

const PAGE_SIZE = 20;

export default function RecruiterApplicantsPage() {
  const [jobTitles, setJobTitles] = useState<JobTitleRecord[]>([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [selectedJobSummary, setSelectedJobSummary] =
    useState<JobSummaryRecord | null>(null);
  const [processingStatus, setProcessingStatus] =
    useState<JobProcessingStatusResponse | null>(null);
  const [loadingTitles, setLoadingTitles] = useState(true);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [retryingFailed, setRetryingFailed] = useState(false);
  const [titlesError, setTitlesError] = useState<string | null>(null);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [applicationsError, setApplicationsError] = useState<string | null>(
    null,
  );
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState<StatusFilter>("All");
  const [sortBy, setSortBy] = useState<TableSortKey>("rankPosition");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [applications, setApplications] = useState<Application[]>([]);
  const [applicationsMeta, setApplicationsMeta] = useState<
    ApplicationListResponse["meta"]
  >({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 1,
  });

  useEffect(() => {
    let isMounted = true;

    async function loadJobTitles() {
      try {
        setLoadingTitles(true);
        setTitlesError(null);
        const titles = await getJobTitles();
        if (!isMounted) return;
        setJobTitles(titles);
        setSelectedJobId((current) => {
          if (current && titles.some((title) => title.id === current)) {
            return current;
          }
          return titles[0]?.id ?? "";
        });
      } catch (requestError) {
        if (!isMounted) return;
        setTitlesError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load job titles.",
        );
      } finally {
        if (isMounted) setLoadingTitles(false);
      }
    }

    void loadJobTitles();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedJobId) {
      setSelectedJobSummary(null);
      setProcessingStatus(null);
      setApplications([]);
      setApplicationsMeta({
        page: 1,
        limit: PAGE_SIZE,
        total: 0,
        totalPages: 1,
      });
      setApplicationsError(null);
      setSummaryError(null);
      setLoadingApplications(false);
      return;
    }

    let isMounted = true;

    async function loadJobOverview() {
      try {
        setSummaryError(null);

        const [summaryResult, processingResult] = await Promise.allSettled([
          getJobSummary(selectedJobId),
          getJobProcessingStatus(selectedJobId),
        ]);

        if (!isMounted) return;

        if (summaryResult.status === "fulfilled") {
          setSelectedJobSummary(summaryResult.value);
        } else {
          setSelectedJobSummary(null);
          setSummaryError(
            summaryResult.reason instanceof Error
              ? summaryResult.reason.message
              : "Failed to load job summary.",
          );
        }

        if (processingResult.status === "fulfilled") {
          setProcessingStatus(processingResult.value);
        } else {
          setProcessingStatus(null);
        }
      } catch (requestError) {
        if (!isMounted) return;
        setSelectedJobSummary(null);
        setProcessingStatus(null);
        setSummaryError(
          requestError instanceof Error
            ? requestError.message
            : "Failed to load job summary.",
        );
      } finally {
        // no-op; the main applications loader owns the visible loading state
      }
    }

    void loadJobOverview();

    return () => {
      isMounted = false;
    };
  }, [selectedJobId]);

  useEffect(() => {
    if (!selectedJobId) return;

    let isMounted = true;

    async function loadApplications() {
      try {
        setLoadingApplications(true);
        setApplicationsError(null);

        const response = await getApplicationsForJob(selectedJobId, {
          page,
          limit: PAGE_SIZE,
          search: search.trim() || undefined,
          status: activeStatus === "All" ? undefined : activeStatus,
          sortBy,
          sortOrder,
        });

        if (!isMounted) return;

        setApplications(response.data);
        setApplicationsMeta(response.meta);
      } catch (requestError) {
        if (!isMounted) return;
        setApplications([]);
        setApplicationsMeta({
          page,
          limit: PAGE_SIZE,
          total: 0,
          totalPages: 1,
        });
        setApplicationsError(
          requestError instanceof Error
            ? requestError.message
            : "Failed to load applications.",
        );
      } finally {
        if (isMounted) setLoadingApplications(false);
      }
    }

    void loadApplications();

    return () => {
      isMounted = false;
    };
  }, [activeStatus, page, search, selectedJobId, sortBy, sortOrder]);

  const selectedJob = useMemo(
    () =>
      selectedJobSummary ??
      jobTitles.find((jobTitle) => jobTitle.id === selectedJobId) ??
      null,
    [jobTitles, selectedJobId, selectedJobSummary],
  );

  const failedApplicationsCount = processingStatus?.progress.failed ?? 0;

  const handleJobChange = (jobId: string) => {
    setSelectedJobId(jobId);
    setPage(1);
    setSearch("");
    setActiveStatus("All");
    setSortBy("rankPosition");
    setSortOrder("desc");
    setSelectedJobSummary(null);
    setProcessingStatus(null);
    setApplications([]);
    setApplicationsMeta({
      page: 1,
      limit: PAGE_SIZE,
      total: 0,
      totalPages: 1,
    });
  };

  const handleRetryFailed = async () => {
    if (!selectedJobId || failedApplicationsCount === 0) return;

    try {
      setRetryingFailed(true);
      await retryFailedApplicationsForJob(selectedJobId);
      const [summaryResult, processingResult, applicationsResult] =
        await Promise.allSettled([
          getJobSummary(selectedJobId),
          getJobProcessingStatus(selectedJobId),
          getApplicationsForJob(selectedJobId, {
            page,
            limit: PAGE_SIZE,
            search: search.trim() || undefined,
            status: activeStatus === "All" ? undefined : activeStatus,
            sortBy,
            sortOrder,
          }),
        ]);

      if (summaryResult.status === "fulfilled") {
        setSelectedJobSummary(summaryResult.value);
      }
      if (processingResult.status === "fulfilled") {
        setProcessingStatus(processingResult.value);
      }
      if (applicationsResult.status === "fulfilled") {
        setApplications(applicationsResult.value.data);
        setApplicationsMeta(applicationsResult.value.meta);
      }
    } finally {
      setRetryingFailed(false);
    }
  };

  if (loadingTitles && jobTitles.length === 0) {
    return (
      <div className="min-h-screen bg-surface p-6">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-xl border border-slate/20 bg-white p-12 text-center text-sm text-slate shadow-sm">
            Loading job titles...
          </div>
        </div>
      </div>
    );
  }

  if (titlesError) {
    return (
      <div className="min-h-screen bg-surface p-6">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-xl border border-danger/20 bg-danger/10 p-6">
            <h2 className="font-semibold text-danger">
              Error loading job titles
            </h2>
            <p className="mt-1 text-sm text-danger/80">{titlesError}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <RecruiterApplicantsHeader
          jobTitles={jobTitles}
          selectedJobId={selectedJobId}
          selectedJobTitle={selectedJob?.title ?? null}
          applicationCount={
            selectedJobSummary?.applications ?? applicationsMeta.total
          }
          jobOpenings={selectedJobSummary?.openings ?? null}
          onJobChange={handleJobChange}
        />

        <RecruiterApplicantsWorkspace
          selectedJobId={selectedJobId}
          loadingApplications={loadingApplications}
          applicationsError={summaryError ?? applicationsError}
          retryingFailed={retryingFailed}
          processingStatus={processingStatus}
          onRetryFailed={handleRetryFailed}
          applications={applications}
          applicationsMeta={applicationsMeta}
          search={search}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          activeStatus={activeStatus}
          onStatusChange={(value) => {
            setActiveStatus(value);
            setPage(1);
          }}
          sortBy={sortBy}
          onSortByChange={(value) => {
            setSortBy(value);
            setPage(1);
          }}
          sortOrder={sortOrder}
          onSortOrderChange={(value) => {
            setSortOrder(value);
            setPage(1);
          }}
          page={page}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
