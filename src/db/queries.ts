import { eq, desc, sql, and, inArray } from 'drizzle-orm';
import { db } from './index';
import { questions, leads, investmentOptions, analyticsEvents, quizzes, question_options } from './schema';
import type { QuizOverviewMetrics } from '@/types/dashboard';
import type { QuizResultsConfig, PersonalityTypeResult } from '@/types/quiz';

export async function getQuizById(quizId: string) {
  try {
    const quiz = await db().select()
      .from(quizzes)
      .where(eq(quizzes.id, quizId))
      .limit(1);

    if (!quiz.length) {
      throw new Error('Quiz not found');
    }

    // Transform the quiz data to ensure proper typing
    return {
      id: quiz[0].id,
      slug: quiz[0].slug,
      title: quiz[0].title,
      description: quiz[0].description,
      heading_text: quiz[0].heading_text,
      results_layout: quiz[0].results_layout,
      personality_results: quiz[0].personality_results ? JSON.parse(JSON.stringify(quiz[0].personality_results)) : undefined
    };
  } catch (error) {
    console.error('Error fetching quiz:', error);
    throw new Error('Failed to fetch quiz');
  }
}

export async function getQuizQuestions(quizId: string) {
  try {
    const allQuestions = await db().select()
      .from(questions)
      .where(eq(questions.quizId, quizId))
      .orderBy(questions.position);
    return allQuestions;
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    throw new Error('Failed to fetch quiz questions');
  }
}

export async function getInvestmentOptions(quizId?: string) {
  try {
    if (!quizId) {
      const options = await db().select().from(investmentOptions).orderBy(investmentOptions.priority);
      return options.map(option => ({
        ...option,
        tags: option.tags as string[],
        keyFeatures: option.keyFeatures as string[]
      }));
    }

    // First get the quiz to get its slug
    const quiz = await db().select({
      slug: quizzes.slug
    })
    .from(quizzes)
    .where(eq(quizzes.id, quizId))
    .limit(1);

    if (!quiz.length) {
      throw new Error(`Quiz not found with ID: ${quizId}`);
    }

    const quizSlug = quiz[0].slug;

    // Then get investment options where quizTags contains the quiz slug
    const options = await db().select()
      .from(investmentOptions)
      .where(sql`${investmentOptions.quizTags} ? ${quizSlug}`)
      .orderBy(investmentOptions.priority);
    
    // Ensure tags are properly typed as string[]
    return options.map(option => ({
      ...option,
      tags: option.tags as string[],
      keyFeatures: option.keyFeatures as string[]
    }));
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
    const quizData = {
      results_layout: quiz[0].results_layout,
      personality_results: quiz[0].personality_results ? JSON.parse(JSON.stringify(quiz[0].personality_results)) : undefined
    };

    if (!quiz.length) {
      return null;
    }
    
    if (quizData.results_layout !== 'personality') {
      return null;
    }
    
    if (!quizData.personality_results) {
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
    const personalityResults = quizData.personality_results as Array<{
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
      quizId,
      email,
      name,
      responses,
      score,
      isAccredited,
      personalityType,
      resultsConfig,
      clickedLinks: [],
      createdAt: new Date(),
      updatedAt: new Date()
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
    // Removed non-essential logging
      return false;
    }

    if (currentLinks.some(click => click.url === link)) {
    // Removed non-essential logging
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
        updatedAt: new Date()
      })
      .where(eq(leads.id, leadId));

    // Removed non-essential logging
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
        .where(eq(leads.quizId, quizId)),
      db().select()
        .from(analyticsEvents)
        .where(eq(analyticsEvents.quizId, quizId))
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
    const options = await db().select().from(investmentOptions);
    const optionsMap = new Map(options.map(opt => [opt.link, opt]));

    const leadsList = await db().select()
      .from(leads)
      .where(eq(leads.quizId, quizId))
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
        ? (lead.clickedLinks as Array<{ url: string; timestamp: string }>).map(click => {
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
    await db().insert(analyticsEvents).values({
      eventType,
      quizId,
      leadId,
      questionId,
      questionIndex,
      data,
      userAgent,
      ipAddress,
      sessionId,
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
    .orderBy(quizzes.createdAt);

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
      .where(eq(leads.quizId, quizId));

    const quizStartEvents = await db().select()
      .from(analyticsEvents)
      .where(
        and(
          eq(analyticsEvents.quizId, quizId),
          eq(analyticsEvents.eventType, 'QUIZ_START')
        )
      );

    const totalLeads = leadsList.length;
    const completionRate = quizStartEvents.length > 0
      ? (totalLeads / quizStartEvents.length) * 100
      : 0;

    // Find the most recent submission, safely handling null createdAt values
    const lastSubmission = leadsList.length > 0
      ? leadsList.reduce((latest, current) => {
          if (!latest.createdAt) return current;
          if (!current.createdAt) return latest;
          return latest.createdAt > current.createdAt ? latest : current;
        }).createdAt
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
