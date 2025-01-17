// src/lib/analytics.ts
import { randomUUID } from 'crypto'; // Built into Node.js, no need for extra dependency

export type AnalyticsEventType = 
  | 'QUIZ_START'
  | 'QUESTION_VIEW'
  | 'QUESTION_ANSWER'
  | 'EMAIL_SUBMIT'
  | 'QUIZ_COMPLETE'
  | 'LINK_CLICK'
  | 'RESULTS_VIEW'
  | 'DROP_OFF';

interface AnalyticsEvent {
  eventType: AnalyticsEventType;
  leadId?: string;
  questionId?: string;
  data?: Record<string, any>;
}

class AnalyticsService {
  private sessionId: string;

  constructor() {
    this.sessionId = randomUUID();
  }

  async trackEvent({
    eventType,
    leadId,
    questionId,
    data
  }: AnalyticsEvent): Promise<void> {
    try {
      const response = await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventType,
          leadId,
          questionId,
          data,
          sessionId: this.sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to track analytics event');
      }
    } catch (error) {
      console.error('Analytics tracking error:', error);
      // Don't throw - we don't want analytics to break the app flow
    }
  }

  startQuiz(): Promise<void> {
    return this.trackEvent({ eventType: 'QUIZ_START' });
  }

  viewQuestion(questionId: string, leadId?: string): Promise<void> {
    return this.trackEvent({ 
      eventType: 'QUESTION_VIEW', 
      questionId, 
      leadId,
    });
  }

  answerQuestion(
    questionId: string, 
    leadId: string, 
    answers: string[]
  ): Promise<void> {
    return this.trackEvent({
      eventType: 'QUESTION_ANSWER',
      questionId,
      leadId,
      data: { answers },
    });
  }

  submitEmail(leadId: string, email: string): Promise<void> {
    return this.trackEvent({
      eventType: 'EMAIL_SUBMIT',
      leadId,
      data: { email },
    });
  }

  completeQuiz(leadId: string): Promise<void> {
    return this.trackEvent({
      eventType: 'QUIZ_COMPLETE',
      leadId,
    });
  }

  clickLink(leadId: string, link: string): Promise<void> {
    return this.trackEvent({
      eventType: 'LINK_CLICK',
      leadId,
      data: { link },
    });
  }

  viewResults(leadId: string): Promise<void> {
    return this.trackEvent({
      eventType: 'RESULTS_VIEW',
      leadId,
    });
  }

  recordDropOff(
    step: number, 
    leadId?: string, 
    questionId?: string
  ): Promise<void> {
    return this.trackEvent({
      eventType: 'DROP_OFF',
      leadId,
      questionId,
      data: { step },
    });
  }
}

export const analytics = new AnalyticsService();