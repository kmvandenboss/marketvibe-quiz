import { Resend } from 'resend';
import { InvestmentOption } from '@/types/quiz';
import { createHash } from 'crypto';

const resendEmail = new Resend(process.env.RESEND_API_KEY);
const resendAdmin = new Resend(process.env.RESEND_FULL_ACCESS_API_KEY);

const GENERAL_AUDIENCE_ID = '592fab99-821d-4508-b693-276772a67eba';
const DOMAIN = 'https://www.marketvibe.app';

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
  return `${DOMAIN}/api/unsubscribe?${params.toString()}`;
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
    const unsubscribeUrl = getUnsubscribeUrl(email);

    // Generate plain text version
    const plainTextContent = `
Your Investment Quiz Results

Based on your responses, we've identified these investment opportunities that align with your preferences:

${matchedInvestments.map(investment => `
${investment.title}
${investment.companyName}

${investment.description}

Key Features:
${investment.keyFeatures.map(feature => `• ${feature}`).join('\n')}

Learn more: ${investment.link}
`).join('\n\n---\n\n')}

To unsubscribe: ${unsubscribeUrl}
    `.trim();

    // Generate HTML version with inline styles
    const investmentsList = matchedInvestments
      .map(investment => {
        const redirectUrl = `${DOMAIN}/api/email-redirect?to=${encodeURIComponent(investment.link)}`;
        return `
        <div style="margin-bottom: 30px; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px; background-color: #f8f9fa;">
          <div style="margin-bottom: 16px;">
            <h2 style="color: #2E7D32; margin: 0 0 4px 0; font-size: 20px; font-weight: 600;">${investment.title}</h2>
            <h3 style="color: #666; margin: 0; font-size: 16px; font-weight: 500;">${investment.companyName}</h3>
          </div>
          
          <p style="color: #333; margin: 16px 0; line-height: 1.5;">${investment.description}</p>
          
          <div style="margin: 20px 0;">
            <h4 style="color: #333; margin: 0 0 12px 0; font-size: 16px; font-weight: 600;">Key Features</h4>
            <ul style="margin: 0; padding-left: 20px;">
              ${investment.keyFeatures.map(feature => 
                `<li style="color: #333; margin: 8px 0; line-height: 1.4;">${feature}</li>`
              ).join('')}
            </ul>
          </div>
          
          <div style="margin-top: 20px; text-align: left;">
            <a href="${redirectUrl}" 
               style="display: inline-block; background-color: #2E7D32; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 16px;">
              Learn More
            </a>
          </div>
        </div>
      `;
      })
      .join('');

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
    <h1 style="color: #2E7D32; text-align: center; margin-bottom: 8px; font-size: 24px;">Your Investment Quiz Results</h1>
    <p style="text-align: center; color: #666; margin-bottom: 30px; line-height: 1.5;">
      Based on your responses, we've identified these investment opportunities that align with your preferences:
    </p>

    ${investmentsList}

    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eaeaea;">
      <p style="color: #666; font-size: 12px;">
        <a href="${unsubscribeUrl}" style="color: #2E7D32; text-decoration: underline;">Unsubscribe</a>
      </p>
    </div>
  </div>
</body>
</html>
    `;

    // Send email using send-only token
    await resendEmail.emails.send({
      from: 'MarketVibe <quiz@marketvibe.app>',
      to: email,
      subject: 'Your Investment Quiz Results',
      html: htmlContent,
      text: plainTextContent,
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