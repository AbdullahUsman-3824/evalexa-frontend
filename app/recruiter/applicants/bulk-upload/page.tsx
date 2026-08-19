"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Loader2,
  UploadCloud,
} from "lucide-react";
import {
  bulkUploadApplicantsForJob,
  getJobTitles,
} from "@/repositories/job.repository";
import type { BulkUploadResponse, JobTitleRecord } from "@/types/job.types";

export default function BulkUploadPage() {
  const [jobTitles, setJobTitles] = useState<JobTitleRecord[]>([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loadingTitles, setLoadingTitles] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<BulkUploadResponse | null>(
    null,
  );

  useEffect(() => {
    let isMounted = true;

    async function loadJobTitles() {
      try {
        setLoadingTitles(true);
        setError(null);
        const titles = await getJobTitles();
        if (!isMounted) return;
        setJobTitles(titles);
        if (titles.length > 0 && !selectedJobId) {
          setSelectedJobId(titles[0].id);
        }
      } catch (requestError) {
        if (!isMounted) return;
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load jobs for bulk upload.",
        );
      } finally {
        if (isMounted) setLoadingTitles(false);
      }
    }

    void loadJobTitles();

    return () => {
      isMounted = false;
    };
  }, [selectedJobId]);

  const selectedJobTitle = useMemo(
    () => jobTitles.find((job) => job.id === selectedJobId)?.title ?? null,
    [jobTitles, selectedJobId],
  );

  const handleFilesSelected = (incomingFiles: FileList | null) => {
    if (!incomingFiles?.length) return;
    setFiles(Array.from(incomingFiles));
  };

  const handleUpload = async () => {
    if (!selectedJobId || files.length === 0) return;

    setIsUploading(true);
    setError(null);
    setUploadResult(null);

    try {
      const result = await bulkUploadApplicantsForJob(selectedJobId, files);
      setUploadResult(result);
      setFiles([]);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Bulk upload failed.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface p-6">
      <div className="mx-auto max-w-4xl space-y-5">
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

          {error && (
            <div className="mt-4 rounded-lg border border-danger/20 bg-danger/10 p-3 text-sm text-danger">
              {error}
            </div>
          )}

          {uploadResult && (
            <div className="mt-4 rounded-lg border border-success/20 bg-success/10 p-3 text-sm text-success">
              Upload complete: {uploadResult.accepted} accepted,{" "}
              {uploadResult.rejected} rejected.
            </div>
          )}

          <div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-xl border border-secondary/20 bg-surface/80 p-4">
              <label className="mb-2 block text-sm font-medium text-midnight">
                Select active job
              </label>

              <select
                value={selectedJobId}
                onChange={(event) => setSelectedJobId(event.target.value)}
                className="h-11 w-full rounded-lg border border-secondary/30 bg-white px-3 text-sm text-midnight outline-none transition-all hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
                disabled={loadingTitles || jobTitles.length === 0}
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
                  Drop PDFs, DOC, or DOCX files here or browse from your device.
                </p>

                <label className="mt-4 inline-flex cursor-pointer items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary-dark">
                  Choose Files
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="hidden"
                    onChange={(event) =>
                      handleFilesSelected(event.target.files)
                    }
                  />
                </label>
              </div>
            </div>

            <aside className="rounded-xl border border-secondary/20 bg-white p-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate">
                Summary
              </h2>

              <div className="mt-4 space-y-3 text-sm text-midnight">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate">Selected Job</span>
                  <span className="font-medium">
                    {selectedJobTitle ?? "Not selected"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate">Files Ready</span>
                  <span className="font-medium">{files.length}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate">Status</span>
                  <span className="font-medium text-cyan">
                    {isUploading ? "Uploading..." : "Ready"}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleUpload}
                disabled={!selectedJobId || files.length === 0 || isUploading}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading...
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

          {files.length > 0 && (
            <div className="mt-6 rounded-xl border border-secondary/20 bg-surface/80 p-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate">
                Selected files
              </h3>

              <div className="mt-3 space-y-2">
                {files.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between gap-3 rounded-lg border border-secondary/20 bg-white px-3 py-2"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
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
                      onClick={() =>
                        setFiles((current) =>
                          current.filter(
                            (_, currentIndex) => currentIndex !== index,
                          ),
                        )
                      }
                      className="text-xs font-medium text-danger hover:underline"
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
