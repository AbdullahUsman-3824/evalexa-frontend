"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Lock,
  ShieldCheck,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import FormInput from "@/components/ui/FormInput";
import RoleSelector from "@/components/auth/RoleSelector";
import SocialLogin from "@/components/auth/SocialLogin";
import Toast from "@/components/ui/Toast";
import PasswordStrength from "@/components/auth/forgot-password/PasswordStrength";
import PasswordRequirements from "@/components/auth/forgot-password/PasswordRequirements";
import { registerUser } from "@/lib/services/authService";

type SignupErrors = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: string;
  agreeToTerms: string;
  submit: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?\d{10,15}$/;
const PENDING_SIGNUP_KEY = "pending_signup";

function getInitialErrors(): SignupErrors {
  return {
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "",
    agreeToTerms: "",
    submit: "",
  };
}

export default function SignupForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: null as "recruiter" | "candidate" | null,
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({
    ...getInitialErrors(),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
    isVisible: boolean;
  }>({
    message: "",
    type: "success",
    isVisible: false,
  });

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "success",
  ) => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  const wait = (duration: number) =>
    new Promise((resolve) => setTimeout(resolve, duration));

  const normalizePhone = (value: string) =>
    value.replace(/\s|-/g, "").replace(/(?!^)\+/g, "");

  const handlePhoneChange = (value: string) => {
    const sanitizedPhone = value.replace(/[^\d+\s-]/g, "");
    setFormData({ ...formData, phone: sanitizedPhone });
  };

  const passwordsMatch =
    Boolean(formData.password) &&
    Boolean(formData.confirmPassword) &&
    formData.password === formData.confirmPassword;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const nextErrors = getInitialErrors();

    const trimmedFullName = formData.fullName.trim();
    const trimmedEmail = formData.email.trim().toLowerCase();
    const normalizedPhone = normalizePhone(formData.phone.trim());

    if (!trimmedFullName) {
      nextErrors.fullName = "Full name is required.";
    }

    if (!trimmedEmail) {
      nextErrors.email = "Email is required.";
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!normalizedPhone) {
      nextErrors.phone = "Phone number is required.";
    } else if (!PHONE_REGEX.test(normalizedPhone)) {
      nextErrors.phone = "Enter a valid phone number (10-15 digits).";
    }

    if (!formData.password) {
      nextErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }

    if (!formData.confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your password.";
    }

    if (!formData.role) {
      nextErrors.role = "Please select your account type.";
    }

    if (!formData.agreeToTerms) {
      nextErrors.agreeToTerms = "You must agree to continue.";
    }

    if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.values(nextErrors).some(Boolean)) {
      setErrors(nextErrors);
      return;
    }

    setErrors(nextErrors);
    setIsLoading(true);

    try {
      const response = await registerUser({
        fullName: trimmedFullName,
        email: trimmedEmail,
        password: formData.password,
        phone: normalizedPhone,
        role: formData.role ?? "recruiter",
      });

      console.log(response);

      showToast(
        "Registration successful. Check your email for the OTP code.",
        "success",
      );

      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          PENDING_SIGNUP_KEY,
          JSON.stringify({
            email: trimmedEmail,
            password: formData.password,
          }),
        );
      }

      await wait(1500);
      router.push(`/verify-email?email=${encodeURIComponent(trimmedEmail)}`);
    } catch (error) {
      const rawMessage =
        error instanceof Error
          ? error.message
          : "Signup failed. Please try again.";

      setErrors(getInitialErrors());
      showToast(rawMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Role Selector */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <RoleSelector
            selectedRole={formData.role}
            onSelect={(role) => setFormData({ ...formData, role })}
          />
          {errors.role && (
            <p className="mt-1.5 text-sm text-red-500">{errors.role}</p>
          )}
        </motion.div>

        {/* Full Name Field */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <FormInput
            label="Full Name"
            type="text"
            name="fullName"
            placeholder="Your full name"
            icon={User}
            value={formData.fullName}
            onChange={(value) => setFormData({ ...formData, fullName: value })}
            error={errors.fullName}
            required
          />
        </motion.div>

        {/* Email Field */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
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
            required
          />
        </motion.div>

        {/* Phone Number Field */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <FormInput
            label="Phone Number"
            type="tel"
            name="phone"
            placeholder="+923001234567"
            icon={Phone}
            value={formData.phone}
            onChange={handlePhoneChange}
            error={errors.phone}
            required
          />
        </motion.div>

        {/* Password Field */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <FormInput
            label="Password"
            type="password"
            name="password"
            placeholder="Create a password (min 8 characters)"
            icon={Lock}
            value={formData.password}
            onChange={(value) => setFormData({ ...formData, password: value })}
            error={errors.password}
            showToggle
            required
          />

          {/* Informational password feedback only, not submission-blocking. */}
          <PasswordStrength password={formData.password} />
          {formData.password && (
            <PasswordRequirements password={formData.password} />
          )}
        </motion.div>

        {/* Confirm Password Field */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <FormInput
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            icon={ShieldCheck}
            value={formData.confirmPassword}
            onChange={(value) =>
              setFormData({ ...formData, confirmPassword: value })
            }
            error={errors.confirmPassword}
            showToggle
            required
          />

          {formData.confirmPassword && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-1.5 text-sm flex items-center space-x-1 ${
                passwordsMatch ? "text-success" : "text-red-500"
              }`}
            >
              {passwordsMatch ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Passwords match</span>
                </>
              ) : (
                <span>Passwords do not match</span>
              )}
            </motion.p>
          )}
        </motion.div>

        {errors.submit && (
          <p className="text-sm text-red-500" role="alert">
            {errors.submit}
          </p>
        )}

        {/* Terms & Conditions Checkbox */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-start">
            <input
              type="checkbox"
              id="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={(e) =>
                setFormData({ ...formData, agreeToTerms: e.target.checked })
              }
              className="w-4 h-4 mt-0.5 text-primary border-slate/30 rounded focus:ring-primary/20 focus:ring-2"
            />
            <label
              htmlFor="agreeToTerms"
              className="ml-2 text-sm text-midnight cursor-pointer"
            >
              I agree to the{" "}
              <Link
                href="/terms"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                Privacy Policy
              </Link>
            </label>
          </div>
          {errors.agreeToTerms && (
            <p className="mt-1.5 text-sm text-red-500">{errors.agreeToTerms}</p>
          )}
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
              <span>Creating account...</span>
            </>
          ) : (
            <span>Create Account</span>
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

        {/* Sign In Link */}
        <div className="text-center text-sm text-slate">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary font-semibold hover:text-primary/80 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </form>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </motion.div>
  );
}
