"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Loader2, MapPin } from "lucide-react";
import CandidateHero from "@/components/recruiter/applicants/details/CandidateHero";
import AIFitAnalysis from "@/components/recruiter/applicants/details/AIFitAnalysis";
import ResumeSection from "@/components/recruiter/applicants/details/ResumeSection";
import RecruiterNotes from "@/components/recruiter/applicants/details/RecruiterNotes";
import BottomActionBar from "@/components/recruiter/applicants/details/BottomActionBar";
import {
  getCandidateDetails,
  type CandidateDetails,
} from "@/lib/services/jobsService";

function statusTone(status: string) {
  if (status === "Rejected") return "bg-danger/10 text-danger";
  if (status === "Interview") return "bg-success/10 text-success";
  if (status === "Shortlisted") return "bg-warning/15 text-warning";
  return "bg-primary/10 text-primary";
}

function mapApplicationStatusToDisplay(status: string): string {
  const statusMap: Record<string, string> = {
    APPLIED: "New",
    SCREENING: "AI Screened",
    SHORTLISTED: "Shortlisted",
    INTERVIEW: "Interview",
    OFFER: "Offer",
    REJECTED: "Rejected",
    HIRED: "Hired",
  };
  return statusMap[status] || "Applied";
}

export default function CandidateDetailsPageComponent() {
  const params = useParams();
  const candidateId = params.candidateId as string;

  const [candidate, setCandidate] = useState<CandidateDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentAppIndex, setCurrentAppIndex] = useState(0);
  const [displayStatus, setDisplayStatus] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    async function loadCandidate() {
      if (!candidateId) return;
      try {
        setLoading(true);
        setError(null);
        const data = await getCandidateDetails(candidateId);
        if (!isMounted) return;
        setCandidate(data);
        if (data.applications.length > 0) {
          setDisplayStatus(
            mapApplicationStatusToDisplay(data.applications[0].status),
          );
          setCurrentAppIndex(0);
        }
      } catch (requestError) {
        if (!isMounted) return;
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load candidate details.",
        );
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    void loadCandidate();

    return () => {
      isMounted = false;
    };
  }, [candidateId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-slate">Loading candidate details...</p>
        </div>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="min-h-screen bg-surface p-6">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/recruiter/applicants"
            className="text-sm font-medium text-primary mb-4 inline-block"
          >
            ← Back to Applicants
          </Link>
          <section className="rounded-xl border border-danger/20 bg-danger/10 p-6 text-danger">
            <h2 className="font-semibold">Error loading candidate</h2>
            <p className="mt-1 text-sm text-danger/80">
              {error || "Candidate not found."}
            </p>
          </section>
        </div>
      </div>
    );
  }

  const currentApp = candidate.applications[currentAppIndex];
  const primaryResume =
    candidate.resumes.find((r) => r.isPrimary) || candidate.resumes[0];
  const experienceYears = primaryResume
    ? Math.max(0, Math.round(primaryResume.extractedExperience / 12))
    : 0;

  const handlePrev = () => {
    if (currentAppIndex > 0) {
      setCurrentAppIndex(currentAppIndex - 1);
      const app = candidate.applications[currentAppIndex - 1];
      setDisplayStatus(mapApplicationStatusToDisplay(app.status));
    }
  };

  const handleNext = () => {
    if (currentAppIndex < candidate.applications.length - 1) {
      setCurrentAppIndex(currentAppIndex + 1);
      const app = candidate.applications[currentAppIndex + 1];
      setDisplayStatus(mapApplicationStatusToDisplay(app.status));
    }
  };

  const handleShortlist = () => {
    setDisplayStatus("Shortlisted");
  };

  const handleReject = () => {
    setDisplayStatus("Rejected");
  };

  return (
    <div className="min-h-screen bg-surface pb-24">
      <div className="sticky top-16 z-20 border-b border-slate/15 bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-3">
          <div className="flex items-center gap-3">
            <Link
              href="/recruiter/applicants"
              className="text-sm font-medium text-primary"
            >
              ← Applicants
            </Link>
            <h1 className="font-syne text-[17px] font-bold text-midnight">
              {candidate.fullName}
            </h1>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusTone(displayStatus)}`}
            >
              {displayStatus}
            </span>
          </div>
          {currentApp && (
            <p className="text-sm font-medium text-slate">
              Application {currentAppIndex + 1} of{" "}
              {candidate.applications.length}
            </p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-5 p-6">
        <CandidateHero
          name={candidate.fullName}
          role={primaryResume?.extractedEducation || "Professional"}
          company={currentApp?.job.title || ""}
          location={candidate.location}
          email={candidate.email}
          phone={candidate.phone}
          linkedIn={candidate.linkedinUrl}
          openToWork={true}
          matchScore={currentApp?.matchScore || 0}
          resumeScore={currentApp?.matchScore || 0}
        />

        {currentApp && (
          <AIFitAnalysis
            scores={{
              skills: Math.min(100, currentApp.matchScore + 5),
              experience: Math.max(0, Math.min(100, experienceYears * 10)),
              education: 85,
              culture: 75,
              overall: currentApp.matchScore,
            }}
            matchedSkills={primaryResume?.extractedSkills?.slice(0, 5) || []}
            missingSkills={primaryResume?.extractedSkills?.slice(5, 8) || []}
          />
        )}

        {primaryResume && (
          <ResumeSection
            filename={primaryResume.fileName}
            uploadedAt={new Date(primaryResume.uploadedAt).toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "short",
                day: "numeric",
              },
            )}
            aiScore={currentApp?.matchScore || 0}
            highlights={{
              experience: `${experienceYears} years`,
              education: primaryResume.extractedEducation,
              topSkills:
                primaryResume.extractedSkills?.slice(0, 3).join(", ") ||
                "Not specified",
            }}
          />
        )}

        <section className="rounded-xl border border-slate/20 bg-white p-5 shadow-sm">
          <h2 className="font-syne text-xl font-bold text-midnight">
            Experience & Education
          </h2>
          <div className="mt-4 space-y-4">
            <article className="relative border-l-2 border-primary/25 pl-4">
              <p className="text-sm text-slate">
                {experienceYears} years of experience
              </p>
              <h3 className="font-semibold text-midnight">
                {primaryResume?.extractedEducation || "Professional"}
              </h3>
              {currentApp && (
                <ul className="mt-1 list-disc pl-5 text-sm text-slate">
                  <li>Applied to: {currentApp.job.title}</li>
                  <li>Match Score: {currentApp.matchScore}%</li>
                </ul>
              )}
            </article>
          </div>
        </section>

        <section className="rounded-xl border border-slate/20 bg-white p-5 shadow-sm">
          <h2 className="font-syne text-xl font-bold text-midnight">Skills</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-midnight">
                Extracted skills
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {primaryResume?.extractedSkills?.slice(0, 5).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-midnight">
                Other skills
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {primaryResume?.extractedSkills?.slice(5).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-surface px-2.5 py-1 text-xs text-midnight"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate/20 bg-white p-5 shadow-sm">
          <h2 className="font-syne text-xl font-bold text-midnight">
            Candidate Snapshot
          </h2>
          <div className="mt-3 grid gap-3 text-sm md:grid-cols-3">
            <div className="rounded-lg bg-surface p-3">
              <p className="text-xs text-slate">Current location</p>
              <p className="mt-1 inline-flex items-center gap-1 font-medium text-midnight">
                <MapPin className="h-4 w-4 text-cyan" />
                {candidate.location}
              </p>
            </div>
            <div className="rounded-lg bg-surface p-3">
              <p className="text-xs text-slate">Resume count</p>
              <p className="mt-1 font-medium text-midnight">
                {candidate._count.resumes}
              </p>
            </div>
            <div className="rounded-lg bg-surface p-3">
              <p className="text-xs text-slate">Applications</p>
              <p className="mt-1 font-medium text-midnight">
                {candidate._count.applications}
              </p>
            </div>
          </div>
        </section>

        <RecruiterNotes
          initialNotes={[
            {
              id: "n1",
              text: `Candidate with ${experienceYears} years of experience.`,
              createdAt: new Date().toLocaleString(),
            },
          ]}
        />
      </div>

      <BottomActionBar
        onPrev={handlePrev}
        onNext={handleNext}
        onShortlist={handleShortlist}
        onReject={handleReject}
      />
    </div>
  );
}
