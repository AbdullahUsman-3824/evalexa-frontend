"use client";

import { DM_Sans } from "next/font/google";
import {
  useJobApplicationFormContext,
  JobApplicationFormProvider,
} from "./job-application-form-context";
import JobApplyHeader from "@/components/public/jobs/apply/JobApplyHeader";
import JobApplyTabs from "@/components/public/jobs/apply/JobApplyTabs";
import JobOverviewSection from "@/components/public/jobs/apply/JobOverviewSection";
import ApplicationTab from "@/components/public/jobs/apply/ApplicationTab";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jobData = {
  company: "Ibrands Inc.",
  logo: "TC",
  title: "FrontEnd Engineering - Internship",
  workMode: "On-site",
  location: "Lahore, Punjab, Pakistan",
  postedBy: "Fakhir Ashraf · Abdullah Usman",
  description:
    "Ibrands is excited to announce internships for Software Engineers. This is a unique opportunity for individuals passionate about technology and eager to build meaningful products with a fast-moving engineering team. As an intern, you will work closely with experienced mentors and contribute to real production systems from day one.",
  responsibilities: [
    "Assist in design, development, testing of software",
    "Support the engineering team in troubleshooting",
    "Learn and apply coding best practices",
    "Participate in daily stand-ups",
    "Document technical processes",
    "Engage in continuous learning",
  ],
  requirements: [
    "Currently enrolled in CS or related degree",
    "Basic knowledge of React or Node.js",
    "Strong problem-solving skills",
    "Good communication skills",
    "Ability to work in a team",
    "Passion for software development",
  ],
};

function JobApplyPageContent() {
  const { activeTab, contentVisible, toastMessage, setToastMessage } =
    useJobApplicationFormContext();

  return (
    <div
      className={`${dmSans.className} min-h-screen bg-[#EEF2F7] text-midnight`}
    >
      <JobApplyHeader
        company={jobData.company}
        title={jobData.title}
        workMode={jobData.workMode}
        postedBy={jobData.postedBy}
        location={jobData.location}
      />

      <JobApplyTabs />

      {toastMessage ? (
        <div className="fixed right-4 top-4 z-50 rounded-lg border border-border bg-white px-4 py-3 text-sm text-midnight shadow-lg">
          <div className="flex items-start gap-3">
            <p className="flex-1">{toastMessage}</p>
            <button type="button" onClick={() => setToastMessage("")}>
              ×
            </button>
          </div>
        </div>
      ) : null}

      <main
        className={`mx-auto max-w-180 px-4 pb-12 pt-7 transition-opacity duration-150 ${contentVisible ? "opacity-100" : "opacity-0"}`}
      >
        {activeTab === "overview" ? (
          <JobOverviewSection jobData={jobData} />
        ) : (
          <ApplicationTab />
        )}
      </main>
    </div>
  );
}

export default function PublicJobApplyPage() {
  return (
    <JobApplicationFormProvider>
      <JobApplyPageContent />
    </JobApplicationFormProvider>
  );
}
