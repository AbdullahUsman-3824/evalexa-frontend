import { Download, ExternalLink, FileText } from "lucide-react";

interface ResumeSectionProps {
  filename: string;
  uploadedAt: string;
  aiScore: number;
  highlights: {
    experience: string;
    education: string;
    topSkills: string;
  };
}

export default function ResumeSection({ filename, uploadedAt, aiScore, highlights }: ResumeSectionProps) {
  return (
    <section className="rounded-xl border border-slate/20 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-syne text-xl font-bold text-midnight">Resume</h2>
          <p className="mt-1 inline-flex items-center gap-1 text-sm text-slate">
            <FileText className="h-4 w-4" />
            {filename} · Uploaded {uploadedAt}
          </p>
        </div>
        <span className="rounded-full bg-cyan/10 px-3 py-1 text-sm font-semibold text-cyan">AI Score: {aiScore}/100</span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate/25 px-3 py-2 text-sm font-medium text-midnight hover:bg-surface"
        >
          <ExternalLink className="h-4 w-4" />
          View Full Resume
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary/90"
        >
          <Download className="h-4 w-4" />
          Download Resume
        </button>
      </div>

      <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
        <div className="rounded-lg bg-surface p-3">
          <p className="text-xs text-slate">Years of experience</p>
          <p className="mt-1 font-semibold text-midnight">{highlights.experience}</p>
        </div>
        <div className="rounded-lg bg-surface p-3">
          <p className="text-xs text-slate">Education</p>
          <p className="mt-1 font-semibold text-midnight">{highlights.education}</p>
        </div>
        <div className="rounded-lg bg-surface p-3">
          <p className="text-xs text-slate">Top skills detected</p>
          <p className="mt-1 font-semibold text-midnight">{highlights.topSkills}</p>
        </div>
      </div>
    </section>
  );
}

