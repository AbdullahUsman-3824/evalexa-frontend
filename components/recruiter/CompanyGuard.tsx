"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Building2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { authRepository } from "@/repositories/auth.repository";
import { useAppSelector } from "@/store/hooks";

interface CompanyGuardProps {
  children: React.ReactNode;
  setupHref?: string;
  featureHint?: string;
}

export default function CompanyGuard({
  children,
  setupHref = "/company-setup",
  featureHint,
}: CompanyGuardProps) {
  const router = useRouter();
const { user } = useAppSelector((state) => state.auth);
const companyId = user?.companyId ? String(user.companyId) : null;

  const [ready, setReady] = useState(false);

  useEffect(() => {
    authRepository
      .getProfile()
      .catch(() => {
        // Refresh failed (offline, 401, etc.) — fall back to whatever's cached
      })
      .finally(() => setReady(true));
  }, []);

  // Don't flash children or the gate until we have a confirmed answer
  if (!ready) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (companyId) {
    return <>{children}</>;
  }

  const bodyText = featureHint
    ? `Set up your company profile to start using ${featureHint} on Evalexa.`
    : "Set up your company profile to unlock the full Evalexa experience.";

  const titleText = featureHint
    ? `${featureHint
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")}`
    : "Your workspace awaits";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#F8FAFC] to-[#F0F0F0] p-10 md:p-14 m-5"
    >
      {/* Background blobs — same pattern as WelcomeBanner */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute -top-10 -right-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-cyan rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center gap-6 max-w-md mx-auto">
        {/* Icon */}
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center">
            <Building2 className="w-9 h-9 text-primary" />
          </div>
        </div>

        {/* Copy */}
        <div className="space-y-2">
          <h2 className="font-syne text-midnight text-2xl font-semibold">
            {titleText}
          </h2>
          <p className="text-slate text-sm leading-relaxed">{bodyText}</p>
        </div>

        {/* Steps — visual reassurance it's quick */}
        <div className="flex items-center gap-2 text-xs text-midnight/60">
          <span className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-medium">
              1
            </span>
            Company details
          </span>
          <ArrowRight className="w-3 h-3 text-white/20" />
          <span className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-medium">
              2
            </span>
            Post jobs
          </span>
          <ArrowRight className="w-3 h-3 text-white/20" />
          <span className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-medium">
              3
            </span>
            Hire faster
          </span>
        </div>

        {/* CTA */}
        <button
          onClick={() => router.push(setupHref)}
          className="group flex items-center gap-2 px-7 py-3 bg-primary hover:bg-primary/80 text-midnight rounded-xl font-semibold text-sm shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all"
        >
          Set up your company
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>

        <p className="text-white/25 text-xs">Takes less than 2 minutes</p>
      </div>
    </motion.div>
  );
}
