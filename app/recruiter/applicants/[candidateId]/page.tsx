"use client";

import Link from "next/link";
import { useState } from "react";
import { CalendarPlus, MapPin, Star, X } from "lucide-react";
import CandidateHero from "@/components/recruiter/applicants/details/CandidateHero";
import AIFitAnalysis from "@/components/recruiter/applicants/details/AIFitAnalysis";
import ResumeSection from "@/components/recruiter/applicants/details/ResumeSection";
import RecruiterNotes from "@/components/recruiter/applicants/details/RecruiterNotes";
import BottomActionBar from "@/components/recruiter/applicants/details/BottomActionBar";

function statusTone(status: string) {
  if (status === "Rejected") return "bg-danger/10 text-danger";
  if (status === "Interview") return "bg-success/10 text-success";
  if (status === "Shortlisted") return "bg-warning/15 text-warning";
  return "bg-primary/10 text-primary";
}

export default function CandidateDetailsPage() {
  const [status, setStatus] = useState<"AI Screened" | "Shortlisted" | "Interview" | "Rejected">("AI Screened");

  return (
    <div className="min-h-screen bg-surface pb-24">
      <div className="sticky top-16 z-20 border-b border-slate/15 bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-3">
          <div className="flex items-center gap-3">
            <Link href="/recruiter/jobs/1/applicants" className="text-sm font-medium text-primary">
              ← Applicants
            </Link>
            <h1 className="font-syne text-lg font-bold text-midnight">Ayesha Khan</h1>
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusTone(status)}`}>{status}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setStatus("Shortlisted")}
              className="inline-flex items-center gap-1 rounded-lg bg-warning px-3 py-2 text-sm font-semibold text-white"
            >
              <Star className="h-4 w-4" />
              Shortlist
            </button>
            <button
              type="button"
              onClick={() => setStatus("Interview")}
              className="inline-flex items-center gap-1 rounded-lg bg-success px-3 py-2 text-sm font-semibold text-white"
            >
              <CalendarPlus className="h-4 w-4" />
              Schedule Interview
            </button>
            <button
              type="button"
              onClick={() => setStatus("Rejected")}
              className="inline-flex items-center gap-1 rounded-lg border border-danger/25 px-3 py-2 text-sm font-medium text-danger"
            >
              <X className="h-4 w-4" />
              Reject
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-5 p-6">
        <CandidateHero
          name="Ayesha Khan"
          role="Senior Frontend Engineer"
          company="PixelWorks"
          location="Lahore, Pakistan"
          email="ayesha.khan@email.com"
          phone="+92 300 1234567"
          linkedIn="linkedin.com/in/ayeshakhan"
          openToWork
          matchScore={84}
          resumeScore={78}
        />

        <AIFitAnalysis
          scores={{ skills: 88, experience: 75, education: 90, culture: 70, overall: 84 }}
          matchedSkills={["React", "TypeScript", "Node.js", "Git", "Agile"]}
          missingSkills={["Docker", "AWS", "GraphQL"]}
        />

        <ResumeSection
          filename="Ayesha_Khan_Resume.pdf"
          uploadedAt="Apr 10, 2026"
          aiScore={78}
          highlights={{
            experience: "5 years",
            education: "BS Computer Science",
            topSkills: "React, TypeScript, Next.js",
          }}
        />

        <section className="rounded-xl border border-slate/20 bg-white p-5 shadow-sm">
          <h2 className="font-syne text-xl font-bold text-midnight">Experience & Education</h2>
          <div className="mt-4 space-y-4">
            <article className="relative border-l-2 border-primary/25 pl-4">
              <p className="text-sm text-slate">2023 - Present</p>
              <h3 className="font-semibold text-midnight">Senior Frontend Engineer · PixelWorks</h3>
              <ul className="mt-1 list-disc pl-5 text-sm text-slate">
                <li>Led migration to Next.js and improved performance by 32%.</li>
                <li>Mentored 3 junior engineers and standardized code review workflows.</li>
              </ul>
            </article>
            <article className="relative border-l-2 border-primary/25 pl-4">
              <p className="text-sm text-slate">2019 - 2023</p>
              <h3 className="font-semibold text-midnight">Frontend Engineer · Nova Labs</h3>
              <ul className="mt-1 list-disc pl-5 text-sm text-slate">
                <li>Built reusable component library used across 6 products.</li>
                <li>Collaborated with product and design on accessibility improvements.</li>
              </ul>
            </article>
            <article className="relative border-l-2 border-cyan/25 pl-4">
              <p className="text-sm text-slate">2015 - 2019</p>
              <h3 className="font-semibold text-midnight">BS Computer Science · COMSATS University</h3>
            </article>
          </div>
        </section>

        <section className="rounded-xl border border-slate/20 bg-white p-5 shadow-sm">
          <h2 className="font-syne text-xl font-bold text-midnight">Skills</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-midnight">Required skills</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {[
                  { skill: "React", matched: true },
                  { skill: "TypeScript", matched: true },
                  { skill: "Node.js", matched: true },
                  { skill: "Docker", matched: false },
                  { skill: "AWS", matched: false },
                ].map((item) => (
                  <span
                    key={item.skill}
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      item.matched ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
                    }`}
                  >
                    {item.skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-midnight">Additional skills</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {["Figma", "Jest", "Cypress", "GraphQL", "Redux"].map((skill) => (
                  <span key={skill} className="rounded-full bg-surface px-2.5 py-1 text-xs text-midnight">
                    {skill}
                  </span>
                ))}
              </div>
              <div className="mt-4 space-y-2">
                {[
                  { name: "React", level: 92 },
                  { name: "TypeScript", level: 86 },
                  { name: "Node.js", level: 74 },
                ].map((skill) => (
                  <div key={skill.name}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-slate">{skill.name}</span>
                      <span className="font-semibold text-midnight">{skill.level}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-surface">
                      <div className="h-2 rounded-full bg-primary" style={{ width: `${skill.level}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate/20 bg-white p-5 shadow-sm">
          <h2 className="font-syne text-xl font-bold text-midnight">Candidate Snapshot</h2>
          <div className="mt-3 grid gap-3 text-sm md:grid-cols-3">
            <div className="rounded-lg bg-surface p-3">
              <p className="text-xs text-slate">Current location</p>
              <p className="mt-1 inline-flex items-center gap-1 font-medium text-midnight">
                <MapPin className="h-4 w-4 text-cyan" />
                Lahore, Pakistan
              </p>
            </div>
            <div className="rounded-lg bg-surface p-3">
              <p className="text-xs text-slate">Notice period</p>
              <p className="mt-1 font-medium text-midnight">30 days</p>
            </div>
            <div className="rounded-lg bg-surface p-3">
              <p className="text-xs text-slate">Preferred mode</p>
              <p className="mt-1 font-medium text-midnight">Hybrid / Remote</p>
            </div>
          </div>
        </section>

        <RecruiterNotes
          initialNotes={[
            {
              id: "n1",
              text: "Strong React fundamentals and excellent communication during screening call.",
              createdAt: "Apr 12, 11:15 AM",
            },
            {
              id: "n2",
              text: "Needs deeper exposure to cloud tooling; could be ramped with onboarding plan.",
              createdAt: "Apr 11, 4:40 PM",
            },
          ]}
        />
      </div>

      <BottomActionBar
        onPrev={() => {}}
        onNext={() => {}}
        onShortlist={() => setStatus("Shortlisted")}
        onReject={() => setStatus("Rejected")}
      />
    </div>
  );
}

