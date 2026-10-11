import dbConnect from "@/dbConnect";
import { error, success } from "@/utils/responseWrapper";
import { NextRequest } from "next/server";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import {
  generateAccessToken,
  generateRefreshToken,
} from "@/utils/generateTokens";
import User from "@/models/Users";

const THIRTY_DAYS = 30 * 24 * 60 * 60;
const ONE_DAY = 24 * 60 * 60;

export async function POST(req: NextRequest) {
  try {
    const { identifier, password, rememberMe } = await req.json();

    if (!identifier || !password) {
      return error(400, "Email/mobile number and password are required.");
    }

    // Connect to DB
    await dbConnect();

    // Check if user exists
    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    })
      .select("+passwordHash")
      .select("+role");

    if (!user) {
      return error(400, "No such user found.");
    }

    // Check if password matches
    const matchedPassword = await bcrypt.compare(password, user.passwordHash);

    if (!matchedPassword) {
      return error(403, "Incorrect password.");
    }

    // Generate access token and refresh token
    const accessToken = generateAccessToken({
      _id: user._id,
    });

    const refreshToken = generateRefreshToken({
      _id: user._id,
      rememberMe,
    });

    // Set refresh token in cookie
    (await cookies()).set("jwt", refreshToken!, {
      httpOnly: true,
      secure: true,
      maxAge: rememberMe ? THIRTY_DAYS : ONE_DAY,
    });

    // Send access token in response
    return success(201, { accessToken, role: user.role });
  } catch (e) {
    console.log(e);
    // Handles any unexpected errors
    return error(500, "Something went wrong. www");
  }
}

export async function GET() {
  try {
    // Clear the cookie
    const cookieStore = cookies();
    (await cookieStore).set("jwt", "", {
      httpOnly: true,
      secure: true,
      expires: new Date(0),
    });

    return success(200, "Logged out successfully.");
  } catch (e) {
    return error(500, "Something went wrong.");
  }
}
