import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { trackLinkClick, logAnalyticsEvent } from '@/db/queries';
import { db } from '@/db';
import { leads } from '@/db/schema';
import { eq } from 'drizzle-orm';

const TrackClickSchema = z.object({
  leadId: z.string().uuid(),
  link: z.string().min(1) // Accept any non-empty string for the link
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request data
    const validationResult = TrackClickSchema.safeParse(body);
    if (!validationResult.success) {
      console.error('Link click validation error:', {
        errors: validationResult.error.issues,
        rawBody: body
      });
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { leadId, link } = validationResult.data;

    // Attempt to track the link click
    const wasTracked = await trackLinkClick({ leadId, link });

    // Log the event with full context
    // Get the lead to find the associated quizId
    const lead = await db().select({
      quiz_id: leads.quiz_id
    })
    .from(leads)
    .where(eq(leads.id, leadId))
    .limit(1);

    if (!lead.length) {
      throw new Error(`Lead not found with ID: ${leadId}`);
    }

    // Only log analytics if we have a valid quiz_id
    if (lead[0].quiz_id) {
      await logAnalyticsEvent({
        eventType: 'LINK_CLICK',
        quizId: lead[0].quiz_id,
        leadId,
        data: {
          link,
          wasTracked,
          timestamp: new Date().toISOString(),
          userAgent: request.headers.get('user-agent') || undefined,
          referer: request.headers.get('referer') || undefined
        }
      });
    }

    return NextResponse.json({ 
      success: true,
      wasTracked
    });

  } catch (error) {
    // Log error details but don't attempt analytics event
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      type: error instanceof Error ? error.constructor.name : 'Unknown',
      timestamp: new Date().toISOString()
    };

    console.error('Error tracking link click:', errorDetails);

    return NextResponse.json(
      { error: 'Failed to track link click', details: errorDetails },
      { status: 500 }
    );
  }
}
