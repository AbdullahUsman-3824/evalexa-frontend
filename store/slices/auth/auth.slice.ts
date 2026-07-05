import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser } from "@/types/auth.types";

type AuthState = {
  user: AuthUser | null;
  loading: boolean;
};

const initialState: AuthState = {
  user: null,
  loading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload;
      state.loading = false;
    },
    setAuthLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { setAuthUser, setAuthLoading } = authSlice.actions;
export default authSlice.reducer;