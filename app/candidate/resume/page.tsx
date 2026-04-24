"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import UploadZone from "@/components/candidate/resume/UploadZone";
import ResumeCard from "@/components/candidate/resume/ResumeCard";
import ParsedData from "@/components/candidate/resume/ParsedData";
import VersionHistory from "@/components/candidate/resume/VersionHistory";
import Toast from "@/components/ui/Toast";

type ToastType = "success" | "error" | "info";

interface ResumeFile {
  id: string;
  name: string;
  sizeBytes: number;
  uploadedAt: Date;
  lastAnalyzedAt: Date;
  score: number;
}

interface PendingFileMeta {
  name: string;
  sizeLabel: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_VERSIONS = 3;

const formatFileSize = (bytes: number) => {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
  return `${Math.round(bytes / 1024)} KB`;
};

const formatLongDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const formatRelativeTime = (date: Date) => {
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.round(diffMs / (1000 * 60));
  if (diffMinutes < 60) {
    return `${Math.max(diffMinutes, 1)} minute${diffMinutes === 1 ? "" : "s"} ago`;
  }
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  }
  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 30) {
    return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  }
  const diffMonths = Math.round(diffDays / 30);
  return `${diffMonths} month${diffMonths === 1 ? "" : "s"} ago`;
};

const generateId = () => `resume-${Math.random().toString(36).slice(2, 9)}`;

const initialResume: ResumeFile = {
  id: generateId(),
  name: "Ayesha_Khan_Resume.pdf",
  sizeBytes: 245 * 1024,
  uploadedAt: new Date("2025-03-15"),
  lastAnalyzedAt: new Date("2025-03-17"),
  score: 78,
};

const initialVersions: ResumeFile[] = [
  {
    id: generateId(),
    name: "Ayesha_Khan_ProductDesigner.pdf",
    sizeBytes: 220 * 1024,
    uploadedAt: new Date("2025-01-02"),
    lastAnalyzedAt: new Date("2025-01-03"),
    score: 74,
  },
  {
    id: generateId(),
    name: "Ayesha_Khan_2024.pdf",
    sizeBytes: 210 * 1024,
    uploadedAt: new Date("2024-11-18"),
    lastAnalyzedAt: new Date("2024-11-20"),
    score: 70,
  },
];

const parsedDataSeed = {
  contact: {
    name: "Ayesha Khan",
    email: "ayesha.khan@example.com",
    phone: "+1 (917) 555-0112",
    location: "San Francisco, CA",
  },
  skills: [
    { name: "Product Design", confidence: "high" as const },
    { name: "Design Systems", confidence: "high" as const },
    { name: "User Research", confidence: "medium" as const },
    { name: "Figma", confidence: "high" as const },
    { name: "Prototyping", confidence: "medium" as const },
    { name: "Stakeholder Alignment", confidence: "medium" as const },
  ],
  experience: [
    {
      title: "Senior Product Designer",
      company: "Nova Labs",
      period: "2022 — Present",
      bullets: [
        "Led redesign of the analytics suite, improving task completion by 32%.",
        "Shipped design system refresh adopted by 6 product teams.",
      ],
    },
    {
      title: "Product Designer",
      company: "BrightPath",
      period: "2019 — 2022",
      bullets: [
        "Owning discovery-to-delivery for recruiter workflow revamp.",
        "Partnered with data science to launch AI-assisted job matching.",
      ],
    },
  ],
  education: [
    {
      degree: "B.S. Human Computer Interaction",
      institution: "University of Washington",
      year: "2018",
    },
  ],
  certifications: [
    {
      name: "NN/g UX Certification",
      issuer: "Nielsen Norman Group",
      year: "2023",
    },
  ],
};

export default function ResumePage() {
  const [currentResume, setCurrentResume] = useState<ResumeFile | null>(
    initialResume
  );
  const [versions, setVersions] = useState<ResumeFile[]>(initialVersions);
  const [pendingFile, setPendingFile] = useState<PendingFileMeta | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [parsedData, setParsedData] = useState(parsedDataSeed);
  const [mismatchDetected, setMismatchDetected] = useState(true);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
    isVisible: boolean;
  }>({
    message: "",
    type: "info",
    isVisible: false,
  });

  const uploadTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerToast = (message: string, type: ToastType = "info") => {
    setToast({ message, type, isVisible: true });
  };

  const closeToast = () =>
    setToast((prev) => ({
      ...prev,
      isVisible: false,
    }));

  const clearUploadTimers = () => {
    uploadTimers.current.forEach((timer) => clearTimeout(timer));
    uploadTimers.current = [];
  };

  useEffect(() => {
    return () => clearUploadTimers();
  }, []);

  const registerTimer = (timer: ReturnType<typeof setTimeout>) => {
    uploadTimers.current.push(timer);
  };

  const handleFileSelection = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      triggerToast("File exceeds 5MB limit. Please upload a smaller file.", "error");
      return;
    }

    clearUploadTimers();
    setPendingFile({
      name: file.name,
      sizeLabel: formatFileSize(file.size),
    });
    simulateUploadFlow(file);
  };

  const simulateUploadFlow = (file: File) => {
    const previousResume = currentResume;
    const versionEntry = previousResume
      ? {
        ...previousResume,
        id: generateId(),
      }
      : null;

    setIsUploading(true);
    setUploadProgress(0);

    [25, 55, 80, 100].forEach((value, index) => {
      const timer = setTimeout(
        () => setUploadProgress(value),
        (index + 1) * 450
      );
      registerTimer(timer);
    });

    registerTimer(
      setTimeout(() => {
        setIsUploading(false);
        triggerToast("Upload successful!", "success");
        setIsAnalyzing(true);
      }, 2100)
    );

    registerTimer(
      setTimeout(() => {
        setIsAnalyzing(false);
        triggerToast("Analysis complete!", "info");
        const newResume: ResumeFile = {
          id: generateId(),
          name: file.name,
          sizeBytes: file.size,
          uploadedAt: new Date(),
          lastAnalyzedAt: new Date(),
          score: Math.min(
            95,
            Math.max(65, Math.round(Math.random() * 25 + 70))
          ),
        };
        setCurrentResume(newResume);
        setPendingFile(null);
        if (versionEntry) {
          setVersions((prev) =>
            [versionEntry, ...prev].slice(0, MAX_VERSIONS)
          );
        }
        setMismatchDetected(true);
        setParsedData((previous) => ({
          ...previous,
          skills: previous.skills.map((skill) =>
            skill.name === "Stakeholder Alignment"
              ? { ...skill, confidence: "high" }
              : skill
          ),
        }));
      }, 3900)
    );
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelection(file);
      event.target.value = "";
    }
  };

  const handleDeleteCurrent = () => {
    if (!currentResume) return;
    const entry = {
      ...currentResume,
      id: generateId(),
    };
    setVersions((prev) => [entry, ...prev].slice(0, MAX_VERSIONS));
    setCurrentResume(null);
    triggerToast("Resume deleted. You can restore it from history.", "info");
  };

  const handleRestoreVersion = (versionId: string) => {
    const target = versions.find((version) => version.id === versionId);
    if (!target) return;

    setVersions((prev) => {
      const filtered = prev.filter((version) => version.id !== versionId);
      return currentResume
        ? [
            { ...currentResume, id: generateId() },
            ...filtered,
          ].slice(0, MAX_VERSIONS)
        : filtered;
    });
    setCurrentResume({
      ...target,
      uploadedAt: new Date(target.uploadedAt),
      lastAnalyzedAt: new Date(target.lastAnalyzedAt),
    });
    triggerToast("Resume restored successfully.", "success");
  };

  const handleDeleteVersion = (versionId: string) => {
    setVersions((prev) => prev.filter((version) => version.id !== versionId));
    triggerToast("Old resume removed from history.", "info");
  };

  const handleSyncProfile = () => {
    setMismatchDetected(false);
    triggerToast("Profile updated with parsed data.", "success");
  };

  const handleDismissMismatch = () => setMismatchDetected(false);

  const resumeCardData = currentResume
    ? {
        name: currentResume.name,
        sizeLabel: formatFileSize(currentResume.sizeBytes),
        uploadedAtLabel: `Uploaded on ${formatLongDate(currentResume.uploadedAt)}`,
        lastAnalyzedLabel: formatRelativeTime(currentResume.lastAnalyzedAt),
        score: currentResume.score,
      }
    : null;

  const uploadZoneCurrentMeta = currentResume
    ? {
        name: currentResume.name,
        sizeLabel: formatFileSize(currentResume.sizeBytes),
      }
    : null;

  const versionHistoryData = versions.map((version) => ({
    id: version.id,
    name: version.name,
    uploadedAtLabel: `Uploaded on ${formatLongDate(version.uploadedAt)}`,
    score: version.score,
  }));

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-6 rounded-3xl border border-slate/15 bg-white px-6 py-6">
        <div>
          <p className="font-display text-3xl text-midnight">My Resume</p>
          <p className="mt-1 text-slate">
            Upload, manage and analyze your resume with AI
          </p>
        </div>
        <Link
          href="/candidate/resume/analysis"
          className="inline-flex items-center gap-2 rounded-full bg-cyan px-5 py-3 font-semibold text-white shadow-lg shadow-cyan/30 transition hover:scale-[1.01]"
        >
          <Sparkles className="h-5 w-5" />
          Run AI Analysis
        </Link>
      </div>

      <section className="rounded-3xl border border-slate/15 bg-white p-6">
        <UploadZone
          hasResume={Boolean(currentResume)}
          currentResume={uploadZoneCurrentMeta}
          pendingFile={pendingFile}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
          isAnalyzing={isAnalyzing}
          onBrowseClick={openFileDialog}
          onFileDrop={handleFileSelection}
        />
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.doc,.docx"
          onChange={handleInputChange}
        />
      </section>

      {currentResume && resumeCardData && (
        <section className="space-y-8">
          <ResumeCard
            resume={resumeCardData}
            onView={() =>
              triggerToast("Preview coming soon. Download to view the file.", "info")
            }
            onDownload={() =>
              triggerToast("Download started in the background.", "info")
            }
            onReplace={openFileDialog}
            onDelete={handleDeleteCurrent}
          />

          <ParsedData
            contact={parsedData.contact}
            skills={parsedData.skills}
            experience={parsedData.experience}
            education={parsedData.education}
            certifications={parsedData.certifications}
            mismatchDetected={mismatchDetected}
            onSyncProfile={handleSyncProfile}
            onDismissMismatch={handleDismissMismatch}
          />
        </section>
      )}

      <VersionHistory
        versions={versionHistoryData}
        onRestore={handleRestoreVersion}
        onDelete={handleDeleteVersion}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={closeToast}
      />
    </div>
  );
}
