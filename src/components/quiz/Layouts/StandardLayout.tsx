// src/components/quiz/layouts/StandardLayout.tsx
import { motion, AnimatePresence } from 'framer-motion';
import type { Quiz, Question } from '@/lib/quiz/types';
import { QuizContainer } from '../base/QuizContainer';

interface StandardLayoutProps {
  quiz: Quiz;
  questions: Question[];
}

export const StandardLayout: React.FC<StandardLayoutProps> = ({
  quiz,
  questions
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-grow">
        <div className="container max-w-2xl mx-auto px-4 py-3 md:py-6">
          <QuizContainer
            quiz={quiz}
            questions={questions}
          />
        </div>
      </main>
    </div>
  );
};

export default StandardLayout;