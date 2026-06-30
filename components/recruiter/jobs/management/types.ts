export type JobType = "Full-time" | "Part-time" | "Contract" | "Freelance" | "Internship";
export type WorkMode = "On-site" | "Remote" | "Hybrid";
export type Currency = "PKR" | "USD" | "EUR";
export type SalaryPer = "MONTHLY" | "YEARLY";
export type ExperienceLevel = "Entry" | "Mid" | "Senior" | "Lead";
export type EducationRequirement = "Any" | "High School" | "Bachelor's" | "Master's" | "PhD";
export type SkillImportance = "REQUIRED" | "PREFERRED";
export type SkillWeight = "Low" | "Medium" | "High";
export type QuestionAnswerType = "Text" | "Yes/No" | "Multiple Choice";
export type AIInterviewType = "Text-based Q&A" | "Video Interview Analysis";

export interface ScreeningQuestion {
  id: string;
  text: string;
  answerType: QuestionAnswerType;
  required: boolean;
}

export interface JobSkill {
  skillId: string;
  name: string;
  category: string;
  importance: SkillImportance;
  weight: number;
}

export interface SelectedJobSkill {
  skillId: string;
  name: string;
  category: string;
  importance: SkillImportance;
  weight: number;
}

export interface JobPostFormData {
  // Step 1
  jobTitle: string;
  department: string;
  jobType: JobType;
  workMode: WorkMode;
  location: string;
  applicationDeadline: string;
  urgentHiring: boolean;

  // Step 2
  salaryMin: string;
  salaryMax: string;
  currency: Currency;
  salaryPer: SalaryPer;
  experienceLevel: ExperienceLevel;
  educationRequirement: EducationRequirement;
  skills: SelectedJobSkill[];
  jobDescription: string;
  responsibilities?: string | string[];

  // Step 3+
  resumeSelectionCount?: number;
  interviewSelectionCount?: number;
  enableAutoShortlist?: boolean;
  enableAiInterview?: boolean;

  // Legacy fields kept for edit-flow compatibility.
  showSalaryOnPost?: boolean;
  requiredSkills?: string[];
  niceToHaveSkills?: string[];
  openings?: number;
  benefits?: string[];
  aiScreeningEnabled: boolean;
  minMatchScore: number;
  autoShortlistEnabled: boolean;
  autoShortlistThreshold: number;
  screeningQuestions: ScreeningQuestion[];
  aiInterviewEnabled: boolean;
  aiInterviewThreshold: number;
  aiInterviewType: AIInterviewType;
  skillWeights?: Record<string, SkillWeight>;
}

export const DEFAULT_FORM_DATA: JobPostFormData = {
  jobTitle: "",
  department: "",
  jobType: "Full-time",
  workMode: "On-site",
  location: "",
  applicationDeadline: "",
  urgentHiring: false,

  salaryMin: "",
  salaryMax: "",
  currency: "PKR",
  salaryPer: "MONTHLY",
  experienceLevel: "Entry",
  educationRequirement: "Any",
  skills: [],
  jobDescription: "",
  responsibilities: "",

  aiScreeningEnabled: false,
  minMatchScore: 70,
  autoShortlistEnabled: false,
  autoShortlistThreshold: 80,
  screeningQuestions: [],
  aiInterviewEnabled: false,
  aiInterviewThreshold: 75,
  aiInterviewType: "Text-based Q&A",
};