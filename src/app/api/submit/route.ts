// src/app/api/submit/route.ts
import { NextResponse } from 'next/server';
import { db } from '../../../../db';
import { leads } from '../../../../db/schema';
import { calculateResults, sendAdminNotification, sendUserAutoresponder } from '../../../utils/quiz-utils';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, responses } = body;

    console.log('Received submission:', { email, name, responsesCount: responses?.length });

    if (!email || !responses || !Array.isArray(responses) || responses.length === 0) {
      console.error('Invalid submission data:', { email, responses });
      return NextResponse.json(
        { success: false, error: 'Invalid submission data' },
        { status: 400 }
      );
    }

    // Validate responses structure
    const validResponses = responses.every(r => 
      r.questionId && 
      Array.isArray(r.selectedOptionIds) && 
      r.selectedOptionIds.length > 0
    );

    if (!validResponses) {
      console.error('Invalid response structure:', responses);
      return NextResponse.json(
        { success: false, error: 'Invalid response structure' },
        { status: 400 }
      );
    }

    // Calculate results and get score
    console.log('Calculating results for responses:', responses);
    const calculatedResults = await calculateResults(responses);
    console.log('Calculated results:', calculatedResults);

    // Verify score exists and is not empty
    if (!calculatedResults.score) {
      console.error('No score calculated');
      return NextResponse.json(
        { success: false, error: 'Failed to calculate quiz score' },
        { status: 500 }
      );
    }

    type LeadInsert = typeof leads.$inferInsert;
    
    // Store lead in database
    console.log('Inserting lead into database with score:', calculatedResults.score);
    const insertData: LeadInsert = {
      email,
      ...(name ? { name } : {}),
      responses,
      clickedLinks: [],
      score: calculatedResults.score,
    };
    
    const [lead] = await db
      .insert(leads)
      .values(insertData)
      .returning();
    console.log('Lead inserted:', lead);

    // Send notifications in parallel
    console.log('Sending notifications...');
    await Promise.all([
      sendAdminNotification({ 
        email, 
        name, 
        responses, 
        score: calculatedResults.score 
      }),
      sendUserAutoresponder({ 
        email, 
        name 
      })
    ]);
    console.log('Notifications sent');

    return NextResponse.json({ 
      success: true, 
      leadId: lead.id,
      results: {
        recommendedInvestments: calculatedResults.recommendedInvestments,
        score: calculatedResults.score
      }
    });

  } catch (error) {
    console.error('Error submitting quiz:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to submit quiz. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
