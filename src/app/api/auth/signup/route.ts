import dbConfig from "@/middlewares/db.config";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

dbConfig();
export async function POST(req: NextRequest) {
  const { formData } = await req.json();
  try {
    // find user by email
    const existingUser = await User.findOne({ email: formData.email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }
    const encryptedPassword = await bcrypt.hash(formData.password, 10);
    formData.password = encryptedPassword;
    const newUser = new User({
      ...formData,
    });
    await newUser.save();
    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error in creating user" },
      { status: 500 }
    );
  }
}
