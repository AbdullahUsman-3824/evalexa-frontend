"use client";

import { useState } from "react";
import { Eye, EyeOff, LucideIcon } from "lucide-react";

interface FormInputProps {
  label: string;
  type: string;
  placeholder: string;
  icon?: LucideIcon;
  error?: string;
  showToggle?: boolean;
  value: string;
  onChange: (value: string) => void;
  name?: string;
  id?: string;
  required?: boolean;
}

export default function FormInput({
  label,
  type,
  placeholder,
  icon: Icon,
  error,
  showToggle = false,
  value,
  onChange,
  name,
  id,
  // required,
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = showToggle && showPassword ? "text" : type;

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-midnight mb-2">
        {label}
      </label>
      <div className="relative">
        {/* Left Icon */}
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <Icon className="w-5 h-5 text-slate" />
          </div>
        )}

        {/* Input Field */}
        <input
          type={inputType}
          name={name}
          id={id}
          // required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full h-11 ${Icon ? "pl-11" : "pl-4"} pr-${showToggle ? "11" : "4"} py-2
            border rounded-lg font-sans text-base
            bg-white text-midnight placeholder-slate/50
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
            ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                : "border-slate/30"
            }`}
        />

        {/* Password Toggle Button */}
        {showToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate hover:text-midnight transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-1.5 text-sm text-red-500 flex items-center space-x-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
