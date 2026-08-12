"use client";

import { useRef, useState, type FormEvent, useEffect } from "react";
import {
  CheckCircle,
  ChevronDown,
  Info,
  Loader2,
  Plus,
  UploadCloud,
  X,
  Zap,
} from "lucide-react";
import {
  submitPublicJobApplication,
  parsePublicResume,
} from "@/repositories/job.repository";
import type {
  ResumeParsePreview,
  PublicJobApplicationPayload,
} from "@/types/job.types";

export type JobDetailData = {
  jobId: string;
  companyId: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
};

type EducationDraft = {
  level: string;
  field: string;
  institution: string;
  startYear: string;
  endYear: string;
};

type ExperienceDraft = {
  title: string;
  company: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  current: boolean;
  description: string;
};

type EducationEntry = EducationDraft & { id: string };
type ExperienceEntry = ExperienceDraft & { id: string };

type SkillEntry = {
  name: string;
  category?: string;
};

type Errors = Partial<
  Record<
    "firstName" | "lastName" | "email" | "phone" | "address" | "resume",
    string
  >
>;

const countryCodes = [
  { flag: "🇵🇰", code: "+92" },
  { flag: "🇮🇳", code: "+91" },
  { flag: "🇺🇸", code: "+1" },
  { flag: "🇬🇧", code: "+44" },
  { flag: "🇦🇪", code: "+971" },
  { flag: "🇸🇦", code: "+966" },
];

const degreeLevels = [
  "High School",
  "Diploma",
  "Bachelor's",
  "Master's",
  "PhD",
  "Other",
];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const years = Array.from(
  { length: 50 },
  (_, index) => `${new Date().getFullYear() + 1 - index}`,
);

const ACCEPTED_RESUME_EXTENSIONS = ".pdf,.doc,.docx";
const ACCEPTED_RESUME_LABEL = ".pdf, .doc, .docx";
const MAX_RESUME_SIZE_BYTES = 10 * 1024 * 1024;

const emptyEducationDraft: EducationDraft = {
  level: "",
  field: "",
  institution: "",
  startYear: "",
  endYear: "",
};

const emptyExperienceDraft: ExperienceDraft = {
  title: "",
  company: "",
  startMonth: "",
  startYear: "",
  endMonth: "",
  endYear: "",
  current: false,
  description: "",
};

const inputBaseClass =
  "h-[46px] w-full rounded-[10px] border-[1.5px] border-[#E2E8F4] bg-[#F8FAFF] px-4 text-[14px] text-[#0D1B2A] outline-none transition focus:border-[#1E6FFF] focus:bg-white focus:shadow-[0_0_0_3px_rgba(30,111,255,0.10)] disabled:cursor-not-allowed disabled:opacity-60";
const textareaBaseClass =
  "w-full rounded-[10px] border-[1.5px] border-[#E2E8F4] bg-[#F8FAFF] px-4 py-2 text-[14px] text-[#0D1B2A] outline-none transition focus:border-[#1E6FFF] focus:bg-white focus:shadow-[0_0_0_3px_rgba(30,111,255,0.10)] disabled:cursor-not-allowed disabled:opacity-60";

function FieldError({ message }: { message?: string }) {
  return (
    <p
      className={`mt-1 text-xs text-[#DC2626] transition-opacity duration-150 ${
        message ? "opacity-100" : "opacity-0"
      }`}
      aria-live="polite"
    >
      {message ?? "placeholder"}
    </p>
  );
}

function SectionCard({
  title,
  onClear,
  children,
}: {
  title: string;
  onClear?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4 rounded-[14px] border border-[#E8ECF4] bg-white px-7 py-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
      <div className="mb-4 flex items-center justify-between border-b border-[#F0F4FA] pb-4">
        <h2 className="border-l-4 border-[#1E6FFF] pl-3 text-[17px] font-semibold text-[#0D1B2A]">
          {title}
        </h2>
        {onClear ? (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1 text-[13px] text-[#9BA3B2] transition hover:text-[#E63946]"
          >
            Clear
          </button>
        ) : null}
      </div>
      {children}
    </div>
  );
}

export default function JobApplicationForm({
  jobSlug,
  jobData,
  initialData = null,
}: {
  jobSlug: string;
  jobData: JobDetailData;
  initialData?: ResumeParsePreview | null;
}) {
  // --- Personal ---
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [headline, setHeadline] = useState("");
  const [countryCode, setCountryCode] = useState(
    countryCodes[0]?.code ?? "+92",
  );
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // --- Education ---
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [educationDraft, setEducationDraft] =
    useState<EducationDraft>(emptyEducationDraft);
  const [educations, setEducations] = useState<EducationEntry[]>([]);

  // --- Experience ---
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [experienceDraft, setExperienceDraft] =
    useState<ExperienceDraft>(emptyExperienceDraft);
  const [experiences, setExperiences] = useState<ExperienceEntry[]>([]);

  // --- Summary & Cover Letter ---
  const [summary, setSummary] = useState("");
  const [coverLetter, setCoverLetter] = useState("");

  // --- Skills ---
  const [skills, setSkills] = useState<SkillEntry[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [skillCategory, setSkillCategory] = useState("");

  // --- Resume ---
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isImportMenuOpen, setIsImportMenuOpen] = useState(false);

  const parseRequestIdRef = useRef(0);
  const hasAppliedInitial = useRef(false);

  // --- Refs ---
  const autofillInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const resumeRef = useRef<HTMLDivElement>(null);

  const requiredFilled =
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    email.trim().length > 0 &&
    /^\S+@\S+\.\S+$/.test(email.trim()) &&
    phone.trim().length > 0 &&
    address.trim().length > 0 &&
    Boolean(resumeFile);

  // --- Clear functions ---
  const clearPersonalSection = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setHeadline("");
    setCountryCode(countryCodes[0]?.code ?? "+92");
    setPhone("");
    setAddress("");
    setErrors((prev) => ({
      ...prev,
      firstName: undefined,
      lastName: undefined,
      email: undefined,
      phone: undefined,
      address: undefined,
    }));
  };

  const clearProfileSection = () => {
    setEducations([]);
    setExperiences([]);
    setSummary("");
    setResumeFile(null);
    setSkills([]);
    setShowEducationForm(false);
    setShowExperienceForm(false);
    setEducationDraft(emptyEducationDraft);
    setExperienceDraft(emptyExperienceDraft);
    setErrors((prev) => ({ ...prev, resume: undefined }));
  };

  const clearDetailsSection = () => {
    setCoverLetter("");
  };

  // --- Import menu ---
  const handleImportSourceSelect = (
    source: "device" | "google-drive" | "dropbox" | "linkedin",
  ) => {
    setIsImportMenuOpen(false);
    if (source === "device") {
      autofillInputRef.current?.click();
      return;
    }
    setToastMessage(
      "This import source is coming soon. Please use This device for now.",
    );
    window.setTimeout(() => setToastMessage(""), 2500);
  };

  // --- Helper functions ---
  const parseDate = (
    dateString: string | null | undefined,
  ): { month: string; year: string } => {
    if (!dateString) return { month: "", year: "" };
    if (/^\d{2}\/\d{4}$/.test(dateString)) {
      const [monthStr, yearStr] = dateString.split("/");
      const monthNum = parseInt(monthStr, 10) - 1;
      return {
        month:
          monthNum >= 0 && monthNum < months.length ? months[monthNum] : "",
        year: yearStr || "",
      };
    }
    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return {
          month: months[date.getMonth()] || "",
          year: String(date.getFullYear()),
        };
      }
    } catch {
      // ignore
    }
    return { month: "", year: "" };
  };

  const splitPhone = (
    value: string | null | undefined,
  ): { code: string; number: string } => {
    if (!value) return { code: countryCodes[0]?.code ?? "+92", number: "" };
    const trimmed = value.trim();
    const match = trimmed.match(/^(\+\d+)\s*(.*)$/);
    if (!match)
      return { code: countryCodes[0]?.code ?? "+92", number: trimmed };
    return {
      code: match[1] || countryCodes[0]?.code || "+92",
      number: (match[2] || "").trim(),
    };
  };

  const normalizePhoneForSubmit = (code: string, value: string): string => {
    const trimmed = value.trim();
    if (!trimmed) return "";
    if (/^\+\d+/.test(trimmed)) return trimmed;
    return `${code} ${trimmed}`.trim();
  };

  const toIsoDateFromMonthYear = (
    monthName: string,
    year: string,
    fallbackDay: "01" | "28" = "01",
  ): string | undefined => {
    const cleanYear = year.trim();
    if (!cleanYear) return undefined;
    const monthIndex = months.findIndex(
      (m) => m.toLowerCase() === monthName.trim().toLowerCase(),
    );
    if (monthIndex < 0) return undefined;
    return `${cleanYear}-${String(monthIndex + 1).padStart(2, "0")}-${fallbackDay}`;
  };

  const toIsoDateFromYear = (
    year: string,
    fallbackMonthDay: "01-01" | "12-28" = "01-01",
  ): string | undefined => {
    const cleanYear = year.trim();
    if (!cleanYear) return undefined;
    return `${cleanYear}-${fallbackMonthDay}`;
  };

  // --- Apply parsed preview ---
  const applyParsePreview = (preview: ResumeParsePreview) => {
    if (preview.personal) {
      const p = preview.personal;
      if (p.firstName && !firstName.trim()) setFirstName(p.firstName);
      if (p.lastName && !lastName.trim()) setLastName(p.lastName);
      if (p.email && !email.trim()) setEmail(p.email);
      if (p.phone && !phone.trim()) {
        const parsed = splitPhone(p.phone);
        setCountryCode(parsed.code);
        setPhone(parsed.number);
      }
      if (p.headline && !headline.trim()) setHeadline(p.headline);
      if (p.address && !address.trim()) setAddress(p.address);
    }

    if (Array.isArray(preview.education) && preview.education.length > 0) {
      setEducations((prev) => {
        if (prev.length > 0) return prev;
        return preview.education.map((e) => ({
          id: crypto.randomUUID(),
          level: e.degree ?? "",
          field: e.field ?? "",
          institution: e.institution ?? "",
          startYear: parseDate(e.startDate).year,
          endYear: parseDate(e.endDate).year,
        }));
      });
    }

    if (Array.isArray(preview.experience) && preview.experience.length > 0) {
      setExperiences((prev) => {
        if (prev.length > 0) return prev;
        return preview.experience.map((ex) => {
          const startParsed = parseDate(ex.startDate);
          const endParsed = parseDate(ex.endDate);
          return {
            id: crypto.randomUUID(),
            title: ex.title ?? "",
            company: ex.company ?? "",
            startMonth: startParsed.month,
            startYear: startParsed.year,
            endMonth: endParsed.month,
            endYear: endParsed.year,
            current: Boolean(ex.isCurrent),
            description: ex.description ?? "",
          };
        });
      });
    }

    // --- Handle skills: support both string[] and { name, category }[] ---
    if (Array.isArray(preview.skills) && preview.skills.length > 0) {
      const skillEntries: SkillEntry[] = preview.skills.flatMap((skill) => {
        if (skill && typeof skill === "object" && "name" in skill) {
          return {
            name: (skill as { name: string }).name,
            category: (skill as { category?: string }).category || "",
          };
        }
        if (typeof skill === "string") {
          return { name: skill, category: "" };
        }
        return [];
      });
      setSkills((prev) => (prev.length === 0 ? skillEntries : prev));
    }
  };

  // --- Apply initialData on mount ---
  useEffect(() => {
    if (initialData && !hasAppliedInitial.current) {
      applyParsePreview(initialData);
      hasAppliedInitial.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  // --- Resume file handler ---
  const handleResumeSelected = (file: File | null) => {
    if (!file) return;
    if (file.size > MAX_RESUME_SIZE_BYTES) {
      setErrors((prev) => ({
        ...prev,
        resume: "File is too large. Maximum size is 10 MB.",
      }));
      return;
    }
    setResumeFile(file);
    setErrors((prev) => ({ ...prev, resume: undefined }));

    const requestId = ++parseRequestIdRef.current;
    (async () => {
      setIsParsing(true);
      try {
        const preview = await parsePublicResume(file);
        if (parseRequestIdRef.current !== requestId) return;
        applyParsePreview(preview);
        setToastMessage("Resume parsed. Review the autofilled details below.");
        window.setTimeout(() => setToastMessage(""), 2500);
      } catch (err: unknown) {
        if (parseRequestIdRef.current !== requestId) return;
        setToastMessage(
          err instanceof Error
            ? `Couldn't read details from this file: ${err.message}. You can still fill the form manually.`
            : "Couldn't read details from this file. You can still fill the form manually.",
        );
        window.setTimeout(() => setToastMessage(""), 4000);
      } finally {
        if (parseRequestIdRef.current === requestId) {
          setIsParsing(false);
        }
      }
    })();
  };

  // --- Add / remove education & experience ---
  const addEducation = () => {
    if (!educationDraft.level || !educationDraft.institution) return;
    setEducations((prev) => [
      ...prev,
      { ...educationDraft, id: crypto.randomUUID() },
    ]);
    setEducationDraft(emptyEducationDraft);
    setShowEducationForm(false);
  };

  const addExperience = () => {
    if (!experienceDraft.title || !experienceDraft.company) return;
    setExperiences((prev) => [
      ...prev,
      { ...experienceDraft, id: crypto.randomUUID() },
    ]);
    setExperienceDraft(emptyExperienceDraft);
    setShowExperienceForm(false);
  };

  const removeResume = () => {
    setResumeFile(null);
    parseRequestIdRef.current += 1;
  };

  // --- Skills handlers ---
  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.some((s) => s.name === trimmed)) {
      setSkills((prev) => [
        ...prev,
        { name: trimmed, category: skillCategory.trim() || undefined },
      ]);
      setSkillInput("");
      setSkillCategory("");
    }
  };

  const removeSkill = (skillName: string) => {
    setSkills((prev) => prev.filter((s) => s.name !== skillName));
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  // --- Validation ---
  const validate = () => {
    const nextErrors: Errors = {};
    if (!firstName.trim()) nextErrors.firstName = "This field is required";
    if (!lastName.trim()) nextErrors.lastName = "This field is required";
    if (!email.trim()) {
      nextErrors.email = "This field is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      nextErrors.email = "Please enter a valid email";
    }
    if (!phone.trim()) nextErrors.phone = "This field is required";
    if (!address.trim()) nextErrors.address = "This field is required";
    if (!resumeFile) nextErrors.resume = "This field is required";
    return nextErrors;
  };

  const scrollToFirstError = (nextErrors: Errors) => {
    const order: Array<keyof Errors> = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "resume",
    ];
    const refMap = {
      firstName: firstNameRef,
      lastName: lastNameRef,
      email: emailRef,
      phone: phoneRef,
      address: addressRef,
      resume: resumeRef,
    };
    const firstErrorKey = order.find((key) => nextErrors[key]);
    if (!firstErrorKey) return;
    const target = refMap[firstErrorKey].current;
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    if (target instanceof HTMLInputElement) target.focus();
  };

  const resetAll = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setHeadline("");
    setCountryCode(countryCodes[0]?.code ?? "+92");
    setPhone("");
    setAddress("");
    setEducations([]);
    setExperiences([]);
    setSkills([]);
    setEducationDraft(emptyEducationDraft);
    setExperienceDraft(emptyExperienceDraft);
    setShowEducationForm(false);
    setShowExperienceForm(false);
    setSummary("");
    setCoverLetter("");
    setResumeFile(null);
    setErrors({});
  };

  // --- Submit ---
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      scrollToFirstError(nextErrors);
      return;
    }
    if (!jobSlug) {
      setToastMessage("Unable to determine job. Please try again.");
      window.setTimeout(() => setToastMessage(""), 3000);
      return;
    }
    if (!resumeFile) {
      setToastMessage("Please attach your resume.");
      window.setTimeout(() => setToastMessage(""), 3000);
      return;
    }

    setSubmitting(true);
    try {
      const payload: PublicJobApplicationPayload = {
        personal: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim() || undefined,
          phone: normalizePhoneForSubmit(countryCode, phone) || undefined,
          headline: headline.trim() || undefined,
          address: address.trim() || undefined,
        },
        education: educations.map((item) => ({
          school: item.institution.trim(),
          fieldOfStudy: item.field.trim() || undefined,
          degree: item.level.trim() || undefined,
          startDate: toIsoDateFromYear(item.startYear, "01-01"),
          endDate: toIsoDateFromYear(item.endYear, "12-28"),
        })),
        experience: experiences.map((item) => ({
          title: item.title.trim(),
          company: item.company.trim() || undefined,
          industry: undefined,
          summary: item.description.trim() || undefined,
          startDate: toIsoDateFromMonthYear(
            item.startMonth,
            item.startYear,
            "01",
          ),
          endDate: item.current
            ? undefined
            : toIsoDateFromMonthYear(item.endMonth, item.endYear, "28"),
          isCurrent: item.current,
        })),
        skills: skills.map((skill) => ({
          name: skill.name.trim(),
          category: skill.category?.trim() || "",
        })),
      };

      await submitPublicJobApplication(jobSlug, payload, resumeFile);
      setToastMessage("Application submitted successfully.");
      resetAll();
      window.setTimeout(() => setToastMessage(""), 3000);
    } catch (err: unknown) {
      setToastMessage(
        err instanceof Error
          ? err.message
          : "Submission failed. Please try again.",
      );
      window.setTimeout(() => setToastMessage(""), 4000);
    } finally {
      setSubmitting(false);
    }
  };

  const isBusy = isParsing || submitting;

  // --- Render --- (unchanged from previous version)
  return (
    <section className="space-y-4 px-0 sm:px-4">
      {toastMessage ? (
        <div className="fixed right-6 top-6 z-50 w-[340px]">
          <div className="rounded-lg bg-white/95 p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full bg-[#1E6FFF]" />
              <p className="flex-1 text-sm text-[#0D1B2A]">{toastMessage}</p>
              <button type="button" onClick={() => setToastMessage("")}>
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mb-5 flex items-center justify-between rounded-lg border-[1.5px] border-primary bg-white p-4 shadow-[0_2px_12px_rgba(30,111,255,0.08)]">
        <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#EEF4FF]">
              <Zap size={16} className="text-primary" />
            </span>
            <div>
              <div className="text-[12px] font-bold uppercase tracking-[0.08em] text-primary">
                AUTOFILL APPLICATION
              </div>
              <p className="mt-2 text-[13px] text-slate">
                Save time by importing your resume in one of the following
                formats: {ACCEPTED_RESUME_LABEL}
              </p>
            </div>
          </div>

          <div className="relative w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setIsImportMenuOpen((prev) => !prev)}
              disabled={isBusy}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-[14px] font-medium text-white shadow-[0_4px_12px_rgba(30,111,255,0.3)] disabled:cursor-not-allowed disabled:opacity-60"
              aria-expanded={isImportMenuOpen}
              aria-haspopup="menu"
            >
              Import resume from
              <ChevronDown
                size={16}
                className={`transition-transform ${isImportMenuOpen ? "rotate-180" : "rotate-0"}`}
              />
            </button>

            {isImportMenuOpen && (
              <div
                className="absolute right-0 z-20 mt-2 w-full min-w-56 rounded-lg border border-border bg-white p-1 shadow-lg sm:w-56"
                role="menu"
              >
                <button
                  type="button"
                  onClick={() => handleImportSourceSelect("device")}
                  className="block w-full rounded-md px-3 py-2 text-left text-sm text-midnight transition hover:bg-surface"
                  role="menuitem"
                >
                  This device
                </button>
                <button
                  type="button"
                  onClick={() => handleImportSourceSelect("google-drive")}
                  className="block w-full rounded-md px-3 py-2 text-left text-sm text-slate transition hover:bg-surface"
                  role="menuitem"
                >
                  Google Drive (Coming soon)
                </button>
                <button
                  type="button"
                  onClick={() => handleImportSourceSelect("dropbox")}
                  className="block w-full rounded-md px-3 py-2 text-left text-sm text-slate transition hover:bg-surface"
                  role="menuitem"
                >
                  Dropbox (Coming soon)
                </button>
                <button
                  type="button"
                  onClick={() => handleImportSourceSelect("linkedin")}
                  className="block w-full rounded-md px-3 py-2 text-left text-sm text-slate transition hover:bg-surface"
                  role="menuitem"
                >
                  LinkedIn (Coming soon)
                </button>
              </div>
            )}
          </div>
        </div>

        <input
          ref={autofillInputRef}
          type="file"
          accept={ACCEPTED_RESUME_EXTENSIONS}
          className="hidden"
          onChange={(e) => handleResumeSelected(e.target.files?.[0] ?? null)}
        />
      </div>

      <p className="mb-4 mt-1 flex items-center gap-2 px-1 text-[13px] text-[#9BA3B2]">
        <span className="text-danger">*</span> Required fields
      </p>

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        {/* Personal information section */}
        <SectionCard
          title="Personal information"
          onClear={clearPersonalSection}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-[13px] font-medium text-[#4A5568]">
                <span className="text-[#E63946]">*</span> First name
              </label>
              <input
                ref={firstNameRef}
                value={firstName}
                disabled={submitting}
                onChange={(e) => setFirstName(e.target.value)}
                className={`${inputBaseClass} ${errors.firstName ? "border-[#DC2626] ring-2 ring-[#DC2626]/20" : ""}`}
              />
              <FieldError message={errors.firstName} />
            </div>
            <div>
              <label className="mb-1 block text-[13px] font-medium text-[#4A5568]">
                <span className="text-[#E63946]">*</span> Last name
              </label>
              <input
                ref={lastNameRef}
                value={lastName}
                disabled={submitting}
                onChange={(e) => setLastName(e.target.value)}
                className={`${inputBaseClass} ${errors.lastName ? "border-[#DC2626] ring-2 ring-[#DC2626]/20" : ""}`}
              />
              <FieldError message={errors.lastName} />
            </div>
          </div>

          <div className="mt-2">
            <label className="mb-1 block text-[13px] font-medium text-[#4A5568]">
              <span className="text-[#E63946]">*</span> Email
            </label>
            <input
              ref={emailRef}
              type="email"
              value={email}
              disabled={submitting}
              onChange={(e) => setEmail(e.target.value)}
              className={`${inputBaseClass} ${errors.email ? "border-[#DC2626] ring-2 ring-[#DC2626]/20" : ""}`}
            />
            <FieldError message={errors.email} />
          </div>

          <div className="mt-2">
            <label className="mb-1 block text-[13px] font-medium text-[#4A5568]">
              Headline{" "}
              <span className="ml-2 text-[12px] font-normal text-[#9BA3B2]">
                (Optional)
              </span>
            </label>
            <input
              value={headline}
              disabled={submitting}
              onChange={(e) => setHeadline(e.target.value)}
              className={inputBaseClass}
            />
          </div>

          <div className="mt-2">
            <label className="mb-1 block text-[13px] font-medium text-[#4A5568]">
              <span className="text-[#E63946]">*</span> Phone
            </label>
            <div className="flex gap-2">
              <select
                value={countryCode}
                disabled={submitting}
                onChange={(e) => setCountryCode(e.target.value)}
                className="h-[46px] min-w-[90px] rounded-[10px] border-[1.5px] border-[#E2E8F4] bg-[#EEF2F7] px-3 text-[14px] text-[#0D1B2A] outline-none transition focus:border-[#1E6FFF] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {countryCodes.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.flag} {country.code}
                  </option>
                ))}
              </select>
              <input
                ref={phoneRef}
                value={phone}
                disabled={submitting}
                onChange={(e) => setPhone(e.target.value)}
                className={`${inputBaseClass} flex-1 ${errors.phone ? "border-[#DC2626] ring-2 ring-[#DC2626]/20" : ""}`}
              />
            </div>
            <p className="mt-1 text-xs text-slate">
              The hiring team may use this number to contact you about this job.
            </p>
            <FieldError message={errors.phone} />
          </div>

          <div className="mt-2">
            <label className="mb-1 flex items-center gap-1 text-[13px] font-medium text-[#4A5568]">
              <span>
                <span className="text-[#E63946]">*</span> Address
              </span>
              <span title="Include city, region, country">
                <Info size={14} className="text-[#1E6FFF]" />
              </span>
            </label>
            <input
              ref={addressRef}
              value={address}
              disabled={submitting}
              onChange={(e) => setAddress(e.target.value)}
              className={`${inputBaseClass} ${errors.address ? "border-[#DC2626] ring-2 ring-[#DC2626]/20" : ""}`}
            />
            <p className="mt-1 text-xs text-slate">
              Include your city, region, and country, so that employers can
              easily manage your application.
            </p>
            <FieldError message={errors.address} />
          </div>
        </SectionCard>

        {/* Profile section */}
        <SectionCard title="Profile" onClear={clearProfileSection}>
          <div className="space-y-5">
            {/* Education */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-[13px] text-slate">
                  Education (Optional)
                </label>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => setShowEducationForm((prev) => !prev)}
                  className="inline-flex h-8 items-center gap-2 rounded-[8px] border-[1.5px] border-dashed border-[#C5CFDF] bg-transparent px-3 text-[13px] text-[#6B7A99] transition hover:border-[#1E6FFF] hover:text-[#1E6FFF] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-sm bg-[#EEF4FF] text-[#1E6FFF]">
                    <Plus size={12} />
                  </span>
                  Add
                </button>
              </div>

              <div
                className={`grid transition-all duration-300 ${showEducationForm ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
              >
                <div className="overflow-hidden">
                  <div className="rounded-lg border border-border bg-[#F8FAFF] p-3">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <select
                        value={educationDraft.level}
                        onChange={(e) =>
                          setEducationDraft((prev) => ({
                            ...prev,
                            level: e.target.value,
                          }))
                        }
                        className={inputBaseClass}
                      >
                        <option value="">Degree/Level</option>
                        {degreeLevels.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                      <input
                        placeholder="Field of Study"
                        value={educationDraft.field}
                        onChange={(e) =>
                          setEducationDraft((prev) => ({
                            ...prev,
                            field: e.target.value,
                          }))
                        }
                        className={inputBaseClass}
                      />
                      <input
                        placeholder="Institution"
                        value={educationDraft.institution}
                        onChange={(e) =>
                          setEducationDraft((prev) => ({
                            ...prev,
                            institution: e.target.value,
                          }))
                        }
                        className={inputBaseClass}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={educationDraft.startYear}
                          onChange={(e) =>
                            setEducationDraft((prev) => ({
                              ...prev,
                              startYear: e.target.value,
                            }))
                          }
                          className={inputBaseClass}
                        >
                          <option value="">Start Year</option>
                          {years.map((year) => (
                            <option
                              key={`education-start-${year}`}
                              value={year}
                            >
                              {year}
                            </option>
                          ))}
                        </select>
                        <select
                          value={educationDraft.endYear}
                          onChange={(e) =>
                            setEducationDraft((prev) => ({
                              ...prev,
                              endYear: e.target.value,
                            }))
                          }
                          className={inputBaseClass}
                        >
                          <option value="">End Year</option>
                          {years.map((year) => (
                            <option key={`education-end-${year}`} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={addEducation}
                        className="h-9 rounded-lg bg-primary px-4 text-sm font-medium text-white transition hover:bg-[#185dde]"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowEducationForm(false);
                          setEducationDraft(emptyEducationDraft);
                        }}
                        className="h-9 rounded-lg px-3 text-sm text-slate transition hover:bg-white"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {educations.length > 0 && (
                <div className="mt-3 space-y-2">
                  {educations.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-start justify-between rounded-lg border border-border bg-white p-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-midnight">
                          {entry.level || "Education"}
                        </p>
                        <p className="text-sm text-slate">
                          {entry.field ? `${entry.field} · ` : ""}
                          {entry.institution}
                        </p>
                        <p className="text-xs text-slate">
                          {entry.startYear || "-"} -{" "}
                          {entry.endYear || "Present"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setEducations((prev) =>
                            prev.filter((item) => item.id !== entry.id),
                          )
                        }
                        className="text-slate transition hover:text-[#DC2626]"
                        aria-label="Remove education"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Experience */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-[13px] text-slate">
                  Experience (Optional)
                </label>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => setShowExperienceForm((prev) => !prev)}
                  className="inline-flex h-8 items-center gap-2 rounded-[8px] border-[1.5px] border-dashed border-[#C5CFDF] bg-transparent px-3 text-[13px] text-[#6B7A99] transition hover:border-[#1E6FFF] hover:text-[#1E6FFF] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-sm bg-[#EEF4FF] text-[#1E6FFF]">
                    <Plus size={12} />
                  </span>
                  Add
                </button>
              </div>

              <div
                className={`grid transition-all duration-300 ${showExperienceForm ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
              >
                <div className="overflow-hidden">
                  <div className="rounded-lg border border-border bg-[#F8FAFF] p-3">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <input
                        placeholder="Job Title"
                        value={experienceDraft.title}
                        onChange={(e) =>
                          setExperienceDraft((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        className={inputBaseClass}
                      />
                      <input
                        placeholder="Company"
                        value={experienceDraft.company}
                        onChange={(e) =>
                          setExperienceDraft((prev) => ({
                            ...prev,
                            company: e.target.value,
                          }))
                        }
                        className={inputBaseClass}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={experienceDraft.startMonth}
                          onChange={(e) =>
                            setExperienceDraft((prev) => ({
                              ...prev,
                              startMonth: e.target.value,
                            }))
                          }
                          className={inputBaseClass}
                        >
                          <option value="">Start Month</option>
                          {months.map((month) => (
                            <option key={`start-month-${month}`} value={month}>
                              {month}
                            </option>
                          ))}
                        </select>
                        <select
                          value={experienceDraft.startYear}
                          onChange={(e) =>
                            setExperienceDraft((prev) => ({
                              ...prev,
                              startYear: e.target.value,
                            }))
                          }
                          className={inputBaseClass}
                        >
                          <option value="">Start Year</option>
                          {years.map((year) => (
                            <option
                              key={`experience-start-${year}`}
                              value={year}
                            >
                              {year}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={experienceDraft.endMonth}
                          onChange={(e) =>
                            setExperienceDraft((prev) => ({
                              ...prev,
                              endMonth: e.target.value,
                            }))
                          }
                          disabled={experienceDraft.current}
                          className={inputBaseClass}
                        >
                          <option value="">End Month</option>
                          {months.map((month) => (
                            <option key={`end-month-${month}`} value={month}>
                              {month}
                            </option>
                          ))}
                        </select>
                        <select
                          value={experienceDraft.endYear}
                          onChange={(e) =>
                            setExperienceDraft((prev) => ({
                              ...prev,
                              endYear: e.target.value,
                            }))
                          }
                          disabled={experienceDraft.current}
                          className={inputBaseClass}
                        >
                          <option value="">End Year</option>
                          {years.map((year) => (
                            <option key={`experience-end-${year}`} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <label className="mt-3 flex items-center gap-2 text-sm text-slate">
                      <input
                        type="checkbox"
                        checked={experienceDraft.current}
                        onChange={(e) =>
                          setExperienceDraft((prev) => ({
                            ...prev,
                            current: e.target.checked,
                            endMonth: e.target.checked ? "" : prev.endMonth,
                            endYear: e.target.checked ? "" : prev.endYear,
                          }))
                        }
                      />
                      Currently working here
                    </label>

                    <textarea
                      rows={4}
                      placeholder="Description (Optional)"
                      value={experienceDraft.description}
                      onChange={(e) =>
                        setExperienceDraft((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      className={`${textareaBaseClass} mt-3`}
                    />

                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={addExperience}
                        className="h-9 rounded-lg bg-primary px-4 text-sm font-medium text-white transition hover:bg-[#185dde]"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowExperienceForm(false);
                          setExperienceDraft(emptyExperienceDraft);
                        }}
                        className="h-9 rounded-lg px-3 text-sm text-slate transition hover:bg-white"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {experiences.length > 0 && (
                <div className="mt-3 space-y-2">
                  {experiences.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-start justify-between rounded-lg border border-border bg-white p-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-midnight">
                          {entry.title}
                        </p>
                        <p className="text-sm text-slate">{entry.company}</p>
                        <p className="text-xs text-slate">
                          {entry.startMonth} {entry.startYear} -{" "}
                          {entry.current
                            ? "Present"
                            : `${entry.endMonth} ${entry.endYear}`}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setExperiences((prev) =>
                            prev.filter((item) => item.id !== entry.id),
                          )
                        }
                        className="text-slate transition hover:text-[#DC2626]"
                        aria-label="Remove experience"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Skills section */}
            <div>
              <label className="mb-1 block text-[13px] font-medium text-[#4A5568]">
                Skills{" "}
                <span className="ml-2 text-[12px] font-normal text-[#9BA3B2]">
                  (Optional)
                </span>
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  placeholder="Skill name"
                  className={`${inputBaseClass} flex-1 min-w-[120px]`}
                  disabled={submitting}
                />
                <input
                  type="text"
                  value={skillCategory}
                  onChange={(e) => setSkillCategory(e.target.value)}
                  placeholder="Category (optional)"
                  className={`${inputBaseClass} flex-1 min-w-[120px]`}
                  disabled={submitting}
                />
                <button
                  type="button"
                  onClick={addSkill}
                  disabled={submitting || !skillInput.trim()}
                  className="h-[46px] rounded-[10px] bg-primary px-4 text-sm font-medium text-white transition hover:bg-[#185dde] disabled:opacity-60"
                >
                  Add
                </button>
              </div>
              {skills.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill.name}
                      className="inline-flex items-center gap-1 rounded-full bg-[#EEF4FF] px-3 py-1 text-sm text-[#0D1B2A]"
                    >
                      {skill.name}
                      {skill.category && (
                        <span className="text-xs text-[#6B7A99]">
                          ({skill.category})
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill.name)}
                        className="text-slate hover:text-[#DC2626]"
                        aria-label={`Remove ${skill.name}`}
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Summary */}
            <div>
              <label className="mb-1 block text-[13px] font-medium text-[#4A5568]">
                Summary{" "}
                <span className="ml-2 text-[12px] font-normal text-[#9BA3B2]">
                  (Optional)
                </span>
              </label>
              <textarea
                rows={5}
                value={summary}
                disabled={submitting}
                onChange={(e) => setSummary(e.target.value)}
                className={textareaBaseClass}
              />
            </div>

            {/* Resume upload */}
            <div ref={resumeRef}>
              <label className="mb-2 flex items-center gap-1 text-[13px] font-medium text-[#4A5568]">
                <span>
                  <span className="text-[#E63946]">*</span> Resume
                </span>
                <span title="Upload your most recent resume">
                  <Info size={14} className="text-[#1E6FFF]" />
                </span>
              </label>

              <input
                ref={resumeInputRef}
                type="file"
                accept={ACCEPTED_RESUME_EXTENSIONS}
                className="hidden"
                onChange={(e) =>
                  handleResumeSelected(e.target.files?.[0] ?? null)
                }
              />

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  if (!isBusy) setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  if (isBusy) return;
                  handleResumeSelected(e.dataTransfer.files?.[0] ?? null);
                }}
                className={`flex min-h-[130px] flex-col items-center justify-center gap-2 rounded-[12px] border-2 border-dashed p-8 text-center transition-transform duration-150 ${
                  isDragOver
                    ? "scale-105 border-[#1E6FFF] bg-[#EEF4FF]"
                    : resumeFile
                      ? "border-[1.5px] border-[#00B37E] bg-[#F0FBF6]"
                      : "border-[#C5D5F0] bg-[#F5F8FF]"
                } ${isBusy ? "pointer-events-none opacity-75" : ""}`}
              >
                {isParsing ? (
                  <div className="flex items-center justify-center gap-2 text-sm text-[#1E6FFF]">
                    <Loader2 size={18} className="animate-spin" />
                    Reading your resume...
                  </div>
                ) : resumeFile ? (
                  <div className="flex items-center justify-center gap-3 text-sm text-[#0D1B2A]">
                    <CheckCircle size={18} className="text-[#00B37E]" />
                    <div className="text-sm">
                      <div className="font-medium">{resumeFile.name}</div>
                      <div className="text-xs text-[#9BA3B2]">
                        {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeResume}
                      disabled={submitting}
                      className="text-sm text-[#E63946] hover:underline disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#EEF4FF]">
                      <UploadCloud size={24} className="text-[#1E6FFF]" />
                    </div>
                    <p className="mt-2 text-sm">
                      <button
                        type="button"
                        onClick={() => resumeInputRef.current?.click()}
                        disabled={isBusy}
                        className="font-medium text-[#1E6FFF] hover:underline disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Choose file
                      </button>
                      <span className="text-[#9BA3B2]">
                        {" "}
                        or drag and drop here
                      </span>
                    </p>
                    <p className="mt-1 text-[12px] text-[#B0B8CC]">
                      Supported formats: {ACCEPTED_RESUME_LABEL}
                    </p>
                  </div>
                )}
              </div>
              <FieldError message={errors.resume} />
            </div>
          </div>
        </SectionCard>

        {/* Details section */}
        <SectionCard title="Details" onClear={clearDetailsSection}>
          <label className="mb-1 block text-[13px] text-slate">
            Cover letter (Optional)
          </label>
          <textarea
            rows={6}
            value={coverLetter}
            disabled={submitting}
            onChange={(e) => setCoverLetter(e.target.value)}
            className={textareaBaseClass}
          />
        </SectionCard>

        <button
          type="submit"
          disabled={!requiredFilled || submitting || isParsing}
          className="flex h-13.5 w-full items-center justify-center gap-2 rounded-xl bg-success text-[15px] font-semibold text-white shadow-[0_4px_16px_rgba(0,179,126,0.35)] transition hover:bg-[#009E6E] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit application"
          )}
        </button>
      </form>

      <footer className="mt-8 px-4 pb-10 pt-8 text-center text-[13px] text-[#9BA3B2]">
        <div className="mb-2 text-[12px] text-[#B0B8CC]">
          {jobData.description
            ? "Please review your details before submitting."
            : "Applying for a role at Evalexa."}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-5 text-[13px] text-[#9BA3B2]">
          <a href="#" className="hover:underline">
            View website
          </a>
          <span className="text-[#D0D5DD]">·</span>
          <a href="#" className="hover:underline">
            View all jobs
          </a>
          <span className="text-[#D0D5DD]">·</span>
          <a href="#" className="hover:underline">
            Help ↗
          </a>
        </div>
        <p className="mt-3 text-[12px] text-[#B0B8CC]">
          Powered by <span className="font-medium text-primary">Evalexa</span> ·
          Cookie settings · Accessibility
        </p>
      </footer>
    </section>
  );
}
