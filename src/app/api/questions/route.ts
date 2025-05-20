import dbConfig from "@/middlewares/db.config";
import Question from "@/models/Question";
import { NextResponse } from "next/server";
dbConfig();
export async function GET() {
  try {
    const questions = await Question.find({});
    return NextResponse.json(
      { message: "Questions fetched successfully", questions },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { message: "Error fetching questions" },
      { status: 500 }
    );
  }
}
