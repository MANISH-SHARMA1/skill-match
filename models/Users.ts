import { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["jobSeeker", "employer", "admin"],
      required: true,
      default: "jobSeeker",
      index: true,
    },
    lastLoginAt: Date,
  },
  { timestamps: true },
);

export default models.User || model("User", UserSchema);
