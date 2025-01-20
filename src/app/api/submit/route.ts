// /api/submit/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { submitQuizResponse, logAnalyticsEvent } from '@/db/queries';
import type { QuizResponse } from '@/types/quiz';

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

    // Submit quiz response to database
    const leadId = await submitQuizResponse({
      email,
      name,
      responses,
      score
    });

    // Log analytics event
    await logAnalyticsEvent({
      eventType: 'QUIZ_SUBMISSION',
      leadId,
      data: {
        questionCount: Object.keys(responses).length,
        hasName: !!name
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