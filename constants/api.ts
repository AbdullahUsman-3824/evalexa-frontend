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
    getStats: (companyId: string) => `/companies/${companyId}/stats`,
    getOnePublic: (slug: string) =>
      `/public/companies/${encodeURIComponent(slug)}`,
    listPublic: "/public/companies",
    listPublicJobs: (slug: string) =>
      `/public/companies/${encodeURIComponent(slug)}/jobs`,
  },
  jobs: {
    list: "/jobs",
    create: "/jobs",
    jobById: (id: string) => `/jobs/${id}`,
    jobTitles: "/jobs/titles",
    skills: "/skills",
    skillCategories: "/skills/categories",
    skillById: (id: string) => `/skills/${id}`,
    applicationsForJob: (jobId: string) => `/application/job/${jobId}`,
    candidateById: (candidateId: string) => `/candidate/${candidateId}`,
    publicJobs: "/public/jobs",
    publicFeaturedJobs: "/public/jobs/featured",
    publicJobBySlug: (slug: string) =>
      `/public/jobs/${encodeURIComponent(slug)}`,
    publicSimilarJobs: (slug: string) =>
      `/public/jobs/${encodeURIComponent(slug)}/similar`,
    publicJobApply: (slug: string) =>
      `/public/jobs/${encodeURIComponent(slug)}/apply`,
    resumeParse: "/resume/parse",
  },
};
