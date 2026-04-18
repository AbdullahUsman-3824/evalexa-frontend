"use client";

import { motion } from "framer-motion";
import { Link, Mail, MapPin, Phone, Sparkles } from "lucide-react";

interface CandidateHeroProps {
  name: string;
  role: string;
  company: string;
  location: string;
  email: string;
  phone: string;
  linkedIn: string;
  openToWork?: boolean;
  matchScore: number;
  resumeScore: number;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function ScoreRing({
  value,
  size,
  stroke,
  colorClass,
  label,
}: {
  value: number;
  size: number;
  stroke: number;
  colorClass: string;
  label: string;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference - (Math.max(0, Math.min(100, value)) / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          className="stroke-white/20"
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          className={colorClass}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: targetOffset }}
          transition={{ duration: 0.9 }}
        />
      </svg>
      <div className="-mt-[58%] text-center">
        <p className="text-lg font-bold text-white">{value}%</p>
      </div>
      <p className="text-xs text-slate-300">{label}</p>
    </div>
  );
}

export default function CandidateHero({
  name,
  role,
  company,
  location,
  email,
  phone,
  linkedIn,
  openToWork,
  matchScore,
  resumeScore,
}: CandidateHeroProps) {
  return (
    <section className="rounded-2xl bg-gradient-to-br from-midnight to-[#132a42] p-6 text-white shadow-lg">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-cyan text-xl font-semibold">
              {initials(name)}
            </div>
            <div>
              <h1 className="font-syne text-2xl font-bold">{name}</h1>
              <p className="text-sm text-cyan">
                {role} at {company}
              </p>
              <p className="mt-1 inline-flex items-center gap-1 text-xs text-slate-300">
                <MapPin className="h-3.5 w-3.5" />
                {location}
              </p>
              {openToWork && (
                <span className="mt-2 inline-flex rounded-full bg-success px-2.5 py-1 text-xs font-semibold text-white">
                  Open to Work
                </span>
              )}
            </div>
          </div>

          <div className="mt-5 grid gap-2 text-sm sm:grid-cols-2">
            <p className="inline-flex items-center gap-2 text-slate-200">
              <Mail className="h-4 w-4 text-cyan" />
              {email}
            </p>
            <p className="inline-flex items-center gap-2 text-slate-200">
              <Phone className="h-4 w-4 text-cyan" />
              {phone}
            </p>
            <p className="inline-flex items-center gap-2 text-slate-200 sm:col-span-2">
              <Link className="h-4 w-4 text-cyan" />
              {linkedIn}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-4 rounded-xl bg-white/5 p-4 lg:items-end">
          <div className="grid w-full grid-cols-2 gap-3">
            <div className="rounded-xl bg-white/5 p-3">
              <ScoreRing value={matchScore} size={108} stroke={9} colorClass="stroke-cyan" label="AI Match" />
            </div>
            <div className="rounded-xl bg-white/5 p-3">
              <ScoreRing value={resumeScore} size={92} stroke={8} colorClass="stroke-primary" label="Resume" />
            </div>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-cyan px-3 py-2 text-sm font-semibold text-midnight hover:bg-cyan/90"
          >
            <Sparkles className="h-4 w-4" />
            View AI Analysis
          </button>
        </div>
      </div>
    </section>
  );
}

