// src/app/api/results/route.ts
import { NextResponse } from 'next/server';
import { db } from '../../../../db';
import { leads, investmentOptions } from '../../../../db/schema';
import { eq } from 'drizzle-orm';
import { calculateResults } from '@/utils/quiz-utils';
import { QuizResults } from '@/types/quiz';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('leadId');

    if (!leadId) {
      return NextResponse.json(
        { success: false, error: 'Lead ID is required' },
        { status: 400 }
      );
    }

    // Get lead data from database
    const [lead] = await db
      .select()
      .from(leads)
      .where(eq(leads.id, leadId))
      .limit(1);

    if (!lead) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      );
    }

    // If we already have calculated results, return them
    if (lead.score) {
      // Get investment options from database
      const recommendedInvestments = await db
        .select()
        .from(investmentOptions)
        .orderBy(investmentOptions.priority);

      // Calculate match scores and sort recommendations
      const matchedInvestments = recommendedInvestments
        .map(option => {
          const matchScore = option.tags.reduce((score, tag) => 
            score + (lead.score[tag] || 0), 0
          ) / option.tags.length;
          return { ...option, matchScore };
        })
        .sort((a, b) => {
          if (Math.abs(a.matchScore - b.matchScore) < 10) {
            // If match scores are within 10%, prioritize by priority rating
            return a.priority - b.priority;
          }
          return b.matchScore - a.matchScore;
        })
        .slice(0, 3); // Get top 3 recommendations

      const results: QuizResults = {
        recommendedInvestments: matchedInvestments,
        score: lead.score
      };

      return NextResponse.json({ 
        success: true, 
        results 
      });
    }

    // If we don't have results, calculate them
    const results = await calculateResults(lead.responses);

    // Update lead with calculated scores
    await db
      .update(leads)
      .set({ score: results.score })
      .where(eq(leads.id, leadId));

    return NextResponse.json({ 
      success: true, 
      results 
    });

  } catch (error) {
    console.error('Error fetching results:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch results' },
      { status: 500 }
    );
  }
}