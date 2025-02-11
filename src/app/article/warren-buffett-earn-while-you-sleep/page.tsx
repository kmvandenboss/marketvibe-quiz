// src/app/article/warren-buffett-earn-while-you-sleep/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import QuizContainer from '@/components/quiz/base/QuizContainer';
import Footer from '@/components/Footer';
import { ArrowDown } from 'lucide-react';
import type { Quiz, Question } from '@/lib/quiz/types';

export default function WarrenBuffettArticle() {
  const [quizData, setQuizData] = useState<{ quiz: Quiz; questions: Question[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        // Fetch the specific quiz using the ID
        const response = await fetch('/api/quiz/high-yield-quiz');
        if (!response.ok) {
          throw new Error('Failed to load quiz');
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
  }, []);

  const scrollToQuiz = () => {
    document.getElementById('quiz-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-grow">
        {/* Header Section */}
        <div className="container max-w-6xl mx-auto px-4 py-3 md:py-6">
          <div className="flex justify-between items-center mb-8">
            <div className="w-[20%]">
              <Link href="/">
                <Image
                  src="/images/MarketVibe-logo.png"
                  alt="MarketVibe Logo"
                  width={748}
                  height={368}
                  className="w-full h-auto"
                  priority
                />
              </Link>
            </div>
          </div>

          {/* Article Content */}
          <article className="max-w-3xl mx-auto prose prose-lg">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">
              Warren Buffett Says You Need To 'Find A Way To Make Money While You Sleep' Or You'll Work Until You...
            </h1>

            <div className="my-8">
              <p className="text-xl font-semibold mb-6">
                Warren Buffett famously said, <strong>"If you don't find a way to make money while you sleep, you will work until you die."</strong>
              </p><br/>

              <p>Let that sink in for a second.</p>

                {/* New CTA Box */}
                <div className="my-8 bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-[rgb(50,205,50)] rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Want to find out how to make your money work for you 24/7?
                </h3>
                <p className="text-gray-700 mb-4">
                  Take this 60-second quiz to get personalized high-yield investment ideas that can help you build passive income.
                </p>
                <button
                  onClick={scrollToQuiz}
                  className="bg-[rgb(50,205,50)] text-white px-6 py-3 rounded-lg font-semibold flex items-center hover:bg-[rgb(45,185,45)] transition-colors"
                >
                  Take the Quiz <ArrowDown className="ml-2 w-4 h-4" />
                </button>
              </div>

              <p>
                It's not just a catchy quote—it’s a warning. If your money isn't working for you 24/7, 
                life becomes a grind of never-ending work. Clock in. Clock out. Repeat.
              </p><br/>

              <p>
                But there's another path. It's the one wealthy people know well. A simple concept that 
                most people overlook:
              </p>

              <p className="text-xl font-semibold my-4">Passive income.</p>

              <p>
                The kind of income that flows into your account day and night, whether you're watching Netflix, 
                lying on a beach, or fast asleep. It's how fortunes are made. And here's the good news—<strong>it’s 
                easier to get started than you think.</strong>
              </p><br/>

              <h2 className="text-2xl font-bold mt-8 mb-4">Why Most People Never Get Rich</h2>

              <p>
                Most people think wealth is built by working harder, saving more, and waiting patiently for retirement.
              </p><br/>

              <p>Wrong.</p><br/>

              <p>
                The truth is, wealth isn't about how much money you have saved. It's about owning assets. 
                Money can buy things, but then what? Once you spend it, it's gone.
              </p><br/>

              <p>
                While most people hustle endlessly, hoping to retire in comfort, the wealthy quietly invest 
                in opportunities that generate passive cash flow—monthly income that keeps stacking up 
                without lifting a finger.
              </p><br/>

              <p>
                It's not luck. It's a strategy. A system.<br />
                And once you unlock it, it changes everything.
              </p><br/>

              <p>
                Suddenly, life gets lighter. You stop worrying about money because you know your money is 
                working for you. Even while you sleep.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">Here's How You Start—In 60 Seconds</h2>

              <p>We've built a tool that takes the guesswork out of it.</p><br/>

              <p><strong>It’s a quick 5-question quiz that matches you with high-yield investment ideas</strong>—the kind that can create passive income streams and start putting your money to work immediately.</p><br/>
                
                <p>Think about it. In less than a minute, you’ll have a customized plan to grow your wealth while you sleep. No boring spreadsheets. No hours of research. Just a few questions and you’re on your way.</p><br/>
                
                <p><strong>It’s simple, it’s fast, and it could change your life.</strong></p>

              <div className="bg-gray-50 border rounded-lg p-6 my-8">
                <p className="text-xl font-semibold mb-4">
                  Take our quick 5-question quiz to get matched with high-yield investment ideas-the kind 
                  that can create passive income streams and start putting your money to work immediately.
                </p>


                <button
                  onClick={scrollToQuiz}
                  className="bg-[rgb(50,205,50)] text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center mx-auto hover:bg-[rgb(45,185,45)] transition-colors"
                >
                  Take the Quiz <ArrowDown className="ml-2 w-5 h-5" />
                </button>
              </div>
            </div>
          </article>

          {/* Quiz Section */}
          <div id="quiz-section" className="max-w-2xl mx-auto mt-16">
            {loading ? (
              <div className="text-center py-8">Loading quiz...</div>
            ) : quizData ? (
              <QuizContainer 
                quiz={quizData.quiz}
                questions={quizData.questions}
              />
            ) : (
              <div className="text-center py-8">Failed to load quiz</div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}