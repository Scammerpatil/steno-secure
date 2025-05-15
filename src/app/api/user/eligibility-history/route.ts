import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConfig from "@/middlewares/db.config";
import Application from "@/models/Application";

dbConfig();

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.id;

    const applications = await Application.find({ user: userId }).sort({
      createdAt: 1,
    });

    console.log("Applications:", applications);

    if (!applications.length) {
      return NextResponse.json([], { status: 200 });
    }

    // Group by month and calculate average eligibility per month
    const historyMap: Record<string, { total: number; count: number }> = {};

    applications.forEach((app) => {
      const month = new Date(app.createdAt).toLocaleString("default", {
        month: "short",
      });
      if (app.eligibilityScore != null) {
        if (!historyMap[month]) {
          historyMap[month] = { total: 0, count: 0 };
        }
        historyMap[month].total += app.eligibilityScore;
        historyMap[month].count += 1;
      }
    });

    const eligibilityHistory = Object.entries(historyMap).map(
      ([month, { total, count }]) => ({
        month,
        eligibility: Math.round(total / count),
      })
    );

    console.log("Eligibility History:", eligibilityHistory);

    return NextResponse.json(eligibilityHistory, { status: 200 });
  } catch (error) {
    console.error("Error fetching eligibility history:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
