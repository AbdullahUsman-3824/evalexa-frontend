import { apiRequest } from "@/lib/api-client";
import type {
  AuthUser,
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  VerifyEmailOtpPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  MessageResponse,
} from "@/types/auth.types";
import { API } from "@/constants/api";

export const authService = {
  register(payload: RegisterPayload): Promise<AuthUser> {
    return apiRequest<AuthUser>(API.auth.register, {
      method: "POST",
      data: payload,
    });
  },

  login(payload: LoginPayload): Promise<LoginResponse> {
    return apiRequest<LoginResponse>(API.auth.login, {
      method: "POST",
      data: payload,
    });
  },

  verifyEmailOtp(payload: VerifyEmailOtpPayload): Promise<MessageResponse> {
    return apiRequest<MessageResponse>(API.auth.verifyEmailOtp, {
      method: "POST",
      data: payload,
    });
  },

  resendVerificationOtp(email: string): Promise<MessageResponse> {
    return apiRequest<MessageResponse>(API.auth.resendVerificationOtp, {
      method: "POST",
      data: { email },
    });
  },

  forgotPassword(payload: ForgotPasswordPayload): Promise<MessageResponse> {
    return apiRequest<MessageResponse>(API.auth.forgotPassword, {
      method: "POST",
      data: payload,
    });
  },

  resetPassword(payload: ResetPasswordPayload): Promise<MessageResponse> {
    return apiRequest<MessageResponse>(API.auth.resetPassword, {
      method: "POST",
      data: payload,
    });
  },

  logout(): Promise<MessageResponse> {
    return apiRequest<MessageResponse>(API.auth.logout, { method: "POST" });
  },

  getSession(): Promise<AuthUser> {
    return apiRequest<AuthUser>(API.auth.session, { method: "GET" });
  },
};