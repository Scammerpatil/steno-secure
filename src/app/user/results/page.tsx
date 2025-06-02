"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  IconCheck,
  IconX,
  IconClockHour4,
  IconAlertTriangle,
} from "@tabler/icons-react";
import toast from "react-hot-toast";

interface Answer {
  questionId: string;
  answer: string;
}

interface ExamResult {
  _id: string;
  answers: Answer[];
  timeTaken: number;
  negativeMark: number;
  correctMarks: number;
  totalMarks: number;
  violationDetected: number;
  submittedAt: string;
}

export default function UserResultPage() {
  const [results, setResults] = useState<ExamResult[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await axios.get("/api/exam/results");
        console.log(res.data);
        setResults(res.data.results);
      } catch (error) {
        console.error("Failed to fetch result:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, []);

  if (loading) {
    return (
      <div>
        <div className="loading-dots"></div>
        <h1 className="text-4xl font-bold">Loading...</h1>
      </div>
    );
  }
  if (!results || results.length === 0) {
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold">No Results Found</h1>
        <p className="mt-4">You have not attempted any exams yet.</p>
      </div>
    );
  }

  const downloadCertificate = async (resultId: string) => {
    try {
      const response = await axios.get(`/api/exam/certificate?id=${resultId}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `certificate-${resultId}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Failed to download certificate:", error);
    }
  };

  const requestRetake = async (resultId: string) => {
    if (!window.confirm("Are you sure you want to request a retake?")) {
      return;
    }
    const message = prompt("Please provide a reason for requesting a retake:");
    if (!message) {
      toast.error("Retake request cancelled. No reason provided.");
      return;
    }
    try {
      const response = axios.post("/api/exam/request-retake", {
        message,
      });
      toast.promise(response, {
        loading: "Requesting retake...",
        success: "Retake request sent successfully!",
        error: "Failed to send retake request. Please try again later.",
      });
    } catch (error) {
      console.error("Failed to request retake:", error);
      toast.error("Failed to send retake request. Please try again later.");
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-6 text-center uppercase">
        Your Exam Results
      </h1>

      <div className="grid gap-8">
        {results.map((result, index) => {
          const percentage = (
            (result.correctMarks / result.totalMarks) *
            100
          ).toFixed(2);
          const passed = parseFloat(percentage) >= 40;

          return (
            <div
              key={result._id}
              className="border border-base-300 rounded-xl p-6 bg-base-300 shadow"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Attempt {index + 1}</h2>
                <span className="text-sm text-base-content/60">
                  Total Marks: {result.totalMarks}
                </span>
                <span className="text-sm text-base-content/60">
                  Submitted: {new Date(result.submittedAt).toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="stat bg-base-100 shadow-md">
                  <div className="stat-figure text-success">
                    <IconCheck size={28} />
                  </div>
                  <div className="stat-title">Correct Marks</div>
                  <div className="stat-value text-success">
                    {result.correctMarks}
                  </div>
                </div>

                <div className="stat bg-base-100 shadow-md">
                  <div className="stat-figure text-error">
                    <IconX size={28} />
                  </div>
                  <div className="stat-title">Negative Marks</div>
                  <div className="stat-value text-error">
                    {result.negativeMark}
                  </div>
                </div>

                <div className="stat bg-base-100 shadow-md">
                  <div className="stat-figure text-info">
                    <IconClockHour4 size={28} />
                  </div>
                  <div className="stat-title">Time Taken (min)</div>
                  <div className="stat-value">{result.timeTaken}</div>
                </div>

                <div className="stat bg-base-100 shadow-md">
                  <div className="stat-figure text-warning">
                    <IconAlertTriangle size={28} />
                  </div>
                  <div className="stat-title">Violations Detected</div>
                  <div className="stat-value">{result.violationDetected}</div>
                </div>
              </div>

              <div className="mt-4 text-center">
                <div
                  className={`text-xl font-bold ${
                    passed ? "text-success" : "text-error"
                  }`}
                >
                  {passed ? "Passed ✅" : "Failed ❌"}
                </div>
                <div className="text-md mt-1">Score: {percentage}%</div>
                <div className="text-sm text-base-content/60 mt-1">
                  {passed ? (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => {
                        downloadCertificate(result._id);
                      }}
                    >
                      Download Certificate
                    </button>
                  ) : (
                    <button
                      className="btn btn-error btn-sm"
                      onClick={() => {
                        requestRetake(result._id);
                      }}
                    >
                      Retake Exam
                    </button>
                  )}
                </div>
                <div className="mt-2 text-base-content/80">
                  {passed
                    ? "Congratulations! You have passed the exam."
                    : "Unfortunately, you did not pass the exam. Please try again."}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
