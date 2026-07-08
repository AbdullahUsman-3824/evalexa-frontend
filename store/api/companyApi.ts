import { createApi } from "@reduxjs/toolkit/query/react";
import { companyService } from "@/services/company.service";
import type {
  Company,
  CreateCompanyPayload,
  UpdateCompanyPayload,
  PublicCompaniesQuery,
  PublicCompanyDetails,
  PublicCompaniesResponse,
  PublicCompanyJobsQuery,
  PublicCompanyJobsResponse,
} from "@/types/company.types";

// Generic error shape returned when a service call throws
type ApiError = { status?: number; message: string };

function toQueryError(error: unknown): { error: ApiError } {
  return {
    error: {
      status: (error as { status?: number })?.status,
      message:
        (error as { message?: string })?.message ?? "Something went wrong",
    },
  };
}

export const companyApi = createApi({
  reducerPath: "companyApi",
  baseQuery: () => ({ data: undefined }), // unused — every endpoint uses queryFn
  tagTypes: ["Company", "PublicCompany"],
  endpoints: (builder) => ({
    // ─── Recruiter-facing ──────────────────────────

    createCompany: builder.mutation<Company, CreateCompanyPayload>({
      queryFn: async (payload) => {
        try {
          const data = await companyService.createCompany(payload);
          return { data };
        } catch (error) {
          return toQueryError(error);
        }
      },
      invalidatesTags: ["Company"],
    }),

    getCompanies: builder.query<Company[], void>({
      queryFn: async () => {
        try {
          const data = await companyService.getCompanies();
          return { data };
        } catch (error) {
          return toQueryError(error);
        }
      },
      providesTags: ["Company"],
    }),

    getCompany: builder.query<Company, string>({
      queryFn: async (id) => {
        try {
          const data = await companyService.getCompany(id);
          return { data };
        } catch (error) {
          return toQueryError(error);
        }
      },
      providesTags: (result, error, id) => [{ type: "Company", id }],
    }),

    updateCompany: builder.mutation<
      Company,
      {
        id: string;
        payload: UpdateCompanyPayload;
      }
    >({
      queryFn: async ({ id, payload }) => {
        try {
          const data = await companyService.updateCompany(id, payload);
          return { data };
        } catch (error) {
          return toQueryError(error);
        }
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: "Company", id }],
    }),

    deleteCompany: builder.mutation<Company, string>({
      queryFn: async (id) => {
        try {
          const data = await companyService.deleteCompany(id);
          return { data };
        } catch (error) {
          return toQueryError(error);
        }
      },
      invalidatesTags: (result, error, id) => [{ type: "Company", id }],
    }),

    getVerificationDocumentUrls: builder.query<string[], string>({
      queryFn: async (companyId) => {
        try {
          const data =
            await companyService.getVerificationDocumentUrls(companyId);
          return { data };
        } catch (error) {
          return toQueryError(error);
        }
      },
    }),

    // ─── Public ─────────────────────────────────────

    getPublicCompanies: builder.query<
      PublicCompaniesResponse,
      PublicCompaniesQuery | void
    >({
      queryFn: async (query = {}) => {
        try {
          const data = await companyService.getPublicCompanies(
            query as PublicCompaniesQuery,
          );
          return { data };
        } catch (error) {
          return toQueryError(error);
        }
      },
      providesTags: ["PublicCompany"],
    }),

    getPublicCompany: builder.query<PublicCompanyDetails, string>({
      queryFn: async (companySlug) => {
        try {
          const data = await companyService.getPublicCompany(companySlug);
          return { data };
        } catch (error) {
          return toQueryError(error);
        }
      },
      providesTags: (result, error, slug) => [
        { type: "PublicCompany", id: slug },
      ],
    }),

    getPublicCompanyJobs: builder.query<
      PublicCompanyJobsResponse,
      { companySlug: string; query?: PublicCompanyJobsQuery }
    >({
      queryFn: async ({ companySlug, query = {} }) => {
        try {
          const data = await companyService.getPublicCompanyJobs(
            companySlug,
            query,
          );
          return { data };
        } catch (error) {
          return toQueryError(error);
        }
      },
    }),
  }),
});

export const {
  useCreateCompanyMutation,
  useGetCompaniesQuery,
  useGetCompanyQuery,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation,
  useGetVerificationDocumentUrlsQuery,
  useGetPublicCompaniesQuery,
  useGetPublicCompanyQuery,
  useGetPublicCompanyJobsQuery,
} = companyApi;
