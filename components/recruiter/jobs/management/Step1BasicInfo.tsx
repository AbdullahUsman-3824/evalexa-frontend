"use client";

import { useState } from "react";
import type { JobPostFormData, JobType, WorkMode } from "./types";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FieldLabel from "@/components/ui/FieldLable";
import FieldError from "@/components/ui/FieldError";

interface Step1BasicInfoProps {
  data: JobPostFormData;
  onChange: <K extends keyof JobPostFormData>(
    field: K,
    value: JobPostFormData[K],
  ) => void;
}

const DEPARTMENTS = [
  "Engineering",
  "Design",
  "Marketing",
  "Sales",
  "HR",
  "Finance",
  "Operations",
  "Other",
];

const JOB_TYPES: JobType[] = ["Full-time", "Part-time", "Contract"];

const WORK_MODES: WorkMode[] = ["On-site", "Remote", "Hybrid"];

function validate(data: JobPostFormData) {
  const errors: Partial<Record<keyof JobPostFormData, string>> = {};

  if (!data.jobTitle.trim())
    errors.jobTitle = "Job title is required.";
  else if (data.jobTitle.trim().length < 3)
    errors.jobTitle = "Job title must be at least 3 characters.";

  if (!data.department)
    errors.department = "Please select a department.";

  if (!data.jobType)
    errors.jobType = "Please select a job type.";

  if (!data.workMode)
    errors.workMode = "Please select a work mode.";

  if (data.workMode !== "Remote" && !data.location.trim())
    errors.location = "Location is required for on-site and hybrid roles.";

  if (!data.applicationDeadline)
    errors.applicationDeadline = "Please set an application deadline.";
  else if (new Date(data.applicationDeadline) <= new Date())
    errors.applicationDeadline = "Deadline must be a future date.";

  return errors;
}

export default function Step1BasicInfo({ data, onChange }: Step1BasicInfoProps) {
  const [touched, setTouched] = useState<Partial<Record<keyof JobPostFormData, boolean>>>({});

  const errors = validate(data);

  function touch(field: keyof JobPostFormData) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function err(field: keyof JobPostFormData) {
    return touched[field] ? errors[field] : undefined;
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm flex flex-col gap-5 text-midnight">

      {/* Job Title */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <FieldLabel htmlFor="jobTitle">Job title</FieldLabel>
          <span className="text-xs text-muted-foreground">
            {data.jobTitle.length}/80
          </span>
        </div>
        <Input
          id="jobTitle"
          value={data.jobTitle}
          onChange={(e) => onChange("jobTitle", e.target.value.slice(0, 80))}
          onBlur={() => touch("jobTitle")}
          placeholder="e.g. Senior Frontend Developer"
          className={`h-10 ${err("jobTitle") ? "border-red-400 focus-visible:ring-red-300" : ""}`}
        />
        <FieldError message={err("jobTitle")} />
      </div>

      {/* Department + Location */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <FieldLabel htmlFor="department">Department</FieldLabel>
          <Select
            value={data.department}
            onValueChange={(val) => {
              onChange("department", val);
              touch("department");
            }}
          >
            <SelectTrigger
              id="department"
              className={`h-10 w-full ${err("department") ? "border-red-400 focus:ring-red-300" : ""}`}
            >
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {DEPARTMENTS.map((dep) => (
                <SelectItem key={dep} value={dep}>{dep}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError message={err("department")} />
        </div>

        {data.workMode !== "Remote" ? (
          <div className="flex flex-col gap-1.5">
            <FieldLabel htmlFor="location">Location</FieldLabel>
            <Input
              id="location"
              value={data.location}
              onChange={(e) => onChange("location", e.target.value)}
              onBlur={() => touch("location")}
              placeholder="City, country"
              className={`h-10 ${err("location") ? "border-red-400 focus-visible:ring-red-300" : ""}`}
            />
            <FieldError message={err("location")} />
          </div>
        ) : (
          <div aria-hidden="true" />
        )}
      </div>

      {/* Job Type + Work Mode */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <FieldLabel htmlFor="jobType">Job type</FieldLabel>
          <Select
            value={data.jobType}
            onValueChange={(val) => {
              onChange("jobType", val as JobType);
              touch("jobType");
            }}
          >
            <SelectTrigger
              id="jobType"
              className={`h-10 w-full ${err("jobType") ? "border-red-400 focus:ring-red-300" : ""}`}
            >
              <SelectValue placeholder="Select job type" />
            </SelectTrigger>
            <SelectContent>
              {JOB_TYPES.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError message={err("jobType")} />
        </div>

        <div className="flex flex-col gap-1.5">
          <FieldLabel htmlFor="workMode">Work mode</FieldLabel>
          <Select
            value={data.workMode}
            onValueChange={(val) => {
              onChange("workMode", val as WorkMode);
              touch("workMode");
            }}
          >
            <SelectTrigger
              id="workMode"
              className={`h-10 w-full ${err("workMode") ? "border-red-400 focus:ring-red-300" : ""}`}
            >
              <SelectValue placeholder="Select work mode" />
            </SelectTrigger>
            <SelectContent>
              {WORK_MODES.map((mode) => (
                <SelectItem key={mode} value={mode}>{mode}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError message={err("workMode")} />
        </div>
      </div>

      {/* Application Deadline */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <FieldLabel htmlFor="deadline">Application deadline</FieldLabel>
          <Input
            id="deadline"
            type="date"
            value={data.applicationDeadline}
            onChange={(e) => onChange("applicationDeadline", e.target.value)}
            onBlur={() => touch("applicationDeadline")}
            className={`h-10 ${err("applicationDeadline") ? "border-red-400 focus-visible:ring-red-300" : ""}`}
          />
          <FieldError message={err("applicationDeadline")} />
        </div>
      </div>

    </div>
  );
}