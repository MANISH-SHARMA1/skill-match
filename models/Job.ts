
import { Schema, models, model } from "mongoose";

const JobSchema = new Schema(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    slug: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    location: {
      city: { type: String, required: true, trim: true },
      state: { type: String, default: "" },
      country: { type: String, default: "India" },
    },
    workplace: {
      type: String,
      enum: ["On-site", "Remote", "Hybrid"],
      required: true,
    },
    employmentType: {
      type: String,
      enum: [
        "Full-time",
        "Part-time",
        "Contract",
        "Internship",
        "Freelance",
        "Temporary",
      ],
      required: true,
    },
    experience: {
      type: String,
      enum: [
        "Fresher",
        "0–1 years",
        "1–3 years",
        "3–5 years",
        "5–8 years",
        "8+ years",
      ],
      required: true,
    },
    salary: {
      min: { type: Number, required: true, min: 0 },
      max: { type: Number, required: true, min: 0 },
      currency: { type: String, default: "INR" },
      period: {
        type: String,
        enum: ["Yearly", "Monthly"],
        default: "Yearly",
      },
      isDisclosed: { type: Boolean, default: true },
    },
    openings: { type: Number, required: true, min: 1, default: 1 },
    description: { type: String, required: true },
    responsibilities: { type: String, default: "" },
    requirements: { type: String, required: true },
    skills: [{ type: String, trim: true }],
    benefits: [{ type: String, trim: true }],
    status: {
      type: String,
      enum: ["Draft", "Active", "Paused", "Closed"],
      default: "Draft",
      index: true,
    },
    publishedAt: Date,
    expiresAt: Date,
    applicationDeadline: Date,
    applicantsCount: { type: Number, default: 0, min: 0 },
    viewsCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

JobSchema.index({ company: 1, createdAt: -1 });
JobSchema.index({ company: 1, status: 1, createdAt: -1 });
JobSchema.index({ status: 1, publishedAt: -1 });
JobSchema.index({ title: "text", description: "text", skills: "text" });
JobSchema.index({ company: 1, slug: 1 }, { unique: true });

JobSchema.pre("validate", function () {
  if (this.salary && this.salary.max < this.salary.min) {
    this.invalidate("salary.max", "Maximum salary must be at least minimum salary.");
  }
});

export default models.Job || model("Job", JobSchema);