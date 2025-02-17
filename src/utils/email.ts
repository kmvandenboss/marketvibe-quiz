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

    // Generate HTML version with improved structure
    const investmentsList = matchedInvestments
      .map(investment => {
        const redirectUrl = `${DOMAIN}/api/email-redirect?to=${encodeURIComponent(investment.link)}`;
        return `
        <article class="investment">
          <header>
            <h2>${investment.title}</h2>
            <h3>${investment.companyName}</h3>
          </header>
          
          <p>${investment.description}</p>
          
          <section class="features">
            <h4>Key Features</h4>
            <ul>
              ${investment.keyFeatures.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
          </section>
          
          <a href="${redirectUrl}" class="cta">Learn More</a>
        </article>
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
<body>
  <main style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <header>
      <h1 style="color: #2E7D32; text-align: center;">Your Investment Quiz Results</h1>
      <p style="text-align: center; color: #666;">Based on your responses, we've identified these investment opportunities that align with your preferences:</p>
    </header>

    <section style="margin: 2em 0;">
      ${investmentsList}
    </section>

    <footer style="text-align: center; margin-top: 2em; padding-top: 1em; border-top: 1px solid #eaeaea;">
      <p style="color: #666; font-size: 12px;">
        <a href="${unsubscribeUrl}" style="color: #2E7D32;">Unsubscribe</a>
      </p>
    </footer>
  </main>
</body>
</html>
    `;

    const styles = `
.investment {
  margin-bottom: 2em;
  padding: 1.25em;
  border: 1px solid #eaeaea;
  border-radius: 0.5em;
}
.investment h2 {
  color: #2E7D32;
  margin: 0;
}
.investment h3 {
  color: #666;
  margin: 0.5em 0;
}
.investment h4 {
  color: #333;
  margin: 1em 0 0.5em;
}
.features ul {
  margin: 0;
  padding-left: 1.5em;
}
.features li {
  margin: 0.5em 0;
}
.cta {
  display: inline-block;
  background: #2E7D32;
  color: white;
  padding: 0.625em 1.25em;
  text-decoration: none;
  border-radius: 0.25em;
  margin-top: 1.25em;
}
    `.trim();

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