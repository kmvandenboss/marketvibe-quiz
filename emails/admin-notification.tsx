// src/emails/admin-notification.tsx
import {
    Container,
    Heading,
    Hr,
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
  
  export const AdminEmailTemplate = ({
    email,
    name,
    responses,
    score,
    timestamp,
  }: AdminEmailTemplateProps) => {
    return (
      <Container style={container}>
        <Heading style={h1}>New Quiz Submission</Heading>
        
        <Section style={section}>
          <Text style={text}>
            <strong>From:</strong> {name ? `${name} (${email})` : email}
          </Text>
          <Text style={text}>
            <strong>Time:</strong> {formatDate(timestamp)}
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
  
  const hr = {
    borderColor: '#cccccc',
    margin: '20px 0',
  };