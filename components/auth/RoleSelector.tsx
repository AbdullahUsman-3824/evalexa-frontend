"use client";

import { motion } from "framer-motion";
import { Briefcase, User } from "lucide-react";

interface RoleSelectorProps {
  selectedRole: "recruiter" | "candidate" | null;
  onSelect: (role: "recruiter" | "candidate") => void;
}

export default function RoleSelector({
  selectedRole,
  onSelect,
}: RoleSelectorProps) {
  const roles = [
    {
      id: "recruiter" as const,
      label: "I'm a Recruiter",
      icon: Briefcase,
      description: "Post jobs and find top talent",
    },
    {
      id: "candidate" as const,
      label: "I'm a Candidate",
      icon: User,
      description: "Apply to jobs and get hired",
    },
  ];

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-midnight mb-3">
        I want to use Evalexa as a:
      </label>
      <div className="grid grid-cols-2 gap-4">
        {roles.map((role) => (
          <motion.button
            key={role.id}
            type="button"
            onClick={() => onSelect(role.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left
              ${
                selectedRole === role.id
                  ? "border-primary bg-primary/5"
                  : "border-slate/30 bg-white hover:border-slate/50"
              }`}
          >
            {/* Icon */}
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3
              ${
                selectedRole === role.id
                  ? "bg-primary/10 text-primary"
                  : "bg-slate/10 text-slate"
              }`}
            >
              <role.icon className="w-5 h-5" />
            </div>

            {/* Label */}
            <div
              className={`font-semibold mb-1
              ${selectedRole === role.id ? "text-primary" : "text-midnight"}`}
            >
              {role.label}
            </div>

            {/* Description */}
            <div className="text-xs text-slate">{role.description}</div>

            {/* Selected Indicator */}
            {selectedRole === role.id && (
              <div className="absolute top-3 right-3">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
