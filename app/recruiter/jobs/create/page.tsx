"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import StepIndicator from "@/components/recruiter/jobs/create/StepIndicator";
import Step1BasicInfo from "@/components/recruiter/jobs/create/Step1BasicInfo";
import Step2Requirements from "@/components/recruiter/jobs/create/Step2Requirements";
import Step3AISettings from "@/components/recruiter/jobs/create/Step3AISettings";
import Step4Review from "@/components/recruiter/jobs/create/Step4Review";
import type { JobPostFormData } from "@/components/recruiter/jobs/create/types";

const INITIAL_FORM_DATA: JobPostFormData = {
  jobTitle: "",
  department: "Engineering",
  jobType: "Full-time",
  workMode: "On-site",
  location: "",
  applicationDeadline: "",
  urgentHiring: false,
  salaryMin: "",
  salaryMax: "",
  currency: "PKR",
  showSalaryOnPost: true,
  salaryPer: "Year",
  experienceLevel: "Mid",
  educationRequirement: "Any",
  requiredSkills: [],
  niceToHaveSkills: [],
  openings: 1,
  jobDescription: "",
  responsibilities: [],
  benefits: [],
  aiScreeningEnabled: true,
  minMatchScore: 60,
  skillWeights: {},
  autoShortlistEnabled: false,
  autoShortlistThreshold: 85,
  screeningQuestions: [],
  aiInterviewEnabled: false,
  aiInterviewThreshold: 80,
  aiInterviewType: "Text-based Q&A",
};

export default function CreateJobPage() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [formData, setFormData] = useState<JobPostFormData>(INITIAL_FORM_DATA);

  const updateField = <K extends keyof JobPostFormData>(
    field: K,
    value: JobPostFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const stepContent = useMemo(() => {
    if (currentStep === 1) {
      return <Step1BasicInfo data={formData} onChange={updateField} />;
    }
    if (currentStep === 2) {
      return <Step2Requirements data={formData} onChange={updateField} />;
    }
    if (currentStep === 3) {
      return <Step3AISettings data={formData} onChange={updateField} />;
    }
    return <Step4Review data={formData} onEditStep={(step) => setCurrentStep(step)} />;
  }, [currentStep, formData]);

  return (
    <div className="p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="font-syne text-2xl font-bold text-midnight">Create Job Post</h1>
          <p className="text-slate">Build, review, and publish your job posting in 4 steps</p>
        </div>

        <StepIndicator currentStep={currentStep} />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.2 }}
          >
            {stepContent}
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white p-4 shadow-sm">
          <button
            type="button"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1) as 1 | 2 | 3 | 4)}
            className="rounded-lg border border-slate/25 px-4 py-2 text-sm font-semibold text-midnight disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          <div className="text-sm text-slate">
            Step <span className="font-semibold text-midnight">{currentStep}</span> of 4
          </div>

          <button
            type="button"
            disabled={currentStep === 4}
            onClick={() => setCurrentStep((prev) => Math.min(4, prev + 1) as 1 | 2 | 3 | 4)}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

