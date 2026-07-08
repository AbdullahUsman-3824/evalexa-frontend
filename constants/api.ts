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
  users: {
    getAll: "/users",
    getOne: (id: string) => `/users/${id}`,
    update: (id: string) => `/users/${id}`,
    delete: (id: string) => `/users/${id}`,
  },
  company: {
    list: "/companies",
    create: "/companies",
    getOne: (id: string) => `/companies/${id}`,
    update: (id: string) => `/companies/${id}`,
    delete: (id: string) => `/companies/${id}`,
    verificationDocuments: (companyId: string) =>
      `/companies/${companyId}/verification-documents`,
    getOnePublic: (slug: string) => `/public/companies/${slug}`,
    listPublic: "/public/companies",
    listPublicJobs: (slug: string) => `/public/companies/${slug}/jobs`,
  },
  public: {},
  jobs: {
    list: "/jobs",
    create: "/jobs",
    details: (id: string) => `/jobs/${id}`,
  },
};
