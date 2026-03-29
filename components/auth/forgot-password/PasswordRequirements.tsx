"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";

interface PasswordRequirementsProps {
  password: string;
}

interface Requirement {
  label: string;
  test: (pwd: string) => boolean;
}

export default function PasswordRequirements({
  password,
}: PasswordRequirementsProps) {
  const requirements: Requirement[] = [
    {
      label: "At least 8 characters",
      test: (pwd) => pwd.length >= 8,
    },
    {
      label: "One uppercase letter",
      test: (pwd) => /[A-Z]/.test(pwd),
    },
    {
      label: "One number",
      test: (pwd) => /\d/.test(pwd),
    },
    {
      label: "One special character (!@#$...)",
      test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    },
  ];

  return (
    <div className="mt-3 space-y-2">
      <p className="text-xs font-medium text-slate">Password requirements:</p>
      <div className="space-y-1.5">
        {requirements.map((req, index) => {
          const isMet = password ? req.test(password) : false;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="flex items-center space-x-2"
            >
              <motion.div
                initial={false}
                animate={{
                  scale: isMet ? [1, 1.2, 1] : 1,
                  rotate: isMet ? [0, 10, -10, 0] : 0,
                }}
                transition={{ duration: 0.3 }}
              >
                {isMet ? (
                  <CheckCircle2 className="w-4 h-4 text-success" />
                ) : (
                  <XCircle className="w-4 h-4 text-slate/40" />
                )}
              </motion.div>
              <span
                className={`text-xs ${isMet ? "text-success font-medium" : "text-slate/60"}`}
              >
                {req.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export function validatePasswordRequirements(password: string): boolean {
  const requirements = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /\d/.test(password),
    /[!@#$%^&*(),.?":{}|<>]/.test(password),
  ];

  return requirements.every((req) => req === true);
}
