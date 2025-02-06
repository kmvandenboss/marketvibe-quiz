// /src/types/dashboard.ts
interface ClickedLink {
  investmentName: string;
  clickedAt: string;
  url: string;
}

export interface Quiz {
  id: string;
  slug: string;
  title: string;
  description?: string;
  active: boolean;
}

export interface QuizOverviewMetrics {
  quizId: string;
  quizTitle: string;
  totalLeads: number;
  completionRate: number;
  lastSubmission: string | null;
}

export interface Lead {
  id: string;
  quizId: string;
  email: string;
  name: string;
  isAccredited: boolean;
  score: Record<string, number>;
  responses: Record<string, string>;
  clickedLinks: ClickedLink[];
  createdAt: string | null;
}

export interface DashboardMetrics {
  // Existing metrics
  quizId: string;
  totalLeads: number;
  accreditedLeads: number;
  conversionRate: number;
  leadsWithClicks: number;
  clickThroughRate: number;

  // New funnel metrics
  quizStarts: number;
  questionAnswers: number[];  // Array of counts for each question
  emailSubmissions: number;
  quizCompletionRate: number;
}
