'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, MotionProps } from 'framer-motion';
import Footer from '@/components/Footer';
import { Shield, Star, TrendingUp, CheckCircle, ExternalLink } from 'lucide-react';
import type { InvestmentOption } from '@/types/quiz';

// Motion component types
type MotionDivProps = MotionProps & React.ComponentProps<'div'>;
type MotionButtonProps = MotionProps & React.ComponentProps<'button'>;

const MotionDiv = motion.div as React.FC<MotionDivProps>;
const MotionButton = motion.button as React.FC<MotionButtonProps>;

// Investment option IDs to randomly select from
const INVESTMENT_IDS = [
  '6c16c0d2-c25d-4a0d-95ef-c9cbca6c8e06',
  '7b2638b0-c124-4915-971b-a9d8244cdd09',
  '89e4b0d2-4ce5-4f7c-923e-6c951c75e65e',
  'b6526647-d9ef-43c2-8d8e-f80d6738f4f8'
];

interface SpotlightData {
  sessionId: string;
  selectedOptions: InvestmentOption[];
}

export default function InvestmentSpotlightPage() {
  const [spotlightData, setSpotlightData] = useState<SpotlightData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clickedOptions, setClickedOptions] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchSpotlightOptions();
  }, []);

  const fetchSpotlightOptions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/investment-spotlight');
      
      if (!response.ok) {
        throw new Error('Failed to load investment options');
      }
      
      const data = await response.json();
      setSpotlightData(data);
    } catch (err) {
      console.error('Error fetching spotlight options:', err);
      setError(err instanceof Error ? err.message : 'Failed to load investments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvestClick = async (option: InvestmentOption) => {
    if (!spotlightData) return;

    try {
      // Track the click
      const response = await fetch('/api/investment-spotlight/track-click', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: spotlightData.sessionId,
          investmentId: option.id,
          link: option.link
        }),
      });

      if (response.ok) {
        setClickedOptions(prev => new Set([...prev, option.id]));
      }

      // Open the investment link in a new tab
      window.open(option.link, '_blank');
    } catch (error) {
      console.error('Error tracking click:', error);
      // Still open the link even if tracking fails
      window.open(option.link, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading investment opportunities...</p>
        </div>
      </div>
    );
  }

  if (error || !spotlightData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Failed to load investment options'}</p>
          <button 
            onClick={fetchSpotlightOptions}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="flex-grow">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="container max-w-6xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="w-[20%]">
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
                Curated Investment Opportunities
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-12 md:py-16">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-yellow-500 mr-2" />
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                  Editor's Picks
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                Today's Top Investment Opportunities
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Hand-selected high-yield investments from our research team. 
                These opportunities won't be available forever.
              </p>
            </MotionDiv>

            {/* Trust indicators */}
            <div className="flex justify-center items-center space-x-8 mb-8">
              <div className="flex items-center text-gray-600">
                <Shield className="w-5 h-5 mr-2" />
                <span className="text-sm">Secure</span>
              </div>
              <div className="flex items-center text-gray-600">
                <TrendingUp className="w-5 h-5 mr-2" />
                <span className="text-sm">Vetted</span>
              </div>
              <div className="flex items-center text-gray-600">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span className="text-sm">Trusted</span>
              </div>
            </div>
          </div>
        </section>

        {/* Investment Options */}
        <section className="pb-12 md:pb-16">
          <div className="container max-w-6xl mx-auto px-4">
            {/* Add top margin to accommodate the overlay flag */}
            <div className="mt-6">
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {spotlightData.selectedOptions.map((option, index) => (
                  <MotionDiv
                    key={option.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300"
                  >
                    {/* Featured badge for first option - positioned as overlay */}
                    {index === 0 && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10 w-3/4">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-2 px-4 text-sm font-semibold rounded-full shadow-lg whitespace-nowrap">
                          🔥 MOST POPULAR
                        </div>
                      </div>
                    )}

                    <div className="p-6">
                      {/* Company Logo & Name */}
                    <div className="flex items-center mb-4 min-h-[4rem]">
                      {option.logoUrl && (
                        <div className="w-16 h-16 mr-4 bg-gray-50 rounded-lg p-2 flex items-center justify-center flex-shrink-0">
                          <img 
                            src={option.logoUrl} 
                            alt={`${option.companyName} logo`}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 leading-tight">{option.title}</h3>
                        {option.companyName && (
                          <p className="text-gray-600 text-sm mt-1">{option.companyName}</p>
                        )}
                      </div>
                    </div>

                    {/* Investment Type Badge */}
                    <div className="mb-4 min-h-[2rem] flex items-start">
                      {option.investmentType && (
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          {option.investmentType}
                        </span>
                      )}
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 gap-3 mb-4 min-h-[8rem]">
                      {option.returnsText && (
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-sm text-green-600 font-medium">Expected Returns</p>
                          <p className="text-lg font-bold text-green-800">{option.returnsText}</p>
                        </div>
                      )}
                      {option.minimumInvestmentText && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-600 font-medium">Minimum Investment</p>
                          <p className="text-lg font-bold text-gray-800">{option.minimumInvestmentText}</p>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <div className="mb-4 min-h-[4.5rem]">
                      <p className="text-gray-600 line-clamp-3">{option.description}</p>
                    </div>

                    {/* Key Features */}
                    <div className="mb-6 min-h-[7rem]">
                      {option.keyFeatures && option.keyFeatures.length > 0 && (
                        <>
                          <h4 className="font-semibold text-gray-900 mb-2">Key Benefits:</h4>
                          <ul className="space-y-1">
                            {option.keyFeatures.slice(0, 3).map((feature, idx) => (
                              <li key={idx} className="text-gray-600 flex items-start text-sm">
                                <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>

                    {/* CTA Button */}
                    <MotionButton
                      onClick={() => handleInvestClick(option)}
                      className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center ${
                        clickedOptions.has(option.id)
                          ? 'bg-gray-100 text-gray-500 cursor-default'
                          : index === 0
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                          : 'bg-gray-900 hover:bg-gray-800 text-white shadow-lg hover:shadow-xl'
                      }`}
                      whileHover={!clickedOptions.has(option.id) ? { scale: 1.02 } : {}}
                      whileTap={!clickedOptions.has(option.id) ? { scale: 0.98 } : {}}
                      disabled={clickedOptions.has(option.id)}
                    >
                      {clickedOptions.has(option.id) ? (
                        <>
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Viewed
                        </>
                      ) : (
                        <>
                          Invest Now
                          <ExternalLink className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </MotionButton>

                    {!clickedOptions.has(option.id) && (
                      <p className="text-xs text-gray-500 text-center mt-2">
                        Click to learn more and start investing
                      </p>
                    )}
                    </div>
                  </MotionDiv>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA Section */}
        <section className="bg-gray-900 text-white py-12">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Want More Personalized Recommendations?
            </h2>
            <p className="text-gray-300 mb-6">
              Take our 60-second quiz to get investment options tailored specifically to your goals
            </p>
            <button
              onClick={() => window.location.href = '/quiz/high-yield-quiz'}
              className="bg-white text-gray-900 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors"
            >
              Take the Investment Quiz
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
