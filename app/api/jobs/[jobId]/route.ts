
import { NextRequest } from "next/server";
import { Types } from "mongoose";

import dbConnect from "@/dbConnect";
import Job from "@/models/Job";

type RouteContext = {
  params: Promise<{ jobId: string }>;
};

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    await dbConnect();

    const { jobId } = await context.params;

    if (!Types.ObjectId.isValid(jobId)) {
      return Response.json(
        { success: false, message: "Invalid job ID" },
        { status: 400 }
      );
    }

    const job = await Job.findOne({
      _id: jobId,
      status: "Active",
      publishedAt: { $ne: null },
      $and: [
        {
          $or: [
            { expiresAt: null },
            { expiresAt: { $gt: new Date() } },
          ],
        },
        {
          $or: [
            { applicationDeadline: null },
            { applicationDeadline: { $gte: new Date() } },
          ],
        },
      ],
    })
      .populate("company", "name slug logo industry website")
      .lean();

    if (!job) {
      return Response.json(
        { success: false, message: "Job not found or no longer available" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, data: job });
  } catch (error) {
    console.error("GET public job:", error);
    return Response.json(
      { success: false, message: "Unable to fetch job" },
      { status: 500 }
    );
  }
}
