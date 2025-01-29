import React, { useState } from 'react';
import { motion, MotionProps } from 'framer-motion';
import Link from 'next/link';

interface EmailCaptureFormProps {
  onSubmit: (email: string) => void;
  matchedOptionsCount: number;
}

type MotionDivProps = MotionProps & React.ComponentProps<'div'>;
type MotionButtonProps = MotionProps & React.ComponentProps<'button'>;
const MotionDiv = motion.div as React.FC<MotionDivProps>;
const MotionButton = motion.button as React.FC<MotionButtonProps>;

const EmailCaptureForm: React.FC<EmailCaptureFormProps> = ({ onSubmit, matchedOptionsCount }) => {
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sendConversion = async (email: string) => {
    try {
      const response = await fetch('/api/meta-conversion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          eventName: 'Lead',
          eventData: {
            matched_options: matchedOptionsCount,
          },
        }),
      });

      if (!response.ok) {
        console.error('Failed to send conversion event');
      }
    } catch (error) {
      console.error('Error sending conversion:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setIsValid(false);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Send conversion event to Meta
      await sendConversion(email);
      
      // Call the original onSubmit handler
      onSubmit(email);
    } catch (error) {
      console.error('Form submission error:', error);
      // Still call onSubmit even if conversion tracking fails
      onSubmit(email);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        padding: '1.5rem'
      }}
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Based on your answers, we have{' '}
        <span className="text-blue-600 font-bold">
          {matchedOptionsCount} high-yield investment
        </span>{' '}
        {matchedOptionsCount === 1 ? 'idea' : 'ideas'} for you
      </h2>
      <p className="text-gray-600 mb-6">
        Enter your email below to see your personalized investment recommendations.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label 
            htmlFor="email" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setIsValid(true);
            }}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              !isValid ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="your@email.com"
            required
            disabled={isSubmitting}
          />
          {!isValid && (
            <MotionDiv
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                marginTop: '0.25rem',
                fontSize: '0.875rem',
                color: '#DC2626'
              }}
            >
              Please enter a valid email address
            </MotionDiv>
          )}
        </div>
        
        <MotionButton
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '100%',
            backgroundColor: '#2563EB',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            fontWeight: 500,
            transition: 'background-color 200ms',
            opacity: isSubmitting ? 0.7 : 1,
          }}
        >
          {isSubmitting ? 'Processing...' : 'Show My Results'}
        </MotionButton>
      </form>
      
      <p className="mt-4 text-xs text-gray-500 text-center">
        By submitting, you agree to receive communication about your investment strategy. 
        Your information will be handled according to our{' '}
        <Link href="/privacy-policy" className="text-blue-600 hover:underline">
          privacy policy
        </Link>.
      </p>
    </MotionDiv>
  );
};

export default EmailCaptureForm;