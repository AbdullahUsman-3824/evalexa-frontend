"use client";

import { Syne } from "next/font/google";

const syne = Syne({ subsets: ["latin"], weight: ["700", "800"] });

interface Skill {
  id: string;
  name: string;
  category: string;
}

interface JobSkill {
  importance: string;
  weight: number;
  skill: Skill;
}

interface JobOverviewSectionProps {
  description: string;
  jobSkills: JobSkill[];
}

export default function JobOverviewSection({
  description,
  jobSkills,
}: JobOverviewSectionProps) {
  const requiredSkills = jobSkills.filter((s) => s.importance === "REQUIRED");
  const preferredSkills = jobSkills.filter((s) => s.importance === "PREFERRED");

  return (
    <div className="space-y-4">
      {/* Description */}
      <div className="rounded-[14px] border border-[#E8ECF4] bg-white p-7 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        <div className="mb-5 flex items-center justify-between gap-2">
          <h2
            className={`${syne.className} border-l-4 border-[#1E6FFF] pl-3 text-[20px] font-semibold text-[#0D1B2A]`}
          >
            Description
          </h2>
          <button
            type="button"
            className="text-[13px] text-[#1E6FFF] hover:underline"
          >
            Share this job ↗
          </button>
        </div>
        <p className="whitespace-pre-line text-[15px] leading-8 text-[#4A5568]">
          {description}
        </p>
        <p className="mt-6 text-[15px] italic leading-7 text-[#4A5568]">
          We encourage all motivated candidates to apply and start their journey
          with us.
        </p>
      </div>

      {/* Skills */}
      {jobSkills.length > 0 && (
        <div className="min-h-[280px] rounded-[14px] border border-[#E8ECF4] bg-white p-7 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <h2
            className={`${syne.className} mb-5 border-l-4 border-[#1E6FFF] pl-3 text-[20px] font-semibold text-[#0D1B2A]`}
          >
            Skills required
          </h2>

          {requiredSkills.length > 0 && (
            <div className="mb-4">
              <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest text-[#9BA3B2]">
                Required
              </p>
              <div className="flex flex-wrap gap-2">
                {requiredSkills.map(({ skill }) => (
                  <span
                    key={skill.id}
                    className="rounded-full bg-[#EEF3FF] px-3 py-1.5 text-[13px] font-medium text-[#1E6FFF]"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {preferredSkills.length > 0 && (
            <div>
              <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest text-[#9BA3B2]">
                Preferred
              </p>
              <div className="flex flex-wrap gap-2">
                {preferredSkills.map(({ skill }) => (
                  <span
                    key={skill.id}
                    className="rounded-full bg-[#F0F4FF] px-3 py-1.5 text-[13px] font-medium text-[#6B7A99]"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
