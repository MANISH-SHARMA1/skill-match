import { error, success } from "@/utils/responseWrapper";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { generateAccessToken } from "@/utils/generateTokens";
import dbConnect from "@/dbConnect";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const cookie = req.cookies.get("jwt");

    if (!cookie) {
      return error(401, "Refresh token in cookie is required.");
    }

    const refreshToken = cookie.value;

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_PRIVATE_KEY!
    ) as { _id: string };

    const _id = decoded._id;

    const accessToken = generateAccessToken({ _id });

    return success(201, { accessToken });
  } catch {
    return error(401, "Invalid refresh token.");
  }
}
