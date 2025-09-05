import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createHash } from 'crypto';

export const dynamic = 'force-dynamic';

const UnsubscribeSchema = z.object({
  email: z.string().email(),
  token: z.string().min(16)
});

// Verify the token matches what we would have generated
function verifyUnsubscribeToken(email: string, token: string): boolean {
  const expectedToken = createHash('sha256')
    .update(email + process.env.BREVO_API_KEY)
    .digest('hex')
    .slice(0, 32);
  
  return token === expectedToken;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');
    const token = searchParams.get('token');

    // Validate parameters
    if (!email || !token) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const validation = UnsubscribeSchema.safeParse({ email, token });
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: validation.error.issues },
        { status: 400 }
      );
    }

    // Verify token for security
    if (!verifyUnsubscribeToken(email, token)) {
      return NextResponse.json(
        { error: 'Invalid unsubscribe token' },
        { status: 403 }
      );
    }

    // Check if using Brevo or Resend based on config
    if (process.env.BREVO_API_KEY) {
      // Unsubscribe from Brevo
      try {
        const response = await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'api-key': process.env.BREVO_API_KEY || ''
          },
          body: JSON.stringify({
            emailBlacklisted: true
          })
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Brevo unsubscribe failed with status: ${response.status} ${errorText}`);
        }
      } catch (error) {
        console.error('Error unsubscribing from Brevo:', error);
        // Continue to try Resend as fallback
      }
    }

    // If Resend is configured, also unsubscribe there (for transition period)
    if (process.env.RESEND_FULL_ACCESS_API_KEY && searchParams.get('audienceId')) {
      const { Resend } = await import('resend');
      const resendAdmin = new Resend(process.env.RESEND_FULL_ACCESS_API_KEY);
      const audienceId = searchParams.get('audienceId');

      try {
        await resendAdmin.contacts.update({
          email,
          audienceId: audienceId!,
          unsubscribed: true
        });
      } catch (error) {
        console.error('Error unsubscribing from Resend:', error);
        // If both services fail, return error
        if (!process.env.BREVO_API_KEY) {
          return NextResponse.json(
            { error: 'Failed to unsubscribe' },
            { status: 500 }
          );
        }
      }
    }

    // Redirect to success page
    return NextResponse.redirect(new URL('/unsubscribe/success', request.url));
    
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your unsubscribe request' },
      { status: 500 }
    );
  }
}
