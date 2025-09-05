// src/app/api/redirect/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { trackLinkClick, logAnalyticsEvent } from '@/db/queries';

export const dynamic = 'force-dynamic';

const RedirectSchema = z.object({
  leadId: z.string().uuid(),
  link: z.string().min(1)
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const leadId = searchParams.get('leadId');
    const link = searchParams.get('link');
    const encodedUrl = searchParams.get('to');

    if (!leadId || !link || !encodedUrl) {
      return NextResponse.redirect(new URL('/error', request.url));
    }

    // Validate parameters
    const validationResult = RedirectSchema.safeParse({ leadId, link });
    if (!validationResult.success) {
      return NextResponse.redirect(new URL('/error', request.url));
    }

    // Track the click
    await trackLinkClick({ leadId, link });
    
    // Get quizId from query params
    const quizId = searchParams.get('quizId');
    
    // Only log analytics if we have a valid quizId
    if (quizId) {
      await logAnalyticsEvent({
        eventType: 'EXTERNAL_REDIRECT',
        quizId,
        leadId,
        data: {
          link,
          destination: encodedUrl,
          timestamp: new Date().toISOString(),
          userAgent: request.headers.get('user-agent') || null,
          referer: request.headers.get('referer') || null
        }
      });
    }

    // Decode and redirect to external URL
    const decodedUrl = decodeURIComponent(encodedUrl);
    return NextResponse.redirect(decodedUrl);

  } catch (error) {
    console.error('Redirect error:', error);
    return NextResponse.redirect(new URL('/error', request.url));
  }
}
