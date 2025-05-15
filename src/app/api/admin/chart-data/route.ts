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
    const data = await Application.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          applications: { $sum: 1 },
        },
      },
      {
        $project: {
          month: "$_id",
          applications: 1,
          _id: 0,
        },
      },
      { $sort: { month: 1 } },
    ]);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const formattedData = data.map((item) => ({
      month: months[item.month - 1],
      applications: item.applications,
    }));
    return NextResponse.json(formattedData, { status: 200 });
  } catch (error) {
    console.error("Error verifying token", error);
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
