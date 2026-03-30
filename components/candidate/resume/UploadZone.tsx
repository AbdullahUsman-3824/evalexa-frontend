"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  UploadCloud,
  CheckCircle2,
  Loader2,
  FileText,
  Shield,
} from "lucide-react";

interface FileMeta {
  name: string;
  sizeLabel: string;
}

interface UploadZoneProps {
  hasResume: boolean;
  currentResume?: FileMeta | null;
  pendingFile?: FileMeta | null;
  isUploading: boolean;
  uploadProgress: number;
  isAnalyzing: boolean;
  onBrowseClick: () => void;
  onFileDrop: (file: File) => void;
}

export default function UploadZone({
  hasResume,
  currentResume,
  pendingFile,
  isUploading,
  uploadProgress,
  isAnalyzing,
  onBrowseClick,
  onFileDrop,
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    if (file) {
      onFileDrop(file);
    }
  };

  const renderFileMeta = () => {
    if (!pendingFile) {
      return null;
    }

    return (
      <div className="mt-4 flex items-center gap-3 rounded-xl bg-success/5 px-4 py-3 text-sm text-midnight">
        <CheckCircle2 className="h-5 w-5 text-success" />
        <div className="flex flex-col">
          <span className="font-medium">{pendingFile.name}</span>
          <span className="text-slate text-xs">{pendingFile.sizeLabel}</span>
        </div>
        {isUploading && (
          <span className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-primary">
            <Loader2 className="h-4 w-4 animate-spin" />
            Uploading...
          </span>
        )}
      </div>
    );
  };

  const zoneClasses = `
    relative rounded-2xl border-2 transition-all duration-300 cursor-pointer
    ${isDragging ? "border-primary bg-primary/5 shadow-lg shadow-primary/10" : "border-dashed border-slate/30 bg-white"}
    ${hasResume ? "p-6" : "p-10"}
  `;

  return (
    <div className="space-y-4">
      {hasResume && currentResume && (
        <div className="rounded-2xl border border-slate/15 bg-white p-4 text-sm text-slate">
          <div className="flex items-start gap-3">
            <FileText className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <p className="font-semibold text-midnight">Current Resume</p>
              <p className="text-sm text-slate">
                {currentResume.name} • {currentResume.sizeLabel}
              </p>
              <p className="mt-1 text-xs text-slate/80">
                Upload a new file to replace your current resume. The previous
                version will be saved in your history.
              </p>
            </div>
          </div>
        </div>
      )}

      <motion.div
        className={zoneClasses}
        onClick={onBrowseClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        animate={{ scale: isDragging ? 1.01 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <UploadCloud className="h-8 w-8 text-primary" />
          </div>
          <p
            className={`font-display text-lg ${
              hasResume ? "text-midnight" : "text-midnight"
            }`}
          >
            {hasResume
              ? "Drag & drop to replace your resume"
              : "Drag & drop your resume here"}
          </p>
          <p className="mt-1 text-sm text-slate">
            or{" "}
            <span className="text-primary underline-offset-4 transition hover:text-primary/80">
              click to browse files
            </span>
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate">
            {["PDF", "DOC", "DOCX"].map((format) => (
              <span
                key={format}
                className="rounded-full border border-slate/20 bg-surface px-3 py-1 font-medium text-midnight"
              >
                {format}
              </span>
            ))}
            <span className="rounded-full border border-slate/20 bg-surface px-3 py-1 font-medium text-midnight">
              Max 5MB
            </span>
          </div>

          {isUploading && (
            <div className="mt-6 w-full max-w-lg">
              <div className="flex items-center justify-between text-xs text-slate">
                <span className="font-semibold text-primary">Uploading...</span>
                <span className="text-midnight font-medium">
                  {uploadProgress}%
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate/10">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ ease: "easeOut", duration: 0.3 }}
                />
              </div>
            </div>
          )}

          {isAnalyzing && (
            <div className="mt-6 flex items-center gap-2 rounded-full bg-cyan/10 px-4 py-2 text-sm font-medium text-cyan">
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing resume with AI...
            </div>
          )}
        </div>
      </motion.div>

      <div className="flex flex-wrap items-center gap-3 text-xs text-slate">
        <div className="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-2 font-medium text-midnight">
          <Shield className="h-4 w-4 text-primary" />
          Bank-grade encryption keeps your data safe.
        </div>
        <span className="text-slate/70">
          We never share your resume without permission.
        </span>
      </div>

      {renderFileMeta()}
    </div>
  );
}
