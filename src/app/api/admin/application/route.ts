import Application from "@/models/Application";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  console.log("Updating application status...");
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id") as string;
  const status = searchParams.get("status") as string;
  const { remarks } = await req.json();
  try {
    const existingApplication = await Application.findById(id);
    if (!existingApplication) {
      return NextResponse.json(
        { message: "Application not found" },
        { status: 404 }
      );
    }
    if (status === "Approved") {
      existingApplication.adminStatus = "Approved";
      existingApplication.adminRemarks = remarks;
    } else if (status === "Rejected") {
      existingApplication.adminStatus = "Rejected";
      existingApplication.adminRemarks = remarks;
    } else {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }
    await existingApplication.save();
    return NextResponse.json(
      { message: "Application status updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating application status", error);
    return NextResponse.json(
      { message: "Error updating application status" },
      { status: 500 }
    );
  }
}
