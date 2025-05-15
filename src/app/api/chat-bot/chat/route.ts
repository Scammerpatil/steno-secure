import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `
You are a financial expert AI assistant. Your job is to help users understand and manage their personal finances,
including budgeting, investing, saving strategies, financial planning, taxes, insurance, and retirement advice.
Always respond with clear and helpful information, even to beginners.
`;

export async function POST(req: NextRequest) {
  const { message, history } = await req.json();

  try {
    const chat = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await chat.generateContent(
      `${SYSTEM_PROMPT} and this is the conversation history: ${history
        .map((msg: any) => `${msg.role}: ${msg.content}`)
        .join("\n")}\nUser: ${message}\nAI:`
    );
    const reply = result.response.text();

    return NextResponse.json({
      reply,
      role: "bot",
    });
  } catch (error) {
    console.error("Gemini Error:", error);
    return NextResponse.json({
      reply: "Sorry, something went wrong while generating a response.",
      role: "bot",
    });
  }
}
