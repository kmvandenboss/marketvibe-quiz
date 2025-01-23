import { eq, desc } from 'drizzle-orm';
import { db } from './index';
import { questions, leads, investmentOptions, analyticsEvents } from './schema';

export async function getQuizQuestions() {
  try {
    const allQuestions = await db.select()
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
    const options = await db.select()
      .from(investmentOptions)
      .orderBy(investmentOptions.priority);
    
    // Ensure tags are properly typed as string[]
    return options.map(option => ({
      ...option,
      tags: option.tags as string[]
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
    
    await db.insert(leads).values({
      id: leadId,
      email,
      name,
      responses,
      score,
      isAccredited,
      clickedLinks: [],
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
    // Get current lead data with explicit type casting
    const lead = await db.select({
      id: leads.id,
      clickedLinks: leads.clickedLinks
    })
    .from(leads)
    .where(eq(leads.id, leadId))
    .limit(1);

    if (!lead.length) {
      throw new Error(`Lead not found with ID: ${leadId}`);
    }

    // Ensure clickedLinks is always an array
    const currentLinks = Array.isArray(lead[0].clickedLinks) 
      ? lead[0].clickedLinks as string[]
      : [];
    
    // Validate click limit
    if (currentLinks.length >= 3) {
      console.log(`Click limit reached for lead ${leadId}`);
      return false;
    }

    // Check if link is already tracked
    if (currentLinks.includes(link)) {
      console.log(`Link ${link} already tracked for lead ${leadId}`);
      return false;
    }

    // Update with new link
    const updatedLinks = [...currentLinks, link];
    await db.update(leads)
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
    const leadsList = await db.select().from(leads);
    
    // Calculate metrics
    const totalLeads = leadsList.length;
    const accreditedLeads = leadsList.filter(lead => lead.isAccredited).length;
    const conversionRate = totalLeads > 0 ? (accreditedLeads / totalLeads) * 100 : 0;
    
    // Get leads with link clicks
    const leadsWithClicks = leadsList.filter(lead => 
      Array.isArray(lead.clickedLinks) && lead.clickedLinks.length > 0
    ).length;

    return {
      totalLeads,
      accreditedLeads,
      conversionRate: Number(conversionRate.toFixed(2)),
      leadsWithClicks,
      clickThroughRate: totalLeads > 0 ? (leadsWithClicks / totalLeads) * 100 : 0
    };
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    throw new Error('Failed to fetch dashboard metrics');
  }
}

export async function getLeadsList() {
  try {
    const leadsList = await db.select()
      .from(leads)
      .orderBy(desc(leads.createdAt));

    return leadsList.map((lead) => ({
      id: lead.id,
      email: lead.email,
      name: lead.name || '',
      isAccredited: lead.isAccredited || false,
      score: lead.score as Record<string, number>,
      clickedLinks: Array.isArray(lead.clickedLinks) ? lead.clickedLinks as string[] : [],
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
  data,
  userAgent,
  ipAddress,
  sessionId,
}: {
  eventType: string;
  leadId?: string;
  questionId?: string;
  data?: Record<string, any>;
  userAgent?: string;
  ipAddress?: string;
  sessionId?: string;
}) {
  try {
    await db.insert(analyticsEvents).values({
      eventType,
      leadId,
      questionId,
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