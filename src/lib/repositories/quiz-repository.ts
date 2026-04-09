import fs from "fs";
import path from "path";
import { QuizData } from "@/types/quiz";

const DATA_DIR = path.join(process.cwd(), "src", "data");

export class QuizRepository {
  async getQuizById(filename: string): Promise<QuizData> {
    const filePath = path.join(DATA_DIR, filename);
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data) as QuizData;
  }

  async getAllQuizFiles(): Promise<string[]> {
    const files = fs.readdirSync(DATA_DIR);
    return files.filter((f) => f.endsWith(".json"));
  }

  async saveQuiz(filename: string, data: QuizData): Promise<void> {
    const filePath = path.join(DATA_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  }

  async getQuizByFilename(filename: string): Promise<QuizData | null> {
    try {
      return await this.getQuizById(filename);
    } catch {
      return null;
    }
  }
}

export const quizRepository = new QuizRepository();
