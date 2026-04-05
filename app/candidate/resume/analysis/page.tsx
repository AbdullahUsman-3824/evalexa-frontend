"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDownCircle,
  FileDown,
  Share2,
  Sparkles,
} from "lucide-react";
import ScoreHero from "@/components/candidate/resume/analysis/ScoreHero";
import MatchReadiness from "@/components/candidate/resume/analysis/MatchReadiness";
import StrengthsWeaknesses from "@/components/candidate/resume/analysis/StrengthsWeaknesses";
import KeywordAnalysis from "@/components/candidate/resume/analysis/KeywordAnalysis";
import Suggestions from "@/components/candidate/resume/analysis/Suggestions";
import ATSReport from "@/components/candidate/resume/analysis/ATSReport";
import ImprovementHistory from "@/components/candidate/resume/analysis/ImprovementHistory";

export default function ResumeAnalysisPage() {
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const handleReanalyze = () => {
    if (isReanalyzing) return;
    setIsReanalyzing(true);
    setTimeout(() => setIsReanalyzing(false), 2500);
  };

  const handleDownloadReport = () => {
    if (typeof window === "undefined") return;
    window.alert("Your AI PDF report will download in the next release.");
  };

  const handleShare = async () => {
    if (typeof window === "undefined" || typeof navigator === "undefined") {
      return;
    }

    const sharePayload = {
      title: "Evalexa AI Resume Analysis",
      text: "Check out my AI-powered resume insights from Evalexa.",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(sharePayload);
      } catch {
        // user cancelled share; nothing else to do
      }
      return;
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(sharePayload.url);
      window.alert("Link copied! Share it with recruiters or mentors.");
    }
  };

  const scrollToSuggestions = () => {
    suggestionsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scoreBreakdowns = [
    { label: "ATS Compatibility", value: 85, color: "bg-primary" },
    { label: "Keyword Match", value: 72, color: "bg-cyan" },
    { label: "Readability", value: 90, color: "bg-success" },
    { label: "Completeness", value: 68, color: "bg-warning" },
  ];

  const quickActions = [
    {
      label: "Download Report",
      icon: FileDown,
      description: "PDF summary",
      onClick: handleDownloadReport,
    },
    {
      label: "Share Analysis",
      icon: Share2,
      description: "Send link",
      onClick: handleShare,
    },
    {
      label: "View Suggestions",
      icon: ArrowDownCircle,
      description: "Jump to fixes",
      onClick: scrollToSuggestions,
    },
  ];

  const readinessLevels = [
    {
      label: "Entry Level Jobs",
      value: 92,
      color: "text-success",
      ringColor: "#00B37E",
    },
    {
      label: "Mid-Level Jobs",
      value: 78,
      color: "text-primary",
      ringColor: "#1E6FFF",
    },
    {
      label: "Senior Level Jobs",
      value: 45,
      color: "text-warning",
      ringColor: "#FF9500",
    },
  ];

  const bestMatch = {
    role: "Frontend Developer",
    company: "TechCorp",
    matchScore: 94,
    summary: "High alignment with React, TypeScript, and product delivery focus.",
    ctaLabel: "Apply now",
  };

  const strengths = [
    { text: "Strong React.js experience highlighted" },
    { text: "Quantified achievements (increased sales by 30%)" },
    { text: "Clean, ATS-friendly formatting" },
    { text: "Relevant certifications included" },
  ];

  const weaknesses = [
    { text: "Missing Docker/DevOps skills" },
    { text: "No LinkedIn profile URL" },
    { text: "Summary section too short" },
    { text: "Gaps in employment not explained" },
  ];

  const keywordFound = [
    "React",
    "TypeScript",
    "REST API",
    "Agile",
    "Git",
    "Problem Solving",
    "Team Leadership",
  ];

  const keywordMissing = [
    "Docker",
    "AWS",
    "CI/CD",
    "GraphQL",
    "Unit Testing",
    "System Design",
    "Node.js",
  ];

  const topMissing = [
    {
      keyword: "Docker",
      importance: "High" as const,
      guidance: "Add to skills plus project descriptions.",
    },
    {
      keyword: "AWS",
      importance: "High" as const,
      guidance: "Consider adding an AWS certification mention.",
    },
    {
      keyword: "CI/CD",
      importance: "Medium" as const,
      guidance: "Mention in engineering collaboration bullets.",
    },
  ];

  const suggestionItems = [
    {
      id: "docker",
      title: "Add Docker to skills section",
      description: "Mention Docker within your technical skills cluster.",
      impact: "High" as const,
      points: 4,
    },
    {
      id: "summary",
      title: "Expand summary to 3–4 lines",
      description:
        "Add a positioning statement plus two impact-driven highlights.",
      impact: "Medium" as const,
      points: 3,
    },
    {
      id: "github",
      title: "Add GitHub profile link",
      description: "Link to your best front-end projects and OSS contributions.",
      impact: "Medium" as const,
      points: 2,
    },
    {
      id: "quantify",
      title: "Quantify more achievements",
      description: "Every bullet should include metrics or measurable outcomes.",
      impact: "High" as const,
      points: 5,
    },
    {
      id: "cloud",
      title: "Add AWS or cloud experience",
      description:
        "Reference cloud deployments or certifications within experience.",
      impact: "High" as const,
      points: 4,
    },
  ];

  const atsChecklist = [
    { label: "Standard section headings used", passed: true },
    { label: "No tables or complex formatting", passed: true },
    { label: "Contact info in correct location", passed: true },
    { label: "File format is PDF/DOCX", passed: true },
    { label: "No custom fonts that ATS can't read", passed: false },
    { label: "Missing job-specific keywords", passed: false },
    { label: "Appropriate resume length (1–2 pages)", passed: true },
  ];

  const improvementHistory = [
    { label: "Mar 1", value: 65 },
    { label: "Mar 10", value: 71 },
    { label: "Mar 20", value: 78 },
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-midnight p-6 text-white shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <motion.span
              className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan/20 text-cyan"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Sparkles className="h-6 w-6" />
              <span className="absolute inset-0 rounded-2xl border border-cyan/30 blur-sm" />
            </motion.span>
            <div>
              <p className="font-display text-3xl">AI Resume Analysis</p>
              <p className="text-slate">
                Powered by Evalexa AI — Last analyzed 2 days ago
              </p>
            </div>
          </div>
          <button
            onClick={handleReanalyze}
            className="inline-flex items-center gap-2 rounded-full border border-cyan/40 px-5 py-3 text-sm font-semibold text-cyan transition hover:bg-cyan/10"
          >
            {isReanalyzing && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-cyan border-b-transparent" />
            )}
            Re-analyze
          </button>
        </div>
      </section>

      <ScoreHero
        score={78}
        lastAnalyzedLabel="Last analyzed 2 days ago"
        breakdowns={scoreBreakdowns}
        quickActions={quickActions}
      />

      <MatchReadiness levels={readinessLevels} bestMatch={bestMatch} />

      <StrengthsWeaknesses strengths={strengths} weaknesses={weaknesses} />

      <KeywordAnalysis
        found={keywordFound}
        missing={keywordMissing}
        topMissing={topMissing}
      />

      <div ref={suggestionsRef}>
        <Suggestions
          suggestions={suggestionItems}
          totalImprovements={12}
          baseCompleted={5}
          baseScore={78}
          targetScore={91}
        />
      </div>

      <ATSReport checklist={atsChecklist} score={85} />

      <ImprovementHistory history={improvementHistory} />
    </div>
  );
}
