export interface NounExample {
  urdu: string;
  english: string;
}

export interface Noun {
  rank: number;
  noun_urdu: string;
  gender: "M" | "F";
  singular: string;
  plural: string;
  roman_scholarly: string;
  meaning_en: string;
  note?: string;
  example?: NounExample;
}