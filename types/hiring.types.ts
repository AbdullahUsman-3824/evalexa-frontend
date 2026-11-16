/** POST /application/:id/hire — request body */
export interface HireCandidatePayload {
  sendEmail?: boolean;
}

/** POST /application/:id/hire — response (shape is not documented, keep it loose) */
export interface HireCandidateResponse {
  success?: boolean;
  message?: string;
  data?: unknown;
}

export interface HiredCandidate {
  applicationId: string;
  status: "HIRED";
  hiredAt: string | null;
  appliedAt: string | null;
  matchScore: number | null;
  job: {
    id: string;
    title: string;
  };
  candidate: {
    id: string;
    fullName: string;
    email: string;
    phone: string | null;
  };
}

export interface HiredPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** GET /application/hired — response */
export interface HiredCandidatesResponse {
  success: boolean;
  data: HiredCandidate[];
  pagination: HiredPagination;
}

/** GET /application/hired — query params */
export interface HiredCandidatesQuery {
  jobId?: string;
  page?: number;
  limit?: number;
}