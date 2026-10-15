
import { Types } from "mongoose";
import { NextRequest } from "next/server";

import dbConnect from "@/dbConnect";
import { verifyAccessToken } from "@/utils/authMiddleware";
import Company from "@/models/Company";
import Job from "@/models/Job";

export async function authenticateEmployer(request: NextRequest) {
  const auth = await verifyAccessToken(request);

  if (!auth.valid) {
    return {
      response:
        auth.response ??
        Response.json({ success: false, message: "Unauthorized" }, { status: 401 }),
    };
  }

  const userId = String(auth._id ?? "");

  if (!Types.ObjectId.isValid(userId)) {
    return {
      response: Response.json(
        { success: false, message: "Invalid user session" },
        { status: 401 }
      ),
    };
  }

  if (auth.user?.role !== "employer") {
    return {
      response: Response.json(
        { success: false, message: "Employer access required" },
        { status: 403 }
      ),
    };
  }

  await dbConnect();

  const company = await Company.findOne({
    $or: [
      { owner: userId },
      { members: { $elemMatch: { user: userId } } },
    ],
  });

  if (!company) {
    return {
      response: Response.json(
        { success: false, message: "Create or join a company first" },
        { status: 404 }
      ),
    };
  }

  const isOwner = String(company.owner) === userId;
  const membership = company.members.find(
    (member: { user: Types.ObjectId; role: string }) =>
      String(member.user) === userId
  );

  const role = isOwner ? "owner" : membership?.role;

  return {
    userId,
    company,
    role,
    response: null,
  };
}

export function canManageJob(
  job: { postedBy: unknown },
  userId: string,
  role: string | undefined
) {
  return (
    String(job.postedBy) === userId ||
    role === "owner" ||
    role === "admin"
  );
}

export const jobStatuses = ["Draft", "Active", "Paused", "Closed"] as const;

export function makeSlug(title: string) {
  return (
    title
      .normalize("NFKD")
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 120) || "job"
  );
}

export async function uniqueJobSlug(
  companyId: string,
  title: string,
  excludeJobId?: string
) {
  const base = makeSlug(title);
  let slug = base;
  let counter = 1;

  while (
    await Job.exists({
      company: companyId,
      slug,
      ...(excludeJobId ? { _id: { $ne: excludeJobId } } : {}),
    })
  ) {
    counter += 1;
    slug = `${base}-${counter}`;
  }

  return slug;
}
