"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import StepIndicator from "@/components/recruiter/jobs/management/StepIndicator";
import Step1BasicInfo from "@/components/recruiter/jobs/management/Step1BasicInfo";
import Step2Requirements from "@/components/recruiter/jobs/management/Step2Requirements";
import Step3AISettings from "@/components/recruiter/jobs/management/Step3AISettings";
import Step4Review from "@/components/recruiter/jobs/management/Step4Review";
import type { JobPostFormData } from "@/components/recruiter/jobs/management/types";
import { getProfile } from "@/repositories/auth.repository";
import {
  createJob,
  updateJob,
  type CreateJobPayload,
  type CreateJobSkillPayload,
  type JobRecord,
} from "@/lib/services/jobs-service";

type JobFormMode = "create" | "edit";

interface JobFormProps {
  mode: JobFormMode;
  data?: JobRecord | null;
}

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
  salaryPer: "MONTHLY",
  experienceLevel: "Mid",
  educationRequirement: "Any",
  skills: [],
  jobDescription: "",
  responsibilities: "",
  aiScreeningEnabled: true,
  minMatchScore: 60,
  autoShortlistEnabled: false,
  autoShortlistThreshold: 85,
  screeningQuestions: [],
  aiInterviewEnabled: false,
  aiInterviewThreshold: 80,
  aiInterviewType: "Text-based Q&A",
  resumeSelectionCount: 20,
  interviewSelectionCount: 5,
  enableAutoShortlist: true,
  enableAiInterview: true,
};

function mapJobType(
  jobType: JobPostFormData["jobType"],
): CreateJobPayload["jobType"] {
  switch (jobType) {
    case "Full-time":
      return "FULL_TIME";
    case "Part-time":
      return "PART_TIME";
    case "Contract":
    case "Freelance":
    case "Internship":
      return "CONTRACT";
    default:
      return "CONTRACT";
  }
}

function mapEducationLevel(
  educationLevel: JobPostFormData["educationRequirement"],
): CreateJobPayload["educationLevel"] {
  switch (educationLevel) {
    case "High School":
      return "HIGH_SCHOOL";
    case "Bachelor's":
      return "BACHELOR";
    case "Master's":
      return "MASTER";
    case "PhD":
      return "PHD";
    default:
      return undefined;
  }
}

function mapExperienceLevel(
  experienceLevel: JobPostFormData["experienceLevel"],
): CreateJobPayload["experienceLevel"] {
  switch (experienceLevel) {
    case "Entry":
      return "JUNIOR";
    case "Mid":
      return "MID";
    case "Senior":
      return "SENIOR";
    case "Lead":
      return "LEAD";
    default:
      return "MID";
  }
}

function mapWorkModel(
  workMode: JobPostFormData["workMode"],
): CreateJobPayload["workModel"] {
  switch (workMode) {
    case "On-site":
      return "ONSITE";
    case "Remote":
      return "REMOTE";
    case "Hybrid":
      return "HYBRID";
    default:
      return "ONSITE";
  }
}

function formatDateForInput(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
}

function buildFormData(data?: JobRecord | null): JobPostFormData {
  if (!data) return { ...INITIAL_FORM_DATA };

  return {
    ...INITIAL_FORM_DATA,
    jobTitle: data.title,
    workMode:
      data.workModel === "REMOTE"
        ? "Remote"
        : data.workModel === "HYBRID"
          ? "Hybrid"
          : "On-site",
    location: data.workModel === "REMOTE" ? "" : data.location,
    applicationDeadline: formatDateForInput(data.applicationDeadline),
    salaryMin: data.salaryMin?.toString() ?? "",
    salaryMax: data.salaryMax?.toString() ?? "",
    jobDescription: data.description,
    skills: data.jobSkills.map((skill) => ({
      skillId: skill.skillId,
      name: skill.skill.name,
      category: skill.skill.category,
      importance: skill.importance,
      weight: skill.weight,
    })),
    aiScreeningEnabled: Boolean(data.aiConfig?.minMatchScore),
    minMatchScore: data.aiConfig?.minMatchScore ?? 60,
    autoShortlistEnabled: data.aiConfig?.enableAutoShortlist ?? false,
    autoShortlistThreshold: data.aiConfig?.autoShortlistThreshold ?? 85,
    aiInterviewEnabled: data.aiConfig?.enableAiInterview ?? false,
    aiInterviewThreshold: data.aiConfig?.aiInterviewThreshold ?? 80,
  };
}

export default function JobForm({ mode, data }: JobFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [formData, setFormData] = useState<JobPostFormData>(() =>
    buildFormData(data),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    setFormData(buildFormData(data));
    setCurrentStep(1);
    setSubmitError(null);
  }, [data, mode]);

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

      if (isActive) setIsCheckingAccess(false);
    };

    void ensureRecruiterCompany();

    return () => {
      isActive = false;
    };
  }, [router]);

  const buildSkillsPayload = (): CreateJobSkillPayload[] => {
    return formData.skills.map((skill) => ({
      skillId: skill.skillId,
      importance: skill.importance,
      weight: skill.weight,
    }));
  };

  const buildPayload = (
    status: CreateJobPayload["status"],
  ): CreateJobPayload => {
    const salaryMin = Number(formData.salaryMin);
    const salaryMax = Number(formData.salaryMax);
    const deadlineDate = new Date(formData.applicationDeadline);
    const responsibilities =
      typeof formData.responsibilities === "string"
        ? formData.responsibilities.trim()
        : Array.isArray(formData.responsibilities)
          ? formData.responsibilities.join("\n").trim()
          : "";

    if (Number.isNaN(deadlineDate.getTime())) {
      throw new Error("Application deadline is invalid.");
    }

    return {
      title: formData.jobTitle.trim(),
      description: formData.jobDescription.trim(),
      department: formData.department.trim(),
      responsibilities,
      jobType: mapJobType(formData.jobType),
      experienceLevel: mapExperienceLevel(formData.experienceLevel),
      educationLevel: mapEducationLevel(formData.educationRequirement),
      salary: {
        min: salaryMin,
        max: salaryMax,
        currency: formData.currency,
        period: formData.salaryPer,
      },
      location:
        formData.workMode === "Remote" ? "Remote" : formData.location.trim(),
      workModel: mapWorkModel(formData.workMode),
      status,
      applicationDeadline: deadlineDate.toISOString(),
      skills: buildSkillsPayload(),
      aiConfig: {
        enableAutoShortlist:
          formData.enableAutoShortlist ?? formData.autoShortlistEnabled,
        enableAiInterview:
          formData.enableAiInterview ?? formData.aiInterviewEnabled,
        resumeSelectionCount: formData.resumeSelectionCount ?? 20,
        interviewSelectionCount: formData.interviewSelectionCount ?? 5,
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
    if (Number(formData.salaryMin) > Number(formData.salaryMax)) {
      setSubmitError(
        "Minimum salary must be less than or equal to maximum salary.",
      );
      return;
    }
    if (formData.skills.length === 0) {
      setSubmitError("Add at least one skill before publishing.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = buildPayload(status);
      const savedJob =
        mode === "edit" && data?.id
          ? await updateJob(data.id, payload)
          : await createJob(payload);

      router.push(`/recruiter/jobs/${savedJob.id}`);
    } catch (requestError) {
      setSubmitError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to save job.",
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

  if (isCheckingAccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface p-6 text-midnight">
        Checking job access...
      </div>
    );
  }

  if (mode === "edit" && !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface p-6 text-midnight">
        Loading job details...
      </div>
    );
  }

  const stepContent = (() => {
    if (currentStep === 1)
      return <Step1BasicInfo data={formData} onChange={updateField} />;
    if (currentStep === 2)
      return <Step2Requirements data={formData} onChange={updateField} />;
    if (currentStep === 3)
      return <Step3AISettings data={formData} onChange={updateField} />;
    return (
      <Step4Review
        data={formData}
        onEditStep={(step: 1 | 2 | 3) => setCurrentStep(step)}
        onPublish={() => void submitJob("OPEN")}
        onSaveDraft={() => void submitJob("DRAFT")}
        isSubmitting={isSubmitting}
        error={submitError}
      />
    );
  })();

  return (
    <div className="p-6 text-midnight">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-syne text-2xl font-bold text-midnight">
            {mode === "edit" ? "Edit job post" : "Create job post"}
          </h1>
          <p className="text-slate">
            {mode === "edit"
              ? "Review and update the job posting in 4 steps"
              : "Build, review, and publish your job posting in 4 steps"}
          </p>
        </div>

        {/* Step indicator */}
        <StepIndicator currentStep={currentStep} />

        {/* Step content */}
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

        {/* Navigation */}
        <div className="flex items-center justify-between">
          {/* Left: Save as draft */}
          <button
            type="button"
            onClick={() => void submitJob("DRAFT")}
            disabled={isSubmitting}
            className="rounded-lg border border-slate/25 px-4 py-2 text-sm font-semibold text-midnight hover:bg-slate/5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Save as draft
          </button>

          {/* Right: Back + Continue */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentStep === 1}
              onClick={() =>
                setCurrentStep((prev) => Math.max(1, prev - 1) as 1 | 2 | 3 | 4)
              }
              className="flex w-28 items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>

            <button
              type="button"
              disabled={currentStep === 4}
              onClick={() =>
                setCurrentStep((prev) => Math.min(4, prev + 1) as 1 | 2 | 3 | 4)
              }
              className="flex w-28 items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continue
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
