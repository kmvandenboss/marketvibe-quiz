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
  logoUrl: string;
  companyName: string;
  returnsText: string;
  minimumInvestmentText: string;
  investmentType: string;
  keyFeatures: string[];
  quizTags: Record<string, unknown>;
}

export interface QuizState {
  currentQuestionIndex: number;
  answers: Record<string, string>;
  isComplete: boolean;
  email?: string;
}

export interface PersonalityResult {
  type: string;
  title: string;
  description: string;
  characteristics: string[];
  imageUrl?: string;
}

export interface QuizResultsConfig {
  layout: 'standard' | 'personality';
  personalityResults?: PersonalityResult[];
}

export interface PersonalityTypeResult {
  personalityResult: PersonalityResult;
  resultsConfig: QuizResultsConfig;
}

export interface QuizResponse {
  email: string;
  responses: Record<string, string>;
  score: Record<string, number>;
  clickedLinks: string[];
  personalityType?: string;
  resultsConfig?: QuizResultsConfig;
}
