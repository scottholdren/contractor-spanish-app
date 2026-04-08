export type Category = "tools" | "materials" | "surfaces" | "actions";

export interface RegionalVariant {
  term: string;
  regions: string[];
}

export interface Term {
  id: string;
  category: Category;
  en: string;
  es: string;
  variants: RegionalVariant[];
  photo: string;
  audioEs: string;
  audioEn: string;
  difficulty: number;
  notes?: string;
}

export interface TermsData {
  terms: Term[];
}

export type Box = 1 | 2 | 3;

export interface CardProgress {
  termId: string;
  box: Box;
  nextReview: string;
  correctStreak: number;
}

export type Direction = "en-to-es" | "es-to-en";

export type Tab = "browse" | "learn" | "progress";
