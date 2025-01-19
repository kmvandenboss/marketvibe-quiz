// src/components/quiz/EmailCapture.tsx
import React from 'react';
import { motion, MotionProps } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { questionVariants } from '@/components/ui/animations';

interface MotionDivProps extends MotionProps {
  className?: string;
  children?: React.ReactNode;
}

const MotionDiv = motion.div as React.FC<MotionDivProps>;

interface EmailCaptureProps {
  email: string;
  setEmail: (email: string) => void;
  name: string;
  setName: (name: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

export function EmailCapture({
  email,
  setEmail,
  name,
  setName,
  onSubmit,
  isSubmitting,
}: EmailCaptureProps) {
  return (
    <MotionDiv
      variants={questionVariants}
      initial="enter"
      animate="center"
      exit="exit"
      className="w-full max-w-2xl mx-auto"
    >
      <Card>
      <CardHeader>
        <CardTitle>Get Your Personalized Results</CardTitle>
        <CardDescription>
          We've analyzed your answers. Enter your email below to see your customized investment strategy.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name (Optional)
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your name"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !email}
            fullWidth
          >
            {isSubmitting ? 'Analyzing Results...' : 'Show My Investment Strategy'}
          </Button>

          <p className="text-xs text-gray-500 mt-4">
            By submitting, you agree to receive communications about investment opportunities. 
            You can unsubscribe at any time.
          </p>
        </form>
      </CardContent>
      </Card>
    </MotionDiv>
  );
}
