"use client";

import { motion } from "framer-motion";

interface PasswordStrengthProps {
  password: string;
}

type PasswordStrength = "weak" | "fair" | "strong" | null;

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  const calculateStrength = (pwd: string): PasswordStrength => {
    if (!pwd) return null;
    if (pwd.length < 6) return "weak";
    if (pwd.length < 10) return "fair";
    return "strong";
  };

  const strength = calculateStrength(password);

  if (!strength) return null;

  const strengthConfig = {
    weak: {
      color: "bg-red-500",
      text: "Weak",
      textColor: "text-red-500",
      width: "33%",
    },
    fair: {
      color: "bg-amber-500",
      text: "Fair",
      textColor: "text-amber-500",
      width: "66%",
    },
    strong: {
      color: "bg-success",
      text: "Strong",
      textColor: "text-success",
      width: "100%",
    },
  };

  const config = strengthConfig[strength];

  return (
    <div className="mt-2 space-y-1.5">
      {/* Strength Bar */}
      <div className="w-full bg-slate/10 rounded-full h-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: config.width }}
          transition={{ duration: 0.4 }}
          className={`h-full ${config.color} rounded-full`}
        />
      </div>

      {/* Strength Label */}
      <p className={`text-xs font-medium ${config.textColor}`}>
        Password strength: {config.text}
      </p>
    </div>
  );
}
