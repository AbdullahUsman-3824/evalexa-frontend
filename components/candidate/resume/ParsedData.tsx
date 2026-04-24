"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Info,
  User,
  Mail,
  Phone,
  MapPin,
  Edit3,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
}

interface Skill {
  name: string;
  confidence: "high" | "medium";
}

interface ExperienceItem {
  title: string;
  company: string;
  period: string;
  bullets: string[];
}

interface EducationItem {
  degree: string;
  institution: string;
  year: string;
}

interface CertificationItem {
  name: string;
  issuer: string;
  year: string;
}

interface ParsedDataProps {
  contact: ContactInfo;
  skills: Skill[];
  experience: ExperienceItem[];
  education: EducationItem[];
  certifications?: CertificationItem[];
  mismatchDetected: boolean;
  onSyncProfile: () => void;
  onDismissMismatch: () => void;
}

const skillConfidenceCopy = {
  high: "High confidence",
  medium: "Medium confidence",
};

export default function ParsedData({
  contact,
  skills,
  experience,
  education,
  certifications,
  mismatchDetected,
  onSyncProfile,
  onDismissMismatch,
}: ParsedDataProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <p className="font-display text-2xl text-midnight">
              Parsed Information
            </p>
            <span title="This is what our AI extracted from your resume">
              <Info className="h-5 w-5 text-slate" />
            </span>
          </div>
          <p className="text-sm text-slate">
            Review what Evalexa detected. Keep your profile and resume in sync.
          </p>
        </div>
      </div>

      {mismatchDetected && (
        <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-warning/30 bg-warning/10 px-5 py-4 text-sm text-midnight">
          <div className="flex items-center gap-2 font-semibold">
            <AlertCircle className="h-5 w-5 text-warning" />
            Some parsed data differs from your profile. Would you like to sync
            them?
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onSyncProfile}
              className="rounded-full bg-warning px-4 py-2 text-sm font-semibold text-white transition hover:brightness-95"
            >
              Update Profile
            </button>
            <button
              onClick={onDismissMismatch}
              className="rounded-full border border-warning/40 px-4 py-2 text-sm font-semibold text-warning transition hover:bg-white/40"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <motion.div
        className="grid gap-6 lg:grid-cols-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={cardVariants}
          className="rounded-2xl border border-slate/15 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center justify-between gap-4">
            <p className="font-semibold text-midnight">Contact Info</p>
            <Link
              href="/candidate/profile"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
            >
              <Edit3 className="h-4 w-4" />
              Edit
            </Link>
          </div>
          <div className="mt-4 space-y-3 text-sm text-midnight">
            <div className="flex items-center gap-3 rounded-xl bg-surface px-4 py-3">
              <User className="h-4 w-4 text-primary" />
              <div>
                <p className="font-semibold">{contact.name}</p>
                <p className="text-slate/80 text-xs">Full name</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-surface px-4 py-3">
              <Mail className="h-4 w-4 text-primary" />
              <div>
                <p className="font-semibold">{contact.email}</p>
                <p className="text-slate/80 text-xs">Email</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-surface px-4 py-3">
              <Phone className="h-4 w-4 text-primary" />
              <div>
                <p className="font-semibold">{contact.phone}</p>
                <p className="text-slate/80 text-xs">Phone</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-surface px-4 py-3">
              <MapPin className="h-4 w-4 text-primary" />
              <div>
                <p className="font-semibold">{contact.location}</p>
                <p className="text-slate/80 text-xs">Location</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          className="rounded-2xl border border-slate/15 bg-white p-5 shadow-sm"
        >
          <p className="font-semibold text-midnight">Skills Detected</p>
          <p className="mt-1 text-sm text-slate">
            Hover to see confidence scores.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill.name}
                className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary"
                title={skillConfidenceCopy[skill.confidence]}
              >
                {skill.name}
              </span>
            ))}
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="grid gap-6 lg:grid-cols-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={cardVariants}
          className="rounded-2xl border border-slate/15 bg-white p-5 shadow-sm"
        >
          <p className="font-semibold text-midnight">Work Experience</p>
          <div className="mt-4 space-y-5 text-sm text-midnight">
            {experience.map((job) => (
              <div
                key={`${job.title}-${job.company}`}
                className="rounded-xl bg-surface px-4 py-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{job.title}</p>
                    <p className="text-slate text-sm">{job.company}</p>
                  </div>
                  <span className="text-xs font-semibold text-primary">
                    {job.period}
                  </span>
                </div>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-slate">
                  {job.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={cardVariants} className="space-y-5 rounded-2xl">
          <div className="rounded-2xl border border-slate/15 bg-white p-5 shadow-sm">
            <p className="font-semibold text-midnight">Education</p>
            <div className="mt-4 space-y-4 text-sm text-midnight">
              {education.map((item) => (
                <div
                  key={item.degree}
                  className="rounded-xl bg-surface px-4 py-3"
                >
                  <p className="font-semibold">{item.degree}</p>
                  <p className="text-slate">{item.institution}</p>
                  <p className="text-xs font-semibold text-primary">
                    Class of {item.year}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {certifications && certifications.length > 0 && (
            <div className="rounded-2xl border border-slate/15 bg-white p-5 shadow-sm">
              <p className="font-semibold text-midnight">Certifications</p>
              <div className="mt-4 space-y-3 text-sm text-midnight">
                {certifications.map((cert) => (
                  <div
                    key={cert.name}
                    className="flex items-center justify-between rounded-xl bg-surface px-4 py-3"
                  >
                    <div>
                      <p className="font-semibold">{cert.name}</p>
                      <p className="text-slate text-xs">{cert.issuer}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                      <CheckCircle2 className="h-4 w-4" />
                      {cert.year}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
