import Question from "@/models/Question";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { newQuestion } = await req.json();
  try {
    const question = new Question({
      ...newQuestion,
    });
    await question.save();
    return NextResponse.json(
      { message: "Question added successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding question:", error);
    return NextResponse.json(
      { message: "Error adding question" },
      { status: 500 }
    );
  }
}
