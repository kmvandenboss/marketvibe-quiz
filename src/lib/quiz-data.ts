// src/lib/quiz-data.ts
import { db } from '@/db';
import { questions, question_options, quizzes } from '@/db/schema';
import { eq } from 'drizzle-orm';
import type { Question, Quiz, QuestionOption } from '@/lib/quiz/types';
import { inArray } from 'drizzle-orm';

// Keep existing default questions as fallback
export const defaultQuizQuestions: Question[] = [
  {
    id: "cc2cea25-7724-404d-bb37-a2937f2b98b2",
    text: "What's your primary reason for seeking high yields?",
    type: "single",
    order: 1,
    options: [
      {
        id: "1a",
        tags: ["income_focused", "current_income", "distributions"],
        text: "Generate steady income right away",
        weight: 1
      },
      {
        id: "1b",
        tags: ["growth_focused", "long_term", "appreciation"],
        text: "Grow my investment balance over time",
        weight: 1
      },
      {
        id: "1c",
        tags: ["balanced", "income_focused", "growth_focused"],
        text: "Both: I want income and long-term growth",
        weight: 1
      }
    ]
  },
  {
    id: "aff99dac-33c7-4049-901a-f1eb468fe0db",
    text: "What is your preferred investing timeframe?",
    type: "single",
    order: 2,
    options: [
      {
        id: "2a",
        tags: ["short_term", "high_liquidity", "current_income"],
        text: "Less than 1 year",
        weight: 1
      },
      {
        id: "2b",
        tags: ["medium_term", "moderate_liquidity"],
        text: "1–3 years",
        weight: 1
      },
      {
        id: "2c",
        tags: ["longer_term", "lower_liquidity"],
        text: "3–5 years",
        weight: 1
      },
      {
        id: "2d",
        tags: ["long_term", "illiquid_okay"],
        text: "5+ years",
        weight: 1.2
      }
    ]
  },
  {
    id: "43d447cb-c9e8-4ef2-b5c6-1a93e968d076",
    text: "How important is regular income from your investments?",
    type: "single",
    order: 3,
    options: [
      {
        id: "3a",
        tags: ["distributions", "income_focused", "current_income"],
        text: "Extremely important—I'd like frequent distributions",
        weight: 1
      },
      {
        id: "3b",
        tags: ["balanced", "flexible_income"],
        text: "Somewhat important—but I'm okay reinvesting if needed",
        weight: 1
      },
      {
        id: "3c",
        tags: ["growth_focused", "appreciation"],
        text: "Not important—my focus is on long-term growth",
        weight: 1
      }
    ]
  },
  {
    id: "224600cd-6f2d-43a8-9add-3195fc3a1ff8",
    text: "What level of liquidity do you need?",
    type: "single",
    order: 4,
    options: [
      {
        id: "4a",
        tags: ["high_liquidity", "public_markets"],
        text: "I need to be able to access my money at any time",
        weight: 1
      },
      {
        id: "4b",
        tags: ["moderate_liquidity", "private_markets"],
        text: "I can lock up my money for a few years",
        weight: 1
      },
      {
        id: "4c",
        tags: ["illiquid_okay", "private_markets"],
        text: "I'm comfortable with long-term or less liquid investments",
        weight: 1
      }
    ]
  },
  {
    id: "a2d065b8-8ba4-4846-b46c-513ec19842c4",
    text: "Are you an accredited investor?",
    type: "single",
    order: 5,
    options: [
      {
        id: "5a",
        tags: ["accredited", "private_markets"],
        text: "Yes",
        weight: 1
      },
      {
        id: "5b",
        tags: ["non_accredited", "public_markets"],
        text: "No",
        weight: 1
      },
      {
        id: "5c",
        tags: ["public_markets"],
        text: "Not sure",
        weight: 0.8
      }
    ]
  }
];

// Database-driven functions
export async function getQuizQuestions(quizId: string): Promise<Question[]> {
  try {
    // Fetch questions
    const dbQuestions = await db()
      .select()
      .from(questions)
      .where(eq(questions.quizId, quizId))
      .orderBy(questions.position);

    console.log('Fetched questions:', dbQuestions);

    if (dbQuestions.length === 0) return defaultQuizQuestions;

    // Get question IDs for logging
    const questionIds = dbQuestions.map(q => q.id);
    console.log('Question IDs to fetch options for:', questionIds);

    // Fetch options for all questions in a single query
    const dbOptions = await db()
      .select()
      .from(question_options)
      .where(
        inArray(
          question_options.questionId,
          questionIds
        )
      )
      .orderBy(question_options.position);

    console.log('Fetched options:', dbOptions);

    // Group options by question ID
    const optionsByQuestionId = dbOptions.reduce((acc, option) => {
      if (!acc[option.questionId]) {
        acc[option.questionId] = [];
      }
      // Transform option to match QuestionOption type
      acc[option.questionId].push({
        id: option.id,
        text: option.optionText,
        tags: option.tags as string[],
        weight: (option.weights as { default: number })?.default || 1
      });
      return acc;
    }, {} as Record<string, QuestionOption[]>);

    console.log('Grouped options by question ID:', optionsByQuestionId);

    // Transform questions and include their options
    const transformedQuestions: Question[] = dbQuestions.map(q => {
      const questionOptions = optionsByQuestionId[q.id] || [];
      console.log(`Options for question ${q.id}:`, questionOptions);
      
      return {
        id: q.id,
        text: q.questionText,
        type: q.questionType,
        order: q.position,
        options: questionOptions,
        created_at: q.createdAt.toISOString(),
        updated_at: q.updatedAt.toISOString()
      };
    });

    return transformedQuestions;
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    return defaultQuizQuestions;
  }
}

export async function getDefaultQuiz(): Promise<{ quiz: Quiz; questions: Question[] }> {
  try {
    const defaultQuizSlug = process.env.DEFAULT_QUIZ_SLUG || 'high-yield-quiz';
    
    const quiz = await db()
      .select()
      .from(quizzes)
      .where(eq(quizzes.slug, defaultQuizSlug))
      .limit(1)
      .then(rows => rows[0]);

    if (!quiz) {
      throw new Error('Default quiz not found');
    }

    // Transform quiz data to match Quiz type
    const transformedQuiz: Quiz = {
      id: quiz.id,
      slug: quiz.slug,
      title: quiz.title,
      description: quiz.description || undefined,
      heading_text: quiz.heading_text,
      emailCaptureMessage: quiz.emailCaptureMessage,
      results_layout: quiz.results_layout as 'standard' | 'personality',
      personalityResults: quiz.personality_results as Quiz['personalityResults'],
      active: quiz.active,
      navigationSettings: quiz.navigationSettings as Quiz['navigationSettings'],
      seoMetadata: quiz.seoMetadata as Quiz['seoMetadata']
    };

    const quizQuestions = await getQuizQuestions(quiz.id);

    return {
      quiz: transformedQuiz,
      questions: quizQuestions
    };
  } catch (error) {
    console.error('Error fetching default quiz:', error);
    throw error;
  }
}

// Helper function to check if a quiz exists
export async function quizExists(slug: string): Promise<boolean> {
  const quiz = await db()
    .select({ id: quizzes.id })
    .from(quizzes)
    .where(eq(quizzes.slug, slug))
    .limit(1)
    .then(rows => rows[0]);

  return !!quiz;
}
