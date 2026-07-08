export type AuthUser = {
  id: string;
  name?: string;
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  companyId: string | null;
  isVerified: boolean;
  isActive: boolean;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  role?: "recruiter" | "candidate";
};

export type LoginResponse = {
  user: AuthUser;
};

export type VerifyEmailOtpPayload = {
  email: string;
  otp: string;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  email: string;
  otp: string;
  newPassword: string;
};

export type MessageResponse = {
  message?: string;
};

export type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
};
