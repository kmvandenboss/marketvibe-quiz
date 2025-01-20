// src/components/quiz/AnswerOption.tsx
import React from 'react';
import { motion, MotionProps } from 'framer-motion';
import { Question } from '@/types/quiz';

const CheckIcon: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <svg 
    style={{
      width: '1.5rem',
      height: '1.5rem',
      color: '#3B82F6',
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

type MotionButtonProps = MotionProps & React.ComponentProps<'button'>;
const MotionButton = motion.button as React.FC<MotionButtonProps>;

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
      transition={{ delay: animationDelay }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      style={{
        width: '100%',
        padding: '1rem',
        borderRadius: '0.5rem',
        border: '2px solid',
        borderColor: isSelected ? '#3B82F6' : '#E5E7EB',
        backgroundColor: isSelected ? '#EFF6FF' : 'transparent',
        color: isSelected ? '#1D4ED8' : '#374151',
        transition: 'all 200ms',
        cursor: 'pointer'
      }}
    >
      <span style={{ display: 'block', textAlign: 'left' }}>{option.text}</span>
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={{
            position: 'absolute',
            right: '1rem',
            top: '50%',
            transform: 'translateY(-50%)'
          }}
        >
          <CheckIcon />
        </motion.div>
      )}
    </MotionButton>
  );
};

export default AnswerOption;