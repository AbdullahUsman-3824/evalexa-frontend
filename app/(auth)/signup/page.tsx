import Link from "next/link";
import LeftPanel from "@/components/auth/LeftPanel";
import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Dark Branding */}
      <LeftPanel
        headline="Start hiring smarter. It only takes a minute."
        subtext="Join 500+ companies using Evalexa to find the best talent faster."
      />

      {/* Right Panel - Form */}
      <div className="flex-1 bg-surface flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Header Section */}
          <div className="text-center mb-8">
            {/* Mobile Logo (shown only on mobile) */}
            <Link
              href="/"
              className="lg:hidden inline-flex items-center space-x-1 font-display text-3xl font-bold mb-6"
            >
              <span className="text-midnight">Eval</span>
              <span className="text-primary">exa</span>
            </Link>

            {/* Top Right Link */}
            <div className="mb-6 text-sm text-slate">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary font-semibold hover:text-primary/80 transition-colors"
              >
                Log In →
              </Link>
            </div>

            {/* Page Title */}
            <h1 className="text-3xl font-display font-bold text-midnight mb-3">
              Create your account
            </h1>
            <p className="text-slate">
              Set up Evalexa in minutes and start hiring smarter.
            </p>
          </div>

          {/* Signup Form */}
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
