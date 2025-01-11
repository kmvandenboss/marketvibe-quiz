// src/app/api/submit/route.ts
import { NextResponse } from 'next/server';
import { db } from '../../../../db';
import { leads } from '../../../../db/schema';
import { calculateResults, sendAdminNotification, sendUserAutoresponder } from '../../../utils/quiz-utils';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, responses } = body;

    // Calculate scores based on responses
    const score = await calculateResults(responses);

    // Store lead in database
    const [lead] = await db.insert(leads).values({
      email,
      name,
      responses,
      clickedLinks: [],
      score: score.score,  // Use the score object from results
    }).returning();

    // Send notifications
    await Promise.all([
      sendAdminNotification({ email, name, responses, score: score.score }),
      sendUserAutoresponder({ email, name })
    ]);

    return NextResponse.json({ 
      success: true, 
      leadId: lead.id,
      score 
    });

  } catch (error) {
    console.error('Error submitting quiz:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit quiz' },
      { status: 500 }
    );
  }
}