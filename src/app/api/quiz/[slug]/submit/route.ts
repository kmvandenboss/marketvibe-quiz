// src/app/api/quiz/[slug]/submit/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { quizzes } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { submitQuizResponse } from '@/db/queries';

const SubmissionSchema = z.object({
  quizId: z.string().uuid(),
  email: z.string().email(),
  responses: z.record(z.string(), z.string()),
  score: z.record(z.string(), z.number())
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = SubmissionSchema.parse(body);

    // Check if quiz exists
    const quiz = await db()
      .select()
      .from(quizzes)
      .where(eq(quizzes.id, validatedData.quizId))
      .limit(1)
      .then(rows => rows[0]);

    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    // Submit quiz response using the existing function
    const leadId = await submitQuizResponse({
      quizId: validatedData.quizId,
      email: validatedData.email,
      responses: validatedData.responses,
      score: validatedData.score
    });

    return NextResponse.json({ 
      success: true,
      leadId
    });
  } catch (error) {
    console.error('Error in quiz submission:', error);
    return NextResponse.json(
      { error: 'Failed to submit quiz response' },
      { status: 500 }
    );
  }
}
