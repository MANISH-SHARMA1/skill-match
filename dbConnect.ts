import mongoose from "mongoose";
import { ServerApiVersion } from "mongodb";

const MONGOURI = process.env.MONGOURI as string;

if (!MONGOURI) {
  throw new Error("Please define MONGOURI in .env.local");
}

// Main connection function
const dbConnect = async () => {
  try {
    // If already connected, do nothing
    if (mongoose.connection.readyState >= 1) return;

    // Connect to MongoDB with server API options
    await mongoose.connect(MONGOURI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: false,
        deprecationErrors: true,
      },
    });

    // Log successful connection
    console.log("<<<:::MONGODB CONNECTED:::>>>");
  } catch (error) {
    // Log error and exit process
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
};

export default dbConnect;
