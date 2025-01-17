// src/utils/quiz-utils.ts
import { Resend } from 'resend';
import { UserResponse, QuizResults, InvestmentOption, QuestionOption } from '@/types/quiz';
import { investmentOptions, questions } from '../../db/schema';
import { db } from '../../db';
import { and, eq, asc } from 'drizzle-orm';

const resend = new Resend(process.env.RESEND_API_KEY);

interface ScoreMap {
  [key: string]: number;
}

/**
 * Calculates quiz results based on user responses
 * Uses tag-based scoring with priority ratings
 */
export async function calculateResults(responses: UserResponse[]): Promise<QuizResults> {
  // Initialize score map for all tags
  const scoreMap: ScoreMap = {};
  
  try {
    // Get questions data with explicit column selection
    const allQuestions = await db
      .select({
        id: questions.id,
        text: questions.text,
        type: questions.type,
        options: questions.options
      })
      .from(questions);

    if (!allQuestions.length) {
      console.error('No questions found in database');
      throw new Error('No questions found');
    }

    console.log('Found questions:', allQuestions.length);

    // Filter questions based on responses
    const responseQuestions = allQuestions.filter(question => 
      responses.some(response => response.questionId === question.id)
    );

    console.log('Matched questions:', responseQuestions.length);

    // Calculate scores based on selected options and their weights
    for (const response of responses) {
      const questionData = responseQuestions.find(q => q.id === response.questionId);
      if (!questionData) {
        console.log(`No matching question found for ID: ${response.questionId}`);
        continue;
      }

      // Find selected options
      const selectedOptions = questionData.options.filter((opt: QuestionOption) => 
        response.selectedOptionIds.includes(opt.id)
      );

      console.log(`Processing question ${response.questionId}, selected options:`, selectedOptions.length);

      // Update scores for each tag in selected options
      for (const option of selectedOptions) {
        if (!option.tags || !Array.isArray(option.tags)) {
          console.log(`Invalid tags for option:`, option);
          continue;
        }
        
        for (const tag of option.tags) {
          scoreMap[tag] = (scoreMap[tag] || 0) + (option.weight || 1); // Default weight to 1 if not specified
        }
      }
    }

    console.log('Raw scores calculated:', scoreMap);

    // Normalize scores to percentages
    const maxScore = Math.max(...Object.values(scoreMap));
    if (maxScore > 0) {
      for (const tag in scoreMap) {
        scoreMap[tag] = Math.round((scoreMap[tag] / maxScore) * 100);
      }
    }

    console.log('Normalized scores:', scoreMap);

    // Get investment options
    const allInvestmentOptions = await db
      .select()
      .from(investmentOptions)
      .orderBy(asc(investmentOptions.priority));

    if (!allInvestmentOptions.length) {
      console.error('No investment options found in database');
      throw new Error('No investment options found');
    }

    // Calculate match scores for each investment option
    const matchedInvestments = allInvestmentOptions.map(option => {
      const matchScore = option.tags.reduce((score, tag) => 
        score + (scoreMap[tag] || 0), 0
      ) / option.tags.length;

      return { 
        ...option, 
        matchScore: Math.round(matchScore) // Round match scores to whole numbers
      };
    });

    // Sort by match score and priority
    const recommendedInvestments = matchedInvestments
      .sort((a, b) => {
        if (Math.abs(a.matchScore - b.matchScore) < 10) {
          // If match scores are within 10%, prioritize by priority rating
          return a.priority - b.priority;
        }
        return b.matchScore - a.matchScore;
      })
      .slice(0, 3); // Get top 3 recommendations

    console.log('Final recommendations:', recommendedInvestments.length);

    return {
      recommendedInvestments,
      score: scoreMap,
    };
  } catch (error) {
    console.error('Error in calculateResults:', error);
    throw error;
  }
}

interface NotificationData {
  email: string;
  name?: string;
  responses: UserResponse[];
  score: ScoreMap;
}

/**
 * Sends email notification to admin about new quiz submission
 */
export async function sendAdminNotification(data: NotificationData) {
  const { email, name, responses, score } = data;

  try {
    await resend.emails.send({
      from: 'MarketVibe Quiz <quiz@yourdomain.com>',
      to: process.env.ADMIN_EMAIL!,
      subject: 'New Quiz Submission',
      react: AdminEmailTemplate({
        email,
        name,
        responses,
        score,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (error) {
    console.error('Error sending admin notification:', error);
    // Don't throw - we don't want to break the quiz flow for email errors
  }
}

interface AutoresponderData {
  email: string;
  name?: string;
}

/**
 * Sends autoresponder email to user after quiz submission
 */
export async function sendUserAutoresponder(data: AutoresponderData) {
  const { email, name } = data;

  try {
    await resend.emails.send({
      from: 'MarketVibe Quiz <quiz@yourdomain.com>',
      to: email,
      subject: 'Your Investment Strategy Results',
      react: UserEmailTemplate({
        name: name || 'Investor',
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (error) {
    console.error('Error sending user autoresponder:', error);
    // Don't throw - we don't want to break the quiz flow for email errors
  }
}

// Email Template Imports
import { AdminEmailTemplate } from '../../emails/admin-notification';
import { UserEmailTemplate } from '../../emails/user-autoresponder';