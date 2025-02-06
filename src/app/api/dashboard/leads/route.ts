import { NextResponse } from 'next/server';
import { getLeadsList } from '@/db/queries';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const quizId = url.searchParams.get('quizId');

  if (!quizId) {
    return NextResponse.json({ message: 'Quiz ID is required' }, { status: 400 });
  }

  try {
    const token = request.headers.get('Cookie')?.split('auth-token=')?.[1]?.split(';')?.[0];
    
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = await verifyAuth(token);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const leads = await getLeadsList(quizId);
    return NextResponse.json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching leads' },
      { status: 500 }
    );
  }
}
