// src/components/quiz/QuestionCard.tsx
import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Question } from '@/types/quiz';
import AnswerOption from './AnswerOption';

interface QuestionCardProps {
  question: Question;
  onAnswer: (questionId: string, optionId: string) => void;
  selectedOption?: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onAnswer, selectedOption }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ 
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        padding: '1.5rem'
      }}
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">{question.text}</h2>
      <div className="space-y-3">
        {question.options.map((option: Question['options'][0], index: number) => (
          <AnswerOption
            key={option.id}
            option={option}
            isSelected={selectedOption === option.id}
            onSelect={() => onAnswer(question.id, option.id)}
            animationDelay={index * 0.1}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default QuestionCard;