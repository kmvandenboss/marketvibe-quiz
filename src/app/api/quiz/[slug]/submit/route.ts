// src/app/api/quiz/[slug]/submit/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { quizzes } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { submitQuizResponse, getQuizQuestions, getInvestmentOptions, logAnalyticsEvent } from '@/db/queries';
import { calculateQuizScore, findMatchingInvestments } from '@/utils/quiz-utils';
import { sendQuizResults, addContactToBrevo } from '@/utils/email';
import { transformDatabaseResponse } from '@/utils/case-transform';
import { Question, InvestmentOption } from '@/types/quiz';

const SubmissionSchema = z.object({
  quizId: z.string().uuid(),
  email: z.string().email(),
  responses: z.record(z.string(), z.string()),
  name: z.string().optional(),
  isAccredited: z.boolean().optional()
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

    // Get quiz questions and calculate score
    const rawQuestions = await getQuizQuestions(validatedData.quizId);
    const questions = transformDatabaseResponse<Question[]>(rawQuestions);
    const score = calculateQuizScore(questions, validatedData.responses);

    // Submit quiz response using the existing function
    const leadId = await submitQuizResponse({
      quizId: validatedData.quizId,
      email: validatedData.email,
      name: validatedData.name,
      responses: validatedData.responses,
      score: score,
      isAccredited: validatedData.isAccredited || false
    });

    // Get matching investments for the lead
    const rawInvestmentOptions = await getInvestmentOptions(validatedData.quizId);
    const investmentOptions = transformDatabaseResponse<InvestmentOption[]>(rawInvestmentOptions);
    const matchedInvestments = findMatchingInvestments(score, investmentOptions);

    // Log analytics event for email submission
    await logAnalyticsEvent({
      eventType: 'EMAIL_SUBMITTED',
      quizId: validatedData.quizId,
      leadId,
      data: {
        email: validatedData.email,
        matchedInvestments: matchedInvestments.map(i => i.title)
      }
    });

    // Add lead to Brevo with matched investments
    await addContactToBrevo(
      validatedData.email, 
      leadId, 
      validatedData.name, 
      matchedInvestments
    );

    // Send quiz results email
    await sendQuizResults(validatedData.email, {
      matchedInvestments,
      quizId: validatedData.quizId,
      leadId
    }, validatedData.name);

    return NextResponse.json({ 
      success: true,
      leadId,
      matchedInvestments
    });
  } catch (error) {
    console.error('Error in quiz submission:', error);
    return NextResponse.json(
      { error: 'Failed to submit quiz response' },
      { status: 500 }
    );
  }
}