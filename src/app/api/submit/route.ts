// /api/submit/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { submitQuizResponse, logAnalyticsEvent, getQuizById, calculatePersonalityType } from '@/db/queries';
import { getQuizQuestions } from '@/lib/quiz-data';
import type { QuizResponse, PersonalityResult } from '@/types/quiz';
import type { Question, QuestionOption } from '@/lib/quiz/types';

type Quiz = {
  id: string;
  slug: string;
  title: string;
  description?: string;
  results_layout: 'standard' | 'personality';
  personality_results?: PersonalityResult[];
};
// Constants for accredited investor question
const ACCREDITED_QUESTION_TEXT = 'Are you an accredited investor?';
const ACCREDITED_YES_TEXT = 'Yes';

// Zod schema for request validation
const QuizSubmissionSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().optional(),
  responses: z.record(z.string(), z.string()),
  score: z.record(z.string(), z.number()),
  quizId: z.string().uuid('Invalid quiz ID')
});

export async function POST(request: Request) {
  let parsedBody: z.infer<typeof QuizSubmissionSchema> | null = null;
  
  try {
    // Parse and validate request body
    const body = await request.json();
    const validationResult = QuizSubmissionSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid submission data', 
          details: validationResult.error.issues 
        }, 
        { status: 400 }
      );
    }

    parsedBody = validationResult.data;
    const { email, name, responses, score, quizId } = parsedBody;

    // Get the questions to check accredited status by question text
    const questions = await getQuizQuestions(quizId);
    const accreditedQuestion = questions.find((q: Question) => q.text === ACCREDITED_QUESTION_TEXT);
    
    // Make accredited check optional based on question existence
    let isAccredited = false;
    if (accreditedQuestion) {
      const accreditedYesOption = accreditedQuestion.options.find((opt: QuestionOption) => opt.text === ACCREDITED_YES_TEXT);
      if (accreditedYesOption) {
        isAccredited = responses[accreditedQuestion.id] === accreditedYesOption.id;
      }
    }

    // Get quiz configuration and transform data
    const quiz = (await getQuizById(quizId)) as Quiz;
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    // Transform personality results to ensure proper format
    const quizConfig = {
      ...quiz,
      personality_results: quiz.personality_results ? JSON.parse(JSON.stringify(quiz.personality_results)) : undefined
    };

    // Calculate personality type if needed
    let personalityData;
    if (quizConfig.results_layout === 'personality' && quizConfig.personality_results) {
      console.log('[Personality] Calculating type for quiz:', {
        quizId,
        layout: quizConfig.results_layout,
        hasPersonalityResults: !!quizConfig.personality_results
      });
      
      personalityData = await calculatePersonalityType({ responses, quizId });
      
      console.log('[Personality] Calculation result:', {
        success: !!personalityData,
        type: personalityData?.personalityResult?.type
      });
    }

    // Submit quiz response to database
    const leadId = await submitQuizResponse({
      email,
      name,
      responses,
      score,
      quizId,
      isAccredited,
      personalityType: personalityData?.personalityResult?.type || undefined,
      resultsConfig: {
        layout: quizConfig.results_layout,
        personalityResults: quizConfig.personality_results
      }
    });

    // Log analytics event
    await logAnalyticsEvent({
      eventType: 'QUIZ_SUBMISSION',
      quizId,
      leadId,
      data: {
        questionCount: Object.keys(responses).length,
        hasName: !!name,
        isAccredited
      }
    });

    // Return success response with leadId and results configuration
    return NextResponse.json({ 
      success: true, 
      leadId,
      resultsConfig: {
        layout: quizConfig.results_layout,
        personalityResults: quizConfig.personality_results
      },
      personalityResult: personalityData?.personalityResult || undefined
    });

  } catch (error) {
    console.error('Error in quiz submission:', error);
    
    // Log error event if we have the quizId
    if (parsedBody?.quizId) {
      await logAnalyticsEvent({
        eventType: 'QUIZ_SUBMISSION_ERROR',
        quizId: parsedBody.quizId,
        data: {
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    }

    return NextResponse.json(
      { 
        error: 'Failed to submit quiz response',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}
