"use client";

interface FieldErrorProps {
  message?: string;
}

export default function FieldError({ message }: FieldErrorProps) {
  return (
    <p
      className={`mt-1 text-xs text-[#DC2626] transition-opacity duration-150 ${message ? "opacity-100" : "opacity-0"}`}
      aria-live="polite"
    >
      {message ?? "placeholder"}
    </p>
  );
}