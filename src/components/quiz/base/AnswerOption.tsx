// src/components/quiz/AnswerOption.tsx
import React from 'react';
import { motion, MotionProps } from 'framer-motion';
import type { Question, QuestionOption } from '@/lib/quiz/types';

// Define proper motion component types
type MotionButtonProps = MotionProps & React.ComponentProps<'button'>;
const MotionButton = motion.button as React.FC<MotionButtonProps>;

type MotionDivProps = MotionProps & React.ComponentProps<'div'>;
const MotionDiv = motion.div as React.FC<MotionDivProps>;

const CheckIcon: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <svg 
    style={{
      width: '2.5rem',
      height: '2.5rem',
      color: '#228B22',
      ...style
    }}
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M5 13l4 4L19 7" 
    />
  </svg>
);

interface AnswerOptionProps {
  option: Question['options'][0];
  isSelected: boolean;
  onSelect: () => void;
  animationDelay: number;
}

const AnswerOption: React.FC<AnswerOptionProps> = ({ 
  option, 
  isSelected, 
  onSelect,
  animationDelay 
}) => {
  return (
    <MotionButton
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: animationDelay,
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`
        relative w-full p-4 rounded-xl
        border-2 transition-all duration-200
        ${isSelected ? 'shadow-green-selected border-[#228B22] bg-[#F0FFF0]' : 'shadow-green border-transparent bg-white hover:border-[#228B22]/20'}
        ${isSelected ? 'text-[#228B22]' : 'text-gray-700'}
        cursor-pointer
        hover:bg-[#F8FFF8]
      `}
    >
      <div className="flex items-center justify-between">
        <span className="text-left font-medium">{option.text}</span>
        {isSelected && (
          <MotionDiv
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="ml-4 flex-shrink-0"
          >
            <CheckIcon />
          </MotionDiv>
        )}
      </div>
    </MotionButton>
  );
};

export default AnswerOption;