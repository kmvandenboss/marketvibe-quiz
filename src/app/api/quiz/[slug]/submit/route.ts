// src/app/api/quiz/[slug]/submit/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { leads, quizzes } from '@/db/schema';
import { eq } from 'drizzle-orm';

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

    // Insert lead with all required fields
    const [lead] = await db()
      .insert(leads)
      .values({
        quizId: validatedData.quizId,
        email: validatedData.email,
        responses: validatedData.responses,
        score: validatedData.score,
        clickedLinks: [], // Required field from schema
        isAccredited: false, // Required field with default
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();

    return NextResponse.json({ 
      success: true,
      leadId: lead.id
    });
  } catch (error) {
    console.error('Error in quiz submission:', error);
    return NextResponse.json(
      { error: 'Failed to submit quiz response' },
      { status: 500 }
    );
  }
}