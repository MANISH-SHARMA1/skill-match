
import { axiosClient } from "@/utils/axiosClient";

export interface CandidateExperience {
  _id: string;
  companyName: string;
  jobTitle: string;
  location: string;
  employmentType: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
}

export interface CandidateEducation {
  _id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate?: string;
  endDate?: string;
  grade?: string;
  description: string;
}

type ApiPayload<T> = {
  data?: T;
} & T;

function getPayload<T>(response: { data: { result: ApiPayload<T> } }): T {
  const result = response.data.result;

  return (result.data ?? result) as T;
}


export async function fetchCandidateExperience() {
  const response = await axiosClient.get("/api/candidate/experience", {
    withCredentials: true,
  });

  const payload = getPayload<{ experience: CandidateExperience[] }>(
    response
  );

  return payload.experience;
}

export async function createCandidateExperience(input: {
  title: string;
  company: string;
  location: string;
  employmentType?: string;
  start: string;
  end?: string;
  current: boolean;
  description: string;
}) {
  const response = await axiosClient.post(
    "/api/candidate/experience",
    input,
    { withCredentials: true }
  );

  const payload = getPayload<{ experience: CandidateExperience }>(
    response
  );

  return payload.experience;
}

export async function updateCandidateExperience(
  experienceId: string,
  input: {
    title: string;
    company: string;
    location: string;
    employmentType?: string;
    start: string;
    end?: string;
    current: boolean;
    description: string;
  }
) {
  const response = await axiosClient.patch(
    `/api/candidate/experience/${experienceId}`,
    input,
    { withCredentials: true }
  );

  const payload = getPayload<{ experience: CandidateExperience }>(
    response
  );

  return payload.experience;
}

export async function deleteCandidateExperience(experienceId: string) {
  await axiosClient.delete(
    `/api/candidate/experience/${experienceId}`,
    { withCredentials: true }
  );
}


export async function fetchCandidateEducation() {
  const response = await axiosClient.get("/api/candidate/education", {
    withCredentials: true,
  });

  const payload = getPayload<{ education: CandidateEducation[] }>(
    response
  );

  return payload.education;
}

export async function createCandidateEducation(input: {
  degree: string;
  school: string;
  field: string;
  start?: string;
  end?: string;
  description: string;
}) {
  const response = await axiosClient.post(
    "/api/candidate/education",
    input,
    { withCredentials: true }
  );

  const payload = getPayload<{ education: CandidateEducation }>(
    response
  );

  return payload.education;
}

export async function updateCandidateEducation(
  educationId: string,
  input: {
    degree: string;
    school: string;
    field: string;
    start?: string;
    end?: string;
    description: string;
  }
) {
  const response = await axiosClient.patch(
    `/api/candidate/education/${educationId}`,
    input,
    { withCredentials: true }
  );

  const payload = getPayload<{ education: CandidateEducation }>(
    response
  );

  return payload.education;
}

export async function deleteCandidateEducation(educationId: string) {
  await axiosClient.delete(
    `/api/candidate/education/${educationId}`,
    { withCredentials: true }
  );
}
