import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");
  const status = searchParams.get("status");
  try {
    if (!id || !status) {
      return NextResponse.json(
        { error: "ID and status are required" },
        { status: 400 }
      );
    }
    const candidate = await User.findByIdAndUpdate(
      id,
      { currentlyAllowed: status },
      { new: true }
    );
    if (!candidate) {
      return NextResponse.json(
        { error: "Candidate not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Candidate approved successfully", candidate },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error approving candidate:", error);
    return NextResponse.json(
      { error: "Failed to approve candidate" },
      { status: 500 }
    );
  }
}
