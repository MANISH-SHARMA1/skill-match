
import { NextRequest } from "next/server";
import CandidateProfile from "@/models/CandidateProfile";
import { verifyAccessToken } from "@/utils/authMiddleware";
import { error, success } from "@/utils/responseWrapper";
import dbConnect from "@/dbConnect";

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
    }
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

  if (typeof value !== "string" && !(value instanceof Date)) {
    return null;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

// GET: Fetch candidate experience
export async function GET(req: NextRequest) {
  try {
    const result = await getCandidateProfile(req);
    if (result.response) return result.response;

    return success(200, {
      experience: result.profile!.experience,
    });
  } catch (e) {
    console.error("GET candidate experience:", e);
    return error(500, "Something went wrong");
  }
}

// POST: Add experience
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

    const companyName =
      typeof data.company === "string" ? data.company.trim() : "";
    const jobTitle =
      typeof data.title === "string" ? data.title.trim() : "";

    const startDate = parseDate(data.start);
    const endDate = parseDate(data.end);
    const isCurrent = data.current === true;

    if (!companyName || !jobTitle) {
      return error(400, "Company and job title are required");
    }

    if (!startDate) {
      return error(400, "A valid start date is required");
    }

    if (startDate === null || endDate === null) {
      return error(400, "Invalid experience date");
    }

    if (isCurrent && endDate) {
      return error(400, "Current experience cannot have an end date");
    }

    if (endDate && endDate < startDate) {
      return error(400, "End date cannot be before start date");
    }

    profile.experience.push({
      companyName,
      jobTitle,
      location:
        typeof data.location === "string" ? data.location.trim() : "",
      employmentType:
        typeof data.employmentType === "string"
          ? data.employmentType.trim()
          : "",
      startDate,
      endDate: isCurrent ? undefined : endDate,
      isCurrent,
      description:
        typeof data.description === "string" ? data.description.trim() : "",
    });

    await profile.save();

    const addedExperience =
      profile.experience[profile.experience.length - 1];

    return success(201, {
      message: "Experience added successfully",
      experience: addedExperience,
      experiences: profile.experience,
    });
  } catch (e) {
    console.error("POST candidate experience:", e);
    return error(500, "Something went wrong");
  }
}
