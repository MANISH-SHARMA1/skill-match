import { axiosClient } from "@/utils/axiosClient";

export interface CompanyRecord {
  _id: string;
  name: string;
  slug: string;
  logo: string;
  coverImage: string;
  tagline: string;
  overview: string;
  about: string;
  industry: string;
  companySize: string;
  foundedYear?: number;
  website: string;
  email: string;
  phone: string;
  location: string;
  benefits: string[];
  values: {
    _id?: string;
    title: string;
    description: string;
    icon: string;
  }[];
  team: {
    _id: string;
    name: string;
    designation: string;
    email: string;
    avatar: string;
    linkedIn: string;
  }[];
  socialLinks: {
    linkedin: string;
    instagram: string;
    facebook: string;
    x: string;
  };
  isVerified: boolean;
  isPublished: boolean;
}

function unwrap<T>(response: { data: { result: { data?: T } & T } }): T {
  const result = response.data.result;
  return (result.data ?? result) as T;
}

export async function getCompanyProfile() {
  const response = await axiosClient.get("/api/company/profile");

  return unwrap<{ company: CompanyRecord }>(response).company;
}

export async function createCompanyProfile(input: {
  name: string;
  industry: string;
  location?: string;
  website?: string;
  email?: string;
  phone?: string;
  companySize?: string;
  foundedYear?: number;
  tagline?: string;
  overview?: string;
  about?: string;
}) {
  const response = await axiosClient.post("/api/company/profile", input);

  return unwrap<{ company: CompanyRecord }>(response).company;
}

export async function updateCompanyProfile(input: {
  name?: string;
  industry?: string;
  location?: string;
  website?: string;
  email?: string;
  phone?: string;
  companySize?: string;
  foundedYear?: number | null;
  tagline?: string;
  overview?: string;
  about?: string;
  logo?: string;
  coverImage?: string;
  benefits?: string[];
  values?: {
    title: string;
    description: string;
    icon: string;
  }[];
}) {
  const response = await axiosClient.patch("/api/company/profile", input);

  return unwrap<{ company: CompanyRecord }>(response).company;
}

export async function getCompanyTeam() {
  const response = await axiosClient.get("/api/company/profile/team");

  return unwrap<{
    team: CompanyRecord["team"];
  }>(response).team;
}

export async function addCompanyTeamMember(input: {
  name: string;
  role: string;
  email?: string;
}) {
  const response = await axiosClient.post("/api/company/profile/team", input);

  return unwrap<{
    member: CompanyRecord["team"][number];
  }>(response).member;
}

export async function updateCompanyTeamMember(
  memberId: string,
  input: {
    name?: string;
    role?: string;
    email?: string;
    avatar?: string;
    linkedIn?: string;
  },
) {
  const response = await axiosClient.patch(
    `/api/company/profile/team/${memberId}`,
    input,
  );

  return unwrap<{
    member: CompanyRecord["team"][number];
  }>(response).member;
}

export async function deleteCompanyTeamMember(memberId: string): Promise<void> {
  await axiosClient.delete(`/api/company/profile/team/${memberId}`);
}
