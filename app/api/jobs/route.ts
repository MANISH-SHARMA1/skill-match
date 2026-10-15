
import { NextRequest } from "next/server";

import dbConnect from "@/dbConnect";
import Job from "@/models/Job";
import { error, success } from "@/utils/responseWrapper";

const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Freelance",
  "Temporary",
] as const;

const EXPERIENCES = [
  "Fresher",
  "0–1 years",
  "1–3 years",
  "3–5 years",
  "5–8 years",
  "8+ years",
] as const;

const WORKPLACES = ["On-site", "Remote", "Hybrid"] as const;

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function positiveNumber(value: string | null) {
  if (!value) return undefined;

  const number = Number(value);
  return Number.isFinite(number) && number >= 0
    ? number
    : undefined;
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const params = request.nextUrl.searchParams;

    const requestedPage = Number(params.get("page") ?? 1);
    const requestedLimit = Number(params.get("limit") ?? 10);

    const page =
      Number.isFinite(requestedPage) && requestedPage > 0
        ? Math.floor(requestedPage)
        : 1;

    const limit =
      Number.isFinite(requestedLimit) && requestedLimit > 0
        ? Math.min(50, Math.floor(requestedLimit))
        : 10;

    const search = params.get("search")?.trim().slice(0, 100);
    const city = params.get("city")?.trim().slice(0, 100);
    const workplace = params.get("workplace");
    const employmentType = params.get("employmentType");
    const experience = params.get("experience");
    const skill = params.get("skill")?.trim().slice(0, 60);

    const salaryMin = positiveNumber(params.get("salaryMin"));
    const salaryMax = positiveNumber(params.get("salaryMax"));
    const sort = params.get("sort");

    if (
      salaryMin !== undefined &&
      salaryMax !== undefined &&
      salaryMin > salaryMax
    ) {
      return error(400, "Minimum salary cannot exceed maximum salary");
    }

    const now = new Date();

    const filter: Record<string, unknown> = {
      status: "Active",
      publishedAt: { $ne: null },
      $and: [
        {
          $or: [
            { expiresAt: null },
            { expiresAt: { $gt: now } },
          ],
        },
        {
          $or: [
            { applicationDeadline: null },
            { applicationDeadline: { $gte: now } },
          ],
        },
      ],
    };

    if (search) {
      filter.$text = { $search: search };
    }

    if (
      workplace &&
      WORKPLACES.includes(workplace as (typeof WORKPLACES)[number])
    ) {
      filter.workplace = workplace;
    }

    if (
      employmentType &&
      EMPLOYMENT_TYPES.includes(
        employmentType as (typeof EMPLOYMENT_TYPES)[number],
      )
    ) {
      filter.employmentType = employmentType;
    }

    if (
      experience &&
      EXPERIENCES.includes(experience as (typeof EXPERIENCES)[number])
    ) {
      filter.experience = experience;
    }

    if (city) {
      filter["location.city"] = {
        $regex: escapeRegex(city),
        $options: "i",
      };
    }

    if (skill) {
      filter.skills = {
        $regex: escapeRegex(skill),
        $options: "i",
      };
    }

    // Return jobs whose salary range overlaps the requested range.
    if (salaryMax !== undefined) {
      filter["salary.min"] = { $lte: salaryMax };
    }

    if (salaryMin !== undefined) {
      filter["salary.max"] = { $gte: salaryMin };
    }

    const sortOptions: Record<string, 1 | -1> =
      sort === "salary-desc"
        ? { "salary.max": -1, publishedAt: -1 }
        : sort === "salary-asc"
          ? { "salary.min": 1, publishedAt: -1 }
          : { publishedAt: -1, createdAt: -1 };

    const [jobs, total] = await Promise.all([
      Job.find(filter)
        .select("-applicantsCount")
        .populate("company", "name slug industry")
        .sort(sortOptions)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      Job.countDocuments(filter),
    ]);

    return success(200, {
      data: jobs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (e) {
    console.error("GET public jobs:", e);
    return error(500, "Unable to search jobs");
  }
}
