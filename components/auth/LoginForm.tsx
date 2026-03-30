"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2 } from "lucide-react";
import Link from "next/link";
import FormInput from "@/components/ui/FormInput";
import SocialLogin from "@/components/auth/SocialLogin";

export default function LoginForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newErrors = { email: "", password: "" };

    // Validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    // If no errors, proceed with login
    if (!newErrors.email && !newErrors.password) {
      setIsLoading(true);

      try {
        // TODO: Replace with actual API call to your backend
        // Example: const response = await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify(formData) })
        // const data = await response.json()

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Mock response - replace with actual API response
        const mockUser = {
          email: formData.email,
          role: "candidate", // This should come from your API: "candidate" or "recruiter"
        };

        // Store user data (you might want to use a state management solution or cookies)
        localStorage.setItem("user", JSON.stringify(mockUser));

        // Navigate based on user role
        if (mockUser.role === "candidate") {
          router.push("/dashboard"); // Candidate dashboard
        } else if (mockUser.role === "recruiter") {
          router.push("/recruiter/dashboard"); // Recruiter dashboard
        } else {
          // Default fallback
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Login failed:", error);
        setErrors({ ...errors, password: "Login failed. Please try again." });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <FormInput
            label="Email Address"
            type="email"
            name="email"
            placeholder="you@company.com"
            icon={Mail}
            value={formData.email}
            onChange={(value) => setFormData({ ...formData, email: value })}
            error={errors.email}
          />
        </motion.div>

        {/* Password Field */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <FormInput
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your password"
            icon={Lock}
            value={formData.password}
            onChange={(value) => setFormData({ ...formData, password: value })}
            error={errors.password}
            showToggle
          />
          <div className="mt-2 text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </motion.div>

        {/* Remember Me Checkbox */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center"
        >
          <input
            type="checkbox"
            id="rememberMe"
            checked={formData.rememberMe}
            onChange={(e) =>
              setFormData({ ...formData, rememberMe: e.target.checked })
            }
            className="w-4 h-4 text-primary border-slate/30 rounded focus:ring-primary/20 focus:ring-2"
          />
          <label
            htmlFor="rememberMe"
            className="ml-2 text-sm text-midnight cursor-pointer"
          >
            Remember me
          </label>
        </motion.div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
          className="w-full h-11 bg-primary text-white font-semibold rounded-lg
            hover:bg-primary/90 transition-colors duration-200
            disabled:opacity-70 disabled:cursor-not-allowed
            flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <span>Sign In</span>
          )}
        </motion.button>

        {/* Divider */}
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate/30"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-surface text-slate">OR</span>
          </div>
        </div>

        {/* Social Login */}
        <SocialLogin />

        {/* Sign Up Link */}
        <div className="text-center text-sm text-slate">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-primary font-semibold hover:text-primary/80 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </form>
    </motion.div>
  );
}
