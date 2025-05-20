import dbConfig from "@/middlewares/db.config";
import User from "@/models/User";
import { NextResponse } from "next/server";

dbConfig();
export async function GET() {
  const users = await User.find();

  return NextResponse.json(
    {
      stats: {
        users: users.length,
        candidates: users.filter((user) => user.role === "candidate").length,
        suspects: users.filter((user) => user.role === "suspect").length,
        verifiedCandidates: users.filter(
          (user) => user.role === "candidate" && user.verified
        ).length,
      },
      users,
    },
    { status: 200 }
  );
}
