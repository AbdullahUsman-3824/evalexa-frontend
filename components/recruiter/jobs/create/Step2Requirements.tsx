"use client";

import { useMemo, useRef, useState } from "react";
import {
  GripVertical,
  Plus,
  Sparkles,
  Trash2,
  Bold,
  Italic,
  List,
  ListOrdered,
} from "lucide-react";
import type {
  Currency,
  EducationRequirement,
  ExperienceLevel,
  JobPostFormData,
  SalaryPer,
} from "./types";

interface Step2RequirementsProps {
  data: JobPostFormData;
  onChange: <K extends keyof JobPostFormData>(
    field: K,
    value: JobPostFormData[K],
  ) => void;
}

const CURRENCIES: Currency[] = ["PKR", "USD", "EUR"];
const SALARY_PER: SalaryPer[] = ["Month", "Year"];
const EXPERIENCE_LEVELS: ExperienceLevel[] = ["Entry", "Mid", "Senior", "Lead"];
const EDUCATION_LEVELS: EducationRequirement[] = [
  "Any",
  "High School",
  "Bachelor's",
  "Master's",
  "PhD",
];

const SUGGESTIONS: Record<string, string[]> = {
  frontend: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Redux"],
  backend: ["Node.js", "Express", "PostgreSQL", "Redis", "Docker"],
  designer: ["Figma", "Wireframing", "Prototyping", "Design Systems"],
  marketing: ["SEO", "Content Strategy", "Google Analytics", "Campaign Management"],
};

export default function Step2Requirements({ data, onChange }: Step2RequirementsProps) {
  const [requiredSkillInput, setRequiredSkillInput] = useState("");
  const [niceSkillInput, setNiceSkillInput] = useState("");
  const [responsibilityInput, setResponsibilityInput] = useState("");
  const [isGeneratingJD, setIsGeneratingJD] = useState(false);
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);

  const suggestedSkills = useMemo(() => {
    const title = data.jobTitle.toLowerCase();
    if (title.includes("front")) return SUGGESTIONS.frontend;
    if (title.includes("back")) return SUGGESTIONS.backend;
    if (title.includes("design")) return SUGGESTIONS.designer;
    if (title.includes("market")) return SUGGESTIONS.marketing;
    return ["Communication", "Problem Solving", "Teamwork", "Time Management"];
  }, [data.jobTitle]);

  const addTag = (
    value: string,
    field: "requiredSkills" | "niceToHaveSkills",
    clear: () => void,
  ) => {
    const cleaned = value.trim();
    if (!cleaned) return;
    if (data[field].includes(cleaned)) {
      clear();
      return;
    }
    onChange(field, [...data[field], cleaned]);
    clear();
  };

  const applyTextFormat = (formatter: (selection: string) => string) => {
    const target = descriptionRef.current;
    if (!target) return;
    const { selectionStart, selectionEnd, value } = target;
    const selected = value.slice(selectionStart, selectionEnd) || "text";
    const replaced = formatter(selected);
    const next = value.slice(0, selectionStart) + replaced + value.slice(selectionEnd);
    onChange("jobDescription", next);
  };

  const generateDescription = () => {
    setIsGeneratingJD(true);
    setTimeout(() => {
      const template = `We are hiring a ${data.jobTitle || "professional"} to join our ${
        data.department
      } team.

In this role, you will contribute to high-impact projects, collaborate cross-functionally, and help us ship quality outcomes faster.

Required skills:
${data.requiredSkills.length ? data.requiredSkills.map((s) => `- ${s}`).join("\n") : "- Strong communication"}

You should be comfortable working in a ${data.workMode.toLowerCase()} environment and taking ownership of deliverables end-to-end.`;

      onChange("jobDescription", template);
      setIsGeneratingJD(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h3 className="mb-4 font-syne text-lg font-semibold text-midnight">Salary Range *</h3>
        <div className="grid gap-3 md:grid-cols-4">
          <input
            type="number"
            min={0}
            value={data.salaryMin}
            onChange={(e) => onChange("salaryMin", e.target.value)}
            placeholder="Min salary"
            className="h-11 rounded-lg border border-slate/25 px-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <input
            type="number"
            min={0}
            value={data.salaryMax}
            onChange={(e) => onChange("salaryMax", e.target.value)}
            placeholder="Max salary"
            className="h-11 rounded-lg border border-slate/25 px-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <select
            value={data.currency}
            onChange={(e) => onChange("currency", e.target.value as Currency)}
            className="h-11 rounded-lg border border-slate/25 px-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            {CURRENCIES.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-4 rounded-lg border border-slate/20 px-3">
            {SALARY_PER.map((per) => (
              <label key={per} className="flex items-center gap-1 text-sm text-midnight">
                <input
                  type="radio"
                  checked={data.salaryPer === per}
                  onChange={() => onChange("salaryPer", per)}
                />
                {per}
              </label>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-lg border border-slate/20 p-3">
          <span className="text-sm text-midnight">Show salary on post</span>
          <button
            type="button"
            onClick={() => onChange("showSalaryOnPost", !data.showSalaryOnPost)}
            className={`relative h-6 w-11 rounded-full transition ${
              data.showSalaryOnPost ? "bg-primary" : "bg-slate/30"
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                data.showSalaryOnPost ? "left-5" : "left-0.5"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h3 className="mb-3 font-syne text-lg font-semibold text-midnight">Experience Level *</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {EXPERIENCE_LEVELS.map((level) => (
              <button
                type="button"
                key={level}
                onClick={() => onChange("experienceLevel", level)}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                  data.experienceLevel === level
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-slate/20 text-midnight"
                }`}
              >
                {level}{" "}
                {level === "Entry"
                  ? "(0–2 yrs)"
                  : level === "Mid"
                    ? "(2–5 yrs)"
                    : level === "Senior"
                      ? "(5+ yrs)"
                      : "(8+ yrs)"}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h3 className="mb-3 font-syne text-lg font-semibold text-midnight">
            Education Requirement
          </h3>
          <select
            value={data.educationRequirement}
            onChange={(e) =>
              onChange("educationRequirement", e.target.value as EducationRequirement)
            }
            className="h-11 w-full rounded-lg border border-slate/25 px-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            {EDUCATION_LEVELS.map((education) => (
              <option key={education} value={education}>
                {education}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h3 className="mb-2 font-syne text-lg font-semibold text-midnight">Required Skills *</h3>
        <input
          value={requiredSkillInput}
          onChange={(e) => setRequiredSkillInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag(requiredSkillInput, "requiredSkills", () => setRequiredSkillInput(""));
            }
          }}
          placeholder="Type skill and press Enter"
          className="h-11 w-full rounded-lg border border-slate/25 px-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {data.requiredSkills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
            >
              {skill}
              <button
                type="button"
                onClick={() =>
                  onChange(
                    "requiredSkills",
                    data.requiredSkills.filter((s) => s !== skill),
                  )
                }
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <p className="mt-4 text-sm text-slate">Suggested skills for this role:</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {suggestedSkills.map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => {
                if (!data.requiredSkills.includes(skill)) {
                  onChange("requiredSkills", [...data.requiredSkills, skill]);
                }
              }}
              className="rounded-full border border-primary/30 px-3 py-1 text-xs font-semibold text-primary hover:bg-primary/10"
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h3 className="mb-2 font-syne text-lg font-semibold text-midnight">
          Nice-to-Have Skills
        </h3>
        <input
          value={niceSkillInput}
          onChange={(e) => setNiceSkillInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag(niceSkillInput, "niceToHaveSkills", () => setNiceSkillInput(""));
            }
          }}
          placeholder="Optional skill and press Enter"
          className="h-11 w-full rounded-lg border border-slate/25 px-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {data.niceToHaveSkills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-2 rounded-full bg-slate/15 px-3 py-1 text-sm font-medium text-slate"
            >
              {skill}
              <button
                type="button"
                onClick={() =>
                  onChange(
                    "niceToHaveSkills",
                    data.niceToHaveSkills.filter((s) => s !== skill),
                  )
                }
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <label className="mb-2 block text-sm font-semibold text-midnight">
          Number of Openings
        </label>
        <input
          type="number"
          min={1}
          value={data.openings}
          onChange={(e) => onChange("openings", Math.max(1, Number(e.target.value) || 1))}
          className="h-11 w-40 rounded-lg border border-slate/25 px-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-syne text-lg font-semibold text-midnight">Job Description *</h3>
          <button
            type="button"
            onClick={generateDescription}
            disabled={isGeneratingJD}
            className="inline-flex items-center gap-2 rounded-lg bg-cyan px-3 py-2 text-sm font-semibold text-white hover:bg-cyan/90 disabled:opacity-60"
          >
            <Sparkles className="h-4 w-4" />
            {isGeneratingJD ? "Generating job description..." : "Generate with AI"}
          </button>
        </div>

        <div className="mb-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => applyTextFormat((sel) => `**${sel}**`)}
            className="rounded-md border border-slate/20 p-2 text-slate hover:bg-surface"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => applyTextFormat((sel) => `*${sel}*`)}
            className="rounded-md border border-slate/20 p-2 text-slate hover:bg-surface"
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => applyTextFormat((sel) => `- ${sel}`)}
            className="rounded-md border border-slate/20 p-2 text-slate hover:bg-surface"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => applyTextFormat((sel) => `1. ${sel}`)}
            className="rounded-md border border-slate/20 p-2 text-slate hover:bg-surface"
          >
            <ListOrdered className="h-4 w-4" />
          </button>
        </div>

        <textarea
          ref={descriptionRef}
          value={data.jobDescription}
          onChange={(e) => onChange("jobDescription", e.target.value.slice(0, 5000))}
          placeholder="Write a detailed job description..."
          className="min-h-[220px] w-full rounded-lg border border-slate/25 p-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <p className="mt-1 text-right text-xs text-slate">{data.jobDescription.length}/5000</p>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-syne text-lg font-semibold text-midnight">Responsibilities</h3>
          <button
            type="button"
            onClick={() => {
              const value = responsibilityInput.trim();
              if (!value) return;
              onChange("responsibilities", [...data.responsibilities, value]);
              setResponsibilityInput("");
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-primary/30 px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/10"
          >
            <Plus className="h-4 w-4" /> Add Responsibility
          </button>
        </div>
        <input
          value={responsibilityInput}
          onChange={(e) => setResponsibilityInput(e.target.value)}
          placeholder="Add responsibility and click button"
          className="mb-3 h-11 w-full rounded-lg border border-slate/25 px-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <div className="space-y-2">
          {data.responsibilities.map((item, index) => (
            <div
              key={`${item}-${index}`}
              className="flex items-center gap-2 rounded-lg border border-slate/20 bg-surface px-3 py-2"
            >
              <GripVertical className="h-4 w-4 text-slate" />
              <span className="flex-1 text-sm text-midnight">{item}</span>
              <button
                type="button"
                onClick={() =>
                  onChange(
                    "responsibilities",
                    data.responsibilities.filter((_, i) => i !== index),
                  )
                }
              >
                <Trash2 className="h-4 w-4 text-danger" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h3 className="mb-3 font-syne text-lg font-semibold text-midnight">Benefits</h3>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {[
            "Health Insurance",
            "Remote Work",
            "Flexible Hours",
            "Annual Bonus",
            "Stock Options",
            "Paid Leave",
            "Training Budget",
            "Company Laptop",
          ].map((benefit) => (
            <label
              key={benefit}
              className="flex items-center gap-2 rounded-lg border border-slate/20 p-2 text-sm text-midnight"
            >
              <input
                type="checkbox"
                checked={data.benefits.includes(benefit)}
                onChange={(e) =>
                  onChange(
                    "benefits",
                    e.target.checked
                      ? [...data.benefits, benefit]
                      : data.benefits.filter((b) => b !== benefit),
                  )
                }
              />
              {benefit}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

