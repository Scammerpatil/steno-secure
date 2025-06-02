import ExamResult from "@/models/ExamResult";
import { NextRequest, NextResponse } from "next/server";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import path from "path";
import fs from "fs";

import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const resultId = searchParams.get("id");
  if (!resultId) {
    return NextResponse.json(
      { message: "Result ID is required" },
      { status: 400 }
    );
  }
  try {
    const result = await ExamResult.findById(resultId).populate("user");
    if (!result) {
      return NextResponse.json(
        { message: "Result not found" },
        { status: 404 }
      );
    }
    const percentage = Math.round(
      (result.correctMarks / result.totalMarks) * 100
    );
    if (percentage < 40) {
      return NextResponse.json(
        { message: "Certificate not available for this result" },
        { status: 403 }
      );
    }
    // Grade the result based on percentage
    let grade;
    if (percentage >= 90) {
      grade = "A+";
    } else if (percentage >= 80) {
      grade = "A";
    } else if (percentage >= 70) {
      grade = "B+";
    } else if (percentage >= 60) {
      grade = "B";
    } else if (percentage >= 50) {
      grade = "C";
    } else {
      grade = "D";
    }
    const data = {
      name: result.user.name,
      obtainedMarks: result.correctMarks,
      totalMarks: result.totalMarks,
      grade: grade,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };
    const certificate = await generateCertificate(data);
    return new NextResponse(certificate, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=certificate-${resultId}.pdf`,
      },
    });
  } catch (error) {
    console.error("Error fetching certificate:", error);
    return NextResponse.json(
      { message: "Failed to fetch certificate" },
      { status: 500 }
    );
  }
}

const generateCertificate = async (data: any) => {
  const tmpDir = path.join(process.cwd(), "tmp");
  const templatePath = path.join(tmpDir, "certificate.docx");
  const zip = new PizZip(fs.readFileSync(templatePath));
  const generatedCertificatesPath = path.join(tmpDir);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });
  doc.render(data);
  const docxBuffer = doc
    .getZip()
    .generate({ type: "nodebuffer", compression: "DEFLATE" });

  const docxFilePath = path.join(
    generatedCertificatesPath,
    `${(data?.name as string).trim().split(" ").join("_")}.docx`
  );
  fs.writeFileSync(docxFilePath, docxBuffer);
  const pythonScriptPath = "python/docx-to-pdf.py";
  await execAsync(
    `py -3.12 ${pythonScriptPath} ${(data?.name as string)
      .trim()
      .split(" ")
      .join("_")}.docx`
  );
  fs.unlinkSync(docxFilePath);
  const pdfFilePath = path.join(
    generatedCertificatesPath,
    `${(data?.name as string).trim().split(" ").join("_")}.pdf`
  );
  const pdfBuffer = fs.readFileSync(pdfFilePath);
  fs.unlinkSync(pdfFilePath);
  return pdfBuffer;
};
