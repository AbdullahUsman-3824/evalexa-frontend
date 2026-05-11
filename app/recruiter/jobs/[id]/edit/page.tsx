"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Loader2, TriangleAlert } from "lucide-react";
import StepIndicator from "@/components/recruiter/jobs/post/StepIndicator";
import Step1BasicInfo from "@/components/recruiter/jobs/post/Step1BasicInfo";
import Step2Requirements from "@/components/recruiter/jobs/post/Step2Requirements";
import Step3AISettings from "@/components/recruiter/jobs/post/Step3AISettings";
import Step4Review from "@/components/recruiter/jobs/post/Step4Review";
import type { JobPostFormData } from "@/components/recruiter/jobs/post/types";
import { getProfile } from "@/lib/services/authService";
import {
  getJob,
  updateJob,
  type UpdateJobPayload,
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

export default function EditJobPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const jobId = params?.id;

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [formData, setFormData] = useState<JobPostFormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const mapJobType = (
    jobType: JobPostFormData["jobType"],
  ): UpdateJobPayload["jobType"] => {
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
  ): UpdateJobPayload["experienceLevel"] => {
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
  ): UpdateJobPayload["workModel"] => {
    switch (workMode) {
      case "On-site":
        return "ONSITE";
      case "Remote":
        return "REMOTE";
      case "Hybrid":
        return "HYBRID";
    }
  };

  const reverseMapJobType = (
    backendType: string,
  ): JobPostFormData["jobType"] => {
    switch (backendType) {
      case "FULL_TIME":
        return "Full-time";
      case "PART_TIME":
        return "Part-time";
      case "CONTRACT":
        return "Contract";
      default:
        return "Full-time";
    }
  };

  const reverseMapExperienceLevel = (
    backendLevel: string,
  ): JobPostFormData["experienceLevel"] => {
    switch (backendLevel) {
      case "JUNIOR":
        return "Entry";
      case "MID":
        return "Mid";
      case "SENIOR":
        return "Senior";
      case "LEAD":
        return "Lead";
      default:
        return "Mid";
    }
  };

  const reverseMapWorkModel = (
    backendModel: string,
  ): JobPostFormData["workMode"] => {
    switch (backendModel) {
      case "ONSITE":
        return "On-site";
      case "REMOTE":
        return "Remote";
      case "HYBRID":
        return "Hybrid";
      default:
        return "On-site";
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

  useEffect(() => {
    if (!isCheckingAccess) {
      let isActive = true;

      async function loadJob() {
        if (!jobId) {
          if (isActive) {
            setLoadError("Invalid job ID");
            setIsLoading(false);
          }
          return;
        }

        setIsLoading(true);
        setLoadError(null);

        try {
          const job = await getJob(jobId);
          if (isActive) {
            const skills = job.jobSkills.map((s) => s.skill.name);
            setFormData({
              jobTitle: job.title,
              department: "Engineering",
              jobType: reverseMapJobType(job.jobType),
              workMode: reverseMapWorkModel(job.workModel),
              location: job.location === "Remote" ? "" : job.location,
              applicationDeadline: new Date(job.applicationDeadline)
                .toISOString()
                .split("T")[0],
              urgentHiring: false,
              salaryMin: job.salaryMin?.toString() ?? "",
              salaryMax: job.salaryMax?.toString() ?? "",
              currency: "PKR",
              showSalaryOnPost: true,
              salaryPer: "Year",
              experienceLevel: reverseMapExperienceLevel(job.experienceLevel),
              educationRequirement: "Any",
              requiredSkills: skills,
              niceToHaveSkills: [],
              openings: 1,
              jobDescription: job.description,
              responsibilities: [],
              benefits: [],
              aiScreeningEnabled: job.aiConfig?.minMatchScore ? true : false,
              minMatchScore: job.aiConfig?.minMatchScore ?? 60,
              skillWeights: {},
              autoShortlistEnabled: job.aiConfig?.enableAutoShortlist ?? false,
              autoShortlistThreshold:
                job.aiConfig?.autoShortlistThreshold ?? 85,
              screeningQuestions: [],
              aiInterviewEnabled: job.aiConfig?.enableAiInterview ?? false,
              aiInterviewThreshold: job.aiConfig?.aiInterviewThreshold ?? 80,
              aiInterviewType: "Text-based Q&A",
            });
          }
        } catch (error) {
          if (isActive) {
            setLoadError(
              error instanceof Error
                ? error.message
                : "Unable to load job details",
            );
          }
        } finally {
          if (isActive) {
            setIsLoading(false);
          }
        }
      }

      void loadJob();

      return () => {
        isActive = false;
      };
    }
  }, [isCheckingAccess, jobId]);

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
    status: UpdateJobPayload["status"],
  ): UpdateJobPayload => {
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

  const submitJob = async (status: UpdateJobPayload["status"]) => {
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
      await updateJob(jobId!, buildPayload(status));
      router.push(`/recruiter/jobs/${jobId}`);
    } catch (requestError) {
      setSubmitError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to update job.",
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

  let stepContent: React.ReactNode;
  if (currentStep === 1) {
    stepContent = <Step1BasicInfo data={formData} onChange={updateField} />;
  } else if (currentStep === 2) {
    stepContent = <Step2Requirements data={formData} onChange={updateField} />;
  } else if (currentStep === 3) {
    stepContent = <Step3AISettings data={formData} onChange={updateField} />;
  } else {
    stepContent = (
      <Step4Review
        data={formData}
        onEditStep={(step) => setCurrentStep(step)}
        onPublish={() => void submitJob("OPEN")}
        onSaveDraft={() => void submitJob("DRAFT")}
        isSubmitting={isSubmitting}
        error={submitError}
      />
    );
  }

  if (isCheckingAccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface p-6 text-midnight">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface p-6 text-midnight">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-surface p-6">
        <div className="rounded-xl border border-danger/20 bg-danger/5 p-6 text-center">
          <TriangleAlert className="mx-auto h-8 w-8 text-danger" />
          <p className="mt-2 text-sm text-danger">{loadError}</p>
          <Link
            href="/recruiter/jobs"
            className="mt-4 inline-block text-sm font-medium text-primary hover:text-primary/80"
          >
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <Link
          href={`/recruiter/jobs/${jobId}`}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate hover:text-midnight"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Job Details
        </Link>

        <div className="rounded-xl border border-slate/20 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-midnight">Edit Job Post</h1>
          <p className="mt-2 text-slate">
            Update the job details and requirements.
          </p>

          <div className="mt-8">
            <StepIndicator currentStep={currentStep} />

            <div className="mt-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {stepContent}
                </motion.div>
              </AnimatePresence>
            </div>

            {currentStep < 4 && (
              <div className="mt-8 flex gap-3">
                {currentStep > 1 && (
                  <button
                    onClick={() =>
                      setCurrentStep(
                        (prev) => Math.max(prev - 1, 1) as 1 | 2 | 3 | 4,
                      )
                    }
                    type="button"
                    className="rounded-lg border border-slate-200 px-6 py-3 font-medium text-midnight transition hover:bg-surface"
                  >
                    Previous Step
                  </button>
                )}
                <button
                  onClick={() =>
                    setCurrentStep(
                      (prev) => Math.min(prev + 1, 4) as 1 | 2 | 3 | 4,
                    )
                  }
                  type="button"
                  className="ml-auto rounded-lg bg-primary px-6 py-3 font-medium text-white transition hover:bg-primary/90"
                >
                  Next Step
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
