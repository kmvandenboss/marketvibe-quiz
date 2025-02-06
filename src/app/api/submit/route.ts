import { NextRequest, NextResponse } from 'next/server';
import { submitQuizResponse } from '@/db/queries';
import { z } from 'zod';

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
    
    return NextResponse.json(
      { success: true, leadId },
      { status: 200 }
    );
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
