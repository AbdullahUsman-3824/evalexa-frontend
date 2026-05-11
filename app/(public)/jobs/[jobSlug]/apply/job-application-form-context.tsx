"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  type Dispatch,
  type FormEvent,
  type ReactNode,
  type RefObject,
  type SetStateAction,
} from "react";
import { useParams } from "next/navigation";
import { submitPublicJobApplication } from "@/lib/services/jobsService";

export type EducationDraft = {
  level: string;
  field: string;
  institution: string;
  startYear: string;
  endYear: string;
};

export type ExperienceDraft = {
  title: string;
  company: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  current: boolean;
  description: string;
};

export type EducationEntry = EducationDraft & { id: string };
export type ExperienceEntry = ExperienceDraft & { id: string };

export type Errors = Partial<
  Record<
    "firstName" | "lastName" | "email" | "phone" | "address" | "resume",
    string
  >
>;

export type CountryCode = {
  flag: string;
  code: string;
  name: string;
};

export const countryCodes: CountryCode[] = [
  { flag: "🇵🇰", code: "+92", name: "Pakistan" },
  { flag: "🇮🇳", code: "+91", name: "India" },
  { flag: "🇺🇸", code: "+1", name: "United States" },
  { flag: "🇬🇧", code: "+44", name: "United Kingdom" },
  { flag: "🇦🇪", code: "+971", name: "UAE" },
  { flag: "🇸🇦", code: "+966", name: "Saudi Arabia" },
];

export const degreeLevels = [
  "High School",
  "Diploma",
  "Bachelor's",
  "Master's",
  "PhD",
  "Other",
];

export const months = [
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

export const years = Array.from(
  { length: 50 },
  (_, index) => `${new Date().getFullYear() + 1 - index}`,
);

export const emptyEducationDraft: EducationDraft = {
  level: "",
  field: "",
  institution: "",
  startYear: "",
  endYear: "",
};

export const emptyExperienceDraft: ExperienceDraft = {
  title: "",
  company: "",
  startMonth: "",
  startYear: "",
  endMonth: "",
  endYear: "",
  current: false,
  description: "",
};

export const inputBaseClass =
  "h-[46px] w-full rounded-[10px] border-[1.5px] border-[#E2E8F4] bg-[#F8FAFF] px-4 text-[14px] text-[#0D1B2A] outline-none transition focus:border-[#1E6FFF] focus:bg-white focus:shadow-[0_0_0_3px_rgba(30,111,255,0.10)]";

export const textareaBaseClass =
  "w-full rounded-[10px] border-[1.5px] border-[#E2E8F4] bg-[#F8FAFF] px-4 py-2 text-[14px] text-[#0D1B2A] outline-none transition focus:border-[#1E6FFF] focus:bg-white focus:shadow-[0_0_0_3px_rgba(30,111,255,0.10)]";

export const sectionCardClass =
  "rounded-[14px] border border-[#E8ECF4] bg-white py-6 px-7 shadow-[0_2px_8px_rgba(0,0,0,0.06)] mb-4";

type JobApplicationFormContextValue = {
  firstName: string;
  setFirstName: Dispatch<SetStateAction<string>>;
  lastName: string;
  setLastName: Dispatch<SetStateAction<string>>;
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  headline: string;
  setHeadline: Dispatch<SetStateAction<string>>;
  countryCode: string;
  setCountryCode: Dispatch<SetStateAction<string>>;
  phone: string;
  setPhone: Dispatch<SetStateAction<string>>;
  address: string;
  setAddress: Dispatch<SetStateAction<string>>;
  showEducationForm: boolean;
  setShowEducationForm: Dispatch<SetStateAction<boolean>>;
  educationDraft: EducationDraft;
  setEducationDraft: Dispatch<SetStateAction<EducationDraft>>;
  educations: EducationEntry[];
  setEducations: Dispatch<SetStateAction<EducationEntry[]>>;
  showExperienceForm: boolean;
  setShowExperienceForm: Dispatch<SetStateAction<boolean>>;
  experienceDraft: ExperienceDraft;
  setExperienceDraft: Dispatch<SetStateAction<ExperienceDraft>>;
  experiences: ExperienceEntry[];
  setExperiences: Dispatch<SetStateAction<ExperienceEntry[]>>;
  summary: string;
  setSummary: Dispatch<SetStateAction<string>>;
  coverLetter: string;
  setCoverLetter: Dispatch<SetStateAction<string>>;
  resumeFile: File | null;
  setResumeFile: Dispatch<SetStateAction<File | null>>;
  isDragOver: boolean;
  setIsDragOver: Dispatch<SetStateAction<boolean>>;
  errors: Errors;
  setErrors: Dispatch<SetStateAction<Errors>>;
  submitting: boolean;
  toastMessage: string;
  setToastMessage: Dispatch<SetStateAction<string>>;
  isImportMenuOpen: boolean;
  setIsImportMenuOpen: Dispatch<SetStateAction<boolean>>;
  autofillInputRef: RefObject<HTMLInputElement | null>;
  resumeInputRef: RefObject<HTMLInputElement | null>;
  firstNameRef: RefObject<HTMLInputElement | null>;
  lastNameRef: RefObject<HTMLInputElement | null>;
  emailRef: RefObject<HTMLInputElement | null>;
  phoneRef: RefObject<HTMLInputElement | null>;
  addressRef: RefObject<HTMLInputElement | null>;
  resumeRef: RefObject<HTMLDivElement | null>;
  requiredFilled: boolean;
  clearPersonalSection: () => void;
  clearProfileSection: () => void;
  clearDetailsSection: () => void;
  handleAutofillImport: (file: File | null) => void;
  handleImportSourceSelect: (
    source: "device" | "google-drive" | "dropbox" | "linkedin",
  ) => void;
  handleResumeSelected: (file: File | null) => void;
  addEducation: () => void;
  addExperience: () => void;
  removeResume: () => void;
  validate: () => Errors;
  scrollToFirstError: (nextErrors: Errors) => void;
  resetAll: () => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
};

const JobApplicationFormContext =
  createContext<JobApplicationFormContextValue | null>(null);

export function JobApplicationFormProvider({
  children,
}: {
  children: ReactNode;
}) {
  const params = useParams();
  const jobSlug = (params?.jobSlug as string | undefined) ?? "";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [headline, setHeadline] = useState("");
  const [countryCode, setCountryCode] = useState(
    countryCodes[0]?.code ?? "+92",
  );
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("Lahore, Pakistan");

  const [showEducationForm, setShowEducationForm] = useState(false);
  const [educationDraft, setEducationDraft] =
    useState<EducationDraft>(emptyEducationDraft);
  const [educations, setEducations] = useState<EducationEntry[]>([]);

  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [experienceDraft, setExperienceDraft] =
    useState<ExperienceDraft>(emptyExperienceDraft);
  const [experiences, setExperiences] = useState<ExperienceEntry[]>([]);

  const [summary, setSummary] = useState("");
  const [coverLetter, setCoverLetter] = useState("");

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isImportMenuOpen, setIsImportMenuOpen] = useState(false);

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

  const clearPersonalSection = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setHeadline("");
    setCountryCode(countryCodes[0]?.code ?? "+92");
    setPhone("");
    setAddress("");
    setErrors((previous) => ({
      ...previous,
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
    setShowEducationForm(false);
    setShowExperienceForm(false);
    setEducationDraft(emptyEducationDraft);
    setExperienceDraft(emptyExperienceDraft);
    setErrors((previous) => ({ ...previous, resume: undefined }));
  };

  const clearDetailsSection = () => {
    setCoverLetter("");
  };

  const handleAutofillImport = (file: File | null) => {
    if (!file) return;
    setToastMessage(
      `Imported ${file.name}. You can review and edit the fields below.`,
    );
    window.setTimeout(() => setToastMessage(""), 2500);
  };

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

  const handleResumeSelected = (file: File | null) => {
    if (!file) return;
    setResumeFile(file);
    setErrors((previous) => ({ ...previous, resume: undefined }));
  };

  const addEducation = () => {
    if (!educationDraft.level || !educationDraft.institution) return;
    setEducations((previous) => [
      ...previous,
      { ...educationDraft, id: crypto.randomUUID() },
    ]);
    setEducationDraft(emptyEducationDraft);
    setShowEducationForm(false);
  };

  const addExperience = () => {
    if (!experienceDraft.title || !experienceDraft.company) return;
    setExperiences((previous) => [
      ...previous,
      { ...experienceDraft, id: crypto.randomUUID() },
    ]);
    setExperienceDraft(emptyExperienceDraft);
    setShowExperienceForm(false);
  };

  const removeResume = () => {
    setResumeFile(null);
  };

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
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      if (target instanceof HTMLInputElement) {
        target.focus();
      }
    }
  };

  const resetAll = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setHeadline("");
    setCountryCode(countryCodes[0]?.code ?? "+92");
    setPhone("");
    setAddress("Lahore, Pakistan");
    setEducations([]);
    setExperiences([]);
    setEducationDraft(emptyEducationDraft);
    setExperienceDraft(emptyExperienceDraft);
    setShowEducationForm(false);
    setShowExperienceForm(false);
    setSummary("");
    setCoverLetter("");
    setResumeFile(null);
    setErrors({});
  };

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

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("phone", `${countryCode} ${phone}`);
      formData.append("address", address);
      formData.append("headline", headline);
      formData.append("summary", summary);
      formData.append("coverLetter", coverLetter);
      formData.append("educations", JSON.stringify(educations));
      formData.append("experiences", JSON.stringify(experiences));
      if (resumeFile) formData.append("resume", resumeFile, resumeFile.name);

      await submitPublicJobApplication(jobSlug, formData);

      setToastMessage("Application submitted successfully.");
      resetAll();
      window.setTimeout(() => setToastMessage(""), 3000);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Submission failed. Please try again.";
      setToastMessage(message);
      window.setTimeout(() => setToastMessage(""), 4000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <JobApplicationFormContext.Provider
      value={{
        firstName,
        setFirstName,
        lastName,
        setLastName,
        email,
        setEmail,
        headline,
        setHeadline,
        countryCode,
        setCountryCode,
        phone,
        setPhone,
        address,
        setAddress,
        showEducationForm,
        setShowEducationForm,
        educationDraft,
        setEducationDraft,
        educations,
        setEducations,
        showExperienceForm,
        setShowExperienceForm,
        experienceDraft,
        setExperienceDraft,
        experiences,
        setExperiences,
        summary,
        setSummary,
        coverLetter,
        setCoverLetter,
        resumeFile,
        setResumeFile,
        isDragOver,
        setIsDragOver,
        errors,
        setErrors,
        submitting,
        toastMessage,
        setToastMessage,
        isImportMenuOpen,
        setIsImportMenuOpen,
        autofillInputRef,
        resumeInputRef,
        firstNameRef,
        lastNameRef,
        emailRef,
        phoneRef,
        addressRef,
        resumeRef,
        requiredFilled,
        clearPersonalSection,
        clearProfileSection,
        clearDetailsSection,
        handleAutofillImport,
        handleImportSourceSelect,
        handleResumeSelected,
        addEducation,
        addExperience,
        removeResume,
        validate,
        scrollToFirstError,
        resetAll,
        handleSubmit,
      }}
    >
      {children}
    </JobApplicationFormContext.Provider>
  );
}

export function useJobApplicationFormContext() {
  const context = useContext(JobApplicationFormContext);

  if (!context) {
    throw new Error(
      "useJobApplicationFormContext must be used within JobApplicationFormProvider",
    );
  }

  return context;
}
