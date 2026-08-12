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
import { getProfile } from "@/repositories/auth.repository";
import { createJob, updateJob } from "@/repositories/job.repository";
import type {
  BackendEducationLevel,
  BackendExperienceLevel,
  BackendJobType,
  BackendSalaryPeriod,
  BackendWorkModel,
  CreateJobPayload,
  CreateJobSkillPayload,
  FormEducationLevel,
  FormExperienceLevel,
  FormJobType,
  FormWorkMode,
  JobPostFormData,
  JobRecord,
} from "@/types/job.types";

type JobFormMode = "create" | "edit";

interface JobFormProps {
  mode: JobFormMode;
  data?: JobRecord | null;
}

/* ── Defaults ──────────────────────────────────────────────────────────── */

const INITIAL_FORM_DATA: JobPostFormData = {
  // Step 1
  title: "",
  department: "Engineering",
  jobType: "Full-time",
  workModel: "On-site",
  location: "",
  applicationDeadline: "",
  // Step 2
  salaryMin: "",
  salaryMax: "",
  currency: "PKR",
  salaryPer: "MONTHLY",
  experienceLevel: "Mid",
  educationLevel: "Any",
  skills: [],
  description: "",
  totalOpenings: 1,
  // Step 3 — AI config
  enableRanking: true,
  enableAutoShortlisting: true,
  shortlistLimit: 5,
  minimumMatchScore: 70,
  enableAiInterview: false,
  interviewLimit: null,
};

/* ── Enum mappers (UI label → backend enum) ────────────────────────────── */

function toBackendJobType(v: FormJobType): BackendJobType {
  const map: Record<FormJobType, BackendJobType> = {
    "Full-time": "FULL_TIME",
    "Part-time": "PART_TIME",
    Contract: "CONTRACT",
    Internship: "INTERN",
    Freelance: "FREELANCE",
  };
  return map[v];
}

function toBackendWorkModel(v: FormWorkMode): BackendWorkModel {
  const map: Record<FormWorkMode, BackendWorkModel> = {
    "On-site": "ONSITE",
    Remote: "REMOTE",
    Hybrid: "HYBRID",
  };
  return map[v];
}

function toBackendExperienceLevel(
  v: FormExperienceLevel,
): BackendExperienceLevel {
  const map: Record<FormExperienceLevel, BackendExperienceLevel> = {
    Intern: "INTERN",
    Entry: "JUNIOR",
    Mid: "MID",
    Senior: "SENIOR",
    Lead: "LEAD",
  };
  return map[v];
}

function toBackendEducationLevel(v: FormEducationLevel): BackendEducationLevel {
  const map: Record<FormEducationLevel, BackendEducationLevel> = {
    Any: "ANY",
    "High School": "HIGH_SCHOOL",
    Diploma: "DIPLOMA",
    Associate: "ASSOCIATE",
    "Bachelor's": "BACHELOR",
    "Master's": "MASTER",
    PhD: "PHD",
  };
  return map[v];
}

function toBackendSalaryPeriod(v: BackendSalaryPeriod): BackendSalaryPeriod {
  return v; // already a backend enum in the form
}

/* ── Reverse mappers (backend enum → UI label, for edit mode) ──────────── */

function toFormJobType(v: BackendJobType): FormJobType {
  const map: Record<BackendJobType, FormJobType> = {
    FULL_TIME: "Full-time",
    PART_TIME: "Part-time",
    CONTRACT: "Contract",
    INTERN: "Internship",
    FREELANCE: "Freelance",
  };
  return map[v] ?? "Full-time";
}

function toFormWorkMode(v: BackendWorkModel): FormWorkMode {
  const map: Record<BackendWorkModel, FormWorkMode> = {
    ONSITE: "On-site",
    REMOTE: "Remote",
    HYBRID: "Hybrid",
  };
  return map[v] ?? "On-site";
}

function toFormExperienceLevel(v: BackendExperienceLevel): FormExperienceLevel {
  const map: Record<BackendExperienceLevel, FormExperienceLevel> = {
    INTERN: "Intern",
    JUNIOR: "Entry",
    MID: "Mid",
    SENIOR: "Senior",
    LEAD: "Lead",
  };
  return map[v] ?? "Mid";
}

function toFormEducationLevel(v: BackendEducationLevel): FormEducationLevel {
  const map: Record<BackendEducationLevel, FormEducationLevel> = {
    ANY: "Any",
    HIGH_SCHOOL: "High School",
    DIPLOMA: "Diploma",
    ASSOCIATE: "Associate",
    BACHELOR: "Bachelor's",
    MASTER: "Master's",
    PHD: "PhD",
  };
  return map[v] ?? "Any";
}

function formatDateForInput(value?: string): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
}

/* ── Build form state from a JobRecord (edit mode) ─────────────────────── */

function buildFormData(record?: JobRecord | null): JobPostFormData {
  if (!record) return { ...INITIAL_FORM_DATA };

  const ai = record.aiConfig;

  return {
    // Step 1
    title: record.title ?? "",
    department: record.department ?? INITIAL_FORM_DATA.department,
    jobType: toFormJobType(record.jobType),
    workModel: toFormWorkMode(record.workModel),
    location: record.workModel === "REMOTE" ? "" : (record.location ?? ""),
    applicationDeadline: formatDateForInput(record.applicationDeadline),
    // Step 2
    salaryMin: record.salaryMin?.toString() ?? "",
    salaryMax: record.salaryMax?.toString() ?? "",
    currency: record.salaryCurrency ?? "PKR",
    salaryPer: record.salaryPeriod ?? "MONTHLY",
    experienceLevel: toFormExperienceLevel(record.experienceLevel),
    educationLevel: toFormEducationLevel(record.educationLevel),
    skills: (record.jobSkills ?? []).map((s) => ({
      skillId: s.skillId,
      name: s.skill?.name ?? "",
      category: s.skill?.category ?? "",
      importance: s.importance,
      weight: s.weight,
    })),
    description: record.description ?? "",
    totalOpenings: record.totalOpenings ?? 1,
    // Step 3 — AI config
    enableRanking: ai?.enableRanking ?? true,
    enableAutoShortlisting: ai?.enableAutoShortlisting ?? true,
    shortlistLimit: ai?.shortlistLimit ?? 5,
    minimumMatchScore: ai?.minimumMatchScore ?? 70,
    enableAiInterview: ai?.enableAiInterview ?? false,
    interviewLimit: ai?.interviewLimit ?? null,
  };
}

/* ── Component ─────────────────────────────────────────────────────────── */

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

  /* ── Payload builder ─────────────────────────────────────────────────── */

  const buildSkillsPayload = (): CreateJobSkillPayload[] =>
    formData.skills.map(({ skillId, importance, weight }) => ({
      skillId,
      importance,
      weight,
    }));

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
      title: formData.title.trim(),
      department: formData.department.trim(),
      location:
        formData.workModel === "Remote" ? "Remote" : formData.location.trim(),
      jobType: toBackendJobType(formData.jobType),
      workModel: toBackendWorkModel(formData.workModel),
      description: formData.description.trim(),
      applicationDeadline: deadlineDate.toISOString(),
      experienceLevel: toBackendExperienceLevel(formData.experienceLevel),
      educationLevel: toBackendEducationLevel(formData.educationLevel),
      salary: {
        min: salaryMin,
        max: salaryMax,
        currency: formData.currency,
        period: toBackendSalaryPeriod(formData.salaryPer),
      },
      status,
      totalOpenings: Number(formData.totalOpenings) || 1,
      skills: buildSkillsPayload(),
      aiConfig: {
        enableRanking: formData.enableRanking,
        enableAutoShortlisting: formData.enableAutoShortlisting,
        shortlistLimit: formData.shortlistLimit,
        minimumMatchScore: formData.minimumMatchScore,
        enableAiInterview: formData.enableAiInterview,
        interviewLimit: formData.interviewLimit,
      },
    };
  };

  /* ── Submit ──────────────────────────────────────────────────────────── */

  const submitJob = async (status: CreateJobPayload["status"]) => {
    setSubmitError(null);

    if (!formData.title.trim()) {
      setSubmitError("Job title is required.");
      return;
    }
    if (!formData.description.trim()) {
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
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Unable to save job.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Field updater ───────────────────────────────────────────────────── */

  const updateField = <K extends keyof JobPostFormData>(
    field: K,
    value: JobPostFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  /* ── Guards ──────────────────────────────────────────────────────────── */

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

  /* ── Render ──────────────────────────────────────────────────────────── */

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
          <button
            type="button"
            onClick={() => void submitJob("DRAFT")}
            disabled={isSubmitting}
            className="rounded-lg border border-slate/25 px-4 py-2 text-sm font-semibold text-midnight hover:bg-slate/5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Save as draft
          </button>

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
