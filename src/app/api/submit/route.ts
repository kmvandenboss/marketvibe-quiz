import { NextRequest, NextResponse } from 'next/server';
import { submitQuizResponse } from '@/db/queries';
import { determinePersonalityType, calculateQuizScore, findMatchingInvestments } from '@/utils/quiz-utils';
import { sendQuizResults } from '@/utils/email';
import { InvestmentOption } from '@/types/quiz';
import { z } from 'zod';
import { db } from '@/db';
import { quizzes } from '@/db/schema';

export const runtime = 'nodejs';
import { eq } from 'drizzle-orm';

const SubmissionSchema = z.object({
  email: z.string().email(),
  responses: z.record(z.string(), z.string()),
  score: z.record(z.string(), z.number()),
  quizId: z.string(),
  isAccredited: z.boolean().optional(),
  personalityType: z.string().optional(),
  resultsConfig: z.any().optional()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = SubmissionSchema.parse(body);
    
    // Submit to database
    const leadId = await submitQuizResponse({
      ...validatedData,
      name: undefined // name is optional in the schema
    });
    
    // Get personality results from quiz data
    // Use absolute URL for server-side fetch
    // Get quiz by slug since the endpoint expects a slug
    const quiz = await db()
      .select()
      .from(quizzes)
      .where(eq(quizzes.id, validatedData.quizId))
      .limit(1)
      .then(rows => rows[0]);

    if (!quiz) {
      throw new Error('Quiz not found');
    }

    const quizResponse = await fetch(`${request.nextUrl.origin}/api/quiz/${quiz.slug}`);
    if (!quizResponse.ok) {
      throw new Error('Failed to fetch quiz data');
    }
    const { quiz: quizData, questions, investmentOptions } = await quizResponse.json();
    
    // Calculate scores from responses
    const scores = calculateQuizScore(questions, validatedData.responses);
    
    // Determine personality type if it's a personality quiz
    let personalityResult;
    let resultsConfig;
    if (quizData.resultsLayout === 'personality' && quizData.personalityResults) {
      const personalityTypeResult = determinePersonalityType(scores, quizData.personalityResults);
      if (personalityTypeResult) {
        personalityResult = personalityTypeResult.personalityResult;
        resultsConfig = personalityTypeResult.resultsConfig;
      }
    }
    
    // Get matched investments using the sophisticated matching algorithm with quiz slug
    const matchedInvestments = findMatchingInvestments(scores, investmentOptions, 5, quiz.slug);

    // Send email with matched investments and personality results if applicable
    const emailResult = await sendQuizResults(validatedData.email, {
      matchedInvestments,
      quizId: validatedData.quizId
    });

    if (!emailResult.success) {
      console.error('Failed to send results email:', emailResult.error);
    }

    return NextResponse.json({
      leadId,
      matchedInvestments,
      emailSent: emailResult.success,
      personalityResult,
      resultsConfig
    }, { status: 200 });
  } catch (error) {
    console.error('Error in submit API:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid submission data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to submit quiz response' },
      { status: 500 }
    );
  }
}
