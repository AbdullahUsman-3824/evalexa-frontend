"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Loader2,
  UploadCloud,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  bulkUploadApplicantsForJob,
  getJobTitles,
} from "@/repositories/job.repository";
import type { BulkUploadResponse, JobTitleRecord } from "@/types/job.types";

const REDIRECT_SECONDS = 10;

type UploadPhase =
  | "idle"        // waiting for user interaction
  | "uploading"   // request in flight
  | "success"     // upload complete, countdown running (or cancelled)
  | "error";      // upload failed

export default function BulkUploadPage() {
  const router = useRouter();

  // ── Job titles ──
  const [jobTitles, setJobTitles] = useState<JobTitleRecord[]>([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [loadingTitles, setLoadingTitles] = useState(true);
  const [titlesError, setTitlesError] = useState<string | null>(null);

  // ── File selection ──
  const [files, setFiles] = useState<File[]>([]);

  // ── Upload state ──
  const [phase, setPhase] = useState<UploadPhase>("idle");
  const [uploadPercent, setUploadPercent] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<BulkUploadResponse | null>(null);

  // ── Redirect countdown ──
  const [countdown, setCountdown] = useState(REDIRECT_SECONDS);
  const [redirectCancelled, setRedirectCancelled] = useState(false);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Load job titles on mount ──
  useEffect(() => {
    let isMounted = true;

    async function loadJobTitles() {
      try {
        setLoadingTitles(true);
        setTitlesError(null);
        const titles = await getJobTitles();
        if (!isMounted) return;
        setJobTitles(titles);
        if (titles.length > 0) {
          setSelectedJobId(titles[0].id);
        }
      } catch (err) {
        if (!isMounted) return;
        setTitlesError(
          err instanceof Error ? err.message : "Unable to load jobs.",
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

  // ── Countdown timer — starts after successful upload ──
  useEffect(() => {
    if (phase !== "success" || redirectCancelled) return;

    setCountdown(REDIRECT_SECONDS);

    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!);
          countdownRef.current = null;
          router.push("/recruiter/applicants");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, redirectCancelled]);

  const selectedJobTitle = useMemo(
    () => jobTitles.find((job) => job.id === selectedJobId)?.title ?? null,
    [jobTitles, selectedJobId],
  );

  const handleFilesSelected = (incomingFiles: FileList | null) => {
    if (!incomingFiles?.length) return;
    setFiles((prev) => {
      const existing = new Set(prev.map((f) => f.name + f.size));
      const incoming = Array.from(incomingFiles).filter(
        (f) => !existing.has(f.name + f.size),
      );
      return [...prev, ...incoming];
    });
  };

  const handleRemoveFile = (index: number) => {
    setFiles((current) => current.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!selectedJobId || files.length === 0) return;

    setPhase("uploading");
    setUploadError(null);
    setUploadResult(null);
    setUploadPercent(0);
    setRedirectCancelled(false);

    try {
      const result = await bulkUploadApplicantsForJob(
        selectedJobId,
        files,
        (percent) => {
          setUploadPercent(percent);
        },
      );
      setUploadResult(result);
      setFiles([]);
      setPhase("success");
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Bulk upload failed.",
      );
      setPhase("error");
    }
  };

  const handleCancelRedirect = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    setRedirectCancelled(true);
  };

  const handleReset = () => {
    setPhase("idle");
    setUploadError(null);
    setUploadResult(null);
    setUploadPercent(0);
    setRedirectCancelled(false);
    setFiles([]);
  };

  const isUploading = phase === "uploading";
  const canUpload = !isUploading && !!selectedJobId && files.length > 0;

  return (
    <div className="min-h-screen bg-surface p-6">
      <div className="mx-auto max-w-4xl space-y-5">
        {/* ── Back link ── */}
        <div className="flex items-center gap-3">
          <Link
            href="/recruiter/applicants"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Applicants
          </Link>
        </div>

        <section className="rounded-xl border border-secondary/20 bg-white p-6 shadow-sm">
          {/* ── Page heading ── */}
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate">
                Recruiter Workflow
              </p>
              <h1 className="mt-2 font-syne text-2xl font-bold text-midnight">
                Bulk Upload Applicants
              </h1>
            </div>
          </div>

          {/* ── Titles error ── */}
          {titlesError && (
            <div className="mt-4 rounded-lg border border-danger/20 bg-danger/10 p-3 text-sm text-danger">
              {titlesError}
            </div>
          )}

          {/* ── Upload error ── */}
          {phase === "error" && uploadError && (
            <div className="mt-4 flex items-start gap-3 rounded-lg border border-danger/20 bg-danger/10 p-4">
              <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-danger" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-danger">
                  Upload failed
                </p>
                <p className="mt-0.5 text-sm text-danger/80">{uploadError}</p>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-medium text-danger hover:underline shrink-0"
              >
                Try again
              </button>
            </div>
          )}

          {/* ── Success + countdown ── */}
          {phase === "success" && uploadResult && (
            <div className="mt-4 rounded-lg border border-success/20 bg-success/10 p-4 space-y-3">
              {/* Summary line */}
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                <div>
                  <p className="text-sm font-semibold text-success">
                    Upload completed successfully!
                  </p>
                  <p className="mt-0.5 text-sm text-success/80">
                    {uploadResult.accepted} accepted
                    {uploadResult.rejected > 0 &&
                      `, ${uploadResult.rejected} rejected`}
                  </p>
                </div>
              </div>

              {/* Per-file errors from API */}
              {uploadResult.errors && uploadResult.errors.length > 0 && (
                <div className="rounded-lg border border-warning/20 bg-warning/10 p-3">
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-warning">
                    Rejected files
                  </p>
                  <ul className="space-y-1">
                    {uploadResult.errors.map((e, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-xs text-warning/90"
                      >
                        <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        <span>
                          <span className="font-medium">{e.fileName}</span>
                          {" — "}
                          {e.reason}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Redirect countdown */}
              {!redirectCancelled ? (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-success/5 border border-success/15 px-4 py-3">
                  <p className="text-sm text-success">
                    Redirecting to Applicants page in{" "}
                    <span className="font-bold tabular-nums">{countdown}</span>{" "}
                    second{countdown !== 1 ? "s" : ""}…
                  </p>
                  <button
                    type="button"
                    onClick={handleCancelRedirect}
                    className="rounded-lg border border-success/30 bg-white px-3 py-1.5 text-xs font-semibold text-success transition-all hover:bg-success/5"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-slate/5 border border-slate/15 px-4 py-3">
                  <p className="text-sm text-slate">
                    Automatic redirect cancelled.
                  </p>
                  <Link
                    href="/recruiter/applicants"
                    className="rounded-lg border border-primary/30 bg-white px-3 py-1.5 text-xs font-semibold text-primary transition-all hover:bg-primary/5"
                  >
                    Go to Applicants
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* ── Upload progress bar ── */}
          {phase === "uploading" && (
            <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-primary">Uploading…</span>
                <span className="tabular-nums font-semibold text-primary">
                  {uploadPercent}%
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-primary/15">
                <div
                  className="h-2.5 rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${uploadPercent}%` }}
                />
              </div>
              <p className="text-xs text-slate">
                Please keep this page open until the upload completes.
              </p>
            </div>
          )}

          {/* ── Main form grid ── */}
          {phase !== "success" && (
            <div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
              {/* Left: job selector + drop zone */}
              <div className="rounded-xl border border-secondary/20 bg-surface/80 p-4">
                <label className="mb-2 block text-sm font-medium text-midnight">
                  Select active job
                </label>

                <select
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  disabled={loadingTitles || isUploading || jobTitles.length === 0}
                  className="h-11 w-full rounded-lg border border-secondary/30 bg-white px-3 text-sm text-midnight outline-none transition-all hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="">Select a job</option>
                  {jobTitles.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.title}
                    </option>
                  ))}
                </select>

                <div className="mt-5 rounded-xl border-2 border-dashed border-secondary/30 bg-white p-6 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <UploadCloud className="h-7 w-7" />
                  </div>
                  <h2 className="mt-4 text-lg font-semibold text-midnight">
                    Upload candidate resumes
                  </h2>
                  <p className="mt-1 text-sm text-slate">
                    Drop PDFs, DOC, or DOCX files here or browse from your
                    device.
                  </p>
                  <label className="mt-4 inline-flex cursor-pointer items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary-dark">
                    Choose Files
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      className="hidden"
                      disabled={isUploading}
                      onChange={(e) => handleFilesSelected(e.target.files)}
                    />
                  </label>
                </div>
              </div>

              {/* Right: summary + upload button */}
              <aside className="rounded-xl border border-secondary/20 bg-white p-4">
                <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate">
                  Summary
                </h2>

                <div className="mt-4 space-y-3 text-sm text-midnight">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate">Selected Job</span>
                    <span className="font-medium text-right">
                      {selectedJobTitle ?? "Not selected"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate">Files Ready</span>
                    <span className="font-medium">{files.length}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate">Status</span>
                    <span
                      className={`font-medium ${
                        isUploading ? "text-primary" : "text-cyan"
                      }`}
                    >
                      {isUploading ? "Uploading…" : "Ready"}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={!canUpload}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading…
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Start Bulk Upload
                    </>
                  )}
                </button>
              </aside>
            </div>
          )}

          {/* ── File list ── */}
          {files.length > 0 && phase !== "success" && (
            <div className="mt-6 rounded-xl border border-secondary/20 bg-surface/80 p-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate">
                Selected files ({files.length})
              </h3>

              <div className="mt-3 space-y-2">
                {files.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between gap-3 rounded-lg border border-secondary/20 bg-white px-3 py-2"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-midnight">
                          {file.name}
                        </p>
                        <p className="text-xs text-slate">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={() => handleRemoveFile(index)}
                      className="shrink-0 text-xs font-medium text-danger hover:underline disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
