import Link from "next/link";
import LeftPanel from "@/components/auth/LeftPanel";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Dark Branding */}
      <LeftPanel
        headline="Welcome back. Your next great hire awaits."
        subtext="Sign in to manage your jobs, candidates, and AI-powered interviews."
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
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-primary font-semibold hover:text-primary/80 transition-colors"
              >
                Sign Up →
              </Link>
            </div>

            {/* Page Title */}
            <h1 className="text-3xl font-display font-bold text-midnight mb-3">
              Sign in to Evalexa
            </h1>
            <p className="text-slate">
              Welcome back! Enter your credentials to continue.
            </p>
          </div>

          {/* Login Form */}
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
