import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST() {
  const cookieStore = cookies();
  
  // Remove the auth cookie
  cookieStore.delete('auth-token');
  
  return NextResponse.json({ message: 'Logged out successfully' });
}
