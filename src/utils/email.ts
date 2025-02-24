import { InvestmentOption } from '@/types/quiz';
import { createHash } from 'crypto';

// Legacy Resend configuration for backward compatibility during transition
import { Resend } from 'resend';
const resendEmail = new Resend(process.env.RESEND_API_KEY);
const resendAdmin = new Resend(process.env.RESEND_FULL_ACCESS_API_KEY);
const GENERAL_AUDIENCE_ID = '592fab99-821d-4508-b693-276772a67eba';

// Brevo configuration
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_LIST_ID = Number(process.env.BREVO_LIST_ID);
const DOMAIN = 'https://www.marketvibe.app';

interface QuizResults {
  matchedInvestments: InvestmentOption[];
  quizId: string;
  leadId?: string;
}

function generateUnsubscribeToken(email: string): string {
  return createHash('sha256')
    .update(email + process.env.BREVO_API_KEY)
    .digest('hex')
    .slice(0, 32);
}

function getUnsubscribeUrl(email: string): string {
  const token = generateUnsubscribeToken(email);
  const params = new URLSearchParams({
    email,
    token
  });
  return `${DOMAIN}/api/unsubscribe?${params.toString()}`;
}

/**
 * Adds a contact to Brevo with quiz-specific attributes
 */
export async function addContactToBrevo(
  email: string, 
  leadId: string, 
  name?: string, 
  matchedInvestments?: InvestmentOption[],
  clickedLinks?: Array<{ url: string; investmentName: string; }>
) {
  try {
    if (!BREVO_API_KEY || !BREVO_LIST_ID) {
      console.error('Brevo configuration missing');
      return { success: false, error: 'Brevo configuration missing' };
    }

    // Format matched investments for Brevo (top 3)
    const formattedMatches = matchedInvestments && matchedInvestments.length > 0
      ? matchedInvestments.slice(0, 3).map(inv => inv.title).join('|')
      : '';

    // Format clicked links for Brevo
    const formattedClicks = clickedLinks && clickedLinks.length > 0
      ? clickedLinks.map(link => link.investmentName).join('|')
      : '';

    // Prepare Brevo API request
    const data = {
      email,
      attributes: {
        FIRSTNAME: name || '',
        LEAD_ID: leadId,
        MATCHED_INVESTMENTS: formattedMatches,
        CLICKED_INVESTMENTS: formattedClicks
      },
      listIds: [BREVO_LIST_ID],
      updateEnabled: true // Update if contact already exists
    };

    // Call Brevo API
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      // Safely attempt to parse error response
      const errorText = await response.text();
      let errorData = {};
      try {
        if (errorText) {
          errorData = JSON.parse(errorText);
        }
      } catch (e) {
        // If JSON parsing fails, use the raw text
        errorData = { rawError: errorText || 'No response body' };
      }
      throw new Error(`Brevo API error: ${response.status} ${JSON.stringify(errorData)}`);
    }

    // Safely parse the successful response
    let responseData = {};
    const responseText = await response.text();
    try {
      if (responseText) {
        responseData = JSON.parse(responseText);
      }
    } catch (e) {
      // If parsing fails, this is ok for a successful response
      responseData = { message: 'Success (no response body)' };
    }

    console.log('Successfully added/updated contact in Brevo:', email);
    return { success: true, data: responseData };
  } catch (error) {
    console.error('Failed to add/update contact in Brevo:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Updates a contact in Brevo with clicked investment links
 */
export async function updateBrevoContactClickedLinks(
  email: string,
  clickedLinks: Array<{ url: string; investmentName: string; }>
) {
  try {
    if (!BREVO_API_KEY) {
      console.error('Brevo configuration missing');
      return { success: false, error: 'Brevo configuration missing' };
    }

    // Format clicked links for Brevo
    const formattedClicks = clickedLinks.map(link => link.investmentName).join('|');

    // Prepare Brevo API request for update
    const data = {
      attributes: {
        CLICKED_INVESTMENTS: formattedClicks
      },
      updateEnabled: true
    };

    // Call Brevo API
    const response = await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      // Safely attempt to parse error response
      const errorText = await response.text();
      let errorData = {};
      try {
        if (errorText) {
          errorData = JSON.parse(errorText);
        }
      } catch (e) {
        // If JSON parsing fails, use the raw text
        errorData = { rawError: errorText || 'No response body' };
      }
      throw new Error(`Brevo API error: ${response.status} ${JSON.stringify(errorData)}`);
    }

    console.log('Successfully updated contact clicked links in Brevo:', email);
    return { success: true };
  } catch (error) {
    console.error('Failed to update contact in Brevo:', error);
    return { success: false, error };
  }
}

/**
 * Send quiz results via Brevo
 */
export async function sendQuizResultsViaBrevo(email: string, results: QuizResults, name?: string) {
  try {
    if (!BREVO_API_KEY) {
      // Fall back to Resend if Brevo is not configured
      console.log('Brevo not configured, falling back to Resend');
      return sendQuizResultsViaResend(email, results);
    }

    const { matchedInvestments, leadId } = results;
    const unsubscribeUrl = getUnsubscribeUrl(email);

    // Add contact to Brevo first
    await addContactToBrevo(email, leadId || 'unknown', name, matchedInvestments);

    // Generate plain text version
    const plainTextContent = `
Your Full List of Investment Ideas

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
    <h1 style="color: #2E7D32; text-align: center; margin-bottom: 8px; font-size: 24px;">Your Full List of Investment Ideas</h1>
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

    // Prepare email data for Brevo
    const emailData = {
      sender: {
        name: 'Kevin at MarketVibe',
        email: 'kevin@marketvibe.app'
      },
      to: [{
        email: email,
        name: name || email
      }],
      subject: 'Your Full Quiz Results - Additional investment ideas unlocked',
      htmlContent: htmlContent,
      textContent: plainTextContent,
      headers: {
        'List-Unsubscribe': `<${unsubscribeUrl}>`
      }
    };

    // Send email via Brevo API
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      body: JSON.stringify(emailData)
    });

    if (!response.ok) {
      // Safely attempt to parse error response
      const errorText = await response.text();
      let errorData = {};
      try {
        if (errorText) {
          errorData = JSON.parse(errorText);
        }
      } catch (e) {
        // If JSON parsing fails, use the raw text
        errorData = { rawError: errorText || 'No response body' };
      }
      throw new Error(`Brevo email API error: ${response.status} ${JSON.stringify(errorData)}`);
    }

    console.log('Successfully sent quiz results email via Brevo');
    return { success: true };
  } catch (error) {
    console.error('Failed to send quiz results email via Brevo:', error);
    // Fall back to Resend if Brevo sending fails
    console.log('Falling back to Resend for email delivery');
    return sendQuizResultsViaResend(email, results);
  }
}

/**
 * Legacy function for Resend (kept for backward compatibility)
 */
export async function sendQuizResultsViaResend(email: string, results: QuizResults) {
  try {
    const { matchedInvestments } = results;
    const unsubscribeUrl = getUnsubscribeUrl(email);

    // Generate plain text version
    const plainTextContent = `
Your Full List of Investment Ideas

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
    <h1 style="color: #2E7D32; text-align: center; margin-bottom: 8px; font-size: 24px;">Your Full List of Investment Ideas</h1>
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

    // Send email using Resend (fallback method)
    await resendEmail.emails.send({
      from: 'Kevin at MarketVibe <kevin@marketvibe.app>',
      to: email,
      subject: 'Your Full Quiz Results - Additional investment ideas unlocked',
      html: htmlContent,
      text: plainTextContent,
      headers: {
        'List-Unsubscribe': `<${unsubscribeUrl}>`
      }
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send quiz results email via Resend:', error);
    return { success: false, error };
  }
}

// Export renamed legacy functions for backward compatibility
export const sendQuizResults = sendQuizResultsViaBrevo;
export const addContactToAudience = async (email: string) => {
  // Try to add to Brevo first
  if (BREVO_API_KEY && BREVO_LIST_ID) {
    const result = await addContactToBrevo(email, 'general_signup');
    if (result.success) return true;
  }
  
  // Fall back to Resend if needed
  try {
    await resendAdmin.contacts.create({
      email,
      unsubscribed: false,
      audienceId: GENERAL_AUDIENCE_ID
    });
    console.log('Successfully added contact to Resend audience:', email);
    return true;
  } catch (error) {
    console.error('Failed to add contact to audience:', error);
    return false;
  }
};