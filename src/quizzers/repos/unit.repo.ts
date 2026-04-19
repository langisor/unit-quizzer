import { BaseRepository } from "./base.repo";
import { QuizQuestion } from "@/quizzers/types/quiz.types";
import { JSONProvider } from "@/quizzers/json-provider/json.provider";

export class UnitRepository extends BaseRepository<QuizQuestion> {
  private readonly file_path = "src/quizzers/data/unit-1-test.json";

  async getAll(): Promise<QuizQuestion[]> {
    return JSONProvider.load<QuizQuestion[]>(this.file_path);
  }

  async search(query: string): Promise<QuizQuestion[]> {
    const questions = await this.getAll();
    const lowerQuery = query.toLowerCase();
    return questions.filter(
      (question) =>
        question.question.includes(lowerQuery) ||
        question.answerOptions.some((option) =>
          option.text.toLowerCase().includes(lowerQuery),
        ),
    );
  }
}