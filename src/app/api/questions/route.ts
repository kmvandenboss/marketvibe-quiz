import { NextRequest, NextResponse } from 'next/server';
import { getQuizQuestions } from '@/db/queries';
import { transformDatabaseResponse } from '@/utils/case-transform';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const quizId = searchParams.get('quizId');
    
    if (!quizId) {
      return NextResponse.json(
        { error: 'Quiz ID is required' },
        { status: 400 }
      );
    }

    const questions = await getQuizQuestions(quizId);
    const transformedQuestions = transformDatabaseResponse(questions);
    return NextResponse.json({ questions: transformedQuestions }, { status: 200 });
  } catch (error) {
    console.error('Error in questions API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}
