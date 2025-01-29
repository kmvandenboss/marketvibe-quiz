// src/app/api/meta-conversion/route.ts
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { cookies } from 'next/headers';

const META_PIXEL_ID = process.env.META_PIXEL_ID;
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const API_VERSION = 'v18.0';

const hashData = (data: string): string => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, eventName = 'Lead', eventData = {} } = body;

    if (!META_PIXEL_ID || !META_ACCESS_TOKEN) {
      console.error('Missing Meta API configuration');
      return NextResponse.json(
        { success: false, error: 'Missing API configuration' },
        { status: 500 }
      );
    }

    // Get user data from request headers and cookies
    const userAgent = request.headers.get('user-agent') || '';
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                    request.headers.get('x-real-ip') || '';
    
    // Get Facebook Click ID (fbc) and Browser ID (fbp) from cookies
    const cookieStore = cookies();
    const fbc = cookieStore.get('_fbc')?.value;
    const fbp = cookieStore.get('_fbp')?.value;

    // Prepare the conversion event data
    const eventRequest = {
      data: [{
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        event_source_url: request.headers.get('referer') || '',
        user_data: {
          em: [hashData(email.toLowerCase().trim())],
          client_ip_address: clientIp,
          client_user_agent: userAgent,
          fbc: fbc || undefined,
          fbp: fbp || undefined
        },
        custom_data: eventData
      }]
    };

    console.log('Sending conversion event:', {
      pixelId: META_PIXEL_ID,
      eventName,
      hashedEmail: hashData(email.toLowerCase().trim()),
      hasFbc: !!fbc,
      hasFbp: !!fbp,
      hasIp: !!clientIp,
      fullPayload: JSON.stringify(eventRequest, null, 2)
    });

    // Send to Meta Conversion API
    const response = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${META_PIXEL_ID}/events?access_token=${META_ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventRequest),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error('Meta API Error:', result);
      throw new Error(JSON.stringify(result));
    }

    console.log('Meta API Response:', result);

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Meta Conversion API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send conversion event' },
      { status: 500 }
    );
  }
}