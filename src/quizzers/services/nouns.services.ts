import { NounsRepository } from "../repos/nouns.repo";
import { Noun } from "@/quizzers/types/noun.types";
import { QuizQuestion, NounQuestionType } from "@/quizzers/types/quiz.types";

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const QUESTION_TYPES: NounQuestionType[] = [
  "meaning_to_urdu",
  "urdu_to_meaning",
  "gender",
  "pluralization",
  "cloze",
  "linguistics",
];

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
    
    const shuffledTypes = shuffleArray([...QUESTION_TYPES]);

    return selectedNouns.map((noun, index) => {
      const questionType = shuffledTypes[index % shuffledTypes.length];
      return this.generateQuestion(noun, nouns, questionType);
    });
  }

  private generateQuestion(
    noun: Noun,
    allNouns: Noun[],
    type: NounQuestionType
  ): QuizQuestion {
    switch (type) {
      case "meaning_to_urdu":
        return this.generateMeaningToUrdu(noun, allNouns);
      case "urdu_to_meaning":
        return this.generateUrduToMeaning(noun, allNouns);
      case "gender":
        return this.generateGenderQuestion(noun, allNouns);
      case "pluralization":
        return this.generatePluralizationQuestion(noun, allNouns);
      case "cloze":
        return this.generateClozeQuestion(noun, allNouns);
      case "linguistics":
        return this.generateLinguisticsQuestion(noun, allNouns);
    }
  }

  private generateMeaningToUrdu(noun: Noun, allNouns: Noun[]): QuizQuestion {
    const distractors = shuffleArray(
      allNouns.filter((n) => n.rank !== noun.rank).slice(0, 3)
    );

    const options = shuffleArray([
      { text: noun.noun_urdu, isCorrect: true, rationale: `"${noun.meaning_en}" is "${noun.noun_urdu}".` },
      ...distractors.map((n) => ({
        text: n.noun_urdu,
        isCorrect: false,
        rationale: "",
      })),
    ]);

    return {
      question: `What is the Urdu word for "${noun.meaning_en}"?`,
      answerOptions: options,
      hint: `Romanization: ${noun.roman_scholarly}`,
      nounQuestionType: "meaning_to_urdu",
    };
  }

  private generateUrduToMeaning(noun: Noun, allNouns: Noun[]): QuizQuestion {
    const distractors = shuffleArray(
      allNouns.filter((n) => n.rank !== noun.rank).slice(0, 3)
    );

    const options = shuffleArray([
      { text: noun.meaning_en, isCorrect: true, rationale: `"${noun.noun_urdu}" means "${noun.meaning_en}".` },
      ...distractors.map((n) => ({
        text: n.meaning_en,
        isCorrect: false,
        rationale: "",
      })),
    ]);

    return {
      question: `What does "${noun.noun_urdu}" mean?`,
      answerOptions: options,
      hint: `Romanization: ${noun.roman_scholarly}`,
      nounQuestionType: "urdu_to_meaning",
    };
  }

  private generateGenderQuestion(noun: Noun, allNouns: Noun[]): QuizQuestion {
    const distractors = shuffleArray(
      allNouns.filter((n) => n.rank !== noun.rank && n.gender !== noun.gender).slice(0, 1)
    );

    const correctGender = noun.gender === "M" ? "Masculine (مذكر)" : "Feminine (مؤنث)";
    const wrongGender = noun.gender === "M" ? "Feminine (مؤنث)" : "Masculine (مذكر)";
    const wrongGender2 = distractors[0]?.gender === "M" ? "Feminine (مؤنث)" : "Masculine (مذكر)";

    const options = shuffleArray([
      { text: correctGender, isCorrect: true, rationale: `"${noun.noun_urdu}" is ${noun.gender === "M" ? "masculine" : "feminine"}.` },
      { text: wrongGender, isCorrect: false, rationale: "" },
      { text: wrongGender2, isCorrect: false, rationale: "" },
      { text: "Neuter (محايد)", isCorrect: false, rationale: "" },
    ]);

    return {
      question: `What is the gender of "${noun.noun_urdu}"?`,
      answerOptions: options,
      hint: `Meaning: ${noun.meaning_en}`,
      nounQuestionType: "gender",
    };
  }

  private generatePluralizationQuestion(noun: Noun, allNouns: Noun[]): QuizQuestion {
    const distractors = shuffleArray(
      allNouns.filter((n) => n.rank !== noun.rank).slice(0, 3)
    );

    if (noun.plural === null) {
      const options = shuffleArray([
        { text: "No plural form (mass/countable noun)", isCorrect: true, rationale: `"${noun.noun_urdu}" is a mass noun or already represents a collective concept.` },
        { text: "Same as singular (invariant)", isCorrect: false, rationale: "" },
        { text: "Arabic broken plural", isCorrect: false, rationale: "" },
        { text: "Urdu feminine plural with ائیں", isCorrect: false, rationale: "" },
      ]);

      return {
        question: `What is the plural of "${noun.singular}"?`,
        answerOptions: options,
        hint: `This noun has no plural in the dataset.`,
        nounQuestionType: "pluralization",
      };
    }

    const options = shuffleArray([
      { text: noun.plural, isCorrect: true, rationale: `The plural of "${noun.singular}" is "${noun.plural}".` },
      ...distractors.map((n) => ({
        text: n.plural || "No plural form",
        isCorrect: false,
        rationale: "",
      })),
    ]);

    return {
      question: `What is the plural of "${noun.singular}"?`,
      answerOptions: options,
      hint: `Singular: ${noun.singular}`,
      nounQuestionType: "pluralization",
    };
  }

  private generateClozeQuestion(noun: Noun, allNouns: Noun[]): QuizQuestion {
    if (!noun.example) {
      return this.generatePluralizationQuestion(noun, allNouns);
    }

    const clozeSentence = noun.example.urdu.replace(noun.noun_urdu, "_______");
    const distractors = shuffleArray(
      allNouns.filter((n) => n.rank !== noun.rank && n.example).slice(0, 3)
    );

    const options = shuffleArray([
      { text: noun.noun_urdu, isCorrect: true, rationale: `The correct word is "${noun.noun_urdu}".` },
      ...distractors.map((n) => ({
        text: n.noun_urdu,
        isCorrect: false,
        rationale: "",
      })),
    ]);

    return {
      question: `Complete the sentence:\n"${clozeSentence}"`,
      answerOptions: options,
      hint: `English: ${noun.example.english}`,
      nounQuestionType: "cloze",
    };
  }

  private generateLinguisticsQuestion(noun: Noun, allNouns: Noun[]): QuizQuestion {
    if (!noun.note) {
      return this.generateGenderQuestion(noun, allNouns);
    }

    const note = noun.note;
    let question: string;
    let correctAnswer: string;
    let options: { text: string; isCorrect: boolean; rationale: string }[];

    if (note.includes("Arabic") && note.includes("plural")) {
      question = `The word "${noun.noun_urdu}" has a note about Arabic plurals. What type of plural does it use?`;
      const optionsPool = [
        "Arabic broken plural (جمعہ من broken)",
        "Arabic '-āt' suffix plural",
        "Urdu invariant plural",
        "No plural (singular only)",
      ];
      options = shuffleArray([
        { text: optionsPool[0], isCorrect: note.includes("broken"), rationale: "" },
        { text: optionsPool[1], isCorrect: note.includes("-āt") || note.includes("'āt"), rationale: "" },
        { text: optionsPool[2], isCorrect: note.includes("invariant") || note.includes("used as"), rationale: "" },
        { text: optionsPool[3], isCorrect: false, rationale: "" },
      ]);
      const correctOpt = options.find((o) => o.isCorrect);
      correctAnswer = correctOpt?.text || "";
      if (correctAnswer) {
        options = options.map((o) => ({ ...o, isCorrect: o.text === correctAnswer }));
      }
    } else if (note.includes("loanword") || note.includes("Loanword")) {
      question = `The word "${noun.noun_urdu}" is a loanword. What is its origin language?`;
      const originMatch = note.match(/(English|Persian|Arabic|Portuguese|Hindi|Turkish)/i);
      const correctOrigin = originMatch ? originMatch[1] : "English";
      const otherOrigins = ["English", "Persian", "Arabic", "Portuguese", "Hindi", "Turkish"].filter(
        (o) => o.toLowerCase() !== correctOrigin.toLowerCase()
      );
      options = shuffleArray([
        { text: correctOrigin, isCorrect: true, rationale: `The word comes from ${correctOrigin}.` },
        ...otherOrigins.slice(0, 3).map((o) => ({ text: o, isCorrect: false, rationale: "" })),
      ]);
    } else if (note.includes("gender") || note.includes("feminine") || note.includes("masculine")) {
      question = `Regarding "${noun.noun_urdu}", which statement is correct based on its note?`;
      const optionsPool = [
        note,
        "This is a standard masculine noun.",
        "This is a standard feminine noun.",
        "The gender is determined by the ending.",
      ];
      options = shuffleArray([
        { text: optionsPool[0], isCorrect: true, rationale: "This matches the note." },
        { text: optionsPool[1], isCorrect: false, rationale: "" },
        { text: optionsPool[2], isCorrect: false, rationale: "" },
        { text: optionsPool[3], isCorrect: false, rationale: "" },
      ]);
    } else if (note.includes("Plural") || note.includes("plural")) {
      question = `What plural rule applies to "${noun.noun_urdu}"?`;
      const optionsPool = [
        note,
        "Standard Urdu plural with ائیں or یں",
        "Arabic broken plural",
        "Invariant (same as singular)",
      ];
      options = shuffleArray([
        { text: optionsPool[0], isCorrect: true, rationale: "This matches the note." },
        { text: optionsPool[1], isCorrect: false, rationale: "" },
        { text: optionsPool[2], isCorrect: false, rationale: "" },
        { text: optionsPool[3], isCorrect: false, rationale: "" },
      ]);
    } else {
      question = `What does the note for "${noun.noun_urdu}" say?`;
      const optionsPool = [
        noun.note || "No special note.",
        "This is a common everyday noun.",
        "This noun has an irregular form.",
        "This word is used in formal contexts only.",
      ];
      options = shuffleArray([
        { text: optionsPool[0], isCorrect: true, rationale: "This matches the note." },
        { text: optionsPool[1], isCorrect: false, rationale: "" },
        { text: optionsPool[2], isCorrect: false, rationale: "" },
        { text: optionsPool[3], isCorrect: false, rationale: "" },
      ]);
    }

    return {
      question,
      answerOptions: options,
      hint: `Romanization: ${noun.roman_scholarly}`,
      nounQuestionType: "linguistics",
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