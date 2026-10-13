import { NextRequest } from "next/server";
import dbConnect from "@/dbConnect";
import CandidateProfile from "@/models/CandidateProfile";
import { verifyAccessToken } from "@/utils/authMiddleware";
import { success, error } from "@/utils/responseWrapper";

async function getCandidateProfile(req: NextRequest) {
  const { valid, response, user } = await verifyAccessToken(req);

  if (!valid) return { response };
  if (!user) return { response: error(404, "User not found") };

  if (user.role !== "jobSeeker") {
    return { response: error(403, "Access denied") };
  }

  await dbConnect();

  const profile = await CandidateProfile.findOneAndUpdate(
    { user: user._id },
    { $setOnInsert: { user: user._id } },
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

function parseDate(value: unknown): Date | undefined | null {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (typeof value !== "string") return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

// GET: Fetch candidate education
export async function GET(req: NextRequest) {
  try {
    const result = await getCandidateProfile(req);
    if (result.response) return result.response;

    return success(200, {
      education: result.profile!.education,
    });
  } catch (e) {
    console.error("GET candidate education:", e);
    return error(500, "Something went wrong");
  }
}

// POST: Add education
export async function POST(req: NextRequest) {
  try {
    const result = await getCandidateProfile(req);
    if (result.response) return result.response;

    const profile = result.profile!;
    const body: unknown = await req.json();

    if (!body || typeof body !== "object") {
      return error(400, "Invalid request body");
    }

    const data = body as Record<string, unknown>;

    const institution =
      typeof data.school === "string" ? data.school.trim() : "";
    const degree = typeof data.degree === "string" ? data.degree.trim() : "";
    const fieldOfStudy =
      typeof data.field === "string" ? data.field.trim() : "";

    if (!institution) {
      return error(400, "Institution is required");
    }

    const startDate = parseDate(data.start);
    const endDate = parseDate(data.end);

    if (startDate === null || endDate === null) {
      return error(400, "Invalid education date");
    }

    if (startDate && endDate && endDate < startDate) {
      return error(400, "End date cannot be before start date");
    }

    profile.education.push({
      institution,
      degree,
      fieldOfStudy,
      startDate,
      endDate,
      description:
        typeof data.description === "string" ? data.description.trim() : "",
    });

    await profile.save();

    const addedEducation = profile.education[profile.education.length - 1];

    return success(201, {
      message: "Education added successfully",
      education: addedEducation,
      educations: profile.education,
    });
  } catch (e) {
    console.error("POST candidate education:", e);
    return error(500, "Something went wrong");
  }
}
