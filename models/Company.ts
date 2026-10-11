import { Schema, models, model } from "mongoose";

const TeamMemberSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    designation: { type: String, default: "" },
    avatar: { type: String, default: "" },
    linkedIn: { type: String, default: "" },
  },
  { _id: true },
);

const CompanySchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    members: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        role: {
          type: String,
          enum: ["owner", "admin", "recruiter"],
          default: "recruiter",
        },
      },
    ],
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    logo: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    tagline: { type: String, default: "", maxlength: 180 },
    overview: { type: String, default: "" },
    about: { type: String, default: "" },
    industry: { type: String, required: true, trim: true },
    companySize: {
      type: String,
      enum: [
        "1-10 employees",
        "11-50 employees",
        "51-200 employees",
        "201-500 employees",
        "501-1000 employees",
        "1000+ employees",
      ],
      default: "1-10 employees",
    },
    foundedYear: {
      type: Number,
      min: 1800,
      max: 2200,
    },
    website: { type: String, default: "" },
    email: { type: String, lowercase: true, trim: true, default: "" },
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
    benefits: [{ type: String, trim: true }],
    values: [
      {
        title: { type: String, required: true },
        description: { type: String, default: "" },
        icon: { type: String, default: "" },
      },
    ],
    team: [TeamMemberSchema],
    socialLinks: {
      linkedin: { type: String, default: "" },
      instagram: { type: String, default: "" },
      facebook: { type: String, default: "" },
      x: { type: String, default: "" },
    },
    isVerified: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true },
);

CompanySchema.index({ name: "text", overview: "text", industry: "text" });

export default models.Company || model("Company", CompanySchema);
