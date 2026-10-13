import { axiosClient } from "@/utils/axiosClient";

export type SkillCategory = "Technical" | "Tools" | "Soft Skills" | "Other";

export type SkillLevel = "Beginner" | "Intermediate" | "Advanced" | "Expert";

export interface CandidateSkill {
  _id: string;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
}

export const CATEGORY_TO_GROUP: Record<SkillCategory, string> = {
  Technical: "technical",
  Tools: "tools",
  "Soft Skills": "soft-skills",
  Other: "other",
};

export const GROUP_TO_CATEGORY: Record<string, SkillCategory> = {
  technical: "Technical",
  tools: "Tools",
  "soft-skills": "Soft Skills",
  other: "Other",
};

export async function fetchCandidateSkills(): Promise<CandidateSkill[]> {
  const response = await axiosClient.get("/api/candidate/skills", {
    withCredentials: true,
  });

  const payload = response.data.result as {
    data?: { skills?: CandidateSkill[] };
    skills?: CandidateSkill[];
  };

  const skills = payload.data?.skills ?? payload.skills;

  if (!Array.isArray(skills)) {
    throw new Error("Invalid skills response");
  }

  return skills;
}

export async function createCandidateSkill(input: {
  name: string;
  category: SkillCategory;
  level?: SkillLevel;
}): Promise<CandidateSkill> {
  const response = await axiosClient.post("/api/candidate/skills", input, {
    withCredentials: true,
  });

  const result = response.data.result;

  const skill = result.data?.skill ?? result.skill;

  if (!skill) {
    throw new Error("The server did not return the saved skill");
  }

  return skill;
}

export async function deleteCandidateSkill(skillId: string): Promise<void> {
  await axiosClient.delete(
    `/api/candidate/skills?skillId=${encodeURIComponent(skillId)}`,
    {
      withCredentials: true,
    },
  );
}
