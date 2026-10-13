
import { NextRequest } from "next/server";
import { Types } from "mongoose";
import dbConnect from "@/dbConnect";
import CandidateProfile from "@/models/CandidateProfile";
import { verifyAccessToken } from "@/utils/authMiddleware";
import { error, success } from "@/utils/responseWrapper";

type RouteContext = {
  params: Promise<{ experienceId: string }>;
};

async function getProfile(req: NextRequest) {
  const { valid, response, user } = await verifyAccessToken(req);

  if (!valid) return { response };
  if (!user) return { response: error(404, "User not found") };

  if (user.role !== "jobSeeker") {
    return { response: error(403, "Access denied") };
  }

  await dbConnect();

  const profile = await CandidateProfile.findOne({
    user: user._id,
  });

  if (!profile) {
    return { response: error(404, "Candidate profile not found") };
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

// PATCH: Update an experience entry
export async function PATCH(
  req: NextRequest,
  { params }: RouteContext
) {
  try {
    const { experienceId } = await params;

    if (!Types.ObjectId.isValid(experienceId)) {
      return error(400, "Invalid experience ID");
    }

    const result = await getProfile(req);
    if (result.response) return result.response;

    const profile = result.profile!;
    const item = profile.experience.find(
      (entry: any) => entry._id.toString() === experienceId
    );

    if (!item) return error(404, "Experience not found");

    const body: unknown = await req.json();

    if (!body || typeof body !== "object") {
      return error(400, "Invalid request body");
    }

    const data = body as Record<string, unknown>;
    const allowed = [
      "title",
      "company",
      "location",
      "employmentType",
      "start",
      "end",
      "current",
      "description",
    ];

    if (
      Object.keys(data).length === 0 ||
      Object.keys(data).some((key) => !allowed.includes(key))
    ) {
      return error(400, "Invalid fields supplied");
    }

    const companyName =
      typeof data.company === "string"
        ? data.company.trim()
        : item.companyName;

    const jobTitle =
      typeof data.title === "string"
        ? data.title.trim()
        : item.jobTitle;

    if (!companyName || !jobTitle) {
      return error(400, "Company and job title are required");
    }

    const startDate =
      "start" in data ? parseDate(data.start) : item.startDate;

    const endDate =
      "end" in data ? parseDate(data.end) : item.endDate;

    if (!startDate || startDate === null || endDate === null) {
      return error(400, "Invalid experience date");
    }

    const isCurrent =
      typeof data.current === "boolean" ? data.current : item.isCurrent;

    if (isCurrent && "end" in data && endDate) {
      return error(400, "Current experience cannot have an end date");
    }

    if (isCurrent && !("end" in data) && item.endDate) {
      return error(400, "Clear the end date for current experience");
    }

    if (endDate && endDate < startDate) {
      return error(400, "End date cannot be before start date");
    }

    item.companyName = companyName;
    item.jobTitle = jobTitle;
    item.startDate = startDate;
    item.isCurrent = isCurrent;

    if ("location" in data) {
      if (typeof data.location !== "string") {
        return error(400, "Invalid location");
      }
      item.location = data.location.trim();
    }

    if ("employmentType" in data) {
      if (typeof data.employmentType !== "string") {
        return error(400, "Invalid employment type");
      }
      item.employmentType = data.employmentType.trim();
    }

    if ("description" in data) {
      if (typeof data.description !== "string") {
        return error(400, "Invalid description");
      }
      item.description = data.description.trim();
    }

    item.endDate = isCurrent ? undefined : endDate;

    await profile.save();

    return success(200, {
      message: "Experience updated successfully",
      experience: item,
    });
  } catch (e) {
    console.error("PATCH candidate experience:", e);
    return error(500, "Something went wrong");
  }
}

// DELETE: Remove an experience entry
export async function DELETE(
  req: NextRequest,
  { params }: RouteContext
) {
  try {
    const { experienceId } = await params;

    if (!Types.ObjectId.isValid(experienceId)) {
      return error(400, "Invalid experience ID");
    }

    const result = await getProfile(req);
    if (result.response) return result.response;

    const profile = result.profile!;

    const exists = profile.experience.some(
      (item: any) => item._id.toString() === experienceId
    );

    if (!exists) return error(404, "Experience not found");

    profile.experience.pull({ _id: experienceId });
    await profile.save();

    return success(200, {
      message: "Experience deleted successfully",
      experiences: profile.experience,
    });
  } catch (e) {
    console.error("DELETE candidate experience:", e);
    return error(500, "Something went wrong");
  }
}
