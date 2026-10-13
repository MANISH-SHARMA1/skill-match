
import { NextRequest } from "next/server";
import { Types } from "mongoose";

import dbConnect from "@/dbConnect";
import Company from "@/models/Company";
import { verifyAccessToken } from "@/utils/authMiddleware";
import { success, error } from "@/utils/responseWrapper";

async function getAuthenticatedUser(req: NextRequest) {
  const { valid, response, user } = await verifyAccessToken(req);

  if (!valid) return { response };

  if (user.role !== "employer") {
    return { response: error(403, "Employer access only") };
  }

  await dbConnect();

  return { user };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const COMPANY_SIZES = [
  "1-10 employees",
  "11-50 employees",
  "51-200 employees",
  "201-500 employees",
  "501-1000 employees",
  "1000+ employees",
];

function cleanString(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthenticatedUser(req);
    if (auth.response) return auth.response;

    const company = await Company.findOne({
      $or: [
        { owner: auth.user!._id },
        { members: { $elemMatch: { user: auth.user!._id } } },
      ],
    });

    if (!company) {
      return error(404, "Company profile not found");
    }

    return success(200, { company });
  } catch (e) {
    console.error("GET company profile:", e);
    return error(500, "Something went wrong");
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthenticatedUser(req);
    if (auth.response) return auth.response;

    const userId = auth.user!._id;

    const existing = await Company.findOne({
      $or: [
        { owner: userId },
        { members: { $elemMatch: { user: userId } } },
      ],
    });

    if (existing) {
      return error(409, "You already belong to a company profile");
    }

    const body: unknown = await req.json();

    if (!body || typeof body !== "object") {
      return error(400, "Invalid request body");
    }

    const data = body as Record<string, unknown>;
    const name = cleanString(data.name);
    const industry = cleanString(data.industry);

    if (!name) return error(400, "Company name is required");
    if (!industry) return error(400, "Industry is required");

    const size = cleanString(data.companySize, "1-10 employees");

    if (!COMPANY_SIZES.includes(size)) {
      return error(400, "Invalid company size");
    }

    const baseSlug = slugify(name);

    if (!baseSlug) {
      return error(400, "Company name cannot generate a valid slug");
    }

    const slug = `${baseSlug}-${new Types.ObjectId().toString().slice(-6)}`;

    const foundedYear =
      data.foundedYear === "" || data.foundedYear == null
        ? undefined
        : Number(data.foundedYear);

    if (
      foundedYear !== undefined &&
      (!Number.isInteger(foundedYear) ||
        foundedYear < 1800 ||
        foundedYear > 2200)
    ) {
      return error(400, "Invalid founding year");
    }

    const company = await Company.create({
      owner: userId,
      members: [{ user: userId, role: "owner" }],
      name,
      slug,
      industry,
      companySize: size,
      foundedYear,
      location: cleanString(data.location),
      website: cleanString(data.website),
      email: cleanString(data.email).toLowerCase(),
      phone: cleanString(data.phone),
      tagline: cleanString(data.tagline),
      overview: cleanString(data.overview),
      about: cleanString(data.about),
      logo: cleanString(data.logo),
      coverImage: cleanString(data.coverImage),
      benefits: [],
      values: [],
      team: [],
    });

    return success(201, {
      message: "Company profile created successfully",
      company,
    });
  } catch (e) {
    console.error("POST company profile:", e);

    if (
      typeof e === "object" &&
      e !== null &&
      "code" in e &&
      e.code === 11000
    ) {
      return error(409, "A company with this slug already exists");
    }

    return error(500, "Something went wrong");
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await getAuthenticatedUser(req);
    if (auth.response) return auth.response;

    const userId = auth.user!._id;

    const company = await Company.findOne({
      owner: userId,
    });

    if (!company) {
      return error(404, "Company profile not found or access denied");
    }

    const body: unknown = await req.json();

    if (!body || typeof body !== "object") {
      return error(400, "Invalid request body");
    }

    const data = body as Record<string, unknown>;

    const allowedFields = [
      "name",
      "industry",
      "location",
      "website",
      "email",
      "phone",
      "companySize",
      "foundedYear",
      "tagline",
      "overview",
      "about",
      "logo",
      "coverImage",
      "benefits",
      "values",
    ];

    if (
      Object.keys(data).length === 0 ||
      Object.keys(data).some((key) => !allowedFields.includes(key))
    ) {
      return error(400, "Invalid fields supplied");
    }

    const stringFields = [
      "name",
      "industry",
      "location",
      "website",
      "email",
      "phone",
      "tagline",
      "overview",
      "about",
      "logo",
      "coverImage",
    ];

    for (const field of stringFields) {
      if (field in data && typeof data[field] !== "string") {
        return error(400, `Invalid ${field}`);
      }
    }

    if ("name" in data && !cleanString(data.name)) {
      return error(400, "Company name is required");
    }

    if ("industry" in data && !cleanString(data.industry)) {
      return error(400, "Industry is required");
    }

    if ("companySize" in data) {
      if (
        typeof data.companySize !== "string" ||
        !COMPANY_SIZES.includes(data.companySize)
      ) {
        return error(400, "Invalid company size");
      }

      company.companySize = data.companySize;
    }

    if ("foundedYear" in data) {
      const year =
        data.foundedYear === "" || data.foundedYear == null
          ? undefined
          : Number(data.foundedYear);

      if (
        year !== undefined &&
        (!Number.isInteger(year) || year < 1800 || year > 2200)
      ) {
        return error(400, "Invalid founding year");
      }

      company.foundedYear = year;
    }

    for (const field of stringFields) {
      if (field in data) {
        const value = cleanString(data[field]);

        switch (field) {
          case "name":
            company.name = value;
            break;
          case "industry":
            company.industry = value;
            break;
          case "location":
            company.location = value;
            break;
          case "website":
            company.website = value;
            break;
          case "email":
            company.email = value.toLowerCase();
            break;
          case "phone":
            company.phone = value;
            break;
          case "tagline":
            company.tagline = value;
            break;
          case "overview":
            company.overview = value;
            break;
          case "about":
            company.about = value;
            break;
          case "logo":
            company.logo = value;
            break;
          case "coverImage":
            company.coverImage = value;
            break;
        }
      }
    }

    if ("benefits" in data) {
      if (
        !Array.isArray(data.benefits) ||
        !data.benefits.every(
          (item) => typeof item === "string" && item.trim()
        )
      ) {
        return error(400, "Benefits must be an array of non-empty strings");
      }

      company.benefits = [
        ...new Set(
          (data.benefits as string[]).map((item) => item.trim())
        ),
      ];
    }

    if ("values" in data) {
      if (
        !Array.isArray(data.values) ||
        !data.values.every(
          (item) =>
            typeof item === "object" &&
            item !== null &&
            !Array.isArray(item) &&
            "title" in item &&
            typeof item.title === "string" &&
            item.title.trim() &&
            (!("description" in item) ||
              typeof item.description === "string") &&
            (!("icon" in item) || typeof item.icon === "string")
        )
      ) {
        return error(400, "Invalid company values");
      }

      company.values = data.values.map((item) => {
        const value = item as {
          title: string;
          description?: string;
          icon?: string;
        };

        return {
          title: value.title.trim(),
          description: value.description?.trim() ?? "",
          icon: value.icon?.trim() ?? "",
        };
      });
    }

    await company.save();

    return success(200, {
      message: "Company profile updated successfully",
      company,
    });
  } catch (e) {
    console.error("PATCH company profile:", e);
    return error(500, "Something went wrong");
  }
}
