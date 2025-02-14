import { Resend } from 'resend';
import { InvestmentOption } from '@/types/quiz';
import { createHash } from 'crypto';

// Use send-only token for sending emails
const resendEmail = new Resend(process.env.RESEND_API_KEY);
// Use full access token for audience management
const resendAdmin = new Resend(process.env.RESEND_FULL_ACCESS_API_KEY);

const GENERAL_AUDIENCE_ID = '592fab99-821d-4508-b693-276772a67eba';

interface QuizResults {
  matchedInvestments: InvestmentOption[];
  quizId: string;
}

function generateUnsubscribeToken(email: string): string {
  return createHash('sha256')
    .update(email + process.env.RESEND_FULL_ACCESS_API_KEY)
    .digest('hex')
    .slice(0, 32);
}

function getUnsubscribeUrl(email: string): string {
  const token = generateUnsubscribeToken(email);
  const params = new URLSearchParams({
    email,
    audienceId: GENERAL_AUDIENCE_ID,
    token
  });
  return `${process.env.NEXT_PUBLIC_BASE_URL}/api/unsubscribe?${params.toString()}`;
}

async function addContactToAudience(email: string) {
  try {
    await resendAdmin.contacts.create({
      email,
      unsubscribed: false,
      audienceId: GENERAL_AUDIENCE_ID
    });
    console.log('Successfully added contact to audience:', email);
    return true;
  } catch (error) {
    console.error('Failed to add contact to audience:', error);
    return false;
  }
}

export async function sendQuizResults(email: string, results: QuizResults) {
  try {
    const { matchedInvestments } = results;

    const investmentsList = matchedInvestments
      .map(investment => `
        <div style="margin-bottom: 30px; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
          <h2 style="color: #2E7D32; margin-top: 0;">${investment.title}</h2>
          <h3 style="color: #666;">${investment.companyName}</h3>
          
          <div style="margin: 15px 0;">
            <p style="color: #333;">${investment.description}</p>
          </div>
          
          <div style="margin: 15px 0;">
            <strong>Key Features:</strong>
            <ul>
              ${investment.keyFeatures.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
          </div>
          
          <div style="margin: 15px 0;">
            <p><strong>Returns:</strong> ${investment.returnsText}</p>
            <p><strong>Minimum Investment:</strong> ${investment.minimumInvestmentText}</p>
          </div>
          
          <div style="margin-top: 20px;">
            <a href="${investment.link}" style="background-color: #2E7D32; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Learn More</a>
          </div>
        </div>
      `)
      .join('');

    const unsubscribeUrl = getUnsubscribeUrl(email);

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2E7D32; text-align: center;">Your Matched Investment Options</h1>
        
        <p style="text-align: center; color: #666; margin-bottom: 30px;">
          Based on your quiz responses, we've identified the following investment opportunities that match your preferences:
        </p>
        
        ${investmentsList}
        
        <p style="text-align: center; color: #666; margin-top: 30px;">
          Thank you for taking our quiz!
        </p>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eaeaea;">
          <p style="color: #666; font-size: 12px;">
            Don't want to receive these emails? <a href="${unsubscribeUrl}" style="color: #2E7D32; text-decoration: underline;">Unsubscribe here</a>
          </p>
        </div>
      </div>
    `;

    // Try to add contact to audience, but continue even if it fails
    await addContactToAudience(email);

    // Send email using send-only token
    await resendEmail.emails.send({
      from: 'MarketVibe <quiz@marketvibe.app>',
      to: email,
      subject: 'Your Matched Investment Options from MarketVibe',
      html: emailContent,
      headers: {
        'List-Unsubscribe': `<${unsubscribeUrl}>`
      }
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send quiz results email:', error);
    return { success: false, error };
  }
}
