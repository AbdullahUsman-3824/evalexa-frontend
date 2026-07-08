export type UserProfile = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  companyId: number | null;
  isVerified: boolean;
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UpdateUserPayload = {
  fullName?: string;
  email?: string;
  password?: string;
  phone?: string;
  role?: string;
  isActive?: boolean;
};
