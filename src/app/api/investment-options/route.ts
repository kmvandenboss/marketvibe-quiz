import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getInvestmentOptions, logAnalyticsEvent } from '@/db/queries';
import { findMatchingInvestments } from '@/utils/quiz-utils';
import type { InvestmentOption } from '@/types/quiz';

// Validate the score object structure
const ScoreSchema = z.record(z.string(), z.number());

const RequestSchema = z.object({
  score: ScoreSchema,
  maxResults: z.number().min(1).max(10).optional().default(3),
  quizId: z.string()
});

export async function POST(request: NextRequest) {
  let parsedBody: z.infer<typeof RequestSchema> | null = null;

  try {
    const body = await request.json();
    
    const validationResult = RequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    parsedBody = validationResult.data;
    const { score, maxResults, quizId } = parsedBody;

    // Fetch investment options for this quiz from database
    const dbOptions = await getInvestmentOptions(quizId);

    // Transform the database results to match InvestmentOption type
    const transformedOptions: InvestmentOption[] = dbOptions.map(option => ({
      id: option.id,
      title: option.title,
      description: option.description,
      link: option.link,
      tags: option.tags,
      priority: option.priority,
      logoUrl: option.logo_url,
      companyName: option.company_name,
      returnsText: option.returns_text,
      minimumInvestmentText: option.minimum_investment_text,
      investmentType: option.investment_type,
      keyFeatures: option.key_features as string[],
      quizTags: option.quiz_tags as Record<string, unknown>
    }));

    // Find matching investments using our utility function
    const matchedOptions = findMatchingInvestments(score, transformedOptions, maxResults);

    // Log analytics event for recommendations generation
    await logAnalyticsEvent({
      eventType: 'RECOMMENDATIONS_GENERATED',
      quizId,
      data: {
        scoreCategories: Object.keys(score),
        recommendationCount: matchedOptions.length,
        userAgent: request.headers.get('user-agent'),
      }
    });

    return NextResponse.json({
      success: true,
      options: matchedOptions
    });

  } catch (error) {
    console.error('Error fetching investment options:', error);
    
    try {
      // Log error event
      await logAnalyticsEvent({
        eventType: 'RECOMMENDATIONS_ERROR',
        quizId: parsedBody?.quizId ?? 'unknown',
        data: {
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    } catch (logError) {
      console.error('Error logging analytics:', logError);
    }

    return NextResponse.json(
      { error: 'Failed to fetch investment options' },
      { status: 500 }
    );
  }
}
