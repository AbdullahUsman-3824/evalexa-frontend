"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import StepIndicator from "@/components/recruiter/jobs/post/StepIndicator";
import Step1BasicInfo from "@/components/recruiter/jobs/post/Step1BasicInfo";
import Step2Requirements from "@/components/recruiter/jobs/post/Step2Requirements";
import Step3AISettings from "@/components/recruiter/jobs/post/Step3AISettings";
import Step4Review from "@/components/recruiter/jobs/post/Step4Review";
import type { JobPostFormData } from "@/components/recruiter/jobs/post/types";
import { getProfile } from "@/lib/services/authService";
import {
  createJob,
  type CreateJobPayload,
  type CreateJobSkillPayload,
} from "@/lib/services/jobsService";

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
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [formData, setFormData] = useState<JobPostFormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const mapJobType = (
    jobType: JobPostFormData["jobType"],
  ): CreateJobPayload["jobType"] => {
    switch (jobType) {
      case "Full-time":
        return "FULL_TIME";
      case "Part-time":
        return "PART_TIME";
      case "Contract":
      case "Freelance":
        return "CONTRACT";
      case "Internship":
        return "CONTRACT";
    }
  };

  const mapExperienceLevel = (
    experienceLevel: JobPostFormData["experienceLevel"],
  ): CreateJobPayload["experienceLevel"] => {
    switch (experienceLevel) {
      case "Entry":
        return "JUNIOR";
      case "Mid":
        return "MID";
      case "Senior":
        return "SENIOR";
      case "Lead":
        return "LEAD";
    }
  };

  const mapWorkModel = (
    workMode: JobPostFormData["workMode"],
  ): CreateJobPayload["workModel"] => {
    switch (workMode) {
      case "On-site":
        return "ONSITE";
      case "Remote":
        return "REMOTE";
      case "Hybrid":
        return "HYBRID";
    }
  };

  useEffect(() => {
    let isActive = true;

    const ensureRecruiterCompany = async () => {
      try {
        const profile = await getProfile();

        if (!profile.companyId) {
          router.replace("/company-setup");
          return;
        }
      } catch {
        router.replace("/login");
        return;
      }

      if (isActive) {
        setIsCheckingAccess(false);
      }
    };

    void ensureRecruiterCompany();

    return () => {
      isActive = false;
    };
  }, [router]);

  const buildSkillsPayload = (): CreateJobSkillPayload[] => {
    const category = formData.department || "General";
    const weights = { Low: 5, Medium: 10, High: 15 } as const;
    const seen = new Set<string>();

    return [...formData.requiredSkills, ...formData.niceToHaveSkills]
      .map((skill) => {
        const trimmed = skill.trim();
        if (!trimmed || seen.has(trimmed.toLowerCase())) return null;
        seen.add(trimmed.toLowerCase());

        const isRequired = formData.requiredSkills.includes(trimmed);
        const weight = formData.skillWeights[trimmed]
          ? weights[formData.skillWeights[trimmed]]
          : isRequired
            ? 10
            : 5;

        return {
          name: trimmed,
          category,
          importance: isRequired ? "REQUIRED" : "PREFERRED",
          weight,
        } as CreateJobSkillPayload;
      })
      .filter((skill): skill is NonNullable<typeof skill> => skill !== null);
  };

  const buildPayload = (
    status: CreateJobPayload["status"],
  ): CreateJobPayload => {
    const salaryMin = Number(formData.salaryMin);
    const salaryMax = Number(formData.salaryMax);
    const deadlineDate = new Date(formData.applicationDeadline);

    if (Number.isNaN(deadlineDate.getTime())) {
      throw new Error("Application deadline is invalid.");
    }

    return {
      title: formData.jobTitle.trim(),
      description: formData.jobDescription.trim(),
      jobType: mapJobType(formData.jobType),
      experienceLevel: mapExperienceLevel(formData.experienceLevel),
      salaryMin,
      salaryMax,
      location:
        formData.workMode === "Remote" ? "Remote" : formData.location.trim(),
      workModel: mapWorkModel(formData.workMode),
      status,
      applicationDeadline: deadlineDate.toISOString(),
      skills: buildSkillsPayload(),
      aiConfig: {
        minMatchScore: formData.minMatchScore,
        autoShortlistThreshold: formData.autoShortlistThreshold,
        enableAutoShortlist: formData.autoShortlistEnabled,
        enableAiInterview: formData.aiInterviewEnabled,
        aiInterviewThreshold: formData.aiInterviewThreshold,
      },
    };
  };

  const submitJob = async (status: CreateJobPayload["status"]) => {
    setSubmitError(null);

    if (!formData.jobTitle.trim()) {
      setSubmitError("Job title is required.");
      return;
    }

    if (!formData.jobDescription.trim()) {
      setSubmitError("Job description is required.");
      return;
    }

    if (!formData.applicationDeadline) {
      setSubmitError("Application deadline is required.");
      return;
    }

    if (!formData.salaryMin || !formData.salaryMax) {
      setSubmitError("Salary range is required.");
      return;
    }

    if (!formData.requiredSkills.length && !formData.niceToHaveSkills.length) {
      setSubmitError("Add at least one skill before publishing.");
      return;
    }

    if (Number(formData.salaryMin) > Number(formData.salaryMax)) {
      setSubmitError(
        "Minimum salary must be less than or equal to maximum salary.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const createdJob = await createJob(buildPayload(status));
      router.push(`/recruiter/jobs/${createdJob.id}`);
    } catch (requestError) {
      setSubmitError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to create job.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
    return (
      <Step4Review
        data={formData}
        onEditStep={(step) => setCurrentStep(step)}
        onPublish={() => void submitJob("OPEN")}
        onSaveDraft={() => void submitJob("DRAFT")}
        isSubmitting={isSubmitting}
        error={submitError}
      />
    );
  }, [currentStep, formData, isSubmitting, submitError]);

  if (isCheckingAccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface p-6 text-midnight">
        Checking job access...
      </div>
    );
  }

  return (
    <div className="p-6 text-midnight">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="font-syne text-2xl font-bold text-midnight">
            Create Job Post
          </h1>
          <p className="text-slate">
            Build, review, and publish your job posting in 4 steps
          </p>
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
            onClick={() =>
              setCurrentStep((prev) => Math.max(1, prev - 1) as 1 | 2 | 3 | 4)
            }
            className="rounded-lg border border-slate/25 px-4 py-2 text-sm font-semibold text-midnight disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          <div className="text-sm text-slate">
            Step{" "}
            <span className="font-semibold text-midnight">{currentStep}</span>{" "}
            of 4
          </div>

          <button
            type="button"
            disabled={currentStep === 4}
            onClick={() =>
              setCurrentStep((prev) => Math.min(4, prev + 1) as 1 | 2 | 3 | 4)
            }
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
