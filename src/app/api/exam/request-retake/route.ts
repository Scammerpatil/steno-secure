import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConfig from "@/middlewares/db.config";
import Request from "@/models/Request";

dbConfig();
export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const { message } = await req.json();
    if (!message || typeof message !== "string" || message.trim() === "") {
      return NextResponse.json(
        { message: "Invalid or missing message" },
        { status: 400 }
      );
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = decoded.id;
    if (!userId) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
    const newRequest = new Request({
      userId,
      message: message.trim(),
    });
    await newRequest.save();
    return NextResponse.json(
      { message: "Retake request submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing retake request:", error);
    return NextResponse.json(
      { message: "Failed to process retake request" },
      { status: 500 }
    );
  }
}
