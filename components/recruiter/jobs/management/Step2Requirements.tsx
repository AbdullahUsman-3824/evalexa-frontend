"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Plus,
  PencilLine,
  Search,
  RefreshCw,
  Trash2,
  Library,
} from "lucide-react";
import type {
  Currency,
  EducationRequirement,
  ExperienceLevel,
  JobPostFormData,
  SkillImportance,
} from "./types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import FieldError from "@/components/ui/FieldError";
import {
  createSkill,
  deleteSkill,
  getSkillCategories,
  getSkills,
  updateSkill,
  type SkillRecord,
} from "@/lib/services/jobsService";

interface Step2RequirementsProps {
  data: JobPostFormData;
  onChange: <K extends keyof JobPostFormData>(
    field: K,
    value: JobPostFormData[K],
  ) => void;
}

const CURRENCIES: Currency[] = ["PKR", "USD", "EUR"];
const SALARY_PERIODS = ["MONTHLY", "YEARLY"] as const;
const EXPERIENCE_LEVELS: ExperienceLevel[] = ["Entry", "Mid", "Senior", "Lead"];
const EDUCATION_LEVELS: EducationRequirement[] = [
  "Any",
  "High School",
  "Bachelor's",
  "Master's",
  "PhD",
];
const IMPORTANCE_OPTIONS: SkillImportance[] = ["REQUIRED", "PREFERRED"];

const EXPERIENCE_LABELS: Record<string, string> = {
  Entry: "Entry (0–2 yrs)",
  Mid: "Mid (2–5 yrs)",
  Senior: "Senior (5+ yrs)",
  Lead: "Lead (8+ yrs)",
};

// Shared height class used by EVERY form control in this file so nothing drifts again.
// !h-10  -> forces 2.5rem height, overriding any internal component defaults (py-2 etc.)
// box-border -> border width is included in the height, so all controls measure identically
// regardless of whether they use border vs border-2 etc.
const FIELD_HEIGHT = "!h-10 box-border";

export default function Step2Requirements({
  data,
  onChange,
}: Step2RequirementsProps) {
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);

  const [skillLibrary, setSkillLibrary] = useState<SkillRecord[]>([]);
  const [skillCategories, setSkillCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSkillId, setSelectedSkillId] = useState("");
  const [skillImportance, setSkillImportance] = useState<SkillImportance>("REQUIRED");
  const [skillWeight, setSkillWeight] = useState<number>(50);
  const [skillSearch, setSkillSearch] = useState("");
  const [librarySkillName, setLibrarySkillName] = useState("");
  const [librarySkillCategory, setLibrarySkillCategory] = useState("");
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [editingDrafts, setEditingDrafts] = useState<
    Record<string, { name: string; category: string }>
  >({});
  const [skillLibraryLoading, setSkillLibraryLoading] = useState(false);
  const [skillLibraryError, setSkillLibraryError] = useState<string | null>(null);
  const [skillLibraryStatus, setSkillLibraryStatus] = useState<string | null>(null);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  function touch(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  const selectedSkills = data.skills ?? [];
  const responsibilitiesText =
    typeof data.responsibilities === "string"
      ? data.responsibilities
      : Array.isArray(data.responsibilities)
        ? data.responsibilities.join("\n")
        : "";

  const filteredSkillLibrary = useMemo(() => {
    const normalizedSearch = skillSearch.trim().toLowerCase();
    return skillLibrary.filter((skill) => {
      const categoryMatches =
        !selectedCategory || skill.category === selectedCategory;
      const searchMatches =
        !normalizedSearch ||
        skill.name.toLowerCase().includes(normalizedSearch) ||
        skill.category.toLowerCase().includes(normalizedSearch);
      return categoryMatches && searchMatches;
    });
  }, [skillLibrary, selectedCategory, skillSearch]);

  useEffect(() => {
    let isActive = true;

    const loadSkillLibrary = async () => {
      setSkillLibraryLoading(true);
      setSkillLibraryError(null);

      try {
        const [categories, skills] = await Promise.all([
          getSkillCategories(),
          getSkills(),
        ]);

        if (!isActive) return;

        const categoryList = categories.length
          ? categories
          : Array.from(new Set(skills.map((skill) => skill.category))).sort();

        setSkillCategories(categoryList);
        setSkillLibrary(skills);

        if (!selectedCategory && categoryList[0]) {
          setSelectedCategory(categoryList[0]);
        }
      } catch (error) {
        if (!isActive) return;
        setSkillLibraryError(
          error instanceof Error ? error.message : "Unable to load skills.",
        );
      } finally {
        if (isActive) setSkillLibraryLoading(false);
      }
    };

    void loadSkillLibrary();

    return () => {
      isActive = false;
    };
  }, [selectedCategory]);

  useEffect(() => {
    if (!selectedCategory && skillCategories[0]) {
      setSelectedCategory(skillCategories[0]);
    }
  }, [selectedCategory, skillCategories]);

  useEffect(() => {
    const categorySkills = skillLibrary.filter(
      (skill) => skill.category === selectedCategory,
    );
    if (
      selectedSkillId &&
      !categorySkills.some((skill) => skill.id === selectedSkillId)
    ) {
      setSelectedSkillId("");
    }
  }, [selectedCategory, selectedSkillId, skillLibrary]);

  const refreshSkillLibrary = async () => {
    setSkillLibraryError(null);
    const [categories, skills] = await Promise.all([
      getSkillCategories(),
      getSkills(),
    ]);

    const categoryList = categories.length
      ? categories
      : Array.from(new Set(skills.map((skill) => skill.category))).sort();

    setSkillCategories(categoryList);
    setSkillLibrary(skills);

    if (!selectedCategory && categoryList[0]) {
      setSelectedCategory(categoryList[0]);
    }
  };

  const addSelectedSkill = (skillId: string) => {
    const skill = skillLibrary.find((entry) => entry.id === skillId);
    if (!skill) return;

    setSelectedSkillId(skillId);

    if (selectedSkills.some((entry) => entry.skillId === skillId)) {
      setSkillLibraryStatus(`${skill.name} is already added to this job.`);
      return;
    }

    onChange("skills", [
      ...selectedSkills,
      {
        skillId: skill.id,
        name: skill.name,
        category: skill.category,
        importance: skillImportance,
        weight: skillWeight,
      },
    ]);
    touch("skills");
    setSkillLibraryStatus(`${skill.name} added to the job.`);
  };

  const updateSelectedSkill = (
    skillId: string,
    patch: Partial<Pick<(typeof selectedSkills)[number], "importance" | "weight">>,
  ) => {
    onChange(
      "skills",
      selectedSkills.map((skill) =>
        skill.skillId === skillId ? { ...skill, ...patch } : skill,
      ),
    );
  };

  const removeSelectedSkill = (skillId: string) => {
    onChange(
      "skills",
      selectedSkills.filter((skill) => skill.skillId !== skillId),
    );
  };

  const createLibrarySkill = async () => {
    const name = librarySkillName.trim();
    const category = librarySkillCategory.trim();
    if (!name || !category) return;

    setSkillLibraryLoading(true);
    setSkillLibraryError(null);

    try {
      const created = await createSkill({ name, category });
      setLibrarySkillName("");
      setLibrarySkillCategory(created.category);
      setSkillLibraryStatus(`Created ${created.name}.`);
      await refreshSkillLibrary();
    } catch (error) {
      setSkillLibraryError(
        error instanceof Error ? error.message : "Unable to create skill.",
      );
    } finally {
      setSkillLibraryLoading(false);
    }
  };

  const saveLibrarySkill = async (skillId: string) => {
    const draft = editingDrafts[skillId];
    const original = skillLibrary.find((skill) => skill.id === skillId);
    if (!draft || !original) return;

    setSkillLibraryLoading(true);
    setSkillLibraryError(null);

    try {
      await updateSkill(skillId, {
        name: draft.name.trim() || original.name,
        category: draft.category.trim() || original.category,
      });
      setEditingSkillId(null);
      setSkillLibraryStatus(`Updated ${draft.name || original.name}.`);
      await refreshSkillLibrary();
    } catch (error) {
      setSkillLibraryError(
        error instanceof Error ? error.message : "Unable to update skill.",
      );
    } finally {
      setSkillLibraryLoading(false);
    }
  };

  const deleteLibrarySkill = async (skillId: string) => {
    setSkillLibraryLoading(true);
    setSkillLibraryError(null);

    try {
      await deleteSkill(skillId);
      setSkillLibraryStatus("Skill removed.");
      await refreshSkillLibrary();
    } catch (error) {
      setSkillLibraryError(
        error instanceof Error ? error.message : "Unable to delete skill.",
      );
    } finally {
      setSkillLibraryLoading(false);
    }
  };

  const salaryMinErr =
    touched.salaryMin && !data.salaryMin
      ? "Min salary is required."
      : undefined;
  const salaryMaxErr =
    touched.salaryMax && !data.salaryMax
      ? "Max salary is required."
      : touched.salaryMax && Number(data.salaryMax) <= Number(data.salaryMin)
        ? "Max must be greater than min."
        : undefined;
  const skillsErr =
    touched.skills && data.skills.length === 0
      ? "Add at least one skill."
      : undefined;
  const descriptionErr =
    touched.jobDescription && !data.jobDescription.trim()
      ? "Job description is required."
      : undefined;
  const experienceErr =
    touched.experienceLevel && !data.experienceLevel
      ? "Select an experience level."
      : undefined;

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm space-y-8 text-midnight">

      {/* Salary Range */}
      <div className="space-y-4">
        <h3 className="font-syne text-lg font-semibold text-midnight">
          Salary range <span className="text-red-500">*</span>
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="salaryMin">Min salary</Label>
            <Input
              id="salaryMin"
              type="number"
              min={0}
              value={data.salaryMin}
              onChange={(e) => onChange("salaryMin", e.target.value)}
              onBlur={() => touch("salaryMin")}
              placeholder="e.g. 50000"
              className={`${FIELD_HEIGHT} py-0 ${salaryMinErr ? "border-red-400 focus-visible:ring-red-300" : ""}`}
            />
            <FieldError message={salaryMinErr} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="salaryMax">Max salary</Label>
            <Input
              id="salaryMax"
              type="number"
              min={0}
              value={data.salaryMax}
              onChange={(e) => onChange("salaryMax", e.target.value)}
              onBlur={() => touch("salaryMax")}
              placeholder="e.g. 100000"
              className={`${FIELD_HEIGHT} py-0 ${salaryMaxErr ? "border-red-400 focus-visible:ring-red-300" : ""}`}
            />
            <FieldError message={salaryMaxErr} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="currency">Currency</Label>
            <Select
              value={data.currency}
              onValueChange={(val) => onChange("currency", val as Currency)}
            >
              <SelectTrigger id="currency" className={`${FIELD_HEIGHT} w-full`}>
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="salaryPer">Period</Label>
            <Select
              value={data.salaryPer}
              onValueChange={(val) =>
                onChange("salaryPer", val as (typeof SALARY_PERIODS)[number])
              }
            >
              <SelectTrigger id="salaryPer" className={`${FIELD_HEIGHT} w-full`}>
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                {SALARY_PERIODS.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p.charAt(0) + p.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="border-t border-slate/10" />

      {/* Experience + Education */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <h3 className="font-syne text-lg font-semibold text-midnight">
            Experience level <span className="text-red-500">*</span>
          </h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {EXPERIENCE_LEVELS.map((level) => (
              <button
                type="button"
                key={level}
                onClick={() => {
                  onChange("experienceLevel", level);
                  touch("experienceLevel");
                }}
                className={`${FIELD_HEIGHT} flex items-center rounded-lg border px-3 text-sm font-medium transition ${
                  data.experienceLevel === level
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-slate/20 text-midnight hover:border-primary/40"
                }`}
              >
                {EXPERIENCE_LABELS[level]}
              </button>
            ))}
          </div>
          <FieldError message={experienceErr} />
        </div>

        <div className="space-y-3">
          <h3 className="font-syne text-lg font-semibold text-midnight">
            Education requirement
          </h3>
          <Select
            value={data.educationRequirement}
            onValueChange={(val) =>
              onChange("educationRequirement", val as EducationRequirement)
            }
          >
            <SelectTrigger className={`${FIELD_HEIGHT} w-full`}>
              <SelectValue placeholder="Select education level" />
            </SelectTrigger>
            <SelectContent>
              {EDUCATION_LEVELS.map((edu) => (
                <SelectItem key={edu} value={edu}>{edu}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border-t border-slate/10" />

      {/* Skills */}
      <div className="space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 className="font-syne text-lg font-semibold text-midnight">
              Skills <span className="text-red-500">*</span>
            </h3>
            <p className="text-sm text-slate">
              Choose a category, pick a skill, and it is added directly to the job table.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsLibraryOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-slate/20 px-3 py-1.5 text-xs font-semibold text-slate hover:border-primary/30 hover:text-midnight"
          >
            <Library className="h-3.5 w-3.5" /> Manage skill library
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="skillCategory">Category</Label>
              <Select
                value={selectedCategory}
                onValueChange={(value) => {
                  setSelectedCategory(value);
                  setSelectedSkillId("");
                }}
              >
                <SelectTrigger id="skillCategory" className={`${FIELD_HEIGHT} w-full`}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {skillCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="skillName">Skill</Label>
              <Select
                value={selectedSkillId}
                onValueChange={addSelectedSkill}
                disabled={!selectedCategory || filteredSkillLibrary.length === 0}
              >
                <SelectTrigger id="skillName" className={`${FIELD_HEIGHT} w-full`}>
                  <SelectValue
                    placeholder={
                      selectedCategory ? "Select skill" : "Pick a category first"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {filteredSkillLibrary.map((skill) => (
                    <SelectItem key={skill.id} value={skill.id}>
                      {skill.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="skillImportance">Importance</Label>
              <Select
                value={skillImportance}
                onValueChange={(val) =>
                  setSkillImportance(val as SkillImportance)
                }
              >
                <SelectTrigger id="skillImportance" className={`${FIELD_HEIGHT} w-full`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {IMPORTANCE_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt.charAt(0) + opt.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="skillWeight">Weight: {skillWeight}</Label>
              <div className={`${FIELD_HEIGHT} flex items-center gap-3 rounded-lg border border-slate/20 px-3`}>
                <input
                  id="skillWeight"
                  type="range"
                  min={1}
                  max={100}
                  value={skillWeight}
                  onChange={(e) => setSkillWeight(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
            </div>
          </div>

          <FieldError message={skillsErr} />

          <div className="rounded-xl border border-slate/15 bg-surface/60 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-midnight">Selected skills</p>
              <p className="text-xs text-slate">{selectedSkills.length} added</p>
            </div>

            {selectedSkills.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate/20 bg-white px-4 py-6 text-sm text-slate">
                Pick a skill from the dropdown to add it here.
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border border-slate/15 bg-white">
                <table className="min-w-full divide-y divide-slate/10 text-sm">
                  <thead className="bg-surface text-left text-xs uppercase tracking-[0.15em] text-slate">
                    <tr>
                      <th className="px-4 py-3">Skill</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Importance</th>
                      <th className="px-4 py-3">Weight</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate/10">
                    {selectedSkills.map((skill) => (
                      <tr key={skill.skillId} className="align-middle">
                        <td className="px-4 py-3 font-medium text-midnight">
                          {skill.name}
                        </td>
                        <td className="px-4 py-3 text-slate">{skill.category}</td>
                        <td className="px-4 py-3">
                          <Select
                            value={skill.importance}
                            onValueChange={(value) =>
                              updateSelectedSkill(skill.skillId, {
                                importance: value as SkillImportance,
                              })
                            }
                          >
                            <SelectTrigger className="!h-9 box-border w-[150px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {IMPORTANCE_OPTIONS.map((opt) => (
                                <SelectItem key={opt} value={opt}>
                                  {opt.charAt(0) + opt.slice(1).toLowerCase()}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <input
                              type="range"
                              min={1}
                              max={100}
                              value={skill.weight}
                              onChange={(e) =>
                                updateSelectedSkill(skill.skillId, {
                                  weight: Number(e.target.value),
                                })
                              }
                              className="w-28 accent-primary"
                            />
                            <span className="w-8 text-right text-xs text-slate">
                              {skill.weight}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => removeSelectedSkill(skill.skillId)}
                            className="inline-flex items-center gap-1 rounded-full border border-danger/20 px-3 py-1.5 text-xs font-semibold text-danger hover:bg-danger/5"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-slate/10" />

      {/* Job Description */}
      <div className="space-y-3">
        <h3 className="font-syne text-lg font-semibold text-midnight">
          Job description <span className="text-red-500">*</span>
        </h3>
        <textarea
          ref={descriptionRef}
          value={data.jobDescription}
          onChange={(e) => {
            onChange("jobDescription", e.target.value.slice(0, 5000));
            touch("jobDescription");
          }}
          onBlur={() => touch("jobDescription")}
          placeholder="Write a detailed job description..."
          className={`min-h-48 w-full rounded-lg border bg-white p-3 text-midnight placeholder-slate/50 outline-none focus:ring-2 transition ${
            descriptionErr
              ? "border-red-400 focus:border-red-400 focus:ring-red-300"
              : "border-slate/25 focus:border-primary focus:ring-primary/20"
          }`}
        />
        <div className="flex items-start justify-between">
          <FieldError message={descriptionErr} />
          <p className="ml-auto text-xs text-muted-foreground">
            {data.jobDescription.length}/5000
          </p>
        </div>
      </div>

      <div className="border-t border-slate/10" />

      {/* Responsibilities */}
      <div className="space-y-3">
        <h3 className="font-syne text-lg font-semibold text-midnight">
          Responsibilities
        </h3>
        <textarea
          value={responsibilitiesText}
          onChange={(e) => onChange("responsibilities", e.target.value)}
          placeholder="List the responsibilities for this role..."
          className="min-h-32 w-full rounded-lg border border-slate/25 bg-white p-3 text-midnight placeholder-slate/50 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
        />
      </div>

      {/* Skill Library Dialog */}
      <Dialog open={isLibraryOpen} onOpenChange={setIsLibraryOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Skill library</DialogTitle>
            <DialogDescription>
              Create, rename, or remove skills available across all job posts.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => void refreshSkillLibrary()}
                disabled={skillLibraryLoading}
                className="inline-flex items-center gap-2 rounded-full border border-slate/20 px-3 py-1.5 text-xs font-semibold text-slate hover:border-primary/30 hover:text-midnight disabled:opacity-50"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Refresh
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="newSkillName">New skill name</Label>
                <Input
                  id="newSkillName"
                  value={librarySkillName}
                  onChange={(e) => setLibrarySkillName(e.target.value)}
                  placeholder="e.g. NestJS"
                  className={`${FIELD_HEIGHT} py-0`}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="newSkillCategory">Category</Label>
                <Input
                  id="newSkillCategory"
                  value={librarySkillCategory}
                  onChange={(e) => setLibrarySkillCategory(e.target.value)}
                  placeholder="e.g. backend"
                  className={`${FIELD_HEIGHT} py-0`}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => void createLibrarySkill()}
              disabled={
                skillLibraryLoading ||
                !librarySkillName.trim() ||
                !librarySkillCategory.trim()
              }
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus className="h-4 w-4" /> Add skill to library
            </button>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="skillSearch">Search library</Label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate" />
                <Input
                  id="skillSearch"
                  value={skillSearch}
                  onChange={(e) => setSkillSearch(e.target.value)}
                  placeholder="Search by skill or category"
                  className={`${FIELD_HEIGHT} py-0 pl-9`}
                />
              </div>
            </div>

            {(skillLibraryError || skillLibraryStatus) && (
              <div className="space-y-1 rounded-lg border border-slate/15 bg-white px-3 py-2 text-xs">
                {skillLibraryError && (
                  <p className="text-danger">{skillLibraryError}</p>
                )}
                {skillLibraryStatus && (
                  <p className="text-success">{skillLibraryStatus}</p>
                )}
              </div>
            )}

            <div className="max-h-[420px] space-y-2 overflow-auto pr-1">
              {skillLibraryLoading && skillLibrary.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate/20 bg-white px-4 py-6 text-sm text-slate">
                  Loading skills...
                </div>
              ) : filteredSkillLibrary.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate/20 bg-white px-4 py-6 text-sm text-slate">
                  No skills found for this filter.
                </div>
              ) : (
                filteredSkillLibrary.map((skill) => {
                  const draft = editingDrafts[skill.id] ?? {
                    name: skill.name,
                    category: skill.category,
                  };
                  const isEditing = editingSkillId === skill.id;

                  return (
                    <div
                      key={skill.id}
                      className="rounded-lg border border-slate/15 bg-white p-3 shadow-sm"
                    >
                      <div className="grid gap-2 sm:grid-cols-[1fr,0.9fr]">
                        <Input
                          value={draft.name}
                          onChange={(e) =>
                            setEditingDrafts((prev) => ({
                              ...prev,
                              [skill.id]: { ...draft, name: e.target.value },
                            }))
                          }
                          onFocus={() => setEditingSkillId(skill.id)}
                          className={`${FIELD_HEIGHT} py-0`}
                        />
                        <Input
                          value={draft.category}
                          onChange={(e) =>
                            setEditingDrafts((prev) => ({
                              ...prev,
                              [skill.id]: {
                                ...draft,
                                category: e.target.value,
                              },
                            }))
                          }
                          onFocus={() => setEditingSkillId(skill.id)}
                          className={`${FIELD_HEIGHT} py-0`}
                        />
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-3 text-xs text-slate">
                        <span>{skill.id}</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingSkillId(skill.id);
                              void saveLibrarySkill(skill.id);
                            }}
                            disabled={skillLibraryLoading}
                            className="inline-flex items-center gap-1 rounded-full border border-primary/20 px-3 py-1.5 font-semibold text-primary hover:bg-primary/5 disabled:opacity-50"
                          >
                            <PencilLine className="h-3.5 w-3.5" /> Save
                          </button>
                          <button
                            type="button"
                            onClick={() => void deleteLibrarySkill(skill.id)}
                            disabled={skillLibraryLoading}
                            className="inline-flex items-center gap-1 rounded-full border border-danger/20 px-3 py-1.5 font-semibold text-danger hover:bg-danger/5 disabled:opacity-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </button>
                          {isEditing && (
                            <span className="rounded-full bg-primary/10 px-2 py-1 text-[11px] font-semibold text-primary">
                              Editing
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}