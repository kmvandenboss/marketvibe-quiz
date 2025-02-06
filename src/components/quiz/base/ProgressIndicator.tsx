// src/components/quiz/ProgressIndicator.tsx
import React from 'react';
import { motion, MotionProps } from 'framer-motion';

interface ProgressIndicatorProps {
  current: number;
  total: number;
}

type MotionDivProps = MotionProps & React.ComponentProps<'div'>;
const MotionDiv = motion.div as React.FC<MotionDivProps>;

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ current, total }) => {
  // Calculate progress with a minimum of 2% to show the starting point
  const progress = Math.max(2, (current / total) * 100);
  
  // For display, we want to show current question number (current + 1)
  // except on the last question where we show the total
  const displayNumber = current === total ? total : current + 1;

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>Question {displayNumber} of {total}</span>
        <span>{Math.round((current / total) * 100)}% Complete</span>
      </div>
      <div 
        className="w-full h-4 rounded-full overflow-hidden" 
        style={{ 
          backgroundColor: '#F0F8FF',
          border: '1px solid #D0E0F0'
        }}
      >
        <MotionDiv 
          className="h-full rounded-full transition-all duration-300"
          style={{
            backgroundColor: '#32CD32',
            boxShadow: '0 0 10px rgba(50,205,50,0.5)'
          }}
          initial={{ width: '2%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};
