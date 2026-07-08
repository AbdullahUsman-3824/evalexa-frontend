import type { UserProfile, UpdateUserPayload } from "@/types/user.types";
import { apiRequest } from "@/lib/api-client";
import { API } from "@/constants/api";

export const userService = {
  /** Fetch a single user by ID (public endpoint). */
  getUser(id: string): Promise<UserProfile> {
    return apiRequest<UserProfile>(API.users.getOne(id), { method: "GET" });
  },

  /** Fetch all users (public endpoint). */
  getAllUsers(): Promise<UserProfile[]> {
    return apiRequest<UserProfile[]>(API.users.getAll, { method: "GET" });
  },

  /** Partially update a user — requires JWT auth. */
  updateUser(id: string, payload: UpdateUserPayload): Promise<UserProfile> {
    return apiRequest<UserProfile>(API.users.update(id), {
      method: "PATCH",
      data: payload,
    });
  },

  /** Delete a user — requires JWT auth. */
  deleteUser(id: string): Promise<UserProfile> {
    return apiRequest<UserProfile>(API.users.delete(id), {
      method: "DELETE",
    });
  },
};
