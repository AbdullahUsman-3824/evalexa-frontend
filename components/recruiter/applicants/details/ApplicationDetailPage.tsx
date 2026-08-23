"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  User,
  Briefcase,
  FileText,
  Brain,
  Settings2,
  MapPin,
  Mail,
  Phone,
  Globe,
  Link2,
  ExternalLink,
  Calendar,
  Hash,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { getApplicationDetail } from "@/repositories/job.repository";
import type {
  ApplicationDetail,
  ApplicationStatus,
  ApplicationSource,
  AiRecommendation,
  ProcessingStatusValue,
} from "@/types/job.types";

/* ─────────────────────────────────────────
   Formatting helpers
───────────────────────────────────────── */

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatExperienceMonths(months: number | null | undefined): string {
  if (months == null) return "—";
  if (months === 0) return "Less than a year";
  const years = Math.floor(months / 12);
  const rem = months % 12;
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} yr${years > 1 ? "s" : ""}`);
  if (rem > 0) parts.push(`${rem} mo${rem > 1 ? "s" : ""}`);
  return parts.join(" ") || "—";
}

function displayStatus(status: ApplicationStatus): string {
  const map: Record<ApplicationStatus, string> = {
    APPLIED: "Applied",
    SCREENING: "AI Screened",
    SHORTLISTED: "Shortlisted",
    INTERVIEW: "Interview",
    OFFER: "Offer",
    REJECTED: "Rejected",
    HIRED: "Hired",
    WITHDRAWN: "Withdrawn",
  };
  return map[status] ?? status;
}

function displaySource(source: ApplicationSource): string {
  const map: Record<ApplicationSource, string> = {
    FORM_FILL: "Form Fill",
    RESUME: "Resume",
    BULK_UPLOAD: "Bulk Upload",
    RESUME_UPLOAD: "Resume Upload",
    REFERRAL: "Referral",
    IMPORT: "Import",
    API: "API",
  };
  return map[source] ?? source;
}

function displayRecommendation(rec: AiRecommendation): string {
  const map: Record<AiRecommendation, string> = {
    STRONG_MATCH: "Strong Match",
    GOOD_MATCH: "Good Match",
    AVERAGE_MATCH: "Average Match",
    WEAK_MATCH: "Weak Match",
  };
  return map[rec] ?? rec;
}

function recommendationTone(rec: AiRecommendation): string {
  if (rec === "STRONG_MATCH") return "bg-success/10 text-success";
  if (rec === "GOOD_MATCH") return "bg-primary/10 text-primary";
  if (rec === "AVERAGE_MATCH") return "bg-warning/15 text-warning";
  return "bg-danger/10 text-danger";
}

function statusTone(status: ApplicationStatus): string {
  if (status === "REJECTED" || status === "WITHDRAWN")
    return "bg-danger/10 text-danger";
  if (status === "INTERVIEW" || status === "HIRED")
    return "bg-success/10 text-success";
  if (status === "SHORTLISTED" || status === "OFFER")
    return "bg-warning/15 text-warning";
  return "bg-primary/10 text-primary";
}

function processingIcon(val: ProcessingStatusValue | null) {
  if (val === "COMPLETED")
    return <CheckCircle2 className="h-4 w-4 text-success" />;
  if (val === "FAILED") return <XCircle className="h-4 w-4 text-danger" />;
  if (val === "RUNNING" || val === "PENDING")
    return <Clock className="h-4 w-4 text-warning" />;
  if (val === "CANCELLED" || val === "SKIPPED")
    return <AlertCircle className="h-4 w-4 text-slate" />;
  return <AlertCircle className="h-4 w-4 text-slate/40" />;
}

function processingLabel(val: ProcessingStatusValue | null): string {
  if (!val) return "Not started";
  const map: Record<ProcessingStatusValue, string> = {
    PENDING: "Pending",
    RUNNING: "Running",
    COMPLETED: "Completed",
    FAILED: "Failed",
    CANCELLED: "Cancelled",
    SKIPPED: "Skipped",
  };
  return map[val] ?? val;
}

/* ─────────────────────────────────────────
   Small reusable sub-components
───────────────────────────────────────── */

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate/20 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </span>
        <h2 className="font-syne text-lg font-bold text-midnight">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-start sm:gap-4">
      <span className="min-w-[160px] text-xs font-semibold uppercase tracking-wide text-slate">
        {label}
      </span>
      <span className="text-sm text-midnight">{value ?? "—"}</span>
    </div>
  );
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  const capped = Math.max(0, Math.min(100, score));
  const color =
    capped >= 80
      ? "bg-success"
      : capped >= 60
        ? "bg-primary"
        : capped >= 40
          ? "bg-warning"
          : "bg-danger";
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-midnight">{label}</span>
        <span className="font-semibold text-midnight">{capped}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-surface overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all ${color}`}
          style={{ width: `${capped}%` }}
        />
      </div>
    </div>
  );
}

function SkillTag({
  name,
  variant = "matched",
}: {
  name: string;
  variant?: "matched" | "missing";
}) {
  const cls =
    variant === "matched"
      ? "bg-success/10 text-success"
      : "bg-danger/10 text-danger";
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${cls}`}>
      {name}
    </span>
  );
}

function StringTag({ text }: { text: string }) {
  return (
    <span className="rounded-full bg-surface px-2.5 py-1 text-xs text-midnight border border-slate/20">
      {text}
    </span>
  );
}

/* ─────────────────────────────────────────
   Main page component
───────────────────────────────────────── */

export default function ApplicationDetailPage() {
  const params = useParams();
  const applicationId = params.applicationId as string;

  const [detail, setDetail] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadDetail() {
      if (!applicationId) return;
      try {
        setLoading(true);
        setError(null);
        const data = await getApplicationDetail(applicationId);
        if (!isMounted) return;
        setDetail(data);
      } catch (requestError) {
        if (!isMounted) return;
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load application details.",
        );
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    void loadDetail();
    return () => {
      isMounted = false;
    };
  }, [applicationId]);

  /* ── Loading state ── */
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-slate">Loading application details...</p>
        </div>
      </div>
    );
  }

  /* ── Error state ── */
  if (error || !detail) {
    return (
      <div className="min-h-screen bg-surface p-6">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/recruiter/applicants"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Applicants
          </Link>
          <section className="rounded-xl border border-danger/20 bg-danger/10 p-6 text-danger">
            <h2 className="font-semibold">Error loading application</h2>
            <p className="mt-1 text-sm text-danger/80">
              {error || "Application not found."}
            </p>
          </section>
        </div>
      </div>
    );
  }

  const { application, job, candidate, resume, analysis, processing } = detail;

  return (
    <div className="min-h-screen bg-surface pb-10">
      {/* ── Sticky header ── */}
      <div className="sticky top-16 z-20 border-b border-slate/15 bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-3">
          <div className="flex items-center gap-3">
            <Link
              href="/recruiter/applicants"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Applicants
            </Link>
            <span className="text-slate/40">/</span>
            <h1 className="font-syne text-[17px] font-bold text-midnight">
              {candidate.fullName}
            </h1>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusTone(application.status)}`}
            >
              {displayStatus(application.status)}
            </span>
          </div>
          <p className="text-sm text-slate">
            Applied for{" "}
            <span className="font-medium text-midnight">{job.title}</span>
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl space-y-5 p-6">
        {/* ── 1. Candidate Information ── */}
        <SectionCard
          title="Candidate Information"
          icon={<User className="h-4 w-4" />}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <InfoRow label="Full Name" value={candidate.fullName} />
            <InfoRow
              label="Email"
              value={
                <a
                  href={`mailto:${candidate.email}`}
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                >
                  <Mail className="h-3.5 w-3.5" />
                  {candidate.email}
                </a>
              }
            />
            <InfoRow
              label="Phone"
              value={
                candidate.phone ? (
                  <a
                    href={`tel:${candidate.phone}`}
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    {candidate.phone}
                  </a>
                ) : null
              }
            />
            <InfoRow
              label="Location"
              value={
                candidate.location ? (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-cyan" />
                    {candidate.location}
                  </span>
                ) : null
              }
            />
            <InfoRow
              label="LinkedIn"
              value={
                candidate.linkedinUrl ? (
                  <a
                    href={candidate.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    <Link2 className="h-3.5 w-3.5" />
                    View Profile
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : null
              }
            />
            <InfoRow
              label="Portfolio"
              value={
                candidate.portfolioUrl ? (
                  <a
                    href={candidate.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    View Portfolio
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : null
              }
            />
          </div>
        </SectionCard>

        {/* ── 2. Job Information ── */}
        <SectionCard
          title="Job Information"
          icon={<Briefcase className="h-4 w-4" />}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <InfoRow label="Job Title" value={job.title} />
            <InfoRow
              label="Job ID"
              value={
                <span className="inline-flex items-center gap-1 font-mono text-xs text-slate">
                  <Hash className="h-3 w-3" />
                  {job.id}
                </span>
              }
            />
            <InfoRow
              label="Job Slug"
              value={
                <span className="font-mono text-xs text-slate">{job.slug}</span>
              }
            />
          </div>
        </SectionCard>

        {/* ── 3. Application Information ── */}
        <SectionCard
          title="Application Information"
          icon={<Settings2 className="h-4 w-4" />}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <InfoRow
              label="Status"
              value={
                <span
                  className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusTone(application.status)}`}
                >
                  {displayStatus(application.status)}
                </span>
              }
            />
            <InfoRow
              label="Source"
              value={displaySource(application.source)}
            />
            <InfoRow
              label="Match Score"
              value={
                application.matchScore != null
                  ? `${application.matchScore}%`
                  : "Pending"
              }
            />
            <InfoRow
              label="Rank Position"
              value={
                application.rankPosition != null
                  ? `#${application.rankPosition}`
                  : "Pending"
              }
            />
            <InfoRow
              label="Auto-Shortlisted"
              value={
                <span
                  className={
                    application.isAutoShortlisted
                      ? "text-success font-medium"
                      : "text-slate"
                  }
                >
                  {application.isAutoShortlisted ? "Yes" : "No"}
                </span>
              }
            />
            <InfoRow
              label="Applied At"
              value={
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-slate" />
                  {formatDateTime(application.appliedAt)}
                </span>
              }
            />
            <InfoRow
              label="Last Updated"
              value={
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-slate" />
                  {formatDateTime(application.updatedAt)}
                </span>
              }
            />
            <InfoRow
              label="Application ID"
              value={
                <span className="font-mono text-xs text-slate">
                  {application.id}
                </span>
              }
            />
          </div>
        </SectionCard>

        {/* ── 4. Resume ── */}
        {resume ? (
          <SectionCard
            title="Resume"
            icon={<FileText className="h-4 w-4" />}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoRow label="File Name" value={resume.fileName} />
              <InfoRow
                label="Primary Resume"
                value={
                  <span
                    className={
                      resume.isPrimary
                        ? "text-success font-medium"
                        : "text-slate"
                    }
                  >
                    {resume.isPrimary ? "Yes" : "No"}
                  </span>
                }
              />
              <InfoRow
                label="Extracted Education"
                value={resume.extractedEducation}
              />
              <InfoRow
                label="Experience"
                value={formatExperienceMonths(resume.extractedExperience)}
              />
              <InfoRow
                label="Uploaded At"
                value={formatDate(resume.uploadedAt)}
              />
              {resume.description && (
                <div className="sm:col-span-2">
                  <InfoRow label="Description" value={resume.description} />
                </div>
              )}
            </div>

            {/* Resume link */}
            {resume.resumeUrl && (
              <div className="mt-4">
                <a
                  href={resume.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-medium text-primary transition-all hover:bg-primary/10"
                >
                  <FileText className="h-4 w-4" />
                  View Resume
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            )}

            {/* Extracted skills */}
            {resume.extractedSkills && resume.extractedSkills.length > 0 && (
              <div className="mt-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate">
                  Extracted Skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {resume.extractedSkills.map((skill, i) => (
                    <StringTag key={`${skill.name}-${i}`} text={skill.name} />
                  ))}
                </div>
              </div>
            )}
          </SectionCard>
        ) : (
          <SectionCard
            title="Resume"
            icon={<FileText className="h-4 w-4" />}
          >
            <p className="text-sm text-slate">No resume attached.</p>
          </SectionCard>
        )}

        {/* ── 5. AI Analysis ── */}
        {analysis ? (
          <SectionCard
            title="AI Analysis"
            icon={<Brain className="h-4 w-4" />}
          >
            {/* Recommendation badge */}
            <div className="mb-5 flex items-center gap-3">
              <span className="text-sm font-medium text-slate">
                AI Recommendation:
              </span>
              <span
                className={`rounded-full px-3 py-1 text-sm font-semibold ${recommendationTone(analysis.recommendation)}`}
              >
                {displayRecommendation(analysis.recommendation)}
              </span>
            </div>

            {/* Score bars */}
            <div className="space-y-4 mb-6">
              <ScoreBar label="Overall Score" score={analysis.overallScore} />
              <ScoreBar
                label="Skill Match Score"
                score={analysis.skillMatchScore}
              />
              <ScoreBar
                label="Experience Score"
                score={analysis.experienceScore}
              />
              <ScoreBar
                label="Education Score"
                score={analysis.educationScore}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Matched skills */}
              {analysis.matchedSkills && analysis.matchedSkills.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate">
                    Matched Skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.matchedSkills.map((skill, i) => (
                      <SkillTag
                        key={`matched-${skill.name}-${i}`}
                        name={skill.name}
                        variant="matched"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Missing skills */}
              {analysis.missingSkills && analysis.missingSkills.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate">
                    Missing Skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missingSkills.map((skill, i) => (
                      <SkillTag
                        key={`missing-${skill.name}-${i}`}
                        name={skill.name}
                        variant="missing"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Strengths */}
              {analysis.strengths && analysis.strengths.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate">
                    Strengths
                  </p>
                  <ul className="space-y-1">
                    {analysis.strengths.map((s, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-midnight"
                      >
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Weaknesses */}
              {analysis.weaknesses && analysis.weaknesses.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate">
                    Weaknesses
                  </p>
                  <ul className="space-y-1">
                    {analysis.weaknesses.map((w, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-midnight"
                      >
                        <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-danger" />
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* AI Summary */}
            {analysis.aiSummary && (
              <div className="mt-5 rounded-lg bg-surface p-4">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate">
                  AI Summary
                </p>
                <p className="text-sm leading-relaxed text-midnight">
                  {analysis.aiSummary}
                </p>
              </div>
            )}

            <div className="mt-4">
              <InfoRow
                label="Analyzed At"
                value={formatDateTime(analysis.analyzedAt)}
              />
            </div>
          </SectionCard>
        ) : (
          <SectionCard
            title="AI Analysis"
            icon={<Brain className="h-4 w-4" />}
          >
            <p className="text-sm text-slate">
              AI analysis has not been run yet for this application.
            </p>
          </SectionCard>
        )}

        {/* ── 6. Processing Status ── */}
        <SectionCard
          title="Processing Status"
          icon={<Settings2 className="h-4 w-4" />}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-lg border border-slate/15 bg-surface p-3">
              {processingIcon(processing.resumeParse)}
              <div>
                <p className="text-xs text-slate">Resume Parse</p>
                <p className="text-sm font-medium text-midnight">
                  {processingLabel(processing.resumeParse)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-slate/15 bg-surface p-3">
              {processingIcon(processing.resumeAnalysis)}
              <div>
                <p className="text-xs text-slate">Resume Analysis</p>
                <p className="text-sm font-medium text-midnight">
                  {processingLabel(processing.resumeAnalysis)}
                </p>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
