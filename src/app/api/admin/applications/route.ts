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
    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (decoded.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    const applications = await Application.find({})
      .sort({ createdAt: -1 })
      .populate("user");
    return NextResponse.json(applications, { status: 200 });
  } catch (error) {
    console.error("Error verifying token", error);
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
