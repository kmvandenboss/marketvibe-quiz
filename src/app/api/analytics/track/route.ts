// src/app/api/analytics/track/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../db';
import { analyticsEvents } from '../../../../../db/schema';
import { headers } from 'next/headers';
import type { AnalyticsEvent } from '@/types/analytics';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventType, leadId, questionId, data, sessionId } = body as AnalyticsEvent;

    const headersList = headers();
    const userAgent = headersList.get('user-agent') || '';
    const forwardedFor = headersList.get('x-forwarded-for') || '';
    const ipAddress = forwardedFor.split(',')[0] || '';

    // Create the event data object that matches the schema
    const eventData: AnalyticsEvent = {
      eventType,
      ...(leadId && { leadId }), // Only include if defined
      ...(questionId && { questionId }), // Only include if defined
      ...(data && { data }), // Only include if defined
      userAgent,
      ipAddress,
      ...(sessionId && { sessionId }), // Only include if defined
    };

    await db.insert(analyticsEvents).values(eventData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking analytics event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track event' },
      { status: 500 }
    );
  }
}