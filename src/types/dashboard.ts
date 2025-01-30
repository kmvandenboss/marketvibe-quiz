// /src/types/dashboard.ts
interface ClickedLink {
  investmentName: string;
  clickedAt: string;
  url: string;
}

export interface Lead {
  id: string;
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
