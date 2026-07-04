export const API = {
  auth: {
    login: "/auth/login",
    logout: "/auth/logout",
    register: "/auth/register",
    verifyEmailOtp: "/auth/verify-email",
    resendVerificationOtp: "/auth/resend-otp",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    session: "/auth/session",
  },

  jobs: {
    list: "/jobs",
    create: "/jobs",
    details: (id: string) => `/jobs/${id}`,
  },

  company: {
    details: "/company",
  },
};