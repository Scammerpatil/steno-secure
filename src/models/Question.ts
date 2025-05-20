import mongoose, { Schema } from "mongoose";

const QuestionSchema = new Schema({
  section: {
    type: String,
    enum: [
      "General Awareness",
      "General Intelligence & Reasoning",
      "English Language & Comprehension",
    ],
    required: true,
  },
  questionText: {
    type: String,
  },
  questionImage: {
    type: String,
  },
  questionType: {
    type: String,
    enum: ["mcq", "audio-transcription", "paragraph-copy", "text-correction"],
    required: true,
  },
  options: {
    type: [String],
    validate: {
      validator: function (this: any, val: string[]) {
        if (this.questionType === "mcq") {
          const hasTextOptions = Array.isArray(val) && val.length === 4;
          const hasImageOptions =
            Array.isArray(this.optionImages) && this.optionImages.length === 4;
          return hasTextOptions || hasImageOptions;
        }
        return true;
      },
      message: "MCQ must have 4 text options or 4 image options",
    },
  },
  optionImages: {
    type: [String],
    validate: {
      validator: function (this: any, val: string[]) {
        if (
          this.questionType === "mcq" &&
          (!this.options || this.options.length === 0)
        ) {
          return Array.isArray(val) && val.length === 4;
        }
        return true;
      },
      message: "If no text options are provided, must have 4 image options",
    },
  },
  correctAnswerIndex: {
    type: Number,
    validate: {
      validator: function (this: any, val: number) {
        if (this.questionType === "mcq") return val >= 0 && val <= 3;
        return true;
      },
      message: "Correct answer index must be between 0-3 for MCQ type",
    },
  },
  audioClipUrl: {
    type: String,
    required: function (this: any) {
      return this.questionType === "audio-transcription";
    },
  },
  transcriptionAnswer: {
    type: String,
    required: function (this: any) {
      return this.questionType === "audio-transcription";
    },
  },
  paragraphText: {
    type: String,
    required: function (this: any) {
      return this.questionType === "paragraph-copy";
    },
  },
  disableBackspace: {
    type: Boolean,
    default: false,
  },
  marks: {
    type: Number,
    default: 1,
  },
  negativeMarks: {
    type: Number,
    default: 0,
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "medium",
  },
});

QuestionSchema.index({ section: 1, difficulty: 1 });

const Question =
  mongoose.models.Question || mongoose.model("Question", QuestionSchema);
export default Question;
