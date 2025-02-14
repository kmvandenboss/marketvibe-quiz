// src/lib/quiz/types.ts
import { z } from 'zod';
import type { 
  Question as BaseQuestion, 
  QuestionOption as BaseQuestionOption,
  InvestmentOption,
  PersonalityResult,
  QuizResultsConfig
} from '../../types/quiz';

export interface Quiz {
    id: string;
    slug: string;
    title: string;
    description?: string;
    headingText: string;
    emailCaptureMessage: string;
    resultsLayout: 'standard' | 'personality';
    personalityResults?: PersonalityResult[];
    active: boolean;
    navigationSettings: {
      allowBack: boolean;
      showProgressBar: boolean;
      showQuestionCount: boolean;
      showStartPrompt?: boolean;
    };
    seoMetadata?: {
      title: string;
      description: string;
      keywords: string[];
    };
}


export type { Question, QuestionOption } from '../../types/quiz';

// Maintain existing InvestmentOption interface
export type { InvestmentOption } from '../../types/quiz';

export interface QuizState {
  currentQuestionIndex: number;
  answers: Record<string, string>;
  isComplete: boolean;
  isLastQuestionAnswered: boolean;
  calculatedScore?: Record<string, number>;
  email?: string;
  leadId?: string;
}

export interface SubmissionState {
  isLoading: boolean;
  error: string | null;
  leadId: string | null;
  investmentOptions: InvestmentOption[];
  matchedOptionsCount: number;
  personalityResult?: PersonalityResult;
  resultsConfig?: QuizResultsConfig;
}

export interface QuizResponse {
  quizId: string;
  answers: Record<string, string>;
  email: string;
  score?: Record<string, number>;
  personalityType?: string;
  clickedLinks?: string[];
}

// Validation Schemas
export const QuizNavigationSettingsSchema = z.object({
  allowBack: z.boolean(),
  showProgressBar: z.boolean(),
  showQuestionCount: z.boolean(),
  showStartPrompt: z.boolean().optional()
});

export const QuizSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  title: z.string(),
  description: z.string().optional(),
  headingText: z.string(),
  emailCaptureMessage: z.string(),
  resultsLayout: z.enum(['standard', 'personality']),
  personalityResults: z.array(z.object({
    type: z.string(),
    title: z.string(),
    description: z.string(),
    characteristics: z.array(z.string()),
    imageUrl: z.string().optional()
  })).optional(),
  active: z.boolean(),
  navigationSettings: QuizNavigationSettingsSchema,
  seoMetadata: z.object({
    title: z.string(),
    description: z.string(),
    keywords: z.array(z.string())
  }).optional()
});

export type QuizNavigationSettings = z.infer<typeof QuizNavigationSettingsSchema>;
export type ValidatedQuiz = z.infer<typeof QuizSchema>;
