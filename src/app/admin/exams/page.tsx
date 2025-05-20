"use client";
import { Question } from "@/types/Question";
import {
  IconTimeDuration10,
  IconTimeDuration30,
  IconTimeDuration90,
} from "@tabler/icons-react";
import axios, { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ManageExams = () => {
  const [stats, setStats] = useState({
    generalAwareness: 0,
    generalIntelligence: 0,
    english: 0,
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [question, setQuestion] = useState<Question>({
    section: "",
    questionText: "",
    questionImage: "",
    questionType: "mcq",
    options: [],
    optionImages: [],
    correctAnswerIndex: 0,
    audioClipUrl: "",
    transcriptionAnswer: "",
    paragraphText: "",
    disableBackspace: false,
    marks: 0,
    negativeMarks: 0,
    difficulty: "easy",
  });

  const fetchQuestions = async () => {
    const res = await axios.get("/api/questions");
    setQuestions(res.data.questions);

    // Reset stats
    const newStats = {
      generalAwareness: 0,
      generalIntelligence: 0,
      english: 0,
    };

    res.data.questions.forEach((question: Question) => {
      if (question.section === "General Awareness") {
        newStats.generalAwareness++;
      } else if (question.section === "General Intelligence & Reasoning") {
        newStats.generalIntelligence++;
      } else if (question.section === "English Language & Comprehension") {
        newStats.english++;
      }
    });

    setStats(newStats);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = axios.delete(`/api/questions/delete?id=${id}`);
      toast.promise(res, {
        loading: "Deleting question...",
        success: (data) => {
          fetchQuestions();
          return data.data.message;
        },
        error: "Error deleting question",
      });
    } catch (error) {
      toast.error("Error deleting question");
    }
  };

  const groupedQuestions = {
    "General Awareness": questions.filter(
      (q) => q.section === "General Awareness"
    ),
    "General Intelligence & Reasoning": questions.filter(
      (q) => q.section === "General Intelligence & Reasoning"
    ),
    "English Language & Comprehension": questions.filter(
      (q) => q.section === "English Language & Comprehension"
    ),
  };

  const handleOptionImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string,
    folderName: string
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB");
        return;
      }
      const formData = new FormData();
      formData.append("file", file as Blob);
      formData.append("name", name);
      formData.append("folderName", folderName);
      const imageResponse = axios.post("/api/helper/upload-img", formData);
      toast.promise(imageResponse, {
        loading: "Uploading Image...",
        success: (data: AxiosResponse) => {
          console.log("Image uploaded successfully:", data.data.path);
          setQuestion({
            ...question,
            optionImages: [...(question.optionImages || []), data.data.path],
          });
          console.log("Updated question state:", question);
          return "Image Uploaded Successfully";
        },
        error: (err: unknown) => {
          if (axios.isAxiosError(err) && err.response) {
            return `This just happened: ${err.response.data.error}`;
          }
          return "An unknown error occurred";
        },
      });
    }
  };

  const handleUploadImageQuestion = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string,
    folderName: string
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB");
        return;
      }
      const formData = new FormData();
      formData.append("file", file as Blob);
      formData.append("name", name);
      formData.append("folderName", folderName);
      const imageResponse = axios.post("/api/helper/upload-img", formData);
      toast.promise(imageResponse, {
        loading: "Uploading Image...",
        success: (data: AxiosResponse) => {
          setQuestion({
            ...question,
            questionImage: data.data.path,
          });
          return "Image Uploaded Successfully";
        },
        error: (err: unknown) => {
          if (axios.isAxiosError(err) && err.response) {
            return `This just happened: ${err.response.data.error}`;
          }
          return "An unknown error occurred";
        },
      });
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleAdd = async (newQuestion: Question) => {
    const finalOptions = ["A", "B", "C", "D"].map(
      (opt) => newQuestion.options?.[opt] || ""
    );
    const finalQuestion = {
      ...newQuestion,
      options: finalOptions.filter(Boolean).length > 0 ? finalOptions : [],
    };

    if (newQuestion.questionType === "audio-transcription") {
      finalQuestion.transcriptionAnswer = question.transcriptionAnswer;
      finalQuestion.audioClipUrl = question.audioClipUrl;
    } else if (newQuestion.questionType === "paragraph-copy") {
      finalQuestion.paragraphText = question.paragraphText;
    }
    try {
      const res = axios.post("/api/questions/add", {
        newQuestion: finalQuestion,
      });
      toast.promise(res, {
        loading: "Adding question...",
        success: (data) => {
          fetchQuestions();
          return data.data.message;
        },
        error: (error) => {
          console.error("Error adding question:", error);
          return "Error adding question";
        },
      });
    } catch (error) {
      console.error("Error adding question:", error);
      toast.error("Error adding question");
    }
  };

  return (
    <>
      <h1 className="text-4xl font-bold mb-6 text-center uppercase">
        Manage Questions
      </h1>

      <div className="stats shadow w-full bg-base-200 mb-6">
        <div className="stat">
          <div className="stat-figure text-primary">
            <IconTimeDuration10 size={32} />
          </div>
          <div className="stat-title">General Awareness</div>
          <div className="stat-value text-primary">
            {stats.generalAwareness} / 50
          </div>
          <div className="stat-desc">Jan 1st - Feb 1st</div>
        </div>
        <div className="stat">
          <div className="stat-figure text-secondary">
            <IconTimeDuration30 size={32} />
          </div>
          <div className="stat-title">General Intelligence</div>
          <div className="stat-value text-secondary">
            {stats.generalIntelligence} / 50
          </div>
          <div className="stat-desc">Feb 1st - Mar 1st</div>
        </div>
        <div className="stat">
          <div className="stat-figure text-accent">
            <IconTimeDuration90 size={32} />
          </div>
          <div className="stat-title">English</div>
          <div className="stat-value text-accent">{stats.english} / 50</div>
          <div className="stat-desc">Mar 1st - Apr 1st</div>
        </div>
      </div>

      {/* Modal Trigger */}
      <div className="text-right mb-4">
        <button
          className="btn btn-primary btn-outline"
          onClick={() =>
            (document.getElementById("add_modal") as any).showModal()
          }
        >
          Add New Question
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-lift bg-base-300 rounded-lg p-2 mb-6">
        {[
          "General Awareness",
          "General Intelligence & Reasoning",
          "English Language & Comprehension",
        ].map((section, idx) => (
          <React.Fragment key={section}>
            <input
              type="radio"
              name="question_tabs"
              className="tab tabs-lg"
              aria-label={section}
              defaultChecked={idx === 0}
            />
            <div className="tab-content border-base-300 p-10 bg-base-200">
              <h2 className="text-xl font-bold mb-4">{section} Questions</h2>
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Question</th>
                    <th>Type</th>
                    <th>Marks</th>
                    <th>Difficulty</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedQuestions[
                    section as keyof typeof groupedQuestions
                  ].map((q, i) => (
                    <tr key={q._id}>
                      <td>{i + 1}</td>
                      <td>{q.questionText?.slice(0, 60)}...</td>
                      <td>{q.questionType}</td>
                      <td>{q.marks}</td>
                      <td>{q.difficulty}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-error mr-2"
                          onClick={() => handleDelete(q._id!)}
                        >
                          Delete
                        </button>
                        {/* Update button can open a modal */}
                        <button
                          className="btn btn-sm btn-info"
                          onClick={() =>
                            toast("Update functionality coming soon!", {
                              icon: "🛠️",
                            })
                          }
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}
                  {groupedQuestions[section as keyof typeof groupedQuestions]
                    .length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center">
                        No questions available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Modal for Add Question */}
      <dialog id="add_modal" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <h3 className="font-bold text-lg mb-4 uppercase text-center">
            Add New Question
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Section */}
            <select
              className="select select-bordered select-primary w-full"
              onChange={(e) =>
                setQuestion({ ...question, section: e.target.value })
              }
              value={question.section}
            >
              <option value="">Select Section</option>
              <option value="General Awareness">General Awareness</option>
              <option value="General Intelligence & Reasoning">
                General Intelligence & Reasoning
              </option>
              <option value="English Language & Comprehension">
                English Language & Comprehension
              </option>
            </select>

            {/* Question Type */}
            <select
              className="select select-bordered select-primary w-full"
              value={question.questionType}
              onChange={(e) =>
                setQuestion({
                  ...question,
                  questionType: e.target.value as
                    | "mcq"
                    | "audio-transcription"
                    | "paragraph-copy"
                    | "text-correction",
                })
              }
            >
              <option value="mcq">MCQ</option>
              <option value="audio-transcription">Audio Transcription</option>
              <option value="paragraph-copy">Paragraph Copy</option>
              <option value="text-correction">Text Correction</option>
            </select>

            {/* Marks */}
            <input
              type="number"
              className="input input-bordered input-primary w-full"
              value={question.marks}
              min={1}
              max={25}
              onChange={(e) =>
                setQuestion({
                  ...question,
                  marks: parseInt(e.target.value),
                })
              }
              placeholder="Marks"
            />

            {/* Difficulty */}
            <select
              className="select select-bordered select-primary w-full"
              value={question.difficulty}
              onChange={(e) =>
                setQuestion({
                  ...question,
                  difficulty: e.target.value as "easy" | "medium" | "hard",
                })
              }
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Question Text */}
          <textarea
            className="textarea textarea-bordered textarea-primary w-full mt-4"
            rows={3}
            value={question.questionText}
            placeholder="Enter the question text here..."
            onChange={(e) =>
              setQuestion({ ...question, questionText: e.target.value })
            }
          ></textarea>

          {/* Optional image for reasoning */}
          {question.section === "General Intelligence & Reasoning" && (
            <input
              type="file"
              accept="image/*"
              className="file-input file-input-bordered input-primary w-full mt-4"
              onChange={(e) =>
                handleUploadImageQuestion(
                  e,
                  question.questionText?.slice(0, 10) || "question",
                  "questions"
                )
              }
            />
          )}

          {/* MCQ Options */}
          {question.questionType === "mcq" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {["A", "B", "C", "D"].map((opt) => (
                <div key={opt}>
                  <input
                    type="text"
                    className="input input-bordered input-primary w-full mb-2"
                    value={question?.options![opt as any] || ""}
                    placeholder={`Option ${opt}`}
                    onChange={(e) =>
                      setQuestion({
                        ...question,
                        options: {
                          ...question.options,
                          [opt]: e.target.value,
                        },
                      })
                    }
                  />
                  {question.section === "General Intelligence & Reasoning" && (
                    <input
                      type="file"
                      accept="image/*"
                      className="file-input file-input-sm file-input-bordered input-primary"
                      onChange={(e) =>
                        handleOptionImageUpload(
                          e,
                          question.questionText?.slice(0, 10) + opt,
                          "questions/option-images"
                        )
                      }
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Audio Transcription Fields */}
          {question.questionType === "audio-transcription" && (
            <div className="mt-4">
              <label className="label">Upload Audio Clip</label>
              <input
                type="file"
                accept="audio/*"
                className="file-input file-input-bordered w-full"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const formData = new FormData();
                    formData.append("file", e.target.files[0]);
                    formData.append(
                      "name",
                      question.questionText?.slice(0, 10) || "audio"
                    );
                    formData.append("folderName", "questions/audio");

                    const audioUpload = axios.post(
                      "/api/helper/upload-audio",
                      formData
                    );
                    toast.promise(audioUpload, {
                      loading: "Uploading Audio...",
                      success: (res: AxiosResponse) => {
                        setQuestion({
                          ...question,
                          audioClipUrl: res.data.path,
                        });
                        return "Audio uploaded";
                      },
                      error: "Audio upload failed",
                    });
                  }
                }}
              />

              <label className="label mt-4">Transcription Answer</label>
              <textarea
                className="textarea textarea-bordered w-full"
                rows={3}
                placeholder="Enter the expected transcription"
                value={question.transcriptionAnswer}
                onChange={(e) =>
                  setQuestion({
                    ...question,
                    transcriptionAnswer: e.target.value,
                  })
                }
              ></textarea>
            </div>
          )}

          {/* Paragraph Copy Fields */}
          {question.questionType === "paragraph-copy" && (
            <div className="mt-4">
              <label className="label">Paragraph Text</label>
              <textarea
                className="textarea textarea-bordered w-full"
                rows={5}
                placeholder="Enter the paragraph text"
                value={question.paragraphText}
                onChange={(e) =>
                  setQuestion({
                    ...question,
                    paragraphText: e.target.value,
                  })
                }
              ></textarea>
            </div>
          )}

          {/* Correct Answer */}
          <input
            type={question.questionType === "mcq" ? "number" : "text"}
            className="input input-bordered input-primary w-full mt-4"
            value={question.correctAnswerIndex}
            placeholder={
              question.questionType === "mcq"
                ? "Enter correct answer index (0-3)"
                : "Enter correct answer (if applicable)"
            }
            onChange={(e) =>
              setQuestion({
                ...question,
                correctAnswerIndex: e.target.value,
              })
            }
          />

          {/* Actions */}
          <div className="modal-action">
            <button
              className="btn btn-primary"
              onClick={() => {
                handleAdd(question);
                (document.getElementById("add_modal") as any).close();
              }}
            >
              Save Question
            </button>
            <form method="dialog">
              <button className="btn">Cancel</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default ManageExams;
