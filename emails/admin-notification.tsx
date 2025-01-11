// src/emails/admin-notification.tsx
import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Preview,
    Section,
    Text,
  } from '@react-email/components';
  import { UserResponse } from '@/types/quiz';
  
  interface AdminEmailTemplateProps {
    email: string;
    name?: string;
    responses: UserResponse[];
    score: Record<string, number>;
    timestamp: string;
  }
  
  export const AdminEmailTemplate = ({
    email,
    name,
    responses,
    score,
    timestamp,
  }: AdminEmailTemplateProps) => {
    const previewText = `New quiz submission from ${name || email}`;
  
    return (
      <Html>
        <Head />
        <Preview>{previewText}</Preview>
        <Body style={main}>
          <Container style={container}>
            <Heading style={h1}>New Quiz Submission</Heading>
            
            <Section style={section}>
              <Text style={text}>
                <strong>From:</strong> {name ? `${name} (${email})` : email}
              </Text>
              <Text style={text}>
                <strong>Time:</strong> {new Date(timestamp).toLocaleString()}
              </Text>
            </Section>
  
            <Hr style={hr} />
  
            <Section style={section}>
              <Heading style={h2}>Score Summary</Heading>
              {Object.entries(score).map(([tag, value]) => (
                <Text key={tag} style={text}>
                  {tag}: {value.toFixed(1)}%
                </Text>
              ))}
            </Section>
  
            <Hr style={hr} />
  
            <Section style={section}>
              <Heading style={h2}>Responses</Heading>
              {responses.map((response, index) => (
                <Text key={index} style={text}>
                  Question {index + 1}: {response.selectedOptionIds.join(', ')}
                </Text>
              ))}
            </Section>
          </Container>
        </Body>
      </Html>
    );
  };
  
  // src/emails/user-autoresponder.tsx
  interface UserEmailTemplateProps {
    name: string;
    timestamp: string;
  }
  
  export const UserEmailTemplate = ({
    name,
    timestamp,
  }: UserEmailTemplateProps) => {
    const previewText = 'Your Investment Strategy Results';
  
    return (
      <Html>
        <Head />
        <Preview>{previewText}</Preview>
        <Body style={main}>
          <Container style={container}>
            <Heading style={h1}>Thank You, {name}!</Heading>
            
            <Section style={section}>
              <Text style={text}>
                Thank you for completing our investment strategy quiz. Your results have been
                carefully analyzed based on your responses.
              </Text>
              
              <Text style={text}>
                You can now review your personalized investment recommendations on our website.
                These options have been selected based on your risk tolerance, investment goals,
                and preferences.
              </Text>
  
              <Text style={text}>
                Please note that this is not financial advice, and you should always conduct
                your own research or consult with a financial advisor before making any
                investment decisions.
              </Text>
            </Section>
  
            <Hr style={hr} />
  
            <Section style={section}>
              <Text style={footer}>
                This email was sent on {new Date(timestamp).toLocaleString()}
              </Text>
            </Section>
          </Container>
        </Body>
      </Html>
    );
  };
  
  // Shared styles
  const main = {
    backgroundColor: '#ffffff',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  };
  
  const container = {
    margin: '0 auto',
    padding: '20px 0 48px',
    maxWidth: '580px',
  };
  
  const section = {
    padding: '24px',
  };
  
  const h1 = {
    color: '#333',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '30px 0',
    padding: '0',
  };
  
  const h2 = {
    color: '#444',
    fontSize: '20px',
    fontWeight: 'bold',
    margin: '20px 0',
    padding: '0',
  };
  
  const text = {
    color: '#333',
    fontSize: '16px',
    lineHeight: '24px',
    margin: '16px 0',
  };
  
  const footer = {
    color: '#898989',
    fontSize: '14px',
    lineHeight: '20px',
  };
  
  const hr = {
    borderColor: '#cccccc',
    margin: '20px 0',
  };