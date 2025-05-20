import dbConfig from "@/middlewares/db.config";
import User from "@/models/User";
import { NextResponse } from "next/server";

dbConfig();

export async function GET() {
  try {
    const candidates = await User.find();
    return NextResponse.json(
      { message: "Candidates fetched successfully", candidates },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching candidates:", error);
    return NextResponse.json(
      { error: "Failed to fetch candidates" },
      { status: 500 }
    );
  }
}
