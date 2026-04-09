import { QuizData } from "@/types/quiz";
import { quizRepository } from "@/lib/repositories/quiz-repository";

export interface QuizMetadata {
  filename: string;
  title: string;
  questionCount: number;
}

export interface QuizServiceResult {
  success: boolean;
  data?: QuizData;
  error?: string;
}

export interface MetadataResult {
  success: boolean;
  data?: QuizMetadata[];
  error?: string;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export class QuizService {
  async getQuiz(filename: string, shuffle: boolean = false): Promise<QuizServiceResult> {
    try {
      const data = await quizRepository.getQuizByFilename(filename);
      if (!data) {
        return { success: false, error: "Quiz not found" };
      }

      if (shuffle) {
        const shuffledQuiz = shuffleArray(data.quiz).map((q) => ({
          ...q,
          answerOptions: shuffleArray(q.answerOptions),
        }));
        return { success: true, data: { quiz: shuffledQuiz } };
      }

      return { success: true, data };
    } catch {
      return { success: false, error: "Failed to load quiz" };
    }
  }

  async getAllQuizzes(): Promise<MetadataResult> {
    try {
      const files = await quizRepository.getAllQuizFiles();
      const metadata: QuizMetadata[] = await Promise.all(
        files.map(async (filename) => {
          const data = await quizRepository.getQuizById(filename);
          const title = filename.replace(".json", "").replace(/-/g, " ");
          return {
            filename,
            title,
            questionCount: data.quiz.length,
          };
        })
      );
      return { success: true, data: metadata };
    } catch {
      return { success: false, error: "Failed to load quiz list" };
    }
  }

  async saveQuiz(filename: string, data: QuizData): Promise<{ success: boolean; error?: string }> {
    try {
      await quizRepository.saveQuiz(filename, data);
      return { success: true };
    } catch {
      return { success: false, error: "Failed to save quiz" };
    }
  }

  getDefaultQuiz(): QuizData {
    return {
      quiz: [],
    };
  }
}

export const quizService = new QuizService();
