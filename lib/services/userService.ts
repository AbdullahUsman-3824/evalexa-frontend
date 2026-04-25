import { apiRequest } from "@/lib/services/apiClient";

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

/** Fetch a single user by ID (public endpoint). */
export async function getUser(id: number): Promise<UserProfile> {
  return apiRequest<UserProfile>(`/users/${id}`);
}

/** Fetch all users (public endpoint). */
export async function getAllUsers(): Promise<UserProfile[]> {
  return apiRequest<UserProfile[]>("/users");
}

/** Partially update a user — requires JWT auth. */
export async function updateUser(
  id: number,
  payload: UpdateUserPayload,
): Promise<UserProfile> {
  return apiRequest<UserProfile>(
    `/users/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
    true, // withAuth
  );
}

/** Delete a user — requires JWT auth. */
export async function deleteUser(id: number): Promise<UserProfile> {
  return apiRequest<UserProfile>(
    `/users/${id}`,
    { method: "DELETE" },
    true, // withAuth
  );
}
