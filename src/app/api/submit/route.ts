// /api/submit/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { submitQuizResponse, logAnalyticsEvent } from '@/db/queries';
import type { QuizResponse } from '@/types/quiz';

// Constants for accredited investor question
const ACCREDITED_QUESTION_ID = 'a2d065b8-8ba4-4846-b46c-513ec19842c4';
const ACCREDITED_YES_ANSWER = '5a';

// Zod schema for request validation
const QuizSubmissionSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().optional(),
  responses: z.record(z.string(), z.string()),
  score: z.record(z.string(), z.number())
});

export async function POST(request: Request) {
  try {
    // Parse and validate request body
    const body = await request.json();
    
    const validationResult = QuizSubmissionSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid submission data', 
          details: validationResult.error.issues 
        }, 
        { status: 400 }
      );
    }

    const { email, name, responses, score } = validationResult.data;

    // Check for accredited investor status from the responses
    const isAccredited = responses[ACCREDITED_QUESTION_ID] === ACCREDITED_YES_ANSWER;

    // Submit quiz response to database
    const leadId = await submitQuizResponse({
      email,
      name,
      responses,
      score,
      isAccredited
    });

    // Log analytics event
    await logAnalyticsEvent({
      eventType: 'QUIZ_SUBMISSION',
      leadId,
      data: {
        questionCount: Object.keys(responses).length,
        hasName: !!name,
        isAccredited
      }
    });

    // Return success response with leadId
    return NextResponse.json({ 
      success: true, 
      leadId 
    });

  } catch (error) {
    console.error('Error in quiz submission:', error);
    
    // Log error event
    await logAnalyticsEvent({
      eventType: 'QUIZ_SUBMISSION_ERROR',
      data: {
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    });

    return NextResponse.json(
      { 
        error: 'Failed to submit quiz response',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}