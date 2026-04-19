import { QuizRepository } from "../repos/quiz.repo";

class QuizService {
  private readonly quizRepository = new QuizRepository();
  //   singleton pattern
  private static instance: QuizService;

  async getAll() {
    return this.quizRepository.getAll();
  }

  async search(query: string) {
    return this.quizRepository.search(query);
  }

  static async getInstance(): Promise<QuizService> {
    if (!QuizService.instance) {
      QuizService.instance = new QuizService();
    }
    return QuizService.instance;
  }
}

export const quizService = await QuizService.getInstance();
