"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  IconCheck,
  IconX,
  IconClockHour4,
  IconAlertTriangle,
  IconUserCircle,
} from "@tabler/icons-react";

interface Answer {
  questionId: string;
  answer: string;
}

interface User {
  _id: string;
  name?: string;
  email: string;
}

interface ExamResult {
  _id: string;
  user: User;
  answers: Answer[];
  timeTaken: number;
  negativeMark: number;
  correctMarks: number;
  totalMarks: number;
  violationDetected: number;
  submittedAt: string;
}

export default function AdminResultsPage() {
  const [results, setResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get("/api/exam/results");
        setResults(res.data.results || []);
      } catch (error) {
        console.error("Failed to fetch results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading results...</div>;
  if (!results.length)
    return <div className="p-8 text-center text-error">No results found.</div>;

  // Group results by user
  const resultsByUser: Record<string, ExamResult[]> = {};
  results.forEach((result) => {
    const userId = result.user?._id || "unknown";
    if (!resultsByUser[userId]) resultsByUser[userId] = [];
    resultsByUser[userId].push(result);
  });

  return (
    <>
      <h1 className="text-3xl font-bold mb-6 text-center uppercase">
        All Exam Results
      </h1>

      {Object.entries(resultsByUser).map(([userId, userResults], index) => {
        const user = userResults[0].user;

        return (
          <div
            key={userId}
            className="mb-10 p-4 border border-base-300 rounded-xl bg-base-300 shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              <IconUserCircle size={32} className="text-primary" />
              <div>
                <h2 className="text-xl font-semibold">
                  {user?.name || "Unnamed User"}
                </h2>
                <p className="text-sm text-base-content/60">{user?.email}</p>
              </div>
            </div>

            <div className="grid gap-6">
              {userResults.map((result, idx) => {
                const percentage = (
                  (result.correctMarks / result.totalMarks) *
                  100
                ).toFixed(2);
                const passed = parseFloat(percentage) >= 40;

                return (
                  <div
                    key={result._id}
                    className="bg-base-200 p-4 rounded-lg border border-base-300"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-sm text-base-content/60">
                        Attempt {userResults.length - idx}
                      </span>
                      <span className="text-xs text-base-content/50">
                        {new Date(result.submittedAt).toLocaleString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="stat bg-base-300">
                        <div className="stat-figure text-success">
                          <IconCheck size={24} />
                        </div>
                        <div className="stat-title">Correct Marks</div>
                        <div className="stat-value text-success">
                          {result.correctMarks}
                        </div>
                      </div>

                      <div className="stat bg-base-300">
                        <div className="stat-figure text-error">
                          <IconX size={24} />
                        </div>
                        <div className="stat-title">Negative Marks</div>
                        <div className="stat-value text-error">
                          {result.negativeMark}
                        </div>
                      </div>

                      <div className="stat bg-base-300">
                        <div className="stat-figure text-info">
                          <IconClockHour4 size={24} />
                        </div>
                        <div className="stat-title">Time Taken (min)</div>
                        <div className="stat-value">{result.timeTaken}</div>
                      </div>

                      <div className="stat bg-base-300">
                        <div className="stat-figure text-warning">
                          <IconAlertTriangle size={24} />
                        </div>
                        <div className="stat-title">Violations Detected</div>
                        <div className="stat-value">
                          {result.violationDetected}
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 text-center">
                      <div
                        className={`font-semibold text-lg ${
                          passed ? "text-success" : "text-error"
                        }`}
                      >
                        {passed ? "Passed ✅" : "Failed ❌"}
                      </div>
                      <div className="text-sm">Score: {percentage}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}
