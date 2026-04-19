import { NounsRepository } from "../repos/nouns.repo";
import { Noun } from "@/quizzers/types/noun.types";
import { QuizQuestion } from "@/quizzers/types/quiz.types";

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

type QuestionType = "plural" | "meaning" | "gender";

class NounsService {
  private readonly nounsRepository = new NounsRepository();
  private static instance: NounsService;

  async getAll(questionCount: number = 50): Promise<QuizQuestion[]> {
    const nouns = await this.nounsRepository.getAll();
    return this.generateQuizQuestions(nouns, questionCount);
  }

  private generateQuizQuestions(nouns: Noun[], count: number): QuizQuestion[] {
    const shuffledNouns = shuffleArray(nouns);
    const selectedNouns = shuffledNouns.slice(0, count);
    const questionTypes: QuestionType[] = shuffleArray([
      "plural",
      "meaning",
      "gender",
    ]);

    return selectedNouns.map((noun, index) => {
      const questionType = questionTypes[index % questionTypes.length];
      return this.generateQuestion(noun, nouns, questionType);
    });
  }

  private generateQuestion(
    noun: Noun,
    allNouns: Noun[],
    type: QuestionType
  ): QuizQuestion {
    switch (type) {
      case "plural":
        return this.generatePluralQuestion(noun, allNouns);
      case "meaning":
        return this.generateMeaningQuestion(noun, allNouns);
      case "gender":
        return this.generateGenderQuestion(noun, allNouns);
    }
  }

  private generatePluralQuestion(noun: Noun, allNouns: Noun[]): QuizQuestion {
    const distractors = shuffleArray(
      allNouns.filter((n) => n.rank !== noun.rank).slice(0, 3)
    ).map((n) => n.plural);

    const options = shuffleArray([
      { text: noun.plural, isCorrect: true, rationale: `جمع "${noun.singular}" هو "${noun.plural}".` },
      ...distractors.map((pl) => ({
        text: pl,
        isCorrect: false,
        rationale: "",
      })),
    ]);

    return {
      question: `ما جمع كلمة "${noun.singular}"؟`,
      answerOptions: options,
      hint: `الجذر: ${noun.roman_scholarly}`,
    };
  }

  private generateMeaningQuestion(noun: Noun, allNouns: Noun[]): QuizQuestion {
    const distractors = shuffleArray(
      allNouns.filter((n) => n.rank !== noun.rank).slice(0, 3)
    ).map((n) => n.meaning_en);

    const options = shuffleArray([
      { text: noun.meaning_en, isCorrect: true, rationale: `"${noun.noun_urdu}" تعني "${noun.meaning_en}".` },
      ...distractors.map((meaning) => ({
        text: meaning,
        isCorrect: false,
        rationale: "",
      })),
    ]);

    return {
      question: `ما معنى كلمة "${noun.noun_urdu}"؟`,
      answerOptions: options,
      hint: `الجذر: ${noun.roman_scholarly}`,
    };
  }

  private generateGenderQuestion(noun: Noun, allNouns: Noun[]): QuizQuestion {
    const distractors = shuffleArray(
      allNouns.filter((n) => n.rank !== noun.rank && n.gender !== noun.gender).slice(0, 1)
    );

    const correctGender = noun.gender === "M" ? "مذكر (Maskulin)" : "مؤنث (Feminin)";
    const wrongGender = noun.gender === "M" ? "مؤنث (Feminin)" : "مذكر (Maskulin)";
    const wrongGender2 = distractors[0]?.gender === "M" ? "مؤنث (Feminin)" : "مذكر (Maskulin)";

    const options = shuffleArray([
      { text: correctGender, isCorrect: true, rationale: `"${noun.noun_urdu}" ${noun.gender === "M" ? "مذكر" : "مؤنث"}.` },
      { text: wrongGender, isCorrect: false, rationale: "" },
      { text: wrongGender2, isCorrect: false, rationale: "" },
      { text: "محايد (Neutrum)", isCorrect: false, rationale: "" },
    ]);

    return {
      question: `ما جنس كلمة "${noun.noun_urdu}"؟`,
      answerOptions: options,
      hint: `الترتيب: ${noun.rank}`,
    };
  }

  static async getInstance(): Promise<NounsService> {
    if (!NounsService.instance) {
      NounsService.instance = new NounsService();
    }
    return NounsService.instance;
  }
}

export const nounsService = await NounsService.getInstance();