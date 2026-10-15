
import { NextRequest } from "next/server";
import dbConnect from "@/dbConnect";
import Company from "@/models/Company";
import { verifyAccessToken } from "@/utils/authMiddleware";
import { success, error } from "@/utils/responseWrapper";

async function getCompany(req: NextRequest) {
  const { valid, response, user } = await verifyAccessToken(req);

  if (!valid) return { response };
  if (!user) return { response: error(404, "User not found") };

  if (user.role !== "employer") {
    return { response: error(403, "Employer access only") };
  }

  await dbConnect();

  const company = await Company.findOne({
    $or: [
      { owner: user._id },
      {
        members: {
          $elemMatch: {
            user: user._id,
            role: { $in: ["owner", "admin", "recruiter"] },
          },
        },
      },
    ],
  });

  if (!company) {
    return { response: error(404, "Company profile not found") };
  }

  return { company, user };
}

export async function GET(req: NextRequest) {
  try {
    const result = await getCompany(req);
    if (result.response) return result.response;

    return success(200, {
      team: result.company!.team,
    });
  } catch (e) {
    console.error("GET company team:", e);
    return error(500, "Something went wrong");
  }
}

export async function POST(req: NextRequest) {
  try {
    const result = await getCompany(req);
    if (result.response) return result.response;

    const company = result.company!;

    // Only the company owner and admins may manage the team.
    const isOwner =
      company.owner.toString() === result.user!._id.toString();

    const membership = company.members.find(
      (member: any) => member.user.toString() === result.user!._id.toString()
    );

    if (!isOwner && membership?.role !== "admin") {
      return error(403, "You cannot manage this team");
    }

    const body: unknown = await req.json();

    if (!body || typeof body !== "object") {
      return error(400, "Invalid request body");
    }

    const data = body as Record<string, unknown>;
    const name =
      typeof data.name === "string" ? data.name.trim() : "";
    const designation =
      typeof data.role === "string" ? data.role.trim() : "";
    const email =
      typeof data.email === "string" ? data.email.trim().toLowerCase() : "";

    if (!name || !designation) {
      return error(400, "Name and role are required");
    }

    if (
      "email" in data &&
      typeof data.email !== "string"
    ) {
      return error(400, "Invalid email");
    }

    company.team.push({
      name,
      designation,
      email,
    });

    await company.save();

    const addedMember = company.team[company.team.length - 1];

    return success(201, {
      message: "Team member added successfully",
      member: addedMember,
      team: company.team,
    });
  } catch (e) {
    console.error("POST company team:", e);
    return error(500, "Something went wrong");
  }
}
