// src/components/sanity/PortableTextComponents.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { PortableTextComponents } from '@portabletext/react';
import { urlFor } from '@/lib/sanity';
import QuizContainer from '@/components/quiz/base/QuizContainer';
import { ArrowDown } from 'lucide-react';
import type { Quiz, Question } from '@/lib/quiz/types';

// Quiz Embed Component
function QuizEmbedComponent({ value }: { value: any }) {
  const [quizData, setQuizData] = useState<{ quiz: Quiz; questions: Question[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [showQuiz, setShowQuiz] = useState(!value.showScrollButton); // Show quiz immediately if no scroll button

  const quizSlug = value.quiz?.slug;

  // Debug logging
  console.log('Quiz Embed Debug:', {
    value,
    quizSlug,
    quizReference: value.quiz,
    showScrollButton: value.showScrollButton,
    initialShowQuiz: !value.showScrollButton
  });

  useEffect(() => {
    if (!quizSlug) {
      console.log('No quiz slug found');
      setLoading(false);
      return;
    }

    const fetchQuizData = async () => {
      try {
        console.log('Fetching quiz data for slug:', quizSlug);
        const response = await fetch(`/api/quiz/${quizSlug}`);
        console.log('Quiz API response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Failed to load quiz`);
        }
        const data = await response.json();
        console.log('Quiz data received:', data);
        setQuizData(data);
      } catch (error) {
        console.error('Error fetching quiz:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [quizSlug]);

  const handleScrollToQuiz = () => {
    setShowQuiz(true);
    setTimeout(() => {
      document.getElementById(`quiz-${quizSlug}`)?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  if (!quizSlug) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-2">Quiz not configured</div>
        <div className="text-sm text-gray-500">
          Debug info: {JSON.stringify(value, null, 2)}
        </div>
      </div>
    );
  }

  return (
    <div className="my-12" data-quiz-embed>
      {/* CTA Section - only show if we have a title, description, or scroll button */}
      {(value.title || value.description || value.showScrollButton) && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-[rgb(50,205,50)] rounded-lg p-6 shadow-sm mb-8">
          {value.title && (
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              {value.title}
            </h3>
          )}
          {value.description && (
            <p className="text-gray-700 mb-4">{value.description}</p>
          )}
          {value.showScrollButton && (
            <button
              onClick={handleScrollToQuiz}
              className="bg-[rgb(50,205,50)] text-white px-6 py-3 rounded-lg font-semibold flex items-center hover:bg-[rgb(45,185,45)] transition-colors"
            >
              {value.ctaText || 'Take the Quiz'} <ArrowDown className="ml-2 w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Quiz Section */}
      {showQuiz && (
        <div id={`quiz-${quizSlug}`} className="max-w-2xl mx-auto mt-8">
          {loading ? (
            <div className="text-center py-8">Loading quiz...</div>
          ) : quizData ? (
            <QuizContainer 
              quiz={quizData.quiz}
              questions={quizData.questions}
            />
          ) : (
            <div className="text-center py-8 text-red-500">Failed to load quiz</div>
          )}
        </div>
      )}
    </div>
  );
}

// Investment Options Component
function InvestmentOptionsComponent({ value }: { value: any }) {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const response = await fetch('/api/investment-options');
        if (!response.ok) throw new Error('Failed to fetch investments');
        const data = await response.json();
        setInvestments(data.slice(0, value.maxItems || 3));
      } catch (error) {
        console.error('Error fetching investments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestments();
  }, [value.maxItems]);

  if (loading) {
    return <div className="text-center py-8">Loading investment options...</div>;
  }

  return (
    <div className="my-12">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
        {value.description && (
          <p className="text-gray-600 max-w-2xl mx-auto">{value.description}</p>
        )}
      </div>
      
      <div className={`grid gap-6 ${
        value.layout === 'list' ? 'grid-cols-1' : 
        value.layout === 'featured' ? 'grid-cols-1 md:grid-cols-2' :
        'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      }`}>
        {investments.map((investment: any) => (
          <div key={investment.id} className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              {investment.logoUrl && (
                <Image
                  src={investment.logoUrl}
                  alt={investment.companyName}
                  width={40}
                  height={40}
                  className="rounded"
                />
              )}
              <div className="ml-3">
                <h4 className="font-semibold">{investment.title}</h4>
                <p className="text-sm text-gray-600">{investment.companyName}</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">{investment.description}</p>
            <div className="space-y-2 text-sm">
              <p><strong>Returns:</strong> {investment.returnsText}</p>
              <p><strong>Minimum:</strong> {investment.minimumInvestmentText}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Call to Action Component
function CallToActionComponent({ value }: { value: any }) {
  const handleClick = () => {
    if (value.buttonAction === 'scrollToQuiz') {
      const quizElement = document.querySelector('[id^="quiz-"]');
      if (quizElement) {
        quizElement.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (value.url) {
      window.open(value.url, value.buttonAction === 'externalLink' ? '_blank' : '_self');
    }
  };

  const getBackgroundClass = () => {
    switch (value.backgroundColor) {
      case 'lightGreen':
        return 'bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-[rgb(50,205,50)]';
      case 'lightBlue':
        return 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500';
      case 'lightGray':
        return 'bg-gray-50 border-l-4 border-gray-400';
      default:
        return 'bg-white border border-gray-200';
    }
  };

  const getButtonClass = () => {
    switch (value.style) {
      case 'primary':
        return 'bg-[rgb(50,205,50)] text-white hover:bg-[rgb(45,185,45)]';
      case 'secondary':
        return 'bg-gray-600 text-white hover:bg-gray-700';
      case 'outline':
        return 'border-2 border-[rgb(50,205,50)] text-[rgb(50,205,50)] hover:bg-[rgb(50,205,50)] hover:text-white';
      default:
        return 'bg-[rgb(50,205,50)] text-white hover:bg-[rgb(45,185,45)]';
    }
  };

  return (
    <div className={`my-8 rounded-lg p-6 shadow-sm ${getBackgroundClass()}`}>
      <h3 className="text-xl font-bold text-gray-800 mb-3">{value.title}</h3>
      {value.description && (
        <p className="text-gray-700 mb-4">{value.description}</p>
      )}
      <button
        onClick={handleClick}
        className={`px-6 py-3 rounded-lg font-semibold transition-colors ${getButtonClass()}`}
      >
        {value.buttonText}
      </button>
    </div>
  );
}

export const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) {
        return null;
      }

      return (
        <div className="my-8">
          <Image
            src={urlFor(value).width(800).height(600).fit('max').auto('format').url()}
            alt={value.alt || 'Article image'}
            width={800}
            height={600}
            className="rounded-lg w-full h-auto"
          />
          {value.caption && (
            <p className="text-sm text-gray-600 mt-2 text-center italic">
              {value.caption}
            </p>
          )}
        </div>
      );
    },
    quizEmbed: QuizEmbedComponent,
    investmentOptions: InvestmentOptionsComponent,
    callToAction: CallToActionComponent,
  },
  block: {
    h1: ({ children }) => <h1 className="text-3xl md:text-4xl font-bold mb-6 mt-8">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl font-bold mb-4 mt-8">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-bold mb-3 mt-6">{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-[rgb(50,205,50)] pl-4 my-6 italic text-lg">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{children}</code>
    ),
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target={value?.blank ? '_blank' : '_self'}
        rel={value?.blank ? 'noopener noreferrer' : undefined}
        className="text-[rgb(50,205,50)] hover:underline font-medium"
      >
        {children}
      </a>
    ),
  },
};
