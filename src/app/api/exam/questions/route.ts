import Question from "@/models/Question";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = await req.cookies.get("token");
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET!) as any;
    const userId = decoded.id;
    const user = await User.findById(userId);
    if (user.currentlyAllowedExam === false) {
      return NextResponse.json(
        { message: "You are not allowed to take the exam" },
        { status: 403 }
      );
    }
    const questions = await Question.find({});
    if (!questions) {
      return NextResponse.json(
        { message: "No questions found", questions: [] },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Questions fetched successfully", questions },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
