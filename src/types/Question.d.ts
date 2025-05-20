export interface Question {
  _id?: string;
  section: string;
  questionText?: string;
  questionImage?: string;
  questionType:
    | "mcq"
    | "audio-transcription"
    | "paragraph-copy"
    | "text-correction";
  options?: string[];
  optionImages?: string[];
  correctAnswerIndex?: string;
  audioClipUrl?: string;
  transcriptionAnswer?: string;
  paragraphText?: string;
  disableBackspace?: boolean;
  marks: number;
  negativeMarks: number;
  difficulty: "easy" | "medium" | "hard";
}
