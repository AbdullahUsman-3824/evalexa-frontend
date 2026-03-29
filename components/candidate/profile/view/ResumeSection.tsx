"use client";

import { motion } from "framer-motion";
import { FileText, Download, Eye, Upload, Sparkles } from "lucide-react";

export default function ResumeSection() {
  const hasResume = true;
  const resumeFileName = "Ayesha_Khan_Resume.pdf";
  const uploadDate = "Uploaded on Feb 15, 2026";
  const aiScore = 78;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="bg-white rounded-xl p-6 border border-slate/10"
    >
      <h2 className="font-display text-lg font-semibold text-midnight mb-4">
        Resume
      </h2>

      {hasResume ? (
        <div className="flex flex-col gap-4 p-4 bg-surface rounded-lg">
          <div className="flex items-center gap-4">
            {/* File icon */}
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <FileText size={24} className="text-primary" />
            </div>

            {/* File info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-midnight truncate">
                {resumeFileName}
              </p>
              <p className="text-xs text-slate mt-0.5">{uploadDate}</p>

              {/* AI Score Badge */}
              <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 bg-success/10 text-success rounded-full">
                <Sparkles size={12} />
                <span className="text-xs font-semibold">
                  AI Score: {aiScore}/100
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap w-full">
            <button className="flex-1 px-4 py-2 border border-slate/20 text-slate text-sm font-medium rounded-lg hover:bg-surface transition-colors flex items-center justify-center gap-2 min-w-[140px]">
              <Eye size={16} />
              <span>View</span>
            </button>
            <button className="flex-1 px-4 py-2 border border-slate/20 text-slate text-sm font-medium rounded-lg hover:bg-surface transition-colors flex items-center justify-center gap-2 min-w-[140px]">
              <Download size={16} />
              <span>Download</span>
            </button>
            <button className="flex-1 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 min-w-[140px]">
              <Upload size={16} />
              <span>Replace</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-8 border-2 border-dashed border-slate/30 rounded-lg text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <FileText size={28} className="text-primary" />
          </div>
          <p className="text-sm font-medium text-midnight mb-2">
            Upload your resume
          </p>
          <p className="text-xs text-slate mb-4">PDF or DOCX format, max 5MB</p>
          <button className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 mx-auto">
            <Upload size={16} />
            <span>Upload Resume</span>
          </button>
        </div>
      )}
    </motion.div>
  );
}
