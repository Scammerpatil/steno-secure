import jwt from "jsonwebtoken";
import dbConfig from "@/middlewares/db.config";
import { NextRequest, NextResponse } from "next/server";
import { decode } from "punycode";
import ExamResult from "@/models/ExamResult";

dbConfig();

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const decoded = (await jwt.verify(token, process.env.JWT_SECRET!)) as any;
    if (decoded.role === "admin") {
      const results = await ExamResult.find()
        .populate("user")
        .populate("answers.questionId");
      return NextResponse.json(
        { message: "Results fetched successfully", results },
        { status: 200 }
      );
    }
    const results = await ExamResult.find({ user: decoded.id })
      .populate("answers.questionId")
      .sort({ createdAt: -1 });
    if (!results) {
      return NextResponse.json(
        { message: "No result found", results: [] },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Result fetched successfully", results },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching result:", error);
    return NextResponse.json(
      { message: "Failed to fetch result" },
      { status: 500 }
    );
  }
}
