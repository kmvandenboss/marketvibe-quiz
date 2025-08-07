import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { investment_options } from '@/db/schema';
import { inArray } from 'drizzle-orm';
import type { InvestmentOption } from '@/types/quiz';

// Investment option IDs to randomly select from
const INVESTMENT_IDS = [
  '6c16c0d2-c25d-4a0d-95ef-c9cbca6c8e06',
  '7b2638b0-c124-4915-971b-a9d8244cdd09',
  '89e4b0d2-4ce5-4f7c-923e-6c951c75e65e',
  'b6526647-d9ef-43c2-8d8e-f80d6738f4f8'
];

// Function to randomly select 3 options from 4
function selectRandomOptions<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export async function GET(request: NextRequest) {
  try {
    // Fetch all specified investment options from database
    const dbOptions = await db()
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
      .where(inArray(investment_options.id, INVESTMENT_IDS));

    if (dbOptions.length === 0) {
      return NextResponse.json(
        { error: 'No investment options found' },
        { status: 404 }
      );
    }

    // Transform database results to match InvestmentOption type
    const transformedOptions: InvestmentOption[] = dbOptions.map(option => ({
      id: option.id,
      title: option.title,
      description: option.description,
      link: option.link,
      tags: option.tags as string[],
      priority: option.priority,
      logoUrl: option.logo_url,
      companyName: option.company_name,
      returnsText: option.returns_text,
      minimumInvestmentText: option.minimum_investment_text,
      investmentType: option.investment_type,
      keyFeatures: option.key_features as string[],
      quizTags: option.quiz_tags as Record<string, unknown>
    }));

    // Randomly select 3 options
    const selectedOptions = selectRandomOptions(transformedOptions, 3);

    // Generate a session ID for tracking
    const sessionId = crypto.randomUUID();

    // Create a unique spotlight "quiz" ID for analytics
    const SPOTLIGHT_QUIZ_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
    
    // Log the spotlight view event
    try {
      const { logAnalyticsEvent } = await import('@/db/queries');
      await logAnalyticsEvent({
        eventType: 'SPOTLIGHT_VIEW',
        quizId: SPOTLIGHT_QUIZ_ID,
        sessionId,
        data: {
          selectedOptionIds: selectedOptions.map(opt => opt.id),
          totalAvailableOptions: transformedOptions.length,
          userAgent: request.headers.get('user-agent'),
          page: 'investment-spotlight'
        }
      });
    } catch (analyticsError) {
      console.warn('Analytics logging failed:', analyticsError);
      // Continue execution even if analytics fails
    }

    return NextResponse.json({
      success: true,
      sessionId,
      selectedOptions,
      totalAvailable: transformedOptions.length
    });

  } catch (error) {
    console.error('Error fetching investment spotlight options:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch investment options' },
      { status: 500 }
    );
  }
}
