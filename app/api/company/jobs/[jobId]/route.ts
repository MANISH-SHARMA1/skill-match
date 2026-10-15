
import { NextRequest } from "next/server";
import { Types } from "mongoose";

import Job from "@/models/Job";
import {
  authenticateEmployer,
  canManageJob,
  uniqueJobSlug,
} from "@/utils/employerJobAuth";

type RouteContext = {
  params: Promise<{ jobId: string }>;
};

const allowedStatuses = ["Draft", "Active", "Paused", "Closed"];
const allowedWorkplaces = ["On-site", "Remote", "Hybrid"];
const allowedEmploymentTypes = [
  "Full-time", "Part-time", "Contract",
  "Internship", "Freelance", "Temporary",
];
const allowedExperience = [
  "Fresher", "0–1 years", "1–3 years",
  "3–5 years", "5–8 years", "8+ years",
];

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const auth = await authenticateEmployer(request);
    if (auth.response) return auth.response;

    const { jobId } = await context.params;

    if (!Types.ObjectId.isValid(jobId)) {
      return Response.json(
        { success: false, message: "Invalid job ID" },
        { status: 400 }
      );
    }

    const job = await Job.findOne({
      _id: jobId,
      company: auth.company._id,
    }).lean();

    if (!job) {
      return Response.json(
        { success: false, message: "Job not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, data: job });
  } catch (error) {
    console.error("GET employer job:", error);
    return Response.json(
      { success: false, message: "Unable to fetch job" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const auth = await authenticateEmployer(request);
    if (auth.response) return auth.response;

    const { userId, company, role } = auth;
    const { jobId } = await context.params;

    if (!Types.ObjectId.isValid(jobId)) {
      return Response.json(
        { success: false, message: "Invalid job ID" },
        { status: 400 }
      );
    }

    const job = await Job.findOne({
      _id: jobId,
      company: company._id,
    });

    if (!job) {
      return Response.json(
        { success: false, message: "Job not found" },
        { status: 404 }
      );
    }

    if (!canManageJob(job, userId, role)) {
      return Response.json(
        { success: false, message: "You cannot edit this job" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Whitelist editable fields. Never accept company or postedBy from the client.
    const allowedFields = [
      "title", "department", "location", "workplace",
      "employmentType", "experience", "salary", "openings",
      "description", "responsibilities", "requirements",
      "skills", "benefits", "status", "expiresAt",
      "applicationDeadline",
    ];

    const unexpected = Object.keys(body).filter(
      (key) => !allowedFields.includes(key)
    );

    if (unexpected.length) {
      return Response.json(
        { success: false, message: `Unsupported field: ${unexpected[0]}` },
        { status: 400 }
      );
    }

    if (
      body.workplace !== undefined &&
      !allowedWorkplaces.includes(body.workplace)
    ) {
      return Response.json(
        { success: false, message: "Invalid workplace type" },
        { status: 400 }
      );
    }

    if (
      body.employmentType !== undefined &&
      !allowedEmploymentTypes.includes(body.employmentType)
    ) {
      return Response.json(
        { success: false, message: "Invalid employment type" },
        { status: 400 }
      );
    }

    if (
      body.experience !== undefined &&
      !allowedExperience.includes(body.experience)
    ) {
      return Response.json(
        { success: false, message: "Invalid experience level" },
        { status: 400 }
      );
    }

    if (
      body.status !== undefined &&
      !allowedStatuses.includes(body.status)
    ) {
      return Response.json(
        { success: false, message: "Invalid job status" },
        { status: 400 }
      );
    }

    const update: Record<string, unknown> = {};

    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        update[key] = body[key];
      }
    }

    if (body.title !== undefined) {
      if (typeof body.title !== "string" || !body.title.trim()) {
        return Response.json(
          { success: false, message: "Job title is required" },
          { status: 400 }
        );
      }

      update.title = body.title.trim();
      update.slug = await uniqueJobSlug(
        String(company._id),
        body.title.trim(),
        jobId
      );
    }

    if (body.location !== undefined) {
      if (
        !body.location ||
        typeof body.location.city !== "string" ||
        !body.location.city.trim()
      ) {
        return Response.json(
          { success: false, message: "Location city is required" },
          { status: 400 }
        );
      }

      update.location = {
        city: body.location.city.trim(),
        state: String(body.location.state ?? "").trim(),
        country: String(body.location.country ?? "India").trim(),
      };
    }

    if (body.salary !== undefined) {
      const salary = body.salary;

      if (
        !Number.isFinite(Number(salary.min)) ||
        !Number.isFinite(Number(salary.max)) ||
        Number(salary.min) < 0 ||
        Number(salary.max) < Number(salary.min)
      ) {
        return Response.json(
          { success: false, message: "Invalid salary range" },
          { status: 400 }
        );
      }

      if (
        salary.period !== undefined &&
        !["Yearly", "Monthly"].includes(salary.period)
      ) {
        return Response.json(
          { success: false, message: "Invalid salary period" },
          { status: 400 }
        );
      }

      update.salary = {
        min: Number(salary.min),
        max: Number(salary.max),
        currency: String(salary.currency ?? job.salary.currency ?? "INR"),
        period: salary.period ?? job.salary.period,
        isDisclosed: salary.isDisclosed ?? job.salary.isDisclosed,
      };
    }

    if (body.openings !== undefined) {
      if (!Number.isInteger(Number(body.openings)) || Number(body.openings) < 1) {
        return Response.json(
          { success: false, message: "At least one opening is required" },
          { status: 400 }
        );
      }

      update.openings = Number(body.openings);
    }

    for (const key of [
      "title", "department", "description", "requirements",
      "responsibilities",
    ]) {
      if (
        body[key] !== undefined &&
        typeof body[key] !== "string"
      ) {
        return Response.json(
          { success: false, message: `${key} must be text` },
          { status: 400 }
        );
      }
    }

    for (const key of ["skills", "benefits"]) {
      if (body[key] !== undefined) {
        if (
          !Array.isArray(body[key]) ||
          !body[key].every((item: unknown) => typeof item === "string")
        ) {
          return Response.json(
            { success: false, message: `${key} must be a list of strings` },
            { status: 400 }
          );
        }

        update[key] = [
          ...new Set(
            body[key].map((item: string) => item.trim()).filter(Boolean)
          ),
        ];
      }
    }

    for (const key of ["expiresAt", "applicationDeadline"]) {
      if (body[key] !== undefined) {
        const date = body[key] ? new Date(body[key]) : null;

        if (date && Number.isNaN(date.getTime())) {
          return Response.json(
            { success: false, message: `Invalid ${key} date` },
            { status: 400 }
          );
        }

        update[key] = date;
      }
    }

    if (body.status === "Active" && !job.publishedAt) {
      update.publishedAt = new Date();
    }

    Object.assign(job, update);
    await job.save();

    return Response.json({
      success: true,
      data: job,
      message: "Job updated successfully",
    });
  } catch (error) {
    console.error("PATCH employer job:", error);
    return Response.json(
      { success: false, message: "Unable to update job" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const auth = await authenticateEmployer(request);
    if (auth.response) return auth.response;

    const { userId, company, role } = auth;
    const { jobId } = await context.params;

    if (!Types.ObjectId.isValid(jobId)) {
      return Response.json(
        { success: false, message: "Invalid job ID" },
        { status: 400 }
      );
    }

    const job = await Job.findOne({
      _id: jobId,
      company: company._id,
    });

    if (!job) {
      return Response.json(
        { success: false, message: "Job not found" },
        { status: 404 }
      );
    }

    if (!canManageJob(job, userId, role)) {
      return Response.json(
        { success: false, message: "You cannot delete this job" },
        { status: 403 }
      );
    }

    // If you add an Application model, check for applications here.
    // For jobs with application history, consider closing instead of deleting.
    await job.deleteOne();

    return Response.json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("DELETE employer job:", error);
    return Response.json(
      { success: false, message: "Unable to delete job" },
      { status: 500 }
    );
  }
}
