// /src/app/api/dashboard/metrics/route.ts
import { NextResponse } from 'next/server';
import { getDashboardMetrics } from '@/db/queries';
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

    const { searchParams } = new URL(request.url);
    const quizId = searchParams.get('quizId');
    
    if (!quizId) {
      return NextResponse.json({ message: 'Quiz ID is required' }, { status: 400 });
    }

    const metrics = await getDashboardMetrics(quizId);
    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching metrics' },
      { status: 500 }
    );
  }
}