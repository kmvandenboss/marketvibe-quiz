import React from 'react';
import { motion, MotionProps } from 'framer-motion';
import type { PersonalityResult, InvestmentOption } from '@/types/quiz';
import LoadingSpinner from './LoadingSpinner';

type MotionDivProps = MotionProps & React.ComponentProps<'div'>;
const MotionDiv = motion.div as React.FC<MotionDivProps>;

interface PersonalityResultsCardProps {
  leadId: string;
  quizId: string;
  personalityResult: PersonalityResult;
  investmentOptions: InvestmentOption[];
  isLoading?: boolean;
  error?: string;
  onInvestmentClick: (link: string) => void;
}

const PersonalityResultsCard: React.FC<PersonalityResultsCardProps> = ({
  personalityResult,
  investmentOptions,
  isLoading,
  error,
  onInvestmentClick
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size={50} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-lg text-red-800">
        <h3 className="text-lg font-semibold mb-2">Error Loading Results</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      {/* Personality Type Section */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Your Investor Personality: {personalityResult.title}
        </h2>
        
        {personalityResult.imageUrl && (
          <div className="mb-6">
            <img
              src={personalityResult.imageUrl}
              alt={personalityResult.title}
              className="mx-auto h-32 w-32 object-cover rounded-full shadow-lg"
            />
          </div>
        )}

        <p className="text-lg text-gray-600 mb-6">
          {personalityResult.description}
        </p>

        {/* Characteristics */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Key Characteristics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {personalityResult.characteristics.map((trait, index) => (
              <div
                key={index}
                className="flex items-center bg-white p-3 rounded-lg shadow-sm"
              >
                <span className="text-green-500 mr-3">•</span>
                <span className="text-gray-700">{trait}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Investment Recommendations Section */}
      <div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">
          Recommended Investment Options
        </h3>
        
        <div className="space-y-6">
          {investmentOptions.map((option, index) => (
            <MotionDiv
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-start space-x-4 mb-4">
                {option.logoUrl && (
                  <div className="w-16 h-16 flex-shrink-0">
                    <img
                      src={option.logoUrl}
                      alt={`${option.companyName} logo`}
                      className="w-full h-full object-contain rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}

                <div className="flex-grow">
                  <h4 className="text-xl font-semibold text-gray-800">
                    {option.title}
                  </h4>
                  {option.companyName && (
                    <p className="text-gray-600">{option.companyName}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {option.returnsText && (
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-600">Returns</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {option.returnsText}
                    </p>
                  </div>
                )}
                {option.minimumInvestmentText && (
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-600">Minimum Investment</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {option.minimumInvestmentText}
                    </p>
                  </div>
                )}
              </div>

              <p className="text-gray-600 mb-4">{option.description}</p>

              <button
                onClick={() => onInvestmentClick(option.link)}
                className="w-full px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
              >
                Learn More
              </button>
            </MotionDiv>
          ))}
        </div>
      </div>
    </MotionDiv>
  );
};

export default PersonalityResultsCard;
