'use client';

import { motion, MotionProps } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Footer from '@/components/Footer';
import { Shield, Cpu, BarChart3, CheckCircle } from 'lucide-react';

// Define proper motion component types
type MotionButtonProps = MotionProps & React.ComponentProps<'button'>;
const MotionButton = motion.button as React.FC<MotionButtonProps>;

type MotionDivProps = MotionProps & React.ComponentProps<'div'>;
const MotionDiv = motion.div as React.FC<MotionDivProps>;

const quizOptions = [
  {
    id: 'high-yield',
    text: 'Generate Passive Income',
    path: '/quiz/high-yield-quiz'
  },
  {
    id: 'personality',
    text: 'Find A Strategy That Matches My Personality',
    path: '/quiz/investor-personality-quiz'
  },
  {
    id: 'etf',
    text: 'Discover ETFs That Fit My Investment Goals',
    path: '/quiz/etf-quiz'
  }
];

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-grow">
        <div className="container max-w-6xl mx-auto px-4 py-3 md:py-6">
          {/* Logo and stats section */}
          <div className="flex justify-between items-center mb-4 md:mb-8">
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
              47,461 investors helped
            </div>
          </div>

          {/* Quiz selector section */}
          <div className="max-w-2xl mx-auto">
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                How do you want to grow your wealth today?
              </h2>
              <p className="text-gray-600 mb-6">
                Get personalized investment recommendations based on your goals and preferences
              </p>
              
              <div className="space-y-3">
                {quizOptions.map((option, index) => (
                  <MotionButton
                    key={option.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: index * 0.1,
                      duration: 0.3,
                      ease: [0.4, 0, 0.2, 1]
                    }}
                    whileHover={{ 
                      scale: 1.02,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push(option.path)}
                    className="
                      relative w-full p-4 rounded-xl
                      border-2 transition-all duration-200
                      shadow-green border-transparent bg-white hover:border-[#228B22]/20
                      text-gray-700
                      cursor-pointer
                      hover:bg-[#F8FFF8]
                    "
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-left font-medium">{option.text}</span>
                    </div>
                  </MotionButton>
                ))}
              </div>
            </MotionDiv>

            <p className="text-center text-gray-600 mt-3 md:mt-4">
              Free personalized investment ideas delivered instantly
            </p>
          </div>

          {/* Trust Indicators */}
          <section className="bg-gray-50 border-y mt-12">
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
                  <CheckCircle className="w-8 h-8 text-gray-700" />
                  <div>
                    <h3 className="font-bold">Simple Process</h3>
                    <p className="text-gray-600">Quick and easy to complete</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <BarChart3 className="w-8 h-8 text-gray-700" />
                  <div>
                    <h3 className="font-bold">Clear Results</h3>
                    <p className="text-gray-600">Easy-to-understand options</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Why Trust MarketVibe */}
          <section className="bg-white">
            <div className="container max-w-4xl mx-auto px-4 py-12">
              <h2 className="text-2xl font-bold text-center mb-8">Why Trust MarketVibe?</h2>
              <div className="space-y-4 max-w-2xl mx-auto">
                {[
                  'Simple, straightforward investment recommendations matched to your needs',
                  'Curated selection of investment opportunities across different asset classes',
                  'Clear explanations of each investment strategy and its potential benefits',
                  'Personalized matches based on your goals, risk tolerance, and preferences'
                ].map((text, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <CheckCircle className="w-6 h-6 flex-shrink-0 text-[rgb(50,205,50)]" />
                    <p>{text}</p>
                  </div>
                ))}
              </div>


            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}