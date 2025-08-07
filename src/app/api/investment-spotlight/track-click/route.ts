import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { logAnalyticsEvent } from '@/db/queries';

const RequestSchema = z.object({
  sessionId: z.string(),
  investmentId: z.string(),
  link: z.string().url()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validationResult = RequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { sessionId, investmentId, link } = validationResult.data;

    const SPOTLIGHT_QUIZ_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

    // Log the click event
    await logAnalyticsEvent({
      eventType: 'SPOTLIGHT_CLICK',
      quizId: SPOTLIGHT_QUIZ_ID,
      sessionId,
      data: {
        investmentId,
        link,
        timestamp: new Date().toISOString(),
        userAgent: request.headers.get('user-agent'),
        ipAddress: request.headers.get('x-forwarded-for') || 
                  request.headers.get('x-real-ip') || 
                  request.ip || 
                  'unknown',
        page: 'investment-spotlight'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Click tracked successfully'
    });

  } catch (error) {
    console.error('Error tracking spotlight click:', error);
    
    // Return success even if tracking fails, so the user can still navigate
    return NextResponse.json({
      success: true,
      message: 'Navigation allowed, tracking may have failed'
    });
  }
}
