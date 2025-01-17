// src/app/api/analytics/track/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../db';
import { analyticsEvents } from '../../../../../db/schema';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventType, leadId, questionId, data, sessionId } = body;

    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || '';
    // Get IP from x-forwarded-for header which Next.js sets
    const forwardedFor = headersList.get('x-forwarded-for') || '';
    const ipAddress = forwardedFor.split(',')[0] || '';

    await db.insert(analyticsEvents).values({
      eventType,
      leadId,
      questionId,
      data,
      userAgent,
      ipAddress,
      sessionId,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking analytics event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track event' },
      { status: 500 }
    );
  }
}