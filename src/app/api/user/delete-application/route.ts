import Application from "@/models/Application";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ message: "ID is required" }, { status: 400 });
  }
  try {
    const deleteApplication = await Application.findByIdAndDelete(id);
    if (!deleteApplication) {
      return NextResponse.json(
        { message: "Application not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Application deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
