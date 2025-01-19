// src/types/analytics.ts

export type AnalyticsEvent = {
    eventType: string;
    leadId?: string;
    questionId?: string;
    data?: Record<string, any>;
    userAgent?: string;
    ipAddress?: string;
    sessionId?: string;
  };