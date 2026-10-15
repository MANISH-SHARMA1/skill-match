import { axiosClient } from "@/utils/axiosClient";

export interface JobRecord {
  _id: string;
  company:
    | string
    | {
        _id: string;
        name: string;
        slug?: string;
        logo?: string;
      };
  postedBy: string;
  title: string;
  slug: string;
  department: string;
  location: {
    city: string;
    state: string;
    country: string;
  };
  workplace: "On-site" | "Remote" | "Hybrid";
  employmentType:
    | "Full-time"
    | "Part-time"
    | "Contract"
    | "Internship"
    | "Freelance"
    | "Temporary";
  experience:
    | "Fresher"
    | "0–1 years"
    | "1–3 years"
    | "3–5 years"
    | "5–8 years"
    | "8+ years";
  salary: {
    min: number;
    max: number;
    currency: string;
    period: "Yearly" | "Monthly";
    isDisclosed: boolean;
  };
  openings: number;
  description: string;
  responsibilities: string;
  requirements: string;
  skills: string[];
  benefits: string[];
  status: "Draft" | "Active" | "Paused" | "Closed";
  publishedAt?: string;
  expiresAt?: string;
  applicationDeadline?: string;
  applicantsCount: number;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
}

interface ApiSuccess<T> {
  status: "ok";
  statusCode: number;
  result: T;
}

interface ApiError {
  status: "error";
  statusCode: number;
  result:
    | string
    | {
        message?: string;
        errors?: string[];
      };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface PaginatedJobs {
  data: JobRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface PublicJobParams {
  page?: number;
  limit?: number;
  search?: string;
  city?: string;
  workplace?: string;
  employmentType?: string;
  experience?: string;
  skill?: string;
  salaryMin?: number;
  salaryMax?: number;
  sort?: "newest" | "salary-desc" | "salary-asc";
}

export interface JobFormInput {
  title: string;
  department: string;
  location: string;
  workplace: JobRecord["workplace"];
  employmentType: JobRecord["employmentType"];
  experience: JobRecord["experience"];
  salaryMin: string;
  salaryMax: string;
  salaryPeriod: JobRecord["salary"]["period"];
  openings: string;
  description: string;
  responsibilities: string;
  requirements: string;
  skills: string[];
  benefits: string[];
}

function parseLocation(value: string) {
  const parts = value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length >= 3) {
    return {
      city: parts[0],
      state: parts.slice(1, -1).join(", "),
      country: parts[parts.length - 1],
    };
  }

  if (parts.length === 2) {
    return {
      city: parts[0],
      state: "",
      country: parts[1],
    };
  }

  return {
    city: parts[0] ?? "",
    state: "",
    country: "India",
  };
}

export function toJobPayload(form: JobFormInput, status: JobRecord["status"]) {
  return {
    title: form.title.trim(),
    department: form.department.trim(),
    location: parseLocation(form.location),
    workplace: form.workplace,
    employmentType: form.employmentType,
    experience: form.experience,
    salary: {
      min: Number(form.salaryMin),
      max: Number(form.salaryMax),
      currency: "INR",
      period: form.salaryPeriod,
      isDisclosed: true,
    },
    openings: Number(form.openings),
    description: form.description.trim(),
    responsibilities: form.responsibilities.trim(),
    requirements: form.requirements.trim(),
    skills: form.skills,
    benefits: form.benefits,
    status,
  };
}

export function fromJobRecord(job: JobRecord): JobFormInput {
  return {
    title: job.title,
    department: job.department,
    location: [job.location.city, job.location.state, job.location.country]
      .filter(Boolean)
      .join(", "),
    workplace: job.workplace,
    employmentType: job.employmentType,
    experience: job.experience,
    salaryMin: String(job.salary.min),
    salaryMax: String(job.salary.max),
    salaryPeriod: job.salary.period,
    openings: String(job.openings),
    description: job.description,
    responsibilities: job.responsibilities ?? "",
    requirements: job.requirements,
    skills: job.skills ?? [],
    benefits: job.benefits ?? [],
  };
}

export function getApiErrorMessage(
  response: ApiResponse<unknown>,
  fallback = "Something went wrong",
): string {
  if (response.status === "ok") {
    return fallback;
  }

  if (typeof response.result === "string") {
    return response.result;
  }

  return response.result.message ?? fallback;
}

export async function getEmployerJobs(params?: {
  page?: number;
  limit?: number;
  status?: JobRecord["status"];
  search?: string;
}) {
  const response = await axiosClient.get<ApiResponse<PaginatedJobs>>(
    "/api/jobs",
    { params },
  );

  return response.data;
}

export async function getEmployerJob(jobId: string): Promise<JobRecord> {
  const response = await axiosClient.get<
    ApiResponse<{ data: JobRecord } | JobRecord>
  >(`/api/company/jobs/${jobId}`);

  if (response.data.status === "error") {
    throw new Error(getApiErrorMessage(response.data));
  }

  const result = response.data.result;

  return "data" in result ? result.data : result;
}

export async function createEmployerJob(
  form: JobFormInput,
  status: JobRecord["status"],
): Promise<JobRecord> {
  const response = await axiosClient.post(
    "/api/company/jobs",
    toJobPayload(form, status),
  );

  if (response.data.status === "error") {
    throw new Error(getApiErrorMessage(response.data));
  }

  const result = response.data.result;
  return result;
}

export async function updateEmployerJob(
  jobId: string,
  form: JobFormInput,
  status: JobRecord["status"],
): Promise<JobRecord> {
  const response = await axiosClient.patch<
    ApiResponse<{ data: JobRecord; message?: string } | JobRecord>
  >(`/api/employer/jobs/${jobId}`, toJobPayload(form, status));

  if (response.data.status === "error") {
    throw new Error(getApiErrorMessage(response.data));
  }

  const result = response.data.result;

  return "data" in result ? result.data : result;
}

export async function deleteEmployerJob(
  jobId: string,
): Promise<ApiResponse<unknown>> {
  const response = await axiosClient.delete<ApiResponse<unknown>>(
    `/api/employer/jobs/${jobId}`,
  );

  if (response.data.status === "error") {
    throw new Error(getApiErrorMessage(response.data));
  }

  return response.data;
}

export async function getPublicJobs(params?: PublicJobParams) {
  const response = await axiosClient.get("/api/jobs", { params });
  
  return response.data.result;
}

export async function getPublicJob(jobId: string): Promise<JobRecord> {
  const response = await axiosClient.get<
    ApiResponse<{ data: JobRecord } | JobRecord>
  >(`/api/jobs/${jobId}`);

  if (response.data.status === "error") {
    throw new Error(getApiErrorMessage(response.data));
  }

  const result = response.data.result;

  return "data" in result ? result.data : result;
}
