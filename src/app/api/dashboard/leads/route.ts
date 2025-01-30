import { NextResponse } from 'next/server';
import { getLeadsList } from '@/db/queries';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const token = request.headers.get('Cookie')?.split('auth-token=')?.[1]?.split(';')?.[0];
    
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = await verifyAuth(token);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const leads = await getLeadsList();
    return NextResponse.json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching leads' },
      { status: 500 }
    );
  }
}