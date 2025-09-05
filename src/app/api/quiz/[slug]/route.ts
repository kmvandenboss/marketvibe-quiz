// src/app/api/quiz/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { quizzes, questions as questionsTable, question_options, investment_options } from '@/db/schema';
import { eq, inArray, sql } from 'drizzle-orm';
import { QuizSchema, Quiz, InvestmentOption } from '@/lib/quiz/types';

// Type for database response with snake_case columns
interface QuizRow {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  heading_text: string;
  email_capture_message: string;
  results_layout: string;
  personality_results: unknown;
  active: boolean;
  navigation_settings: unknown;
  seo_metadata: unknown;
  created_at: Date;
  updated_at: Date;
}
import { transformDatabaseResponse } from '@/utils/case-transform';

export const runtime = 'nodejs';

async function getQuizBySlug(slug: string) {
  try {
    const quiz = await db()
      .select()
      .from(quizzes)
      .where(eq(quizzes.slug, slug))
      .limit(1)
      .then(rows => rows[0]);

    if (!quiz) return null;

    // Transform the raw database response to camelCase and handle null values
    const transformedQuiz = transformDatabaseResponse<Quiz>({
      ...quiz,
      personality_results: quiz.personality_results || undefined,
      seo_metadata: quiz.seo_metadata || undefined,
      navigation_settings: quiz.navigation_settings || {
        allowBack: true,
        showProgressBar: true,
        showQuestionCount: true
      }
    });
    
    return transformedQuiz;
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
      .where(eq(questionsTable.quiz_id, quizId))
      .orderBy(questionsTable.position);

    if (questions.length === 0) return [];

    // Get all options with a join to ensure we get all questions and their options
    const options = await db()
      .select({
        id: question_options.id,
        question_id: question_options.question_id,
        option_text: question_options.option_text,
        tags: question_options.tags,
        weights: question_options.weights,
        position: question_options.position
      })
      .from(question_options)
      .innerJoin(
        questionsTable,
        eq(question_options.question_id, questionsTable.id)
      )
      .where(eq(questionsTable.quiz_id, quizId))
      .orderBy(question_options.position);

    // Group options by question ID
    const optionsByQuestionId = options.reduce((acc, option) => {
      if (!acc[option.question_id]) {
        acc[option.question_id] = [];
      }
      const transformedOption = {
        id: option.id,
        text: option.option_text,
        tags: Array.isArray(option.tags) ? option.tags : [],
        weight: typeof option.weights === 'object' && option.weights !== null ? 
          (option.weights as { default?: number }).default || 1 : 1
      };
      acc[option.question_id].push(transformedOption);
      return acc;
    }, {} as Record<string, any[]>);

    // Transform questions and their options to match the Question interface
    const transformedQuestions = questions.map(q => ({
      id: q.id,
      text: q.question_text,
      type: q.question_type,
      order: q.position,
      options: (optionsByQuestionId[q.id] || []).map(opt => ({
        id: opt.id,
        text: opt.text,
        tags: opt.tags,
        weight: opt.weight
      }))
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

    // Get the questions
    const questions = await getQuizQuestions(quiz.id);

    // Get investment options filtered by quiz slug and transform to camelCase
    const investments = await db()
      .select()
      .from(investment_options)
      .where(sql`${investment_options.quiz_tags} ? ${params.slug}`)
      .orderBy(investment_options.priority)
      .then(investments => investments.map(investment => 
        transformDatabaseResponse<InvestmentOption>(investment)
      ));
    
    console.log(`Filtered investment options for quiz slug: ${params.slug}, found: ${investments.length}`);

    return NextResponse.json({
      quiz: validatedQuiz,
      questions,
      investmentOptions: investments
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
