import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  const formData = await req.json();
  try {
    const updatedUser = await User.findByIdAndUpdate(
      formData._id,
      { ...formData },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "User updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error updating user" },
      { status: 500 }
    );
  }
}
