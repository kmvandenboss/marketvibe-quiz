// src/app/api/track-click/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { trackLinkClick, logAnalyticsEvent } from '@/db/queries';
import { db } from '@/db';
import { leads, investment_options } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { updateBrevoContactClickedLinks } from '@/utils/email';

export const runtime = 'nodejs';

const TrackClickSchema = z.object({
  leadId: z.string().uuid(),
  link: z.string().min(1), // Accept any non-empty string for the link
  requestInfo: z.boolean().optional().default(false)
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

    const { leadId, link, requestInfo } = validationResult.data;

    // Attempt to track the link click
    const wasTracked = await trackLinkClick({ leadId, link, requestInfo });

    // Get the lead to find the associated quizId and email
    const lead = await db().select({
      quiz_id: leads.quiz_id,
      email: leads.email,
      clicked_links: leads.clicked_links
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
        eventType: requestInfo ? 'INFO_REQUEST_CLICK' : 'LINK_CLICK',
        quizId: lead[0].quiz_id,
        leadId,
        data: {
          link,
          wasTracked,
          requestInfo,
          timestamp: new Date().toISOString(),
          userAgent: request.headers.get('user-agent') || undefined,
          referer: request.headers.get('referer') || undefined
        }
      });
      
      // Format clicked links for Brevo update
      if (wasTracked && Array.isArray(lead[0].clicked_links)) {
        // Get the investment option details for these links
        const clickedLinks = lead[0].clicked_links as Array<{ url: string; timestamp: string; requestInfo?: boolean }>;
        
        // Get all investment options
        const investmentOptions = await db().select({
          link: investment_options.link,
          title: investment_options.title
        })
        .from(investment_options);
        
        // Create a map of link to investment name
        const investmentMap = new Map();
        investmentOptions.forEach(option => {
          investmentMap.set(option.link, option.title);
        });
        
        // Format clicked links with investment names and requestInfo status
        const formattedLinks = clickedLinks.map(click => ({
          url: click.url,
          investmentName: investmentMap.get(click.url) || 'Unknown Investment',
          requestInfo: click.requestInfo || false
        }));
        
        // Update the contact in Brevo with clicked investments
        if (lead[0].email && formattedLinks.length > 0) {
          await updateBrevoContactClickedLinks(lead[0].email, formattedLinks);
        }
      }
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