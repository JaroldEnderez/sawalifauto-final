// backend/lib/mongo.ts
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/autosite";

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;

  await mongoose.connect(MONGO_URI);
  console.log("✅ MongoDB connected");
}
