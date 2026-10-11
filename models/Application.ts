
import { Schema, models, model } from "mongoose";

const ApplicationSchema = new Schema(
  {
    job: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
    candidate: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    resumeId: {
      type: Schema.Types.ObjectId,
    },
    resumeUrl: { type: String, required: true },
    coverLetter: { type: String, default: "" },
    status: {
      type: String,
      enum: [
        "Applied",
        "Under Review",
        "Shortlisted",
        "Interview",
        "Offered",
        "Hired",
        "Rejected",
        "Withdrawn",
      ],
      default: "Applied",
      index: true,
    },
    matchScore: { type: Number, min: 0, max: 100 },
    employerNotes: { type: String, default: "" },
    appliedAt: { type: Date, default: Date.now },
    statusHistory: [{
      status: {
        type: String,
        enum: [
          "Applied",
          "Under Review",
          "Shortlisted",
          "Interview",
          "Offered",
          "Hired",
          "Rejected",
          "Withdrawn",
        ],
      },
      changedBy: { type: Schema.Types.ObjectId, ref: "User" },
      changedAt: { type: Date, default: Date.now },
      note: { type: String, default: "" },
    }],
  },
  { timestamps: true }
);

ApplicationSchema.index(
  { job: 1, candidate: 1 },
  { unique: true }
);

ApplicationSchema.index({ company: 1, status: 1, appliedAt: -1 });
ApplicationSchema.index({ candidate: 1, appliedAt: -1 });

export default models.Application ||
  model("Application", ApplicationSchema);