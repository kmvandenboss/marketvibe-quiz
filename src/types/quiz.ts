// src/types/quiz.ts

export type QuestionType = 'single' | 'multiple';

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options: QuestionOption[];
}

export interface QuestionOption {
  id: string;
  text: string;
  tags: string[];
  weight: number;
}

export interface QuizResponse {
  id: string;
  email: string;
  name?: string;
  responses: UserResponse[];
  clickedLinks: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserResponse {
  questionId: string;
  selectedOptionIds: string[];
}

export interface InvestmentOption {
  id: string;
  title: string;
  description: string;
  link: string;
  tags: string[];
  priority: number;
}

export interface QuizResults {
  recommendedInvestments: InvestmentOption[];
  score: {
    [key: string]: number;  // Tag-based scores
  };
}

// Quiz Configuration
export const QUIZ_CONFIG = {
  totalQuestions: 6,
  minOptionsPerQuestion: 3,
  maxOptionsPerQuestion: 4,
  maxClickTracking: 3,
} as const;