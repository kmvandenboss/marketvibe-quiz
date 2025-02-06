import { NextRequest, NextResponse } from 'next/server';
import { logAnalyticsEvent } from '@/db/queries';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventType, quizId, questionId, questionIndex, data } = body;

    // Get client info from request
    const userAgent = request.headers.get('user-agent') || undefined;
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] || request.headers.get('x-real-ip') || undefined;

    // Log the event
    await logAnalyticsEvent({
      eventType,
      quizId,
      questionId,
      questionIndex,
      data,
      userAgent,
      ipAddress,
      sessionId: request.cookies.get('sessionId')?.value
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error logging analytics event:', error);
    return NextResponse.json(
      { error: 'Failed to log analytics event' },
      { status: 500 }
    );
  }
}
