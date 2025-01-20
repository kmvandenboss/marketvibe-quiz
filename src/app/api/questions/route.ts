// /src/app/api/questions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getQuizQuestions } from '@/db/queries';

export async function GET(request: NextRequest) {
  try {
    const questions = await getQuizQuestions();
    return NextResponse.json({ questions }, { status: 200 });
  } catch (error) {
    console.error('Error in questions API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}

// /src/app/api/submit/route.ts
import { submitQuizResponse } from '@/db/queries';
import { z } from 'zod';

const SubmissionSchema = z.object({
  email: z.string().email(),
  responses: z.record(z.string(), z.string()),
  score: z.record(z.string(), z.number())
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = SubmissionSchema.parse(body);
    
    // Submit to database
    const leadId = await submitQuizResponse(validatedData);
    
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