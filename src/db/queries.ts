import { eq, desc, sql, and, inArray } from 'drizzle-orm';
import { db } from './index';
import { questions, leads, investment_options, analytics_events, quizzes, question_options } from './schema';
import type { QuizOverviewMetrics } from '@/types/dashboard';
import type { QuizResultsConfig, PersonalityTypeResult } from '@/types/quiz';
import type { Quiz } from '@/lib/quiz/types';
import { transformDatabaseResponse } from '@/utils/case-transform';

export async function getQuizById(quizId: string) {
  try {
    const quiz = await db().select()
      .from(quizzes)
      .where(eq(quizzes.id, quizId))
      .limit(1);

    if (!quiz.length) {
      throw new Error('Quiz not found');
    }

    // Transform the quiz data to ensure proper typing and casing
    return transformDatabaseResponse<Quiz>({
      id: quiz[0].id,
      slug: quiz[0].slug,
      title: quiz[0].title,
      description: quiz[0].description,
      heading_text: quiz[0].heading_text,
      results_layout: quiz[0].results_layout,
      personality_results: quiz[0].personality_results ? JSON.parse(JSON.stringify(quiz[0].personality_results)) : undefined
    });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    throw new Error('Failed to fetch quiz');
  }
}

export async function getQuizQuestions(quizId: string) {
  try {
    const allQuestions = await db().select()
      .from(questions)
      .where(eq(questions.quiz_id, quizId))
      .orderBy(questions.position);
    return transformDatabaseResponse(allQuestions);
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    throw new Error('Failed to fetch quiz questions');
  }
}

export async function getInvestmentOptions(quizId?: string) {
  try {
    // First get the quiz to get its slug (even if quizId is not provided)
    // This ensures we always have a quizSlug for filtering
    let quizSlug = null;
    
    if (quizId) {
      const quiz = await db().select({
        slug: quizzes.slug
      })
      .from(quizzes)
      .where(eq(quizzes.id, quizId))
      .limit(1);

      if (!quiz.length) {
        throw new Error(`Quiz not found with ID: ${quizId}`);
      }

      quizSlug = quiz[0].slug;
    }

    // If we have a quizSlug, filter by it
    if (quizSlug) {
      // Get investment options where quiz_tags contains the quiz slug
      const options = await db()
        .select({
          id: investment_options.id,
          title: investment_options.title,
          description: investment_options.description,
          link: investment_options.link,
          tags: investment_options.tags,
          priority: investment_options.priority,
          logo_url: investment_options.logo_url,
          company_name: investment_options.company_name,
          returns_text: investment_options.returns_text,
          minimum_investment_text: investment_options.minimum_investment_text,
          investment_type: investment_options.investment_type,
          key_features: investment_options.key_features,
          quiz_tags: investment_options.quiz_tags
        })
        .from(investment_options)
        .where(sql`${investment_options.quiz_tags} ? ${quizSlug}`)
        .orderBy(investment_options.priority);
      
      console.log(`Filtered investment options for quiz slug: ${quizSlug}, found: ${options.length}`);
      
      return options.map((option: any) => ({
        ...option,
        tags: option.tags as string[],
        keyFeatures: option.key_features as string[],
        quizTags: option.quiz_tags as Record<string, unknown>
      }));
    }
    
    // If no quizSlug or no options found for the quizSlug, return an empty array
    console.log("No quiz slug provided or no matching options found, returning empty array");
    return [];
  } catch (error) {
    console.error('Error fetching investment options:', error);
    throw new Error('Failed to fetch investment options');
  }
}

export async function calculatePersonalityType({
  responses,
  quizId,
}: {
  responses: Record<string, string>;
  quizId: string;
}): Promise<PersonalityTypeResult | null> {
  try {
    // Get the quiz to check if it's a personality quiz and get personality results
    const quiz = await db().select()
      .from(quizzes)
      .where(eq(quizzes.id, quizId))
      .limit(1);

    // Transform the quiz data to ensure proper typing
    const quizData = transformDatabaseResponse<{
      resultsLayout: string;
      personalityResults?: Array<{
        type: string;
        title: string;
        description: string;
        characteristics: string[];
      }>;
    }>({
      results_layout: quiz[0].results_layout,
      personality_results: quiz[0].personality_results ? JSON.parse(JSON.stringify(quiz[0].personality_results)) : undefined
    });

    if (!quiz.length) {
      return null;
    }
    
    if (quizData.resultsLayout !== 'personality') {
      return null;
    }
    
    if (!quizData.personalityResults) {
      return null;
    }

    // Get all selected options with their tags
    const selectedOptionIds = Object.values(responses);
    
    const options = await db().select({
      id: question_options.id,
      tags: question_options.tags
    })
    .from(question_options)
    .where(inArray(question_options.id, selectedOptionIds));

    // Get available personality types
    const personalityResults = quizData.personalityResults as Array<{
      type: string;
      title: string;
      description: string;
      characteristics: string[];
    }>;
    const availableTypes = personalityResults.map(r => r.type.toLowerCase());

    // Count tag frequencies only for tags that match available personality types
    const tagCounts: Record<string, number> = {};
    options.forEach(option => {
      const tags = option.tags as string[];
      if (Array.isArray(tags)) {
        console.log('[Personality] Processing tags for option:', {
          optionId: option.id,
          tags
        });
        tags.forEach(tag => {
          // Only count tags that are valid personality types
          if (availableTypes.includes(tag.toLowerCase())) {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          }
        });
      }
    });

    console.log('[Personality] Tag frequency counts:', tagCounts);

    // Find the most frequent tag from the filtered counts
    let highestCount = 0;
    let dominantTag = '';
    Object.entries(tagCounts).forEach(([tag, count]) => {
      if (count > highestCount) {
        highestCount = count;
        dominantTag = tag;
      }
    });

    console.log('[Personality] Most frequent tag:', {
      tag: dominantTag,
      count: highestCount,
      availableTypes: personalityResults.map(r => r.type)
    });

    const matchedPersonality = personalityResults.find(result => 
      result.type.toLowerCase() === dominantTag.toLowerCase()
    );

    console.log('[Personality] Match result:', {
      matched: !!matchedPersonality,
      matchedType: matchedPersonality?.type
    });

    return matchedPersonality ? {
      personalityResult: matchedPersonality,
      resultsConfig: {
        layout: 'personality',
        personalityResults
      }
    } : null;
  } catch (error) {
    console.error('Error calculating personality type:', error);
    throw new Error('Failed to calculate personality type');
  }
}

export async function submitQuizResponse({
  email,
  name,
  responses,
  score,
  quizId,
  isAccredited = false,
  personalityType,
  resultsConfig,
}: {
  email: string;
  name?: string;
  responses: Record<string, string>;
  score: Record<string, number>;
  quizId: string;
  isAccredited?: boolean;
  personalityType?: string;
  resultsConfig?: QuizResultsConfig;
}) {
  try {
    const leadId = crypto.randomUUID();
    
    await db().insert(leads).values({
      id: leadId,
      quiz_id: quizId,
      email,
      name,
      responses,
      score,
      is_accredited: isAccredited,
      personality_type: personalityType,
      results_config: resultsConfig,
      clicked_links: [],
      created_at: new Date(),
      updated_at: new Date()
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
  requestInfo = false,
}: {
  leadId: string;
  link: string;
  requestInfo?: boolean;
}) {
  try {
    const lead = await db().select({
      id: leads.id,
      clicked_links: leads.clicked_links
    })
    .from(leads)
    .where(eq(leads.id, leadId))
    .limit(1);

    if (!lead.length) {
      throw new Error(`Lead not found with ID: ${leadId}`);
    }

    const currentLinks = Array.isArray(lead[0].clicked_links) 
      ? (lead[0].clicked_links as Array<{ url: string; timestamp: string; requestInfo?: boolean }>)
      : [];
    
    if (currentLinks.length >= 3) {
      return false;
    }

    if (currentLinks.some(click => click.url === link)) {
      return false;
    }

    const updatedLinks = [
      ...currentLinks,
      {
        url: link,
        timestamp: new Date().toISOString(),
        requestInfo: requestInfo || false
      }
    ];

    await db().update(leads)
      .set({ 
        clicked_links: updatedLinks,
        updated_at: new Date()
      })
      .where(eq(leads.id, leadId));

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

export async function getDashboardMetrics(quizId: string) {
  try {
    const [leadsList, analyticsData] = await Promise.all([
      db().select()
        .from(leads)
        .where(eq(leads.quiz_id, quizId)),
      db().select()
        .from(analytics_events)
        .where(eq(analytics_events.quiz_id, quizId))
    ]);
    
    // Basic metrics
    const totalLeads = leadsList.length;
    const accreditedLeads = leadsList.filter(lead => lead.is_accredited).length;
    const conversionRate = totalLeads > 0 ? (accreditedLeads / totalLeads) * 100 : 0;
    const leadsWithClicks = leadsList.filter(lead => 
      Array.isArray(lead.clicked_links) && lead.clicked_links.length > 0
    ).length;

    // Funnel metrics
    const quizStarts = analyticsData.filter(event => event.event_type === 'QUIZ_START').length;
    const questionAnswers = new Array(6).fill(0); // Array for each question
    analyticsData
      .filter(event => event.event_type === 'QUESTION_ANSWERED')
      .forEach(event => {
        if (event.question_index !== null) {
          questionAnswers[event.question_index] = questionAnswers[event.question_index] + 1;
        }
      });

    // Count both old and new email submission event types
    const emailSubmissions = analyticsData.filter(event => 
      ['EMAIL_SUBMISSION', 'EMAIL_SUBMITTED'].includes(event.event_type)
    ).length;

    return {
      totalLeads,
      accreditedLeads,
      conversionRate: Number(conversionRate.toFixed(2)),
      leadsWithClicks,
      clickThroughRate: totalLeads > 0 ? (leadsWithClicks / totalLeads) * 100 : 0,
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

export async function getLeadsList(quizId: string) {
  try {
    // First get all investment options for lookup
    const options = await db()
      .select({
        id: investment_options.id,
        title: investment_options.title,
        link: investment_options.link,
        logo_url: investment_options.logo_url,
        company_name: investment_options.company_name
      })
      .from(investment_options);
    const optionsMap = new Map(options.map(opt => [opt.link, opt]));

    const leadsList = await db().select()
      .from(leads)
      .where(eq(leads.quiz_id, quizId))
      .orderBy(desc(leads.created_at))
      .limit(100);

    if (!leadsList || !Array.isArray(leadsList)) {
      throw new Error('Invalid response from database');
    }

    return leadsList.map((lead) => ({
      id: lead.id,
      email: lead.email,
      name: lead.name || '',
      isAccredited: lead.is_accredited || false,
      score: lead.score as Record<string, number>,
      responses: lead.responses as Record<string, string>,
      clickedLinks: Array.isArray(lead.clicked_links) 
        ? (lead.clicked_links as Array<{ url: string; timestamp: string; requestInfo?: boolean }>).map(click => {
            const url = typeof click === 'string' ? click : click.url;
            const timestamp = typeof click === 'string' ? null : click.timestamp;
            const requestInfo = typeof click === 'object' && 'requestInfo' in click ? click.requestInfo : false;
            return {
              url,
              clickedAt: timestamp,
              investmentName: optionsMap.get(url)?.title || 'Unknown Investment',
              requestInfo
            };
          })
        : [],
      createdAt: lead.created_at
    }));
  } catch (error) {
    console.error('Error fetching leads list:', error);
    throw new Error('Failed to fetch leads list');
  }
}

export async function logAnalyticsEvent({
  eventType,
  quizId,
  leadId,
  questionId,
  questionIndex,
  data,
  userAgent,
  ipAddress,
  sessionId,
}: {
  eventType: string;
  quizId: string;
  leadId?: string;
  questionId?: string;
  questionIndex?: number;
  data?: Record<string, any>;
  userAgent?: string;
  ipAddress?: string;
  sessionId?: string;
}) {
  try {
    await db().insert(analytics_events).values({
      event_type: eventType,
      quiz_id: quizId,
      lead_id: leadId,
      question_id: questionId,
      question_index: questionIndex,
      data,
      user_agent: userAgent,
      ip_address: ipAddress,
      session_id: sessionId,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error logging analytics event:', error);
    throw new Error('Failed to log analytics event');
  }
}

export async function getQuizzesList() {
  try {
    const quizzesList = await db().select({
      id: quizzes.id,
      slug: quizzes.slug,
      title: quizzes.title,
      description: quizzes.description,
      active: quizzes.active,
    })
    .from(quizzes)
    .where(eq(quizzes.active, true))
    .orderBy(quizzes.created_at);

    return quizzesList;
  } catch (error) {
    console.error('Error fetching quizzes list:', error);
    throw new Error('Failed to fetch quizzes list');
  }
}

export async function getQuizOverviewMetrics(quizId: string): Promise<QuizOverviewMetrics> {
  try {
    const quiz = await db().select()
      .from(quizzes)
      .where(eq(quizzes.id, quizId))
      .limit(1);

    if (!quiz.length) {
      throw new Error(`Quiz not found with ID: ${quizId}`);
    }

    const leadsList = await db().select()
      .from(leads)
      .where(eq(leads.quiz_id, quizId));

    const quizStartEvents = await db().select()
      .from(analytics_events)
      .where(
        and(
          eq(analytics_events.quiz_id, quizId),
          eq(analytics_events.event_type, 'QUIZ_START')
        )
      );

    const totalLeads = leadsList.length;
    const completionRate = quizStartEvents.length > 0
      ? (totalLeads / quizStartEvents.length) * 100
      : 0;

    // Find the most recent submission, safely handling null created_at values
    const lastSubmission = leadsList.length > 0
      ? leadsList.reduce((latest, current) => {
          if (!latest.created_at) return current;
          if (!current.created_at) return latest;
          return latest.created_at > current.created_at ? latest : current;
        }).created_at
      : null;

    return {
      quizId,
      quizTitle: quiz[0].title,
      totalLeads,
      completionRate,
      lastSubmission: lastSubmission?.toISOString() || null
    };
  } catch (error) {
    console.error('Error fetching quiz overview metrics:', error);
    throw new Error('Failed to fetch quiz overview metrics');
  }
}
