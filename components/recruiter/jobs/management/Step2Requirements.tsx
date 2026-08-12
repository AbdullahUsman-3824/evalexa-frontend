"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  PencilLine,
  Search,
  RefreshCw,
  Trash2,
  Library,
  Check,
  X,
  ChevronDown,
} from "lucide-react";
import type {
  BackendCurrency as Currency,
  FormEducationLevel as EducationRequirement,
  FormExperienceLevel as ExperienceLevel,
  JobPostFormData,
  BackendSkillImportance as SkillImportance,
} from "@/types/job.types";
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
} from "@/repositories/job.repository";
import { SkillRecord } from "@/types/job.types";

interface Step2RequirementsProps {
  data: JobPostFormData;
  onChange: <K extends keyof JobPostFormData>(
    field: K,
    value: JobPostFormData[K],
  ) => void;
}

const CURRENCIES: Currency[] = ["PKR", "USD", "EUR"];
const SALARY_PERIODS = ["MONTHLY", "YEARLY"] as const;
const EXPERIENCE_LEVELS: ExperienceLevel[] = [
  "Intern",
  "Entry",
  "Mid",
  "Senior",
  "Lead",
];
const EDUCATION_LEVELS: EducationRequirement[] = [
  "High School",
  "Diploma",
  "Associate",
  "Bachelor's",
  "Master's",
  "PhD",
  "Any",
];
const IMPORTANCE_OPTIONS: SkillImportance[] = ["REQUIRED", "PREFERRED"];

const EXPERIENCE_LABELS: Record<string, string> = {
  Intern: "Intern (0-1 yrs)",
  Entry: "Entry (1-2 yrs)",
  Mid: "Mid (2-5 yrs)",
  Senior: "Senior (5+ yrs)",
  Lead: "Lead (8+ yrs)",
};

const FIELD_HEIGHT = "!h-10 box-border";

export default function Step2Requirements({
  data,
  onChange,
}: Step2RequirementsProps) {
  const [skillLibrary, setSkillLibrary] = useState<SkillRecord[]>([]);
  const [skillCategories, setSkillCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSkillId, setSelectedSkillId] = useState("");
  const [skillImportance] = useState<SkillImportance>("REQUIRED");
  const [skillWeight] = useState<number>(50);

  // Separate search for main dropdown vs dialog
  const [dialogSkillSearch, setDialogSkillSearch] = useState("");

  const [librarySkillName, setLibrarySkillName] = useState("");
  const [librarySkillCategory, setLibrarySkillCategory] = useState("");
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [editingDrafts, setEditingDrafts] = useState<
    Record<string, { name: string; category: string }>
  >({});
  const [skillLibraryLoading, setSkillLibraryLoading] = useState(false);
  const [skillLibraryError, setSkillLibraryError] = useState<string | null>(
    null,
  );
  const [skillLibraryStatus, setSkillLibraryStatus] = useState<string | null>(
    null,
  );
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  // Dialog-specific state
  const [libraryFilterCategory, setLibraryFilterCategory] =
    useState<string>("__all__");
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  function touch(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  // Auto-clear status / error after 3s
  useEffect(() => {
    if (!skillLibraryStatus && !skillLibraryError) return;
    const t = setTimeout(() => {
      setSkillLibraryStatus(null);
      setSkillLibraryError(null);
    }, 3000);
    return () => clearTimeout(t);
  }, [skillLibraryStatus, skillLibraryError]);

  const selectedSkills = data.skills ?? [];

  // Skills available for the main "Skill" dropdown (filtered by selected category only)
  const filteredSkillLibrary = useMemo(() => {
    return skillLibrary.filter((skill) => {
      if (!selectedCategory) return false;
      return skill.category === selectedCategory;
    });
  }, [skillLibrary, selectedCategory]);

  // Skills visible in the dialog list (filtered by tab + search)
  const dialogFilteredSkills = useMemo(() => {
    const normalizedSearch = dialogSkillSearch.trim().toLowerCase();
    return skillLibrary.filter((skill) => {
      const categoryMatches =
        libraryFilterCategory === "__all__" ||
        skill.category === libraryFilterCategory;
      const searchMatches =
        !normalizedSearch ||
        skill.name.toLowerCase().includes(normalizedSearch) ||
        skill.category.toLowerCase().includes(normalizedSearch);
      return categoryMatches && searchMatches;
    });
  }, [skillLibrary, libraryFilterCategory, dialogSkillSearch]);

  // Group dialog skills by category
  const groupedDialogSkills = useMemo(() => {
    const groups: Record<string, SkillRecord[]> = {};
    for (const skill of dialogFilteredSkills) {
      if (!groups[skill.category]) groups[skill.category] = [];
      groups[skill.category].push(skill);
    }
    return groups;
  }, [dialogFilteredSkills]);

  // Load once on mount
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

        if (categoryList[0]) {
          setSelectedCategory((prev) => prev || categoryList[0]);
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
  }, []);

  // Keep selectedSkillId valid when category changes
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
    setSkillLibraryLoading(true);
    setSkillLibraryError(null);
    try {
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
    } catch (error) {
      setSkillLibraryError(
        error instanceof Error ? error.message : "Unable to refresh skills.",
      );
    } finally {
      setSkillLibraryLoading(false);
    }
  };

  const addSelectedSkill = (skillId: string) => {
    const skill = skillLibrary.find((entry) => entry.id === skillId);
    if (!skill) return;

    if (selectedSkills.some((entry) => entry.skillId === skillId)) {
      setSkillLibraryStatus(`${skill.name} is already added to this job.`);
      setSelectedSkillId(""); // reset so user can pick another
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
    setSelectedSkillId(""); // clear so next skill can be selected cleanly
  };

  const updateSelectedSkill = (
    skillId: string,
    patch: Partial<
      Pick<(typeof selectedSkills)[number], "importance" | "weight">
    >,
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

  const cancelEdit = (skillId: string) => {
    setEditingSkillId(null);
    setEditingDrafts((prev) => {
      const next = { ...prev };
      delete next[skillId];
      return next;
    });
  };

  const canAddSkill = librarySkillName.trim() && librarySkillCategory.trim();

  const salaryMinErr =
    touched.salaryMin &&
    (data.salaryMin === "" ||
      data.salaryMin === null ||
      data.salaryMin === undefined)
      ? "Min salary is required."
      : undefined;
  const salaryMaxErr =
    touched.salaryMax &&
    (data.salaryMax === "" ||
      data.salaryMax === null ||
      data.salaryMax === undefined)
      ? "Max salary is required."
      : touched.salaryMax &&
          data.salaryMin !== "" &&
          data.salaryMax !== "" &&
          Number(data.salaryMax) <= Number(data.salaryMin)
        ? "Max must be greater than min."
        : undefined;
  const skillsErr =
    touched.skills && data.skills.length === 0
      ? "Add at least one skill."
      : undefined;
  const descriptionErr =
    touched.description && !data.description.trim()
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
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
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
              <SelectTrigger
                id="salaryPer"
                className={`${FIELD_HEIGHT} w-full`}
              >
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
            value={data.educationLevel}
            onValueChange={(val) =>
              onChange("educationLevel", val as EducationRequirement)
            }
          >
            <SelectTrigger className={`${FIELD_HEIGHT} w-full`}>
              <SelectValue placeholder="Select education level" />
            </SelectTrigger>
            <SelectContent>
              {EDUCATION_LEVELS.map((edu) => (
                <SelectItem key={edu} value={edu}>
                  {edu}
                </SelectItem>
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
              Choose a category, pick a skill, and it is added directly to the
              job table. You can adjust importance and weight afterwards.
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
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="skillCategory">Category</Label>
              <Select
                value={selectedCategory}
                onValueChange={(value) => {
                  setSelectedCategory(value);
                  setSelectedSkillId("");
                }}
              >
                <SelectTrigger
                  id="skillCategory"
                  className={`${FIELD_HEIGHT} w-full`}
                >
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
                disabled={
                  !selectedCategory ||
                  filteredSkillLibrary.length === 0 ||
                  skillLibraryLoading
                }
              >
                <SelectTrigger
                  id="skillName"
                  className={`${FIELD_HEIGHT} w-full`}
                >
                  <SelectValue
                    placeholder={
                      !selectedCategory
                        ? "Pick a category first"
                        : skillLibraryLoading
                          ? "Loading..."
                          : filteredSkillLibrary.length === 0
                            ? "No skills in this category"
                            : "Select skill"
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
          </div>

          {/* Inline status for main form (already-added / just-added) */}
          {skillLibraryStatus && !isLibraryOpen && (
            <p className="text-xs font-medium text-success">
              {skillLibraryStatus}
            </p>
          )}

          <FieldError message={skillsErr} />

          <div className="rounded-xl border border-slate/15 bg-surface/60 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-midnight">
                Selected skills
              </p>
              <p className="text-xs text-slate">
                {selectedSkills.length} added
              </p>
            </div>

            {selectedSkills.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate/20 bg-white px-4 py-6 text-sm text-slate">
                Pick a skill from the dropdown to add it here.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-slate/15 bg-white">
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
                        <td className="px-4 py-3 font-medium text-midnight whitespace-nowrap">
                          {skill.name}
                        </td>
                        <td className="px-4 py-3 text-slate whitespace-nowrap">
                          {skill.category}
                        </td>
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
                          <div className="flex items-center gap-3 min-w-[140px]">
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
          value={data.description}
          onChange={(e) => {
            onChange("description", e.target.value.slice(0, 5000));
            touch("description");
          }}
          onBlur={() => touch("description")}
          placeholder="Write a detailed job description..."
          className={`min-h-48 w-full rounded-lg border bg-white p-3 text-midnight placeholder-slate/50 outline-none focus:ring-2 transition ${
            descriptionErr
              ? "border-red-400 focus:border-red-400 focus:ring-red-300"
              : "border-slate/25 focus:border-primary focus:ring-primary/20"
          }`}
        />
        <div className="flex items-start justify-between gap-3">
          <FieldError message={descriptionErr} />
          <p className="ml-auto text-xs text-muted-foreground shrink-0">
            {data.description.length}/5000
          </p>
        </div>
      </div>

      {/* ── Skill Library Dialog ─────────────────────────────────────── */}
      <Dialog
        open={isLibraryOpen}
        onOpenChange={(open) => {
          setIsLibraryOpen(open);
          if (!open) {
            setDialogSkillSearch("");
            setLibraryFilterCategory("__all__");
            setEditingSkillId(null);
            setIsAddFormOpen(false);
            setSkillLibraryStatus(null);
            setSkillLibraryError(null);
          }
        }}
      >
        <DialogContent className="flex max-h-[85vh] w-full max-w-2xl flex-col gap-0 overflow-hidden p-0">
          <DialogHeader className="shrink-0 border-b border-slate/10 px-6 py-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <DialogTitle>Skill library</DialogTitle>
                <DialogDescription>
                  Create, rename, or remove skills available across all job
                  posts.
                </DialogDescription>
              </div>
              <span className="shrink-0 rounded-full bg-slate/10 px-2.5 py-1 text-xs font-semibold text-slate">
                {skillLibrary.length} skills
              </span>
            </div>
          </DialogHeader>

          {/* Single scrollable body */}
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
            <div className="space-y-4">
              {/* ── Add new skill (collapsible) ── */}
              <div className="rounded-lg border border-slate/15">
                <button
                  type="button"
                  onClick={() => setIsAddFormOpen((prev) => !prev)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left"
                >
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-midnight">
                    <Plus className="h-4 w-4 text-primary" /> Add new skill
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate transition-transform ${
                      isAddFormOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isAddFormOpen && (
                  <div className="space-y-3 border-t border-slate/10 bg-slate/5 p-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor="newSkillName">Skill name</Label>
                        <Input
                          id="newSkillName"
                          value={librarySkillName}
                          onChange={(e) => setLibrarySkillName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && canAddSkill)
                              void createLibrarySkill();
                          }}
                          placeholder="e.g. NestJS"
                          className={`${FIELD_HEIGHT} py-0`}
                          autoFocus
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor="newSkillCategory">Category</Label>
                        <Input
                          id="newSkillCategory"
                          value={librarySkillCategory}
                          onChange={(e) =>
                            setLibrarySkillCategory(e.target.value)
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && canAddSkill)
                              void createLibrarySkill();
                          }}
                          placeholder="e.g. Backend"
                          className={`${FIELD_HEIGHT} py-0`}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => void createLibrarySkill()}
                        disabled={skillLibraryLoading || !canAddSkill}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Plus className="h-4 w-4" /> Add skill
                      </button>
                      {!canAddSkill && (
                        <p className="text-xs text-slate">
                          Fill in both fields to add a skill.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* ── Status / error banner ── */}
              {(skillLibraryError ?? skillLibraryStatus) && (
                <div
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium ${
                    skillLibraryError
                      ? "border-danger/20 bg-danger/5 text-danger"
                      : "border-success/20 bg-success/5 text-success"
                  }`}
                >
                  {skillLibraryError ? (
                    <X className="h-3.5 w-3.5 flex-shrink-0" />
                  ) : (
                    <Check className="h-3.5 w-3.5 flex-shrink-0" />
                  )}
                  {skillLibraryError ?? skillLibraryStatus}
                </div>
              )}

              {/* ── Sticky search + filter + refresh ── */}
              <div className="sticky top-0 z-10 -mx-6 space-y-3 border-b border-slate/10 bg-white px-6 pb-3 pt-1">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate" />
                    <Input
                      value={dialogSkillSearch}
                      onChange={(e) => setDialogSkillSearch(e.target.value)}
                      placeholder="Search skills..."
                      className={`${FIELD_HEIGHT} py-0 pl-9`}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => void refreshSkillLibrary()}
                    disabled={skillLibraryLoading}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate/20 px-3 py-2 text-xs font-semibold text-slate hover:border-primary/30 hover:text-midnight disabled:opacity-50"
                  >
                    <RefreshCw
                      className={`h-3.5 w-3.5 ${skillLibraryLoading ? "animate-spin" : ""}`}
                    />
                    Refresh
                  </button>
                </div>

                {skillCategories.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setLibraryFilterCategory("__all__")}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                        libraryFilterCategory === "__all__"
                          ? "bg-primary text-white"
                          : "border border-slate/20 text-slate hover:border-primary/30 hover:text-midnight"
                      }`}
                    >
                      All
                      <span className="ml-1 opacity-70">
                        ({skillLibrary.length})
                      </span>
                    </button>
                    {skillCategories.map((cat) => {
                      const count = skillLibrary.filter(
                        (s) => s.category === cat,
                      ).length;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setLibraryFilterCategory(cat)}
                          className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                            libraryFilterCategory === cat
                              ? "bg-primary text-white"
                              : "border border-slate/20 text-slate hover:border-primary/30 hover:text-midnight"
                          }`}
                        >
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          <span className="ml-1 opacity-70">({count})</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ── Skills list grouped by category ── */}
              <div className="space-y-4">
                {skillLibraryLoading && skillLibrary.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate/20 px-4 py-8 text-center text-sm text-slate">
                    Loading skills...
                  </div>
                ) : Object.keys(groupedDialogSkills).length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate/20 px-4 py-8 text-center text-sm text-slate">
                    No skills found.
                  </div>
                ) : (
                  Object.entries(groupedDialogSkills).map(
                    ([category, skills]) => (
                      <div key={category}>
                        <div className="mb-1.5 flex items-center gap-2">
                          <span className="text-xs font-semibold uppercase tracking-widest text-slate">
                            {category.charAt(0).toUpperCase() +
                              category.slice(1)}
                          </span>
                          <span className="rounded-full bg-slate/10 px-1.5 py-0.5 text-[10px] font-semibold text-slate">
                            {skills.length}
                          </span>
                          <div className="h-px flex-1 bg-slate/10" />
                        </div>

                        <div className="space-y-1">
                          {skills.map((skill) => {
                            const isEditing = editingSkillId === skill.id;
                            const draft = editingDrafts[skill.id] ?? {
                              name: skill.name,
                              category: skill.category,
                            };

                            return (
                              <div
                                key={skill.id}
                                className={`group rounded-lg border transition ${
                                  isEditing
                                    ? "border-primary/30 bg-primary/5"
                                    : "border-slate/15 bg-white hover:border-slate/30"
                                }`}
                              >
                                {isEditing ? (
                                  <div className="p-3 space-y-3">
                                    <div className="grid gap-2 sm:grid-cols-[1fr,0.9fr]">
                                      <Input
                                        value={draft.name}
                                        onChange={(e) =>
                                          setEditingDrafts((prev) => ({
                                            ...prev,
                                            [skill.id]: {
                                              ...draft,
                                              name: e.target.value,
                                            },
                                          }))
                                        }
                                        placeholder="Skill name"
                                        className={`${FIELD_HEIGHT} py-0`}
                                        autoFocus
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
                                        placeholder="Category"
                                        className={`${FIELD_HEIGHT} py-0`}
                                      />
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          void saveLibrarySkill(skill.id)
                                        }
                                        disabled={skillLibraryLoading}
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
                                      >
                                        <Check className="h-3.5 w-3.5" /> Save
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => cancelEdit(skill.id)}
                                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate/20 px-3 py-1.5 text-xs font-semibold text-slate hover:bg-slate/5"
                                      >
                                        <X className="h-3.5 w-3.5" /> Cancel
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-between gap-2 px-3 py-2.5">
                                    <span className="text-sm font-medium text-midnight">
                                      {skill.name}
                                    </span>
                                    {/* Always visible on touch; slightly stronger on hover for desktop */}
                                    <div className="flex items-center gap-1 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setEditingSkillId(skill.id);
                                          setEditingDrafts((prev) => ({
                                            ...prev,
                                            [skill.id]: {
                                              name: skill.name,
                                              category: skill.category,
                                            },
                                          }));
                                        }}
                                        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-slate hover:bg-slate/10 hover:text-midnight"
                                      >
                                        <PencilLine className="h-3.5 w-3.5" />{" "}
                                        Edit
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          void deleteLibrarySkill(skill.id)
                                        }
                                        disabled={skillLibraryLoading}
                                        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-danger hover:bg-danger/5 disabled:opacity-50"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />{" "}
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ),
                  )
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
