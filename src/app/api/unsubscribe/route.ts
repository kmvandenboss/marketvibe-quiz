import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createHash } from 'crypto';

const resendAdmin = new Resend(process.env.RESEND_FULL_ACCESS_API_KEY);

function generateUnsubscribeToken(email: string): string {
  return createHash('sha256')
    .update(email + process.env.RESEND_FULL_ACCESS_API_KEY)
    .digest('hex')
    .slice(0, 32);
}

function verifyUnsubscribeToken(email: string, token: string): boolean {
  const expectedToken = generateUnsubscribeToken(email);
  return token === expectedToken;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');
    const audienceId = searchParams.get('audienceId');
    const token = searchParams.get('token');

    if (!email || !audienceId || !token) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Verify the token
    if (!verifyUnsubscribeToken(email, token)) {
      return NextResponse.json(
        { error: 'Invalid unsubscribe token' },
        { status: 403 }
      );
    }

    // Update the contact's unsubscribed status using full access token
    await resendAdmin.contacts.update({
      email,
      unsubscribed: true,
      audienceId
    });

    // Redirect to the unsubscribe confirmation page
    return NextResponse.redirect(new URL('/unsubscribe/success', request.url));
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Failed to unsubscribe' },
      { status: 500 }
    );
  }
}
