import Application from "@/models/Application";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id") as string;
  try {
    const application = await Application.findById(id).populate("user");
    if (!application) {
      return NextResponse.json(
        { message: "Application not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ application }, { status: 200 });
  } catch (error) {
    console.error("Error fetching application", error);
    return NextResponse.json(
      { message: "Error fetching application" },
      { status: 500 }
    );
  }
}
