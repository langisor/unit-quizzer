export interface AnswerOption {
  text: string;
  isCorrect: boolean;
  rationale: string;
}

export interface QuizQuestion {
  question: string;
  answerOptions: AnswerOption[];
  hint?: string;
}

export interface QuizData {
  quiz: QuizQuestion[];
}