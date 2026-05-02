"use client";

import { CheckCircle, Plus, UploadCloud, X, Info } from "lucide-react";
import FieldError from "./FieldError";
import SectionCard from "./SectionCard";
import {
  degreeLevels,
  emptyEducationDraft,
  emptyExperienceDraft,
  inputBaseClass,
  months,
  textareaBaseClass,
  useJobApplicationFormContext,
  years,
} from "@/app/(public)/jobs/[jobId]/apply/job-application-form-context";

export default function ProfileSection() {
  const {
    addEducation,
    addExperience,
    clearProfileSection,
    educationDraft,
    educations,
    errors,
    experienceDraft,
    experiences,
    handleResumeSelected,
    isDragOver,
    removeResume,
    resumeFile,
    resumeInputRef,
    resumeRef,
    setEducationDraft,
    setExperienceDraft,
    setIsDragOver,
    setShowEducationForm,
    setShowExperienceForm,
    setEducations,
    setExperiences,
    setSummary,
    showEducationForm,
    showExperienceForm,
    summary,
  } = useJobApplicationFormContext();

  return (
    <SectionCard title="Profile" onClear={clearProfileSection}>
      <div className="space-y-5">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-[13px] text-slate">
              Education (Optional)
            </label>
            <button
              type="button"
              onClick={() => setShowEducationForm((previous) => !previous)}
              className="inline-flex h-8 items-center gap-2 rounded-[8px] border-[1.5px] border-dashed border-[#C5CFDF] bg-transparent px-3 text-[13px] text-[#6B7A99] transition hover:border-[#1E6FFF] hover:text-[#1E6FFF]"
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
                    onChange={(event) =>
                      setEducationDraft((previous) => ({
                        ...previous,
                        level: event.target.value,
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
                    onChange={(event) =>
                      setEducationDraft((previous) => ({
                        ...previous,
                        field: event.target.value,
                      }))
                    }
                    className={inputBaseClass}
                  />

                  <input
                    placeholder="Institution"
                    value={educationDraft.institution}
                    onChange={(event) =>
                      setEducationDraft((previous) => ({
                        ...previous,
                        institution: event.target.value,
                      }))
                    }
                    className={inputBaseClass}
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={educationDraft.startYear}
                      onChange={(event) =>
                        setEducationDraft((previous) => ({
                          ...previous,
                          startYear: event.target.value,
                        }))
                      }
                      className={inputBaseClass}
                    >
                      <option value="">Start Year</option>
                      {years.map((year) => (
                        <option key={`education-start-${year}`} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>

                    <select
                      value={educationDraft.endYear}
                      onChange={(event) =>
                        setEducationDraft((previous) => ({
                          ...previous,
                          endYear: event.target.value,
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

          {educations.length > 0 ? (
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
                      {entry.startYear || "-"} - {entry.endYear || "Present"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setEducations((previous) =>
                        previous.filter((item) => item.id !== entry.id),
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
          ) : null}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-[13px] text-slate">
              Experience (Optional)
            </label>
            <button
              type="button"
              onClick={() => setShowExperienceForm((previous) => !previous)}
              className="inline-flex h-8 items-center gap-2 rounded-[8px] border-[1.5px] border-dashed border-[#C5CFDF] bg-transparent px-3 text-[13px] text-[#6B7A99] transition hover:border-[#1E6FFF] hover:text-[#1E6FFF]"
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
                    onChange={(event) =>
                      setExperienceDraft((previous) => ({
                        ...previous,
                        title: event.target.value,
                      }))
                    }
                    className={inputBaseClass}
                  />

                  <input
                    placeholder="Company"
                    value={experienceDraft.company}
                    onChange={(event) =>
                      setExperienceDraft((previous) => ({
                        ...previous,
                        company: event.target.value,
                      }))
                    }
                    className={inputBaseClass}
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={experienceDraft.startMonth}
                      onChange={(event) =>
                        setExperienceDraft((previous) => ({
                          ...previous,
                          startMonth: event.target.value,
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
                      onChange={(event) =>
                        setExperienceDraft((previous) => ({
                          ...previous,
                          startYear: event.target.value,
                        }))
                      }
                      className={inputBaseClass}
                    >
                      <option value="">Start Year</option>
                      {years.map((year) => (
                        <option key={`experience-start-${year}`} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={experienceDraft.endMonth}
                      onChange={(event) =>
                        setExperienceDraft((previous) => ({
                          ...previous,
                          endMonth: event.target.value,
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
                      onChange={(event) =>
                        setExperienceDraft((previous) => ({
                          ...previous,
                          endYear: event.target.value,
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
                    onChange={(event) =>
                      setExperienceDraft((previous) => ({
                        ...previous,
                        current: event.target.checked,
                        endMonth: event.target.checked ? "" : previous.endMonth,
                        endYear: event.target.checked ? "" : previous.endYear,
                      }))
                    }
                  />
                  Currently working here
                </label>

                <textarea
                  rows={4}
                  placeholder="Description (Optional)"
                  value={experienceDraft.description}
                  onChange={(event) =>
                    setExperienceDraft((previous) => ({
                      ...previous,
                      description: event.target.value,
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

          {experiences.length > 0 ? (
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
                      setExperiences((previous) =>
                        previous.filter((item) => item.id !== entry.id),
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
          ) : null}
        </div>

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
            onChange={(event) => setSummary(event.target.value)}
            className={textareaBaseClass}
          />
        </div>

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
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(event) =>
              handleResumeSelected(event.target.files?.[0] ?? null)
            }
          />

          <div
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragOver(false);
              handleResumeSelected(event.dataTransfer.files?.[0] ?? null);
            }}
            className={`flex min-h-[130px] flex-col items-center justify-center gap-2 rounded-[12px] border-2 border-dashed p-8 text-center transition-transform duration-150 ${isDragOver ? "scale-105 border-[#1E6FFF] bg-[#EEF4FF]" : resumeFile ? "border-[1.5px] border-[#00B37E] bg-[#F0FBF6]" : "border-[#C5D5F0] bg-[#F5F8FF]"}`}
          >
            {resumeFile ? (
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
                  className="text-sm text-[#E63946] hover:underline"
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
                    className="font-medium text-[#1E6FFF] hover:underline"
                  >
                    Choose file
                  </button>
                  <span className="text-[#9BA3B2]"> or drag and drop here</span>
                </p>
                <p className="mt-1 text-[12px] text-[#B0B8CC]">
                  Supported formats: .pdf, .doc, .docx
                </p>
              </div>
            )}
          </div>
          <FieldError message={errors.resume} />
        </div>
      </div>
    </SectionCard>
  );
}
