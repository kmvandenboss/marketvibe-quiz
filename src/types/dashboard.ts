// /src/types/dashboard.ts
export interface Lead {
  id: string;
  email: string;
  name: string;
  isAccredited: boolean;
  score: Record<string, number>;
  clickedLinks: string[];
  createdAt: string | null;
}

export interface DashboardMetrics {
  // Existing metrics
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