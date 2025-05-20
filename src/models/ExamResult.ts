import mongoose, { Schema } from "mongoose";
import { models } from "mongoose";

const ExamResultSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  answers: [
    {
      questionId: {
        type: Schema.Types.ObjectId,
        ref: "Question",
        required: true,
      },
      answer: { type: String, required: true },
    },
  ],
  timeTaken: { type: Number, required: true },
  negativeMark: { type: Number, required: true },
  violationDetected: { type: Number, required: true },
  correctMarks: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  submittedAt: { type: Date, default: Date.now },
});

const ExamResult =
  models.ExamResult || mongoose.model("ExamResult", ExamResultSchema);

export default ExamResult;
