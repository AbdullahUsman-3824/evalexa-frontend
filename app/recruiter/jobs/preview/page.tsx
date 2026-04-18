"use client";

import Link from "next/link";
import { Briefcase, Calendar, MapPin } from "lucide-react";

const PREVIEW_JOB = {
  title: "Senior Frontend Developer",
  company: "Evalexa",
  location: "Karachi, Pakistan",
  workMode: "Hybrid",
  type: "Full-time",
  department: "Engineering",
  salary: "PKR 250,000 - 400,000 / Year",
  deadline: "2026-06-30",
  experience: "Senior (5+ yrs)",
  education: "Bachelor's",
  requiredSkills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
  niceToHaveSkills: ["GraphQL", "Jest"],
  description:
    "We are looking for an experienced frontend engineer to own and ship production-ready user experiences across our recruitment platform.",
  responsibilities: [
    "Build scalable, accessible UI components.",
    "Collaborate with product, design, and backend teams.",
    "Improve performance and developer experience.",
  ],
};

export default function JobPreviewPage() {
  return (
    <div className="relative p-6">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="rotate-[-24deg] text-[120px] font-extrabold tracking-[0.25em] text-slate/10">
          PREVIEW
        </span>
      </div>

      <div className="relative mx-auto max-w-5xl space-y-6">
        <div className="rounded-xl border border-warning/30 bg-warning/10 p-4">
          <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
            <div>
              <p className="font-syne text-lg font-semibold text-midnight">Preview Mode</p>
              <p className="text-sm text-slate">
                This is how your job post appears to candidates
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/recruiter/jobs/create"
                className="rounded-lg border border-primary px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/10"
              >
                Edit Post
              </Link>
              <button className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary/90">
                Publish Now
              </button>
            </div>
          </div>
        </div>

        <article className="rounded-xl border border-slate/20 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate/15 pb-4">
            <div>
              <h1 className="font-syne text-3xl font-bold text-midnight">{PREVIEW_JOB.title}</h1>
              <p className="mt-1 text-slate">{PREVIEW_JOB.company}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary">
                  {PREVIEW_JOB.type}
                </span>
                <span className="rounded-full bg-slate/15 px-3 py-1 font-semibold text-slate">
                  {PREVIEW_JOB.workMode}
                </span>
                <span className="rounded-full bg-success/10 px-3 py-1 font-semibold text-success">
                  {PREVIEW_JOB.department}
                </span>
              </div>
            </div>
            <div className="space-y-2 text-sm text-slate">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                {PREVIEW_JOB.location}
              </p>
              <p className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-primary" />
                {PREVIEW_JOB.salary}
              </p>
              <p className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Apply before {new Date(PREVIEW_JOB.deadline).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[2fr,1fr]">
            <div className="space-y-6">
              <section>
                <h2 className="mb-2 font-syne text-xl font-semibold text-midnight">Job Description</h2>
                <p className="text-sm leading-6 text-midnight">{PREVIEW_JOB.description}</p>
              </section>

              <section>
                <h2 className="mb-2 font-syne text-xl font-semibold text-midnight">Responsibilities</h2>
                <ul className="list-disc space-y-1 pl-5 text-sm text-midnight">
                  {PREVIEW_JOB.responsibilities.map((responsibility) => (
                    <li key={responsibility}>{responsibility}</li>
                  ))}
                </ul>
              </section>
            </div>

            <aside className="space-y-5">
              <section className="rounded-lg border border-slate/20 p-4">
                <h3 className="font-syne text-lg font-semibold text-midnight">Requirements</h3>
                <div className="mt-2 space-y-1 text-sm text-midnight">
                  <p><span className="text-slate">Experience:</span> {PREVIEW_JOB.experience}</p>
                  <p><span className="text-slate">Education:</span> {PREVIEW_JOB.education}</p>
                </div>
              </section>

              <section className="rounded-lg border border-slate/20 p-4">
                <h3 className="mb-2 font-syne text-lg font-semibold text-midnight">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {PREVIEW_JOB.requiredSkills.map((skill) => (
                    <span key={skill} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>

              <section className="rounded-lg border border-slate/20 p-4">
                <h3 className="mb-2 font-syne text-lg font-semibold text-midnight">Nice-to-Have</h3>
                <div className="flex flex-wrap gap-2">
                  {PREVIEW_JOB.niceToHaveSkills.map((skill) => (
                    <span key={skill} className="rounded-full bg-slate/15 px-3 py-1 text-xs font-semibold text-slate">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>

              <div className="group relative">
                <button
                  disabled
                  className="w-full cursor-not-allowed rounded-lg bg-primary/60 px-4 py-3 text-sm font-semibold text-white"
                >
                  Apply Now
                </button>
                <p className="mt-2 text-center text-xs text-slate">
                  Apply button is active for candidates
                </p>
              </div>
            </aside>
          </div>
        </article>
      </div>
    </div>
  );
}

