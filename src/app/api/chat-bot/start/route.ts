import { NextResponse } from "next/server";

export async function GET() {
  const initialPrompt =
    "Welcome to the Financial Assistant Chatbot! I'm here to help you with your financial questions and concerns. How can I assist you today?";

  return NextResponse.json({ reply: initialPrompt });
}
