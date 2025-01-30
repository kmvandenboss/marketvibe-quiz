import { eq, desc } from 'drizzle-orm';
import { db } from './index';
import { questions, leads, investmentOptions, analyticsEvents } from './schema';

export async function getQuizQuestions() {
  try {
    const allQuestions = await db().select()
      .from(questions)
      .orderBy(questions.order);
    return allQuestions;
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    throw new Error('Failed to fetch quiz questions');
  }
}

export async function getInvestmentOptions() {
  try {
    const options = await db().select()
      .from(investmentOptions)
      .orderBy(investmentOptions.priority);
    
    // Ensure tags are properly typed as string[]
    return options.map(option => ({
      ...option,
      tags: option.tags as string[],
      key_features: option.key_features as string[]
    }));
  } catch (error) {
    console.error('Error fetching investment options:', error);
    throw new Error('Failed to fetch investment options');
  }
}

export async function submitQuizResponse({
  email,
  name,
  responses,
  score,
  isAccredited = false,
}: {
  email: string;
  name?: string;
  responses: Record<string, string>;
  score: Record<string, number>;
  isAccredited?: boolean;
}) {
  try {
    // Insert quiz response
    const leadId = crypto.randomUUID();
    const now = new Date().toISOString();
    
    await db().insert(leads).values({
      id: leadId,
      email,
      name,
      responses,
      score,
      isAccredited,
      clickedLinks: [] as Array<{ url: string; timestamp: string }>,
      createdAt: now,
      updatedAt: now
    });

    return leadId;
  } catch (error) {
    console.error('Error submitting quiz response:', error);
    throw new Error('Failed to submit quiz response');
  }
}

export async function trackLinkClick({
  leadId,
  link,
}: {
  leadId: string;
  link: string;
}) {
  try {
    const lead = await db().select({
      id: leads.id,
      clickedLinks: leads.clickedLinks
    })
    .from(leads)
    .where(eq(leads.id, leadId))
    .limit(1);

    if (!lead.length) {
      throw new Error(`Lead not found with ID: ${leadId}`);
    }

    const currentLinks = Array.isArray(lead[0].clickedLinks) 
      ? (lead[0].clickedLinks as Array<{ url: string; timestamp: string }>)
      : [];
    
    if (currentLinks.length >= 3) {
      console.log(`Click limit reached for lead ${leadId}`);
      return false;
    }

    if (currentLinks.some(click => click.url === link)) {
      console.log(`Link ${link} already tracked for lead ${leadId}`);
      return false;
    }

    const updatedLinks = [
      ...currentLinks,
      {
        url: link,
        timestamp: new Date().toISOString()
      }
    ];
    await db().update(leads)
      .set({ 
        clickedLinks: updatedLinks,
        updatedAt: new Date().toISOString()
      })
      .where(eq(leads.id, leadId));

    console.log(`Successfully tracked link ${link} for lead ${leadId}`);
    return true;

  } catch (error) {
    console.error('Error tracking link click:', error);
    throw new Error(
      error instanceof Error 
        ? `Failed to track link click: ${error.message}`
        : 'Failed to track link click'
    );
  }
}

export async function getDashboardMetrics() {
  try {
    const [leadsList, analyticsData] = await Promise.all([
      db().select().from(leads),
      db().select().from(analyticsEvents)
    ]);
    
    // Basic metrics
    const totalLeads = leadsList.length;
    const accreditedLeads = leadsList.filter(lead => lead.isAccredited).length;
    const conversionRate = totalLeads > 0 ? (accreditedLeads / totalLeads) * 100 : 0;
    const leadsWithClicks = leadsList.filter(lead => 
      Array.isArray(lead.clickedLinks) && lead.clickedLinks.length > 0
    ).length;

    // Funnel metrics
    const quizStarts = analyticsData.filter(event => event.eventType === 'QUIZ_START').length;
    const questionAnswers = new Array(6).fill(0); // Array for each question
    analyticsData
      .filter(event => event.eventType === 'QUESTION_ANSWERED')
      .forEach(event => {
        if (event.questionIndex !== null) {
          questionAnswers[event.questionIndex] = questionAnswers[event.questionIndex] + 1;
        }
      });

    const emailSubmissions = analyticsData.filter(event => event.eventType === 'QUIZ_SUBMISSION').length;

    return {
      totalLeads,
      accreditedLeads,
      conversionRate: Number(conversionRate.toFixed(2)),
      leadsWithClicks,
      clickThroughRate: totalLeads > 0 ? (leadsWithClicks / totalLeads) * 100 : 0,
      // Funnel metrics
      quizStarts,
      questionAnswers,
      emailSubmissions,
      quizCompletionRate: quizStarts > 0 ? (emailSubmissions / quizStarts) * 100 : 0
    };
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    throw new Error('Failed to fetch dashboard metrics');
  }
}

export async function getLeadsList() {
  try {
    // First get all investment options for lookup
    const options = await db().select().from(investmentOptions);
    const optionsMap = new Map(options.map(opt => [opt.link, opt]));

    const leadsList = await db().select()
      .from(leads)
      .orderBy(desc(leads.createdAt))
      .limit(100);

    if (!leadsList || !Array.isArray(leadsList)) {
      throw new Error('Invalid response from database');
    }

    return leadsList.map((lead) => ({
      id: lead.id,
      email: lead.email,
      name: lead.name || '',
      isAccredited: lead.isAccredited || false,
      score: lead.score as Record<string, number>,
      responses: lead.responses as Record<string, string>,
      clickedLinks: Array.isArray(lead.clickedLinks) 
        ? (lead.clickedLinks as string[] | Array<{ url: string; timestamp: string }>).map(click => {
            // Handle old format (string) vs new format (object)
            const url = typeof click === 'string' ? click : click.url;
            const timestamp = typeof click === 'string' ? null : click.timestamp;
            return {
              url,
              clickedAt: timestamp,
              investmentName: optionsMap.get(url)?.title || 'Unknown Investment'
            };
          })
        : [],
      createdAt: lead.createdAt
    }));
  } catch (error) {
    console.error('Error fetching leads list:', error);
    throw new Error('Failed to fetch leads list');
  }
}

export async function logAnalyticsEvent({
  eventType,
  leadId,
  questionId,
  questionIndex,
  data,
  userAgent,
  ipAddress,
  sessionId,
}: {
  eventType: string;
  leadId?: string;
  questionId?: string;
  questionIndex?: number;
  data?: Record<string, any>;
  userAgent?: string;
  ipAddress?: string;
  sessionId?: string;
}) {
  try {
    await db().insert(analyticsEvents).values({
      eventType,
      leadId,
      questionId,
      questionIndex,
      data,
      userAgent,
      ipAddress,
      sessionId,
      timestamp: new Date()  // Changed from toISOString() to just new Date()
    });
  } catch (error) {
    console.error('Error logging analytics event:', error);
    throw new Error('Failed to log analytics event');
  }
}
