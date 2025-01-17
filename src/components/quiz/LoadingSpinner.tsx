// src/components/quiz/LoadingSpinner.tsx
import React from 'react';
import { motion, MotionProps } from 'framer-motion';
import { Card, CardContent, CardHeader } from '../ui/card';
import { skeletonVariants } from '@/components/ui/animations';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'spinner' | 'skeleton';
  className?: string;
}

interface MotionDivProps extends MotionProps {
  className?: string;
  children?: React.ReactNode;
}

interface MotionSvgProps extends MotionProps {
  className?: string;
  xmlns?: string;
  fill?: string;
  viewBox?: string;
}

interface MotionPathProps extends MotionProps {
  className?: string;
  fill?: string;
  d?: string;
}

interface MotionCircleProps extends MotionProps {
  className?: string;
  cx?: string | number;
  cy?: string | number;
  r?: string | number;
  stroke?: string;
  strokeWidth?: string | number;
}

const MotionDiv = motion.div as React.FC<MotionDivProps>;
const MotionSvg = motion.svg as React.FC<MotionSvgProps>;
const MotionPath = motion.path as React.FC<MotionPathProps>;
const MotionCircle = motion.circle as React.FC<MotionCircleProps>;

export function LoadingSpinner({ 
  size = 'medium', 
  variant = 'spinner',
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  if (variant === 'skeleton') {
    return (
      <Card className="w-full">
        <CardHeader>
          <MotionDiv 
            className="h-8 w-3/4 bg-gray-200 rounded-md"
            variants={skeletonVariants}
            initial="initial"
            animate="animate"
          />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <MotionDiv
              key={`skeleton-${index}`}
              className="h-14 w-full bg-gray-200 rounded-lg"
              variants={skeletonVariants}
              initial="initial"
              animate="animate"
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: index * 0.1
              }}
            />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <div role="status" className={`flex justify-center items-center ${className}`}>
      <MotionSvg
        className={`${sizeClasses[size]} text-blue-600`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        initial={{ rotate: 0 }}
        animate={{ 
          rotate: 360,
          transition: {
            duration: 1,
            ease: "linear",
            repeat: Infinity
          }
        }}
      >
        <MotionCircle
          className="opacity-25"
          cx={12}
          cy={12}
          r={10}
          stroke="currentColor"
          strokeWidth={4}
        />
        <MotionPath
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </MotionSvg>
      <span className="sr-only">Loading...</span>
    </div>
  );
}