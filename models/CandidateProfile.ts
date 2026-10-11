
import { Schema, models, model } from "mongoose";

const SkillSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["Technical", "Tools", "Soft Skills", "Other"],
      default: "Technical",
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
      default: "Intermediate",
    },
  },
  { _id: true }
);

const ExperienceSchema = new Schema(
  {
    companyName: { type: String, required: true, trim: true },
    jobTitle: { type: String, required: true, trim: true },
    location: { type: String, default: "" },
    employmentType: { type: String, default: "" },
    startDate: { type: Date, required: true },
    endDate: Date,
    isCurrent: { type: Boolean, default: false },
    description: { type: String, default: "" },
  },
  { _id: true }
);

const EducationSchema = new Schema(
  {
    institution: { type: String, required: true, trim: true },
    degree: { type: String, default: "" },
    fieldOfStudy: { type: String, default: "" },
    startDate: Date,
    endDate: Date,
    grade: { type: String, default: "" },
  },
  { _id: true }
);

const ResumeSchema = new Schema(
  {
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    mimeType: { type: String, default: "application/pdf" },
    fileSize: { type: Number, min: 0 },
    uploadedAt: { type: Date, default: Date.now },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);

const CandidateProfileSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    headline: { type: String, default: "", maxlength: 180 },
    summary: { type: String, default: "" },
    location: {
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      country: { type: String, default: "India" },
    },
    skills: [SkillSchema],
    experience: [ExperienceSchema],
    education: [EducationSchema],
    resumes: [ResumeSchema],
    links: {
      linkedIn: { type: String, default: "" },
      github: { type: String, default: "" },
      portfolio: { type: String, default: "" },
    },
    preferences: {
      jobTypes: [{ type: String }],
      workplaceTypes: [{
        type: String,
        enum: ["On-site", "Remote", "Hybrid"],
      }],
      desiredLocations: [{ type: String }],
      expectedSalaryMin: { type: Number, min: 0 },
      expectedSalaryMax: { type: Number, min: 0 },
      salaryPeriod: {
        type: String,
        enum: ["Yearly", "Monthly"],
        default: "Yearly",
      },
      openToWork: { type: Boolean, default: true },
    },
    profileVisibility: {
      type: String,
      enum: ["Public", "EmployersOnly", "Private"],
      default: "EmployersOnly",
    },
    completionPercentage: { type: Number, min: 0, max: 100, default: 0 },
  },
  { timestamps: true }
);

CandidateProfileSchema.index({ "skills.name": 1 });
CandidateProfileSchema.index({ "location.city": 1 });

export default models.CandidateProfile ||
  model("CandidateProfile", CandidateProfileSchema);