export type JobType =
  | "Full-time"
  | "Part-time"
  | "Contract"
  | "Internship"
  | "Freelance";

export type WorkMode = "On-site" | "Remote" | "Hybrid";
export type Currency = "PKR" | "USD" | "EUR";
export type SalaryPer = "Month" | "Year";
export type ExperienceLevel = "Entry" | "Mid" | "Senior" | "Lead";
export type EducationRequirement =
  | "Any"
  | "High School"
  | "Bachelor's"
  | "Master's"
  | "PhD";
export type SkillWeight = "Low" | "Medium" | "High";
export type QuestionAnswerType = "Text" | "Yes/No" | "Multiple Choice";
export type AIInterviewType = "Text-based Q&A" | "Video Interview Analysis";

export interface ScreeningQuestion {
  id: string;
  text: string;
  answerType: QuestionAnswerType;
  required: boolean;
}

export interface JobPostFormData {
  jobTitle: string;
  department: string;
  jobType: JobType;
  workMode: WorkMode;
  location: string;
  applicationDeadline: string;
  urgentHiring: boolean;
  salaryMin: string;
  salaryMax: string;
  currency: Currency;
  showSalaryOnPost: boolean;
  salaryPer: SalaryPer;
  experienceLevel: ExperienceLevel;
  educationRequirement: EducationRequirement;
  requiredSkills: string[];
  niceToHaveSkills: string[];
  openings: number;
  jobDescription: string;
  responsibilities: string[];
  benefits: string[];
  aiScreeningEnabled: boolean;
  minMatchScore: number;
  skillWeights: Record<string, SkillWeight>;
  autoShortlistEnabled: boolean;
  autoShortlistThreshold: number;
  screeningQuestions: ScreeningQuestion[];
  aiInterviewEnabled: boolean;
  aiInterviewThreshold: number;
  aiInterviewType: AIInterviewType;
}

export const BENEFIT_OPTIONS = [
  "Health Insurance",
  "Remote Work",
  "Flexible Hours",
  "Annual Bonus",
  "Stock Options",
  "Paid Leave",
  "Training Budget",
  "Company Laptop",
] as const;

