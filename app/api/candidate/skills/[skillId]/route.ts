
import { NextRequest } from "next/server";
import { Types } from "mongoose";

import CandidateProfile from "@/models/CandidateProfile";
import { verifyAccessToken } from "@/utils/authMiddleware";
import { error, success } from "@/utils/responseWrapper";
import dbConnect from "@/dbConnect";

const VALID_CATEGORIES = [
  "Technical",
  "Tools",
  "Soft Skills",
  "Other",
] as const;

const VALID_LEVELS = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
] as const;

type RouteContext = {
  params: Promise<{ skillId: string }>;
};

export async function PATCH(
  req: NextRequest,
  { params }: RouteContext
) {
  try {
    const { valid, response, user } = await verifyAccessToken(req);

    if (!valid) return response!;
    if (!user) return error(404, "User not found");
    if (user.role !== "jobSeeker") {
      return error(403, "Access denied");
    }

    const { skillId } = await params;

    if (!Types.ObjectId.isValid(skillId)) {
      return error(400, "Invalid skill ID");
    }

    const body: unknown = await req.json();

    if (!body || typeof body !== "object") {
      return error(400, "Invalid request body");
    }

    const updates = body as Record<string, unknown>;
    const allowedFields = ["name", "category", "level"];

    if (
      Object.keys(updates).length === 0 ||
      Object.keys(updates).some((key) => !allowedFields.includes(key))
    ) {
      return error(400, "Invalid fields supplied");
    }

    if (
      "name" in updates &&
      (typeof updates.name !== "string" || !updates.name.trim())
    ) {
      return error(400, "Skill name cannot be empty");
    }

    if (
      "category" in updates &&
      (typeof updates.category !== "string" ||
        !VALID_CATEGORIES.includes(
          updates.category as (typeof VALID_CATEGORIES)[number]
        ))
    ) {
      return error(400, "Invalid skill category");
    }

    if (
      "level" in updates &&
      (typeof updates.level !== "string" ||
        !VALID_LEVELS.includes(
          updates.level as (typeof VALID_LEVELS)[number]
        ))
    ) {
      return error(400, "Invalid skill level");
    }

    await dbConnect();

    const profile = await CandidateProfile.findOne({
      user: user._id,
    });

    if (!profile) return error(404, "Candidate profile not found");

    const skill = profile.skills.find(
      (item: any) => item._id.toString() === skillId
    );

    if (!skill) return error(404, "Skill not found");

    const nextName =
      typeof updates.name === "string"
        ? updates.name.trim()
        : skill.name;

    const nextCategory =
      typeof updates.category === "string"
        ? updates.category
        : skill.category;

    const duplicate = profile.skills.some(
      (item: any) =>
        item._id.toString() !== skillId &&
        item.name.toLowerCase() === nextName.toLowerCase() &&
        item.category === nextCategory
    );

    if (duplicate) {
      return error(409, "This skill already exists in this category");
    }

    if (typeof updates.name === "string") skill.name = nextName;
    if (typeof updates.category === "string") {
      skill.category =
        updates.category as (typeof VALID_CATEGORIES)[number];
    }
    if (typeof updates.level === "string") {
      skill.level = updates.level as (typeof VALID_LEVELS)[number];
    }

    await profile.save();

    return success(200, {
      message: "Skill updated successfully",
      skill,
    });
  } catch (e) {
    console.error("PATCH candidate skill:", e);
    return error(500, "Something went wrong");
  }
}
