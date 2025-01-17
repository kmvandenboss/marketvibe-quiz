// src/emails/user-autoresponder.tsx
import {
    Container,
    Heading,
    Hr,
    Section,
    Text,
  } from '@react-email/components';
  
  interface UserEmailTemplateProps {
    name: string;
    timestamp: string;
  }
  
  // Helper function for consistent date formatting
  const formatDate = (date: string) => {
    const d = new Date(date);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'UTC'
    }).format(d);
  };
  
  export const UserEmailTemplate = ({
    name,
    timestamp,
  }: UserEmailTemplateProps) => {
    return (
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
            This email was sent on {formatDate(timestamp)}
          </Text>
        </Section>
      </Container>
    );
  };
  
  // Styles
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