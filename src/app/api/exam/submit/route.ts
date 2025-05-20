import User from "@/models/User";
import ExamResult from "@/models/ExamResult";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import dbConfig from "@/middlewares/db.config";

dbConfig();

export async function POST(req: NextRequest) {
  try {
    const { examData } = await req.json();
    const token = req.cookies.get("token");

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET!) as {
      id: string;
    };
    const user = await User.findById(decoded.id);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.currentlyAllowed === false) {
      return NextResponse.json(
        { message: "You are not allowed to take the exam" },
        { status: 403 }
      );
    }

    if (!examData || !Array.isArray(examData.answers)) {
      return NextResponse.json(
        { message: "Invalid or missing exam data" },
        { status: 400 }
      );
    }

    const examAttempt = {
      date: new Date(),
      score: examData.correctMarks,
      status: "submitted",
      isAllowed: true,
    };
    const result = await ExamResult.create({
      user: user._id,
      answers: examData.answers,
      timeTaken: examData.timeTaken,
      negativeMark: examData.negativeMarks,
      violationDetected: examData.violationDetected,
      correctMarks: examData.correctMarks,
      totalMarks: examData.totalMarks,
    });
    user.examAttempts.push(examAttempt);
    user.currentlyAllowed = false;
    await user.save();

    return NextResponse.json(
      { message: "Exam submitted successfully", resultId: result._id },
      { status: 200 }
    );
  } catch (error) {
    console.error("[EXAM SUBMIT ERROR]", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
