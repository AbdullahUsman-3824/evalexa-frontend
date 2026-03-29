"use client";

import { useState } from "react";
import { Plus, X, GripVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Experience {
  id: string;
  title: string;
  company: string;
  employmentType: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  currentlyWorking: boolean;
  location: string;
  description: string;
}

export default function ExperienceTab() {
  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: "1",
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      employmentType: "full-time",
      startMonth: "01",
      startYear: "2022",
      endMonth: "",
      endYear: "",
      currentlyWorking: true,
      location: "Remote",
      description:
        "Led development of company dashboard using React and TypeScript",
    },
  ]);

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      title: "",
      company: "",
      employmentType: "full-time",
      startMonth: "",
      startYear: "",
      endMonth: "",
      endYear: "",
      currentlyWorking: false,
      location: "",
      description: "",
    };
    setExperiences([...experiences, newExp]);
  };

  const removeExperience = (id: string) => {
    setExperiences(experiences.filter((exp) => exp.id !== id));
  };

  const updateExperience = (
    id: string,
    field: keyof Experience,
    value: any,
  ) => {
    setExperiences(
      experiences.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp,
      ),
    );
  };

  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {experiences.map((exp, index) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="p-6 border border-slate/20 rounded-xl space-y-4"
          >
            {/* Header with drag handle and remove button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GripVertical size={20} className="text-slate cursor-move" />
                <h3 className="font-semibold text-midnight">
                  Experience #{index + 1}
                </h3>
              </div>
              {experiences.length > 1 && (
                <button
                  onClick={() => removeExperience(exp.id)}
                  className="p-2 text-danger hover:bg-danger/10 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Job Title */}
            <div>
              <label className="block text-sm font-medium text-midnight mb-2">
                Job Title *
              </label>
              <input
                type="text"
                value={exp.title}
                onChange={(e) =>
                  updateExperience(exp.id, "title", e.target.value)
                }
                placeholder="e.g., Frontend Developer"
                className="w-full px-4 py-2.5 border border-slate/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              />
            </div>

            {/* Company and Employment Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-midnight mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) =>
                    updateExperience(exp.id, "company", e.target.value)
                  }
                  placeholder="e.g., TechCorp Inc."
                  className="w-full px-4 py-2.5 border border-slate/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-midnight mb-2">
                  Employment Type
                </label>
                <select
                  value={exp.employmentType}
                  onChange={(e) =>
                    updateExperience(exp.id, "employmentType", e.target.value)
                  }
                  className="w-full px-4 py-2.5 border border-slate/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="freelance">Freelance</option>
                  <option value="internship">Internship</option>
                  <option value="contract">Contract</option>
                </select>
              </div>
            </div>

            {/* Start Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-midnight mb-2">
                  Start Month *
                </label>
                <select
                  value={exp.startMonth}
                  onChange={(e) =>
                    updateExperience(exp.id, "startMonth", e.target.value)
                  }
                  className="w-full px-4 py-2.5 border border-slate/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                >
                  <option value="">Select month</option>
                  {months.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-midnight mb-2">
                  Start Year *
                </label>
                <select
                  value={exp.startYear}
                  onChange={(e) =>
                    updateExperience(exp.id, "startYear", e.target.value)
                  }
                  className="w-full px-4 py-2.5 border border-slate/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                >
                  <option value="">Select year</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Currently Working Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`currently-working-${exp.id}`}
                checked={exp.currentlyWorking}
                onChange={(e) =>
                  updateExperience(exp.id, "currentlyWorking", e.target.checked)
                }
                className="w-4 h-4 text-primary border-slate/30 rounded focus:ring-2 focus:ring-primary/50"
              />
              <label
                htmlFor={`currently-working-${exp.id}`}
                className="text-sm text-midnight"
              >
                I currently work here
              </label>
            </div>

            {/* End Date - only if not currently working */}
            {!exp.currentlyWorking && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-midnight mb-2">
                    End Month *
                  </label>
                  <select
                    value={exp.endMonth}
                    onChange={(e) =>
                      updateExperience(exp.id, "endMonth", e.target.value)
                    }
                    className="w-full px-4 py-2.5 border border-slate/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  >
                    <option value="">Select month</option>
                    {months.map((month) => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-midnight mb-2">
                    End Year *
                  </label>
                  <select
                    value={exp.endYear}
                    onChange={(e) =>
                      updateExperience(exp.id, "endYear", e.target.value)
                    }
                    className="w-full px-4 py-2.5 border border-slate/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  >
                    <option value="">Select year</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-midnight mb-2">
                Location
              </label>
              <input
                type="text"
                value={exp.location}
                onChange={(e) =>
                  updateExperience(exp.id, "location", e.target.value)
                }
                placeholder="e.g., Lahore, Pakistan or Remote"
                className="w-full px-4 py-2.5 border border-slate/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-midnight mb-2">
                Description
              </label>
              <textarea
                value={exp.description}
                onChange={(e) =>
                  updateExperience(exp.id, "description", e.target.value)
                }
                rows={4}
                placeholder="Describe your responsibilities and achievements..."
                className="w-full px-4 py-2.5 border border-slate/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none"
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Add Another Experience Button */}
      <button
        onClick={addExperience}
        className="w-full py-3 border-2 border-dashed border-slate/30 rounded-lg text-primary font-medium hover:border-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-2 flex-wrap"
      >
        <Plus size={20} className="flex-shrink-0" />
        <span>Add Another Experience</span>
      </button>
    </div>
  );
}
