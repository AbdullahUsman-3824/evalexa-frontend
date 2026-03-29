"use client";

import { useState } from "react";
import { Plus, X, GripVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Education {
  id: string;
  degree: string;
  field: string;
  institution: string;
  startYear: string;
  endYear: string;
  grade: string;
  description: string;
}

export default function EducationTab() {
  const [education, setEducation] = useState<Education[]>([
    {
      id: "1",
      degree: "bachelors",
      field: "Computer Science",
      institution: "University of Engineering & Technology",
      startYear: "2016",
      endYear: "2020",
      grade: "3.8 CGPA",
      description: "",
    },
  ]);

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      degree: "",
      field: "",
      institution: "",
      startYear: "",
      endYear: "",
      grade: "",
      description: "",
    };
    setEducation([...education, newEdu]);
  };

  const removeEducation = (id: string) => {
    setEducation(education.filter((edu) => edu.id !== id));
  };

  const updateEducation = (
    id: string,
    field: keyof Education,
    value: string,
  ) => {
    setEducation(
      education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu,
      ),
    );
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {education.map((edu, index) => (
          <motion.div
            key={edu.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="p-6 border border-slate/20 rounded-xl space-y-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GripVertical size={20} className="text-slate cursor-move" />
                <h3 className="font-semibold text-midnight">
                  Education #{index + 1}
                </h3>
              </div>
              {education.length > 1 && (
                <button
                  onClick={() => removeEducation(edu.id)}
                  className="p-2 text-danger hover:bg-danger/10 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Degree */}
            <div>
              <label className="block text-sm font-medium text-midnight mb-2">
                Degree *
              </label>
              <select
                value={edu.degree}
                onChange={(e) =>
                  updateEducation(edu.id, "degree", e.target.value)
                }
                className="w-full px-4 py-2.5 border border-slate/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              >
                <option value="">Select degree</option>
                <option value="high-school">High School</option>
                <option value="associate">Associate Degree</option>
                <option value="bachelors">Bachelor's</option>
                <option value="masters">Master's</option>
                <option value="phd">PhD</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Field of Study */}
            <div>
              <label className="block text-sm font-medium text-midnight mb-2">
                Field of Study *
              </label>
              <input
                type="text"
                value={edu.field}
                onChange={(e) =>
                  updateEducation(edu.id, "field", e.target.value)
                }
                placeholder="e.g., Computer Science"
                className="w-full px-4 py-2.5 border border-slate/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              />
            </div>

            {/* Institution */}
            <div>
              <label className="block text-sm font-medium text-midnight mb-2">
                Institution Name *
              </label>
              <input
                type="text"
                value={edu.institution}
                onChange={(e) =>
                  updateEducation(edu.id, "institution", e.target.value)
                }
                placeholder="e.g., University of Engineering"
                className="w-full px-4 py-2.5 border border-slate/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              />
            </div>

            {/* Years */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-midnight mb-2">
                  Start Year *
                </label>
                <select
                  value={edu.startYear}
                  onChange={(e) =>
                    updateEducation(edu.id, "startYear", e.target.value)
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
              <div>
                <label className="block text-sm font-medium text-midnight mb-2">
                  End Year *
                </label>
                <select
                  value={edu.endYear}
                  onChange={(e) =>
                    updateEducation(edu.id, "endYear", e.target.value)
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

            {/* Grade */}
            <div>
              <label className="block text-sm font-medium text-midnight mb-2">
                Grade / CGPA
              </label>
              <input
                type="text"
                value={edu.grade}
                onChange={(e) =>
                  updateEducation(edu.id, "grade", e.target.value)
                }
                placeholder="e.g., 3.8 CGPA or First Class"
                className="w-full px-4 py-2.5 border border-slate/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-midnight mb-2">
                Description (Optional)
              </label>
              <textarea
                value={edu.description}
                onChange={(e) =>
                  updateEducation(edu.id, "description", e.target.value)
                }
                rows={3}
                placeholder="Notable achievements, projects, or activities..."
                className="w-full px-4 py-2.5 border border-slate/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none"
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Add Button */}
      <button
        onClick={addEducation}
        className="w-full py-3 border-2 border-dashed border-slate/30 rounded-lg text-primary font-medium hover:border-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-2 flex-wrap"
      >
        <Plus size={20} className="flex-shrink-0" />
        <span>Add Education</span>
      </button>
    </div>
  );
}
