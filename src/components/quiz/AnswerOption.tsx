// src/components/quiz/AnswerOption.tsx
import { motion, MotionProps } from 'framer-motion';
import React from 'react';
import { QuestionOption } from '@/types/quiz';
import { Check } from 'lucide-react';
import { answerOptionVariants, checkmarkVariants } from '@/components/ui/animations';

interface AnswerOptionProps {
  option: QuestionOption;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

interface MotionButtonProps extends MotionProps {
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

interface MotionDivProps extends MotionProps {
  className?: string;
  children?: React.ReactNode;
}

const MotionButton = motion.button as React.FC<MotionButtonProps>;
const MotionDiv = motion.div as React.FC<MotionDivProps>;

export function AnswerOption({ 
  option, 
  selected, 
  onClick,
  disabled = false 
}: AnswerOptionProps) {
  return (
    <MotionButton
      onClick={onClick}
      disabled={disabled}
      variants={answerOptionVariants}
      initial="initial"
      animate={selected ? ["animate", "selected"] : "animate"}
      whileHover={!disabled && !selected ? "hover" : undefined}
      whileTap={!disabled && !selected ? "tap" : undefined}
      className={`w-full p-4 text-left rounded-lg transition-colors duration-200 flex items-center justify-between gap-4 ${
        selected
          ? 'border-2 border-blue-500 bg-blue-50 text-blue-900'
          : 'border border-gray-200 hover:border-blue-500 hover:bg-gray-50'
      } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
    >
      <span className="flex-1">{option.text}</span>
      {selected && (
        <MotionDiv
          variants={checkmarkVariants}
          initial="initial"
          animate="animate"
          className="flex-shrink-0"
        >
          <Check className="h-6 w-6 text-green-500 stroke-2" />
        </MotionDiv>
      )}
    </MotionButton>
  );
}