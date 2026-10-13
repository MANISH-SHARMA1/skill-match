
import { NextRequest } from "next/server";
import { Types } from "mongoose";
import dbConnect from "@/dbConnect";
import CandidateProfile from "@/models/CandidateProfile";
import { verifyAccessToken } from "@/utils/authMiddleware";
import { success, error } from "@/utils/responseWrapper";

type RouteContext = {
  params: Promise<{ educationId: string }>;
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

// PATCH: Update education
export async function PATCH(
  req: NextRequest,
  { params }: RouteContext
) {
  try {
    const { educationId } = await params;

    if (!Types.ObjectId.isValid(educationId)) {
      return error(400, "Invalid education ID");
    }

    const result = await getProfile(req);
    if (result.response) return result.response;

    const profile = result.profile!;
    const item = profile.education.find(
      (entry: any) => entry._id.toString() === educationId
    );

    if (!item) return error(404, "Education not found");

    const body: unknown = await req.json();

    if (!body || typeof body !== "object") {
      return error(400, "Invalid request body");
    }

    const data = body as Record<string, unknown>;
    const allowed = [
      "degree",
      "school",
      "field",
      "start",
      "end",
      "description",
    ];

    if (
      Object.keys(data).length === 0 ||
      Object.keys(data).some((key) => !allowed.includes(key))
    ) {
      return error(400, "Invalid fields supplied");
    }

    const institution =
      typeof data.school === "string"
        ? data.school.trim()
        : item.institution;

    if (!institution) {
      return error(400, "Institution is required");
    }

    let startDate = item.startDate;
    let endDate = item.endDate;

    if ("start" in data) {
      startDate = parseDate(data.start);
      if (startDate === null) {
        return error(400, "Invalid start date");
      }
    }

    if ("end" in data) {
      endDate = parseDate(data.end);
      if (endDate === null) {
        return error(400, "Invalid end date");
      }
    }

    if (startDate && endDate && endDate < startDate) {
      return error(400, "End date cannot be before start date");
    }

    item.institution = institution;

    if ("degree" in data) {
      if (typeof data.degree !== "string") {
        return error(400, "Invalid degree");
      }
      item.degree = data.degree.trim();
    }

    if ("field" in data) {
      if (typeof data.field !== "string") {
        return error(400, "Invalid field of study");
      }
      item.fieldOfStudy = data.field.trim();
    }

    if ("description" in data) {
      if (typeof data.description !== "string") {
        return error(400, "Invalid description");
      }
      item.description = data.description.trim();
    }

    item.startDate = startDate;
    item.endDate = endDate;

    await profile.save();

    return success(200, {
      message: "Education updated successfully",
      education: item,
    });
  } catch (e) {
    console.error("PATCH candidate education:", e);
    return error(500, "Something went wrong");
  }
}

// DELETE: Remove education
export async function DELETE(
  req: NextRequest,
  { params }: RouteContext
) {
  try {
    const { educationId } = await params;

    if (!Types.ObjectId.isValid(educationId)) {
      return error(400, "Invalid education ID");
    }

    const result = await getProfile(req);
    if (result.response) return result.response;

    const profile = result.profile!;

    const exists = profile.education.some(
      (item: any) => item._id.toString() === educationId
    );

    if (!exists) return error(404, "Education not found");

    profile.education.pull({ _id: educationId });
    await profile.save();

    return success(200, {
      message: "Education deleted successfully",
      educations: profile.education,
    });
  } catch (e) {
    console.error("DELETE candidate education:", e);
    return error(500, "Something went wrong");
  }
}
