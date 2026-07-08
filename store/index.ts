import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth/auth.slice";
import { companyApi } from "./api/companyApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [companyApi.reducerPath]: companyApi.reducer,
  },
  middleware: (getDefault) => getDefault().concat(companyApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
