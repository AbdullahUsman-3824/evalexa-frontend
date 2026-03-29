"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueMonth: string;
  issueYear: string;
  expiryMonth: string;
  expiryYear: string;
  credentialId: string;
  credentialUrl: string;
}

export default function SkillsTab() {
  const [skills, setSkills] = useState<string[]>([
    "React",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
  ]);
  const [skillInput, setSkillInput] = useState("");
  const [certifications, setCertifications] = useState<Certification[]>([]);

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const addCertification = () => {
    const newCert: Certification = {
      id: Date.now().toString(),
      name: "",
      issuer: "",
      issueMonth: "",
      issueYear: "",
      expiryMonth: "",
      expiryYear: "",
      credentialId: "",
      credentialUrl: "",
    };
    setCertifications([...certifications, newCert]);
  };

  const removeCertification = (id: string) => {
    setCertifications(certifications.filter((cert) => cert.id !== id));
  };

  const updateCertification = (
    id: string,
    field: keyof Certification,
    value: string,
  ) => {
    setCertifications(
      certifications.map((cert) =>
        cert.id === id ? { ...cert, [field]: value } : cert,
      ),
    );
  };

  const months = [
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

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-8">
      {/* Skills Section */}
      <div>
        <h3 className="font-display text-lg font-semibold text-midnight mb-4">
          Skills
        </h3>

        {/* Skill Input */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a skill and press Enter..."
            className="flex-1 px-4 py-2.5 border border-slate/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors min-w-[200px]"
          />
          <button
            onClick={addSkill}
            className="px-4 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors flex-shrink-0"
          >
            Add
          </button>
        </div>

        {/* Skills Display */}
        <div className="flex flex-wrap gap-2">
          <AnimatePresence>
            {skills.map((skill) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary text-white text-sm font-medium rounded-lg"
              >
                {skill}
                <button
                  onClick={() => removeSkill(skill)}
                  className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                >
                  <X size={14} />
                </button>
              </motion.span>
            ))}
          </AnimatePresence>
        </div>

        <p className="text-xs text-slate mt-2">
          Add your technical and soft skills. Press Enter or click Add to
          include each skill.
        </p>
      </div>

      {/* Certifications Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-semibold text-midnight">
            Certifications
          </h3>
          <button
            onClick={addCertification}
            className="text-primary text-sm font-medium hover:underline flex items-center gap-1"
          >
            <Plus size={16} />
            <span>Add Certification</span>
          </button>
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="p-6 border border-slate/20 rounded-xl space-y-4"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-midnight">
                    Certification #{index + 1}
                  </h4>
                  <button
                    onClick={() => removeCertification(cert.id)}
                    className="p-2 text-danger hover:bg-danger/10 rounded-lg transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Certification Name */}
                <div>
                  <label className="block text-sm font-medium text-midnight mb-2">
                    Certification Name *
                  </label>
                  <input
                    type="text"
                    value={cert.name}
                    onChange={(e) =>
                      updateCertification(cert.id, "name", e.target.value)
                    }
                    placeholder="e.g., AWS Certified Solutions Architect"
                    className="w-full px-4 py-2.5 border border-slate/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  />
                </div>

                {/* Issuing Organization */}
                <div>
                  <label className="block text-sm font-medium text-midnight mb-2">
                    Issuing Organization *
                  </label>
                  <input
                    type="text"
                    value={cert.issuer}
                    onChange={(e) =>
                      updateCertification(cert.id, "issuer", e.target.value)
                    }
                    placeholder="e.g., Amazon Web Services"
                    className="w-full px-4 py-2.5 border border-slate/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  />
                </div>

                {/* Issue Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-midnight mb-2">
                      Issue Month
                    </label>
                    <select
                      value={cert.issueMonth}
                      onChange={(e) =>
                        updateCertification(
                          cert.id,
                          "issueMonth",
                          e.target.value,
                        )
                      }
                      className="w-full px-4 py-2.5 border border-slate/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                    >
                      <option value="">Select</option>
                      {months.map((month) => (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-midnight mb-2">
                      Issue Year
                    </label>
                    <select
                      value={cert.issueYear}
                      onChange={(e) =>
                        updateCertification(
                          cert.id,
                          "issueYear",
                          e.target.value,
                        )
                      }
                      className="w-full px-4 py-2.5 border border-slate/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                    >
                      <option value="">Select</option>
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Expiry Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-midnight mb-2">
                      Expiry Month (Optional)
                    </label>
                    <select
                      value={cert.expiryMonth}
                      onChange={(e) =>
                        updateCertification(
                          cert.id,
                          "expiryMonth",
                          e.target.value,
                        )
                      }
                      className="w-full px-4 py-2.5 border border-slate/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                    >
                      <option value="">Select</option>
                      {months.map((month) => (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-midnight mb-2">
                      Expiry Year (Optional)
                    </label>
                    <select
                      value={cert.expiryYear}
                      onChange={(e) =>
                        updateCertification(
                          cert.id,
                          "expiryYear",
                          e.target.value,
                        )
                      }
                      className="w-full px-4 py-2.5 border border-slate/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                    >
                      <option value="">Select</option>
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Credential ID & URL */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-midnight mb-2">
                      Credential ID
                    </label>
                    <input
                      type="text"
                      value={cert.credentialId}
                      onChange={(e) =>
                        updateCertification(
                          cert.id,
                          "credentialId",
                          e.target.value,
                        )
                      }
                      placeholder="e.g., ABC123XYZ"
                      className="w-full px-4 py-2.5 border border-slate/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-midnight mb-2">
                      Credential URL
                    </label>
                    <input
                      type="url"
                      value={cert.credentialUrl}
                      onChange={(e) =>
                        updateCertification(
                          cert.id,
                          "credentialUrl",
                          e.target.value,
                        )
                      }
                      placeholder="https://..."
                      className="w-full px-4 py-2.5 border border-slate/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {certifications.length === 0 && (
            <div className="p-8 border-2 border-dashed border-slate/30 rounded-lg text-center text-slate">
              <p className="text-sm">No certifications added yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
