// src/components/quiz/QuestionCard.tsx
import React, { useState } from 'react';
import { motion, MotionProps, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Question, QuestionOption } from '@/types/quiz';
import { AnswerOption } from './AnswerOption';
import { questionVariants } from '@/components/ui/animations';

interface QuestionCardProps {
  question: Question;
  selectedOptionIds: string[];
  onOptionSelect: (questionId: string, optionIds: string[]) => void;
  onAnimationComplete?: () => void;
  direction?: number;
}

interface MotionDivProps extends MotionProps {
  className?: string;
  children?: React.ReactNode;
  key?: string;
  custom?: number;
}

const MotionDiv = motion.div as React.FC<MotionDivProps>;

export function QuestionCard({
  question,
  selectedOptionIds,
  onOptionSelect,
  onAnimationComplete,
  direction = 1,
}: QuestionCardProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleOptionClick = async (optionId: string) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    if (question.type === 'single') {
      onOptionSelect(question.id, [optionId]);
      
      await new Promise(resolve => setTimeout(resolve, 600));
      
      onAnimationComplete?.();
    } else {
      const newSelection = selectedOptionIds.includes(optionId)
        ? selectedOptionIds.filter(id => id !== optionId)
        : [...selectedOptionIds, optionId];
      onOptionSelect(question.id, newSelection);
    }
  };

  return (
    <AnimatePresence mode="wait" initial={false} custom={direction}>
      <MotionDiv
        key={question.id}
        custom={direction}
        variants={questionVariants}
        initial="enter"
        animate="center"
        exit="exit"
        onAnimationComplete={() => setIsTransitioning(false)}
        className="w-full max-w-2xl mx-auto"
      >
        <Card>
          <CardHeader>
            <CardTitle>{question.text}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {question.options.map((option, index) => (
              <MotionDiv
                key={option.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <AnswerOption
                  key={option.id}
                  option={option}
                  selected={selectedOptionIds.includes(option.id)}
                  onClick={() => handleOptionClick(option.id)}
                  disabled={isTransitioning}
                />
              </MotionDiv>
            ))}
          </CardContent>
        </Card>
      </MotionDiv>
    </AnimatePresence>
  );
}
