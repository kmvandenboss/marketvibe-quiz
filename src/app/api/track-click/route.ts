// src/app/api/track-click/route.ts
import { NextResponse } from 'next/server';
import { db } from '../../../../db';
import { leads } from '../../../../db/schema';
import { eq } from 'drizzle-orm';
import { QUIZ_CONFIG } from '@/types/quiz';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { leadId, link } = body;

    // Get current lead
    const [existingLead] = await db
      .select()
      .from(leads)
      .where(eq(leads.id, leadId))
      .limit(1);

    if (!existingLead) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      );
    }

    // Update clicked links (keeping only up to maxClickTracking)
    const updatedLinks = [...new Set([...existingLead.clickedLinks, link])]
      .slice(0, QUIZ_CONFIG.maxClickTracking);

    // Update the lead
    await db
      .update(leads)
      .set({
        clickedLinks: updatedLinks
      })
      .where(eq(leads.id, leadId));

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error tracking click:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track click' },
      { status: 500 }
    );
  }
}
