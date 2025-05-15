import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Application from "@/models/Application";
export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    const applications = await Application.find({ user: decoded.id }).sort({
      createdAt: -1,
    });
    return NextResponse.json({ applications }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
