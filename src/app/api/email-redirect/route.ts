import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const RedirectSchema = z.object({
  to: z.string().url()
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const encodedUrl = searchParams.get('to');

    if (!encodedUrl) {
      return NextResponse.redirect(new URL('/error', request.url));
    }

    const decodedUrl = decodeURIComponent(encodedUrl);

    // Validate the URL
    const validationResult = RedirectSchema.safeParse({ to: decodedUrl });
    if (!validationResult.success) {
      return NextResponse.redirect(new URL('/error', request.url));
    }

    // Simple redirect without any tracking
    return NextResponse.redirect(decodedUrl);

  } catch (error) {
    console.error('Email redirect error:', error);
    return NextResponse.redirect(new URL('/error', request.url));
  }
}
