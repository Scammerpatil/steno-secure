import Application from "@/models/Application";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConfig from "@/middlewares/db.config";

dbConfig();
export async function POST(req: NextRequest) {
  const formData = await req.json();
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const flaskRes = await fetch(
      "https://novacops.pythonanywhere.com/predict",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    );

    if (!flaskRes.ok) {
      const err = await flaskRes.json();
      return NextResponse.json(
        { error: err.message || "Flask error" },
        { status: flaskRes.status }
      );
    }

    const flaskData = await flaskRes.json();
    const newApplication = new Application({
      user: decoded.id,
      gender: formData.Gender === "0" ? "Female" : "Male",
      married: formData.Married === "0" ? "No" : "Yes",
      dependents: formData.Dependents,
      education: formData.Education === "0" ? "Not Graduate" : "Graduate",
      selfEmployed: formData.Self_Employed === "0" ? "No" : "Yes",
      applicantIncome: formData.ApplicantIncome,
      coapplicantIncome: formData.CoapplicantIncome,
      loanAmount: formData.LoanAmount,
      loanAmountTerm: formData.Loan_Amount_Term,
      creditHistory: formData.Credit_History === "0" ? "Bad" : "Good",
      propertyArea:
        formData.Property_Area === "0"
          ? "Rural"
          : formData.Property_Area === "1"
          ? "Semiurban"
          : "Urban",
      eligibilityScore: flaskData.confidence,
      modelResult: flaskData.prediction === 1 ? "Eligible" : "Not Eligible",
    });
    newApplication.save();
    return NextResponse.json(
      { message: "Application Saved successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
