// src/app/quiz/[slug]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence, MotionProps } from 'framer-motion';
import QuizContainer from '@/components/quiz/base/QuizContainer';
import Footer from '@/components/Footer';
import { Clock, DollarSign, Shield, CheckCircle, ChevronRight } from 'lucide-react';
import type { Quiz, Question } from '@/lib/quiz/types';

type MotionDivProps = MotionProps & React.ComponentProps<'div'>;
const MotionDiv = motion.div as React.FC<MotionDivProps>;

export default function DynamicQuizPage() {
  const params = useParams();
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizData, setQuizData] = useState<{ quiz: Quiz; questions: Question[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await fetch(`/api/quiz/${params.slug}`);
        if (!response.ok) {
          throw new Error('Quiz not found');
        }
        const data = await response.json();
        setQuizData(data);
      } catch (error) {
        console.error('Error fetching quiz:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [params.slug]);

  if (loading) {
    return <div>Loading...</div>; // Replace with your loading component
  }

  if (!quizData) {
    return <div>Quiz not found</div>; // Replace with your 404 component
  }

  const { quiz, questions } = quizData;

  const handleQuizStart = () => {
    setQuizStarted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToQuiz = () => {
    document.getElementById('quiz-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-grow">
        <div className="container max-w-6xl mx-auto px-4 py-3 md:py-6">
          {/* Logo and stats section */}
            <div className="flex justify-between items-center mb-4 md:mb-8">
              <div className={quizStarted ? "w-[15%]" : "w-[20%]"}>
                <Image
                  src="/images/MarketVibe-logo.png"
                  alt="MarketVibe Logo"
                  width={748}
                  height={368}
                  className="w-full h-auto"
                  priority
                />
              </div>
              <div className="text-gray-600 text-sm md:text-base">
              27,492 investors helped
            </div>
            </div>
          

          {/* Quiz section */}
          <div id="quiz-section" className="max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
              {!quizStarted && (
                <MotionDiv
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <h1 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">
                    {quiz.title}
                  </h1>
                  {quiz.description && (
                    <p className="text-gray-600 mb-6 md:mb-8">
                      {quiz.description}
                    </p>
                  )}
                </MotionDiv>
              )}
            </AnimatePresence>

            <QuizContainer 
              quiz={quiz}
              questions={questions}
              onStart={handleQuizStart} 
            />
          </div>
        </div>

        {/* Marketing sections - only visible before quiz starts */}
        <AnimatePresence>
          {!quizStarted && (
            <MotionDiv
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Trust Indicators */}
              <section className="bg-gray-50 border-y">
                <div className="container max-w-4xl mx-auto px-4 py-12">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex items-center space-x-4">
                      <Shield className="w-8 h-8 text-gray-700" />
                      <div>
                        <h3 className="font-bold">Bank-Level Security</h3>
                        <p className="text-gray-600">Your data is always protected</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Clock className="w-8 h-8 text-gray-700" />
                      <div>
                        <h3 className="font-bold">Quick & Easy</h3>
                        <p className="text-gray-600">Complete in under 60 seconds</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <DollarSign className="w-8 h-8 text-gray-700" />
                      <div>
                        <h3 className="font-bold">100% Free</h3>
                        <p className="text-gray-600">No credit card required</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              
                <section className="bg-white">
                  <div className="container max-w-4xl mx-auto px-4 py-12">
                    <h2 className="text-2xl font-bold text-center mb-8">
                      Why Take The Quiz?
                    </h2>
                    <div className="space-y-4 max-w-2xl mx-auto mb-12">
                      {[
                        'Get personalized investment ideas based on your goals',
                        'Access expert insights typically reserved for high-net-worth clients',
                        'Discover little-known investment strategies used by top investors',
                        'Receive a customized investment roadmap instantly'
                      ].map((text, index) => (
                        <div key={index} className="flex items-center space-x-4">
                          <CheckCircle className="w-6 h-6 flex-shrink-0 text-[rgb(50,205,50)]" />
                          <p>{text}</p>
                        </div>
                      ))}
                    </div>

                    {/* Final CTA */}
                    <div className="text-center">
                      <h3 className="text-xl font-bold mb-2">
                        Ready to Find Your Ideal Investment Path?
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Markets change daily - get your personalized investment ideas now
                      </p>
                      <button
                        onClick={scrollToQuiz}
                        className="bg-[rgb(50,205,50)] text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center mx-auto hover:bg-[rgb(45,185,45)] transition-colors"
                      >
                        Start Your 60-Second Assessment <ChevronRight className="ml-2 w-5 h-5" />
                      </button>
                      <p className="text-gray-500 text-sm mt-4">
                        100% free • No credit card required • Unsubscribe anytime
                      </p>
                    </div>
                  </div>
                </section>
              
            </MotionDiv>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}