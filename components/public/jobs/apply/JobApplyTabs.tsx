"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export default function JobApplyTabs() {
  const pathname = usePathname();
  const params = useParams();
  const jobSlug = params?.jobSlug as string | undefined;

  const overviewHref = jobSlug ? `/jobs/${jobSlug}` : "/jobs";
  const applyHref = jobSlug ? `/jobs/${jobSlug}/apply` : "/jobs";
  const isApplyTab = pathname.endsWith("/apply");

  return (
    <div className="border-b-2 border-[#F0F0F0] bg-white">
      <div className="mx-auto flex w-full max-w-[720px]">
        <Link
          href={overviewHref}
          className={`w-1/2 border-b-[3px] px-8 py-4 text-[13px] font-semibold tracking-[0.05em] transition ${
            !isApplyTab
              ? "mb-[-2px] border-[#1E6FFF] text-[#1E6FFF]"
              : "border-transparent text-[#9BA3B2] hover:text-[#6B7A99]"
          }`}
        >
          OVERVIEW
        </Link>
        <Link
          href={applyHref}
          className={`w-1/2 border-b-[3px] px-8 py-4 text-[13px] font-semibold tracking-[0.05em] transition ${
            isApplyTab
              ? "mb-[-2px] border-[#1E6FFF] text-[#1E6FFF]"
              : "border-transparent text-[#9BA3B2] hover:text-[#6B7A99]"
          }`}
        >
          APPLICATION
        </Link>
      </div>
    </div>
  );
}
