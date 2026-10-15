import { NextRequest } from "next/server";
import { Types } from "mongoose";

import Job from "@/models/Job";
import { authenticateEmployer, uniqueJobSlug } from "@/utils/employerJobAuth";
import { error, success } from "@/utils/responseWrapper";

const employmentTypes = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Freelance",
  "Temporary",
];

const workplaces = ["On-site", "Remote", "Hybrid"];

const experiences = [
  "Fresher",
  "0–1 years",
  "1–3 years",
  "3–5 years",
  "5–8 years",
  "8+ years",
];

const statuses = ["Draft", "Active", "Paused", "Closed"];

function validateJob(body: Record<string, unknown>) {
  const errors: string[] = [];

  if (typeof body.title !== "string" || !body.title.trim()) {
    errors.push("Job title is required.");
  }

  if (typeof body.department !== "string" || !body.department.trim()) {
    errors.push("Department is required.");
  }

  if (!body.location || typeof body.location !== "object") {
    errors.push("Location is required.");
  }

  if (!workplaces.includes(String(body.workplace))) {
    errors.push("Invalid workplace type.");
  }

  if (!employmentTypes.includes(String(body.employmentType))) {
    errors.push("Invalid employment type.");
  }

  if (!experiences.includes(String(body.experience))) {
    errors.push("Invalid experience level.");
  }

  if (typeof body.description !== "string" || !body.description.trim()) {
    errors.push("Job description is required.");
  }

  if (typeof body.requirements !== "string" || !body.requirements.trim()) {
    errors.push("Job requirements are required.");
  }

  const salary = body.salary as Record<string, unknown> | undefined;

  const min = Number(salary?.min);
  const max = Number(salary?.max);

  if (!Number.isFinite(min) || min < 0) {
    errors.push("Enter a valid minimum salary.");
  }

  if (!Number.isFinite(max) || max < min) {
    errors.push("Maximum salary must be at least the minimum salary.");
  }

  if (!Number.isInteger(Number(body.openings)) || Number(body.openings) < 1) {
    errors.push("At least one opening is required.");
  }

  if (body.status !== undefined && !statuses.includes(String(body.status))) {
    errors.push("Invalid job status.");
  }

  return errors;
}

function toJobPayload(body: Record<string, unknown>) {
  const location = body.location as Record<string, unknown>;
  const salary = body.salary as Record<string, unknown>;

  return {
    title: String(body.title).trim(),
    department: String(body.department).trim(),
    location: {
      city: String(location.city ?? "").trim(),
      state: String(location.state ?? "").trim(),
      country: String(location.country ?? "India").trim(),
    },
    workplace: body.workplace,
    employmentType: body.employmentType,
    experience: body.experience,
    salary: {
      min: Number(salary.min),
      max: Number(salary.max),
      currency: String(salary.currency ?? "INR"),
      period: salary.period ?? "Yearly",
      isDisclosed: salary.isDisclosed !== false,
    },
    openings: Number(body.openings),
    description: String(body.description).trim(),
    responsibilities: String(body.responsibilities ?? "").trim(),
    requirements: String(body.requirements).trim(),
    skills: Array.isArray(body.skills)
      ? [
          ...new Set(
            body.skills
              .map(String)
              .map((s) => s.trim())
              .filter(Boolean),
          ),
        ]
      : [],
    benefits: Array.isArray(body.benefits)
      ? [
          ...new Set(
            body.benefits
              .map(String)
              .map((s) => s.trim())
              .filter(Boolean),
          ),
        ]
      : [],
    status: String(body.status ?? "Draft"),
  };
}

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateEmployer(request);
    if (auth.response) return auth.response;

    const { company } = auth;
    const params = request.nextUrl.searchParams;

    const page = Math.max(1, Number(params.get("page") ?? 1));
    const limit = Math.min(50, Math.max(1, Number(params.get("limit") ?? 10)));
    const status = params.get("status");
    const search = params.get("search")?.trim();

    const filter: Record<string, unknown> = {
      company: company._id,
    };

    if (status && statuses.includes(status)) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { department: { $regex: search, $options: "i" } },
      ];
    }

    const [jobs, total] = await Promise.all([
      Job.find(filter)
        .sort({ createdAt: -1 })
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
    console.log("GET employer jobs:", e);
    return error(500, "Unable to fetch jobs");
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateEmployer(request);
    if (auth.response) return auth.response;

    const { userId, company, role } = auth;

    if (!["owner", "admin", "recruiter"].includes(String(role))) {
      return error(403, "You cannot post jobs for this company");
    }

    const body = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return error(400, "Invalid request body");
    }

    const payload = toJobPayload(body);
    const errors = validateJob(payload);

    if (errors.length) {
      return error(400, { message: errors[0], errors });
    }

    const slug = await uniqueJobSlug(String(company._id), payload.title);
    const isActive = payload.status === "Active";

    await Job.create({
      ...payload,
      company: company._id,
      postedBy: new Types.ObjectId(userId),
      slug,
      publishedAt: isActive ? new Date() : undefined,
    });

    return success(201, "Job created successfully");
  } catch (e) {
    console.error("POST employer job:", e);
    return error(500, "Unable to create job");
  }
}
