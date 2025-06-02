"use client";
import { useState, useEffect, ChangeEvent } from "react";
import toast from "react-hot-toast";
import { Question } from "@/types/Question";
import axios from "axios";

interface Answer {
  questionId: string;
  answer: string;
}

const sections: string[] = [
  "General Awareness",
  "General Intelligence & Reasoning",
  "English Language & Comprehension",
];

const ExamStartPage = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number>(120 * 60);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [violationDetected, setViolationDetected] = useState<number>(0);
  const [activeSection, setActiveSection] = useState<string>(sections[0]);

  const fetchQuestions = async () => {
    try {
      const res = await axios.get("/api/exam/questions");
      if (res.status === 200) {
        const fetchedQuestions: Question[] = res.data.questions;
        setQuestions(fetchedQuestions);
        setAnswers(
          fetchedQuestions
            .filter((q: Question) => typeof q._id === "string")
            .map((q: Question) => ({
              questionId: q._id as string,
              answer: "",
            }))
        );
      } else {
        toast.error("Failed to fetch questions");
      }
    } catch (error) {
      toast.error("Error fetching questions");
    }
  };

  const enterFullScreen = () => {
    const docElm = document.documentElement as HTMLElement & {
      mozRequestFullScreen?: () => void;
      webkitRequestFullscreen?: () => void;
    };
    if (docElm.requestFullscreen) docElm.requestFullscreen();
    else if (docElm.mozRequestFullScreen) docElm.mozRequestFullScreen();
    else if (docElm.webkitRequestFullscreen) docElm.webkitRequestFullscreen();
    setIsFullscreen(true);
  };

  const handleFullScreenChange = () => {
    if (!document.fullscreenElement) {
      setViolationDetected((prev) => {
        const newViolation = prev + 1;
        if (newViolation >= 3) {
          toast.error("You have violated the exam policy too many times!");
          submitExam();
        } else {
          toast.error(
            "Exiting fullscreen is not allowed! Please click to re-enter."
          );
        }
        return newViolation;
      });
      setIsFullscreen(false);
    } else {
      setIsFullscreen(true);
    }
  };

  useEffect(() => {
    if (!hasStarted) return;
    fetchQuestions();

    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          submitExam();
        }
        return prevTime - 1;
      });
    }, 1000);

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => {
      clearInterval(timer);
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, [hasStarted]);

  const startExam = () => {
    setHasStarted(true);
    enterFullScreen();
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setViolationDetected((prev) => prev + 1);
        toast.error("Switching tabs is not allowed during the exam!");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const handleAnswerChange = (questionId: string, answer: string) => {
    const updatedAnswers = answers.map((a) =>
      a.questionId === questionId ? { ...a, answer } : a
    );
    setAnswers(updatedAnswers);
  };

  const calculateMarks = (): {
    correctMarks: number;
    negativeMarks: number;
  } => {
    let correctMarks = 0;
    let negativeMarks = 0;

    questions.forEach((q: Question) => {
      const ans = answers.find((a) => a.questionId === q._id)?.answer;

      if (!ans) return;

      if (
        q.section === "General Awareness" ||
        q.section === "General Intelligence & Reasoning"
      ) {
        if (ans === q.options![q.correctAnswerIndex as unknown as number]) {
          correctMarks += q.marks;
        } else if (q.optionImages) {
          const selectedImage = q.optionImages[parseInt(ans)];
          const correctImage =
            q.optionImages[q.correctAnswerIndex as unknown as number];
          if (selectedImage === correctImage) {
            correctMarks += q.marks;
          } else {
            negativeMarks += 0.25;
          }
        } else {
          negativeMarks += 0.25;
        }
      } else if (
        q.section === "English Language & Comprehension" &&
        q.questionType === "audio-transcription"
      ) {
        const userWords = ans
          .split(/\s+/)
          .map((word) => word.trim().toLowerCase());
        const correctWords = q
          .transcriptionAnswer!.split(/\s+/)
          .map((word) => word.trim().toLowerCase());

        let correctWordCount = 0;
        userWords.forEach((word, index) => {
          if (word === correctWords[index]) {
            correctWordCount++;
          }
        });

        const correctPercentage =
          (correctWordCount / correctWords.length) * 100;
        correctMarks += Math.max(0, Math.round((correctPercentage / 100) * 25));

        const mistakes = correctWords.length - correctWordCount;
        let calculatedNegativeMarks = mistakes * 0.25;

        negativeMarks += Math.min(calculatedNegativeMarks, q.marks / 4);
      } else if (
        q.section === "English Language & Comprehension" &&
        q.questionType === "paragraph-copy"
      ) {
        const userWords = ans
          .split(/\s+/)
          .map((word) => word.trim().toLowerCase());
        const correctWords = q
          .paragraphText!.split(/\s+/)
          .map((word) => word.trim().toLowerCase());

        let correctWordCount = 0;
        userWords.forEach((word, index) => {
          if (word === correctWords[index]) {
            correctWordCount++;
          }
        });

        const correctPercentage =
          (correctWordCount / correctWords.length) * 100;
        correctMarks += Math.max(0, Math.round((correctPercentage / 100) * 25));

        const mistakes = correctWords.length - correctWordCount;
        let calculatedNegativeMarks = mistakes * 0.25;

        negativeMarks += Math.min(calculatedNegativeMarks, q.marks / 4);
      }
    });

    if (correctMarks < 0) correctMarks = 0;
    if (negativeMarks < 0) negativeMarks = 0;

    if (violationDetected > 0) {
      correctMarks = Math.max(0, correctMarks - violationDetected * 0.05);
      negativeMarks += violationDetected * 0.25;
    }

    return { correctMarks, negativeMarks };
  };

  const submitExam = () => {
    const { correctMarks, negativeMarks } = calculateMarks();
    const examData = {
      answers,
      timeTaken: 120 * 60 - timeRemaining,
      violationDetected,
      correctMarks,
      negativeMarks,
      totalMarks: questions.reduce(
        (total, q) =>
          total +
          (q.section === "English Language & Comprehension" ? 25 : q.marks),
        0
      ),
    };
    try {
      const res = axios.post("/api/exam/submit", { examData });
      toast.promise(res, {
        loading: "Submitting exam...",
        success: (data) => {
          setHasStarted(false);
          setTimeRemaining(120 * 60);
          setCurrentIndex(0);
          setAnswers([]);
          setViolationDetected(0);
          window.close();
          return "Exam submitted successfully!";
        },
        error: (error) => {
          console.error("Error submitting exam:", error);
          return "Failed to submit exam. Please try again.";
        },
      });
    } catch (error) {
      console.error("Error submitting exam:", error);
      toast.error("Failed to submit exam. Please try again.");
    }
  };
  const formatTime = (timeInSeconds: number): string => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const sectionQuestions = questions.filter((q) => q.section === activeSection);
  const currentQuestion = sectionQuestions[currentIndex];

  const renderQuestion = () => {
    if (!currentQuestion) return null;
    const indexInAll = questions.findIndex(
      (q) => q._id === currentQuestion._id
    );
    const currentAnswer =
      answers.find((a) => a.questionId === currentQuestion._id)?.answer || "";

    return (
      <div className="bg-base-100 p-4 rounded-lg shadow-md">
        <p className="text-lg font-semibold mb-2">
          Q{indexInAll + 1}.{" "}
          {currentQuestion?.questionText?.trim().endsWith("?")
            ? currentQuestion.questionText
            : currentQuestion.questionText + "?"}
        </p>

        {currentQuestion.options?.map((opt, idx) => (
          <div key={idx} className="form-control">
            <label className="label cursor-pointer">
              <input
                type="radio"
                name={`question_${currentQuestion._id}`}
                className="radio"
                checked={currentAnswer === idx.toString()}
                onChange={() =>
                  handleAnswerChange(currentQuestion._id!, idx.toString())
                }
              />
              <span className="label-text ml-2">{opt}</span>
            </label>
          </div>
        ))}

        {currentQuestion.questionImage && (
          <img
            src={currentQuestion.questionImage}
            alt="question"
            className="w-full h-auto mb-4"
          />
        )}

        {currentQuestion.optionImages?.map((img, idx) => (
          <div key={idx} className="form-control">
            <label className="label cursor-pointer">
              <input
                type="radio"
                name={`question_${currentQuestion._id}`}
                className="radio"
                checked={currentAnswer === idx.toString()}
                onChange={() =>
                  handleAnswerChange(currentQuestion._id!, idx.toString())
                }
              />
              <img
                src={img}
                alt={`option-${idx}`}
                className="w-40 h-auto ml-4"
              />
            </label>
          </div>
        ))}

        {currentQuestion.questionType === "audio-transcription" &&
          currentQuestion.audioClipUrl && (
            <>
              <audio
                controls
                src={currentQuestion.audioClipUrl}
                onEnded={(e) => e.target.pause()}
                className="mb-4"
              />
              <textarea
                className="textarea textarea-bordered w-full"
                rows={4}
                placeholder="Type what you hear..."
                value={currentAnswer}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  handleAnswerChange(currentQuestion._id!, e.target.value)
                }
              />
            </>
          )}

        {currentQuestion.questionType === "paragraph-copy" &&
          currentQuestion.paragraphText && (
            <>
              <p
                className="mb-2 whitespace-pre-wrap border p-2 rounded bg-base-200 user-select-none"
                onCopy={(e) => e.preventDefault()}
                onContextMenu={(e) => e.preventDefault()}
              >
                {currentQuestion.paragraphText}
              </p>
              <textarea
                className="textarea textarea-bordered w-full"
                rows={6}
                placeholder="Copy the paragraph here..."
                value={currentAnswer}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                  const inputType = (e.nativeEvent as InputEvent).inputType;
                  if (!inputType?.includes("delete")) {
                    handleAnswerChange(currentQuestion._id!, e.target.value);
                  }
                }}
              />
            </>
          )}
      </div>
    );
  };

  return (
    <>
      <h1 className="text-4xl mt-16 font-bold mb-4 uppercase text-center text-primary">
        Start Exam
        <button
          onClick={startExam}
          className="btn btn-primary ml-4"
          disabled={hasStarted}
        >
          Start Exam
        </button>
      </h1>

      <div className="fixed top-0 left-0 right-0 bg-base-300 text-xl p-2 text-center shadow-lg z-50">
        Time Remaining: {formatTime(timeRemaining)}
      </div>

      {hasStarted && (
        <div className="p-10 bg-base-200 max-w-5xl mx-auto rounded-xl shadow-2xl mt-20 border border-primary">
          <div className="tabs mb-6 bg-base-100 text-lg rounded-lg">
            {sections.map((section) => (
              <a
                key={section}
                className={`tab text-lg tab-bordered ${
                  activeSection === section
                    ? "tab-active font-bold text-accent"
                    : ""
                }`}
                onClick={() => {
                  setActiveSection(section);
                  setCurrentIndex(0);
                }}
              >
                {section}
              </a>
            ))}
          </div>

          {renderQuestion()}

          <div className="mt-6 flex justify-between items-center">
            <button
              className="btn btn-outline"
              onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
              disabled={currentIndex === 0}
            >
              Previous
            </button>
            <button
              className="btn btn-outline"
              onClick={() =>
                setCurrentIndex((prev) =>
                  Math.min(prev + 1, sectionQuestions.length - 1)
                )
              }
              disabled={currentIndex === sectionQuestions.length - 1}
            >
              Next
            </button>
            <button className="btn btn-success" onClick={submitExam}>
              Submit Exam
            </button>
          </div>

          {violationDetected !== 0 && (
            <div className="mt-4 text-red-500 font-bold text-center">
              Policy Violation Detected — Your activity may be flagged.
              <p>
                <span>Penaltiy till Now : {violationDetected}</span>
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ExamStartPage;
