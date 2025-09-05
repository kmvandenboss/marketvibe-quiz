// /src/app/api/dashboard/overview/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { verifyAuth } from '@/lib/auth';
import { getQuizzesList, getQuizOverviewMetrics } from '@/db/queries';

export const runtime = 'nodejs';

// Define a type that matches what getQuizzesList returns
type QuizListItem = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  active: boolean;
};

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

    const quizzes = await getQuizzesList();
    const overviewMetrics = await Promise.all(
      quizzes.map((quiz: QuizListItem) => getQuizOverviewMetrics(quiz.id))
    );

    return NextResponse.json(overviewMetrics);
  } catch (error) {
    console.error('Error fetching overview metrics:', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching overview metrics' },
      { status: 500 }
    );
  }
}