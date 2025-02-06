import { NextRequest, NextResponse } from 'next/server';
import { submitQuizResponse } from '@/db/queries';
import { determinePersonalityType } from '@/utils/quiz-utils';
import { z } from 'zod';
import { db } from '@/db';
import { quizzes } from '@/db/schema';
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
    const { quiz: quizData } = await quizResponse.json();
    
    // Calculate personality type
    const personalityResult = determinePersonalityType(
      validatedData.score,
      quizData.personalityResults || []
    );

    return NextResponse.json({
      leadId,
      ...personalityResult
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
