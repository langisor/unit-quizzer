import unit1TestData from "@/data/unit-1-test.json";
import { QuizData } from "@/types/quiz";

export const QUIZZES: Record<string, QuizData> = {
  "unit-1-test.json": unit1TestData,
};

export function getQuizByFilename(filename: string): QuizData | null {
  return QUIZZES[filename] || null;
}

export function getQuizList(): Array<{ filename: string; title: string; questionCount: number }> {
  return Object.entries(QUIZZES).map(([filename, data]) => ({
    filename,
    title: filename.replace(".json", "").replace(/-/g, " "),
    questionCount: data.quiz.length,
  }));
}

export function getDefaultQuiz(): QuizData {
  return unit1TestData;
}
