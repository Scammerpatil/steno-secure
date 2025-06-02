import Request from "@/models/Request";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const requests = await Request.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    if (!requests || requests.length === 0) {
      return NextResponse.json(
        { message: "No requests found", requests: [] },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Requests fetched successfully", requests },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching requests:", error);
    return NextResponse.json(
      { message: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}
