// /src/app/api/investment-options/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getInvestmentOptions, logAnalyticsEvent } from '@/db/queries';
import { findMatchingInvestments } from '@/utils/quiz-utils';

// Validate the score object structure
const ScoreSchema = z.record(z.string(), z.number());

const RequestSchema = z.object({
  score: ScoreSchema,
  maxResults: z.number().min(1).max(10).optional().default(3)
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validationResult = RequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { score, maxResults } = validationResult.data;

    // Fetch all investment options from database
    const allOptions = await getInvestmentOptions();

    // Find matching investments using our utility function
    const matchedOptions = findMatchingInvestments(score, allOptions, maxResults);

    // Log analytics event for recommendations generation
    await logAnalyticsEvent({
      eventType: 'RECOMMENDATIONS_GENERATED',
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
    
    // Log error event
    await logAnalyticsEvent({
      eventType: 'RECOMMENDATIONS_ERROR',
      data: {
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    });

    return NextResponse.json(
      { error: 'Failed to fetch investment options' },
      { status: 500 }
    );
  }
}