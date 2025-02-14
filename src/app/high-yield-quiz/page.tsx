// src/app/high-yield-quiz/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, MotionProps } from 'framer-motion';
import QuizContainer from '@/components/quiz/base/QuizContainer';
import type { Quiz } from '@/lib/quiz/types';
import { defaultQuizQuestions } from '@/lib/quiz-data';
import Footer from '@/components/Footer';
import { Clock, DollarSign, Shield, CheckCircle, ChevronRight } from 'lucide-react';

type MotionDivProps = MotionProps & React.ComponentProps<'div'>;
const MotionDiv = motion.div as React.FC<MotionDivProps>;

export default function HighYieldQuizPage() {
  const [quizStarted, setQuizStarted] = useState(false);

  const quiz: Quiz = {
    id: 'high-yield-quiz',
    slug: 'high-yield-quiz',
    title: 'High-Yield Investment Quiz',
    headingText: 'Discover Your Perfect High-Yield Investment Strategy in 60 Seconds',
    description: 'Discover your perfect high-yield investment strategy',
    emailCaptureMessage: 'Get your personalized high-yield investment recommendations',
    resultsLayout: 'standard',
    active: true,
    navigationSettings: {
      allowBack: true,
      showProgressBar: true,
      showQuestionCount: true,
      showStartPrompt: true
    },
    seoMetadata: {
      title: 'High-Yield Investment Quiz | Find Your Perfect Investment Strategy',
      description: 'Take our 60-second quiz to discover high-yield investment opportunities tailored to your goals and risk tolerance.',
      keywords: ['high-yield investments', 'investment quiz', 'investment strategy']
    }
  };

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
          {/* Logo and stats section - always visible but resizes */}
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

          {/* Quiz section - always present */}
          <div id="quiz-section" className="max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
              {!quizStarted && (
                <MotionDiv
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <h1 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">
                    Discover Your Perfect High-Yield Investment Strategy in 60 Seconds
                  </h1>
                  <p className="text-gray-600 mb-6 md:mb-8">
                    Join 10,000+ investors who found their ideal high-yield opportunities
                  </p>
                </MotionDiv>
              )}
            </AnimatePresence>

            <QuizContainer 
              quiz={quiz}
              questions={defaultQuizQuestions}
              onStart={handleQuizStart}
            />

            {!quizStarted && (
              <p className="text-center text-gray-600 mt-3 md:mt-4">
                Free personalized high-yield investment ideas delivered instantly
              </p>
            )}
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

              {/* Value Proposition */}
              <section className="bg-white">
                <div className="container max-w-4xl mx-auto px-4 py-12">
                  <h2 className="text-2xl font-bold text-center mb-8">Why Take The Quiz?</h2>
                  <div className="space-y-4 max-w-2xl mx-auto mb-12">
                    {[
                      'Get personalized high-yield ideas based on your goals',
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
                      Ready to Find Your High-Yield Investment Path?
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
