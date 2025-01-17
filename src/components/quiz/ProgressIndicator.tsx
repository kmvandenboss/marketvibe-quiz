// src/components/quiz/ProgressIndicator.tsx
import React from 'react';
import { motion, MotionProps } from 'framer-motion';
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { progressVariants } from '@/components/ui/animations';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

interface MotionDivProps extends MotionProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const MotionDiv = motion.div as React.FC<MotionDivProps>;
const MotionSpan = motion.span as React.FC<MotionDivProps>;

export function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  const progress = (currentStep / (totalSteps - 1)) * 100;

  return (
    <div className="space-y-2">
      <ProgressPrimitive.Root
        className="relative h-2 w-full overflow-hidden rounded-full bg-gray-100"
      >
        <MotionDiv
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
          initial={{ scaleX: 0 }}
          animate={{ 
            scaleX: progress / 100,
            transition: {
              type: "spring",
              stiffness: 260,
              damping: 20
            }
          }}
          style={{ 
            transformOrigin: 'left'
          }}
        />
      </ProgressPrimitive.Root>
      
      <MotionDiv 
        className="flex justify-between items-center"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <MotionSpan 
          className="text-sm font-medium text-gray-700"
          key={`step-${currentStep}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          Question {currentStep + 1} of {totalSteps - 1}
        </MotionSpan>
        
        <MotionSpan 
          className="text-sm font-medium text-blue-600"
          key={`progress-${progress}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {Math.round(progress)}% Complete
        </MotionSpan>
      </MotionDiv>

      <div className="h-6" aria-hidden="true" />
    </div>
  );
}