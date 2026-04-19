export interface AnswerOption {
  text: string;
  isCorrect: boolean;
  rationale: string;
}

export type NounQuestionType = 
  | "meaning_to_urdu"   // Give meaning_en → ask noun_urdu
  | "urdu_to_meaning"   // Give noun_urdu → ask meaning_en
  | "gender"            // M or F
  | "pluralization"     // singular → plural (or explain null)
  | "cloze"             // Fill-in-the-blank from example
  | "linguistics";      // Note-based trivia

export interface QuizQuestion {
  question: string;
  answerOptions: AnswerOption[];
  hint?: string;
  nounQuestionType?: NounQuestionType;
}