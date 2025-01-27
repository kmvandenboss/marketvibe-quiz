// src/app/high-yield-quiz/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, MotionProps } from 'framer-motion';
import QuizContainer from '@/components/quiz/QuizContainer';
import { Clock, DollarSign, Shield, CheckCircle, ChevronRight } from 'lucide-react';
import type { Question } from '@/types/quiz';

// Add this after the imports and before the component:
const sampleQuestions: Question[] = [
  {
    id: '1',
    text: 'What is your primary investment goal?',
    type: 'single',
    order: 1,
    options: [
      { id: '1a', text: 'Growth - I want to grow my wealth over time', tags: ['growth_focused', 'appreciation'], weight: 1 },
      { id: '1b', text: 'Income - I want regular returns from my investments', tags: ['income_focused', 'distributions'], weight: 1 },
      { id: '1c', text: 'Preservation - I want to protect my existing wealth', tags: ['conservative', 'low_risk'], weight: 1 },
    ],
  },
  {
    id: '2',
    text: 'How comfortable are you with investment risk?',
    type: 'single',
    order: 2,
    options: [
      { id: '2a', text: 'Very comfortable - I can handle market volatility', tags: ['high_risk', 'growth_focused'], weight: 1 },
      { id: '2b', text: 'Somewhat comfortable - I prefer moderate risks', tags: ['moderate_risk', 'balanced'], weight: 1 },
      { id: '2c', text: 'Not comfortable - I prefer safer investments', tags: ['low_risk', 'conservative'], weight: 1 },
    ],
  },
  {
    id: '3',
    text: 'What is your investment time horizon?',
    type: 'single',
    order: 3,
    options: [
      { id: '3a', text: 'Short-term (Less than 2 years)', tags: ['short_term', 'high_liquidity'], weight: 1 },
      { id: '3b', text: 'Medium-term (2-5 years)', tags: ['medium_term', 'moderate_liquidity'], weight: 1 },
      { id: '3c', text: 'Long-term (5+ years)', tags: ['long_term', 'illiquid_okay'], weight: 1 },
    ],
  },
  {
    id: '4',
    text: 'What is your current investment experience?',
    type: 'single',
    order: 4,
    options: [
      { id: '4a', text: 'Beginner - New to investing', tags: ['beginner', 'conservative'], weight: 1 },
      { id: '4b', text: 'Intermediate - Some investment experience', tags: ['intermediate', 'balanced'], weight: 1 },
      { id: '4c', text: 'Advanced - Experienced investor', tags: ['advanced', 'growth_focused'], weight: 1 },
    ],
  },
  {
    id: '5',
    text: 'How much capital do you plan to invest?',
    type: 'single',
    order: 5,
    options: [
      { id: '5a', text: '$1,000 - $10,000', tags: ['small_cap', 'retail'], weight: 1 },
      { id: '5b', text: '$10,000 - $50,000', tags: ['medium_cap', 'retail'], weight: 1 },
      { id: '5c', text: '$50,000+', tags: ['large_cap', 'accredited'], weight: 1 },
    ],
  },
  {
    id: '6',
    text: 'What is your preferred investment style?',
    type: 'single',
    order: 6,
    options: [
      { id: '6a', text: 'Hands-off - I prefer automated or managed solutions', tags: ['passive', 'managed'], weight: 1 },
      { id: '6b', text: 'Hybrid - I want some control but also guidance', tags: ['hybrid', 'balanced'], weight: 1 },
      { id: '6c', text: 'Active - I want full control over my investments', tags: ['active', 'self_directed'], weight: 1 },
    ],
  }
];

type MotionDivProps = MotionProps & React.ComponentProps<'div'>;
const MotionDiv = motion.div as React.FC<MotionDivProps>;

export default function HighYieldQuizPage() {
  const [questions, setQuestions] = useState<Question[]>(sampleQuestions);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/questions');
      if (!response.ok) throw new Error('Failed to fetch questions');
      
      const data = await response.json();
      setQuestions(data.questions);
    } catch (err) {
      console.error('Error fetching questions:', err);
      setQuestions(sampleQuestions);
      setError('Failed to load questions from server, using sample questions instead');
    } finally {
      setLoading(false);
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
    <main className="min-h-screen bg-white">
      <div className="container max-w-6xl mx-auto px-4 py-6">
        {/* Logo and stats section - always visible but resizes */}
        <div className="flex justify-between items-center mb-8">
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
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {!quizStarted && (
              <MotionDiv
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <h1 className="text-2xl md:text-4xl font-bold mb-4">
                  Discover Your Perfect High-Yield Investment Strategy in 60 Seconds
                </h1>
                <p className="text-gray-600 mb-8">
                  Join 10,000+ investors who found their ideal high-yield opportunities
                </p>
              </MotionDiv>
            )}
          </AnimatePresence>

          {!loading && (
            <>
              <QuizContainer
                questions={questions}
                onStart={handleQuizStart}
              />
              {!quizStarted && (
                <p className="text-center text-gray-600 mt-4">
                  Free personalized high-yield investment ideas delivered instantly
                </p>
              )}
            </>
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
  );
}