import { NextRequest } from "next/server";
import { error } from "./responseWrapper";
import jwt from "jsonwebtoken";
import dbConnect from "@/dbConnect";
import User from "@/models/Users";

export const verifyAccessToken = async (req: NextRequest) => {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      valid: false,
      response: error(401, "Authorization header is required."),
    };
  }

  const accessToken = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_PRIVATE_KEY!
    ) as { _id: string };

    await dbConnect();
    const user = await User.findById(decoded._id);

    if (!user) {
      return {
        valid: false,
        response: error(404, "User not found."),
      };
    }

    return { valid: true, _id: decoded._id, user };
  } catch (e) {
    return {
      valid: false,
      response: error(401, "Invalid user or token expired."),
    };
  }
};
