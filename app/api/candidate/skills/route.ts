import { NextRequest } from "next/server";
import { Types } from "mongoose";
import { verifyAccessToken } from "@/utils/authMiddleware";
import { error, success } from "@/utils/responseWrapper";
import dbConnect from "@/dbConnect";
import CandidateProfile from "@/models/CandidateProfile";

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

async function getCandidateProfile(req: NextRequest) {
  const { valid, response, user } = await verifyAccessToken(req);

  if (!valid) {
    return { response };
  }

  if (!user) {
    return {
      response: error(404, "User not found"),
    };
  }

  if (user.role !== "jobSeeker") {
    return {
      response: error(403, "Access denied"),
    };
  }

  await dbConnect();

  // Find the candidate profile or create it on the first request.
  const profile = await CandidateProfile.findOneAndUpdate(
    { user: user._id },
    {
      $setOnInsert: {
        user: user._id,
      },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
      runValidators: true,
    },
  );

  if (!profile) {
    return {
      response: error(500, "Unable to create candidate profile"),
    };
  }

  return { profile };
}

export async function GET(req: NextRequest) {
  try {
    const result = await getCandidateProfile(req);
    
    if (result.response) return result.response;

    const { profile } = result;

    return success(200, {
      skills: profile!.skills,
    });
  } catch (e) {
    console.error("GET candidate skills:", e);
    return error(500, "Something went wrong");
  }
}

export async function POST(req: NextRequest) {
  try {
    const result = await getCandidateProfile(req);

    if (result.response) return result.response;

    const { profile } = result;
    const body: unknown = await req.json();

    if (!body || typeof body !== "object") {
      return error(400, "Invalid request body");
    }

    const { name, category, level } = body as {
      name?: unknown;
      category?: unknown;
      level?: unknown;
    };

    if (typeof name !== "string" || !name.trim()) {
      return error(400, "Skill name is required");
    }

    const normalizedName = name.trim();
    const normalizedCategory = category === undefined ? "Technical" : category;
    const normalizedLevel = level === undefined ? "Intermediate" : level;

    if (
      typeof normalizedCategory !== "string" ||
      !VALID_CATEGORIES.includes(
        normalizedCategory as (typeof VALID_CATEGORIES)[number],
      )
    ) {
      return error(400, "Invalid skill category");
    }

    if (
      typeof normalizedLevel !== "string" ||
      !VALID_LEVELS.includes(normalizedLevel as (typeof VALID_LEVELS)[number])
    ) {
      return error(400, "Invalid skill level");
    }

    const duplicate = profile!.skills.some(
      (skill: any) =>
        skill.name.toLowerCase() === normalizedName.toLowerCase() &&
        skill.category === normalizedCategory,
    );

    if (duplicate) {
      return error(409, "This skill already exists in this category");
    }

    profile!.skills.push({
      name: normalizedName,
      category: normalizedCategory as (typeof VALID_CATEGORIES)[number],
      level: normalizedLevel as (typeof VALID_LEVELS)[number],
    });

    await profile!.save();

    const addedSkill = profile!.skills[profile!.skills.length - 1];

    return success(201, {
      message: "Skill added successfully",
      skill: addedSkill,
      skills: profile!.skills,
    });
  } catch (e) {
    console.error("POST candidate skill:", e);
    return error(500, "Something went wrong");
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const result = await getCandidateProfile(req);

    if (result.response) return result.response;

    const { profile } = result;
    const skillId = req.nextUrl.searchParams.get("skillId");

    if (!skillId || !Types.ObjectId.isValid(skillId)) {
      return error(400, "A valid skillId is required");
    }

    const skillExists = profile!.skills.some(
      (skill: any) => skill._id.toString() === skillId,
    );

    if (!skillExists) {
      return error(404, "Skill not found");
    }

    profile!.skills.pull({ _id: skillId });
    await profile!.save();

    return success(200, {
      message: "Skill removed successfully",
      skills: profile!.skills,
    });
  } catch (e) {
    console.error("DELETE candidate skill:", e);
    return error(500, "Something went wrong");
  }
}
