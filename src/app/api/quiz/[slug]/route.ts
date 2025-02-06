// src/app/api/quiz/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { quizzes, questions as questionsTable, question_options } from '@/db/schema';
import { eq, inArray } from 'drizzle-orm';
import { QuizSchema, Quiz } from '@/lib/quiz/types';

async function getQuizBySlug(slug: string) {
  try {
    const quiz = await db()
      .select()
      .from(quizzes)
      .where(eq(quizzes.slug, slug))
      .limit(1)
      .then(rows => rows[0]);

    if (!quiz) return null;

    // Transform quiz data to match Quiz type
    return {
      id: quiz.id,
      slug: quiz.slug,
      title: quiz.title,
      description: quiz.description || undefined,
      emailCaptureMessage: quiz.emailCaptureMessage,
      results_layout: quiz.results_layout as 'standard' | 'personality',
      personalityResults: quiz.results_layout === 'personality' 
        ? (quiz.personality_results as Quiz['personalityResults']) 
        : [],
      active: quiz.active,
      navigationSettings: {
        allowBack: true,
        showProgressBar: true,
        showQuestionCount: true,
        showStartPrompt: true,
        ...(quiz.navigationSettings as Record<string, boolean> || {})
      },
      seoMetadata: quiz.seoMetadata || undefined
    };
  } catch (error) {
    console.error('Error fetching quiz:', error);
    throw new Error('Failed to fetch quiz');
  }
}

async function getQuizQuestions(quizId: string) {
  try {
    // First get all questions
    const questions = await db()
      .select()
      .from(questionsTable)
      .where(eq(questionsTable.quizId, quizId))
      .orderBy(questionsTable.position);

    if (questions.length === 0) return [];

    // Get all options with a join to ensure we get all questions and their options
    const options = await db()
      .select({
        id: question_options.id,
        questionId: question_options.questionId,
        optionText: question_options.optionText,
        tags: question_options.tags,
        weights: question_options.weights,
        position: question_options.position
      })
      .from(question_options)
      .innerJoin(
        questionsTable,
        eq(question_options.questionId, questionsTable.id)
      )
      .where(eq(questionsTable.quizId, quizId))
      .orderBy(question_options.position);

    // Group options by question ID
    const optionsByQuestionId = options.reduce((acc, option) => {
      if (!acc[option.questionId]) {
        acc[option.questionId] = [];
      }
      const transformedOption = {
        id: option.id,
        text: option.optionText,
        tags: Array.isArray(option.tags) ? option.tags : [],
        weight: typeof option.weights === 'object' && option.weights !== null ? 
          (option.weights as { default?: number }).default || 1 : 1
      };
      acc[option.questionId].push(transformedOption);
      return acc;
    }, {} as Record<string, any[]>);

    // Transform questions to include their options
    const transformedQuestions = questions.map(q => ({
      id: q.id,
      text: q.questionText,
      type: q.questionType,
      order: q.position,
      options: optionsByQuestionId[q.id] || []
    }));

    return transformedQuestions;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw new Error('Failed to fetch questions');
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // First try to get the quiz
    const quiz = await getQuizBySlug(params.slug);
    
    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    // Validate transformed quiz data
    const validatedQuiz = QuizSchema.parse(quiz);

    // Then get the questions
    const questions = await getQuizQuestions(quiz.id);

    return NextResponse.json({
      quiz: validatedQuiz,
      questions
    });
  } catch (error) {
    console.error('Error in quiz route:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch quiz data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
