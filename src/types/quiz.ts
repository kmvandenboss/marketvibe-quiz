// /src/types/quiz.ts
export interface QuestionOption {
  id: string;
  text: string;
  tags: string[];
  weight: number;
}

export interface Question {
  id: string;
  text: string;
  type: string;
  order: number;
  options: QuestionOption[];
  created_at?: string;
  updated_at?: string;
}

export interface InvestmentOption {
  id: string;
  title: string;
  description: string;
  link: string;
  tags: string[];
  priority: number;
}

export interface QuizState {
  currentQuestionIndex: number;
  answers: Record<string, string>;
  isComplete: boolean;
  email?: string;
}

export interface QuizResponse {
  email: string;
  responses: Record<string, string>;
  score: Record<string, number>;
  clickedLinks: string[];
}