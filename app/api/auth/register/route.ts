import User from "@/models/Users";
import { error, success } from "@/utils/responseWrapper";
import { NextRequest } from "next/server";
import bcrypt from "bcrypt";
import dbConnect from "@/dbConnect";

export async function POST(req: NextRequest) {
  try {
    const { fullName, email, phone, password, role } = await req.json();

    // Validate required fields
    if (!fullName || !email || !phone || !password || !role) {
      return error(400, "All required fields must be filled.");
    }

    // Basic format checks (mirrors the client-side validation)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return error(400, "Enter a valid email address.");
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return error(400, "Enter a valid 10-digit mobile number.");
    }

    if (password.length < 8) {
      return error(400, "Password must be at least 8 characters long.");
    }

    await dbConnect(); // Connect to DB

    // Check if User with the given email OR phone already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return error(409, "Email already registered.");
      }
      return error(409, "Mobile number already registered.");
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new User
   const res = await User.create({
      fullName,
      email,
      phone,
      passwordHash: hashedPassword,
      role
    });

    // Return success response
    return success(201, "Registered successfully.");
  } catch (e) {
    console.log("Error in registration route:", e);
    // Handles any unexpected errors
    return error(500, "Something went wrong.");
  }
}