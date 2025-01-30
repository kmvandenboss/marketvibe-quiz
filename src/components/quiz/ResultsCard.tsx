// src/components/quiz/ResultsCard.tsx
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InvestmentOption } from '@/types/quiz';
import LoadingSpinner from './LoadingSpinner';

interface ResultsCardProps {
  leadId: string;
  options: InvestmentOption[];
  isLoading?: boolean;
  error?: string;
}

type MotionDivProps = React.ComponentProps<'div'> & {
  initial?: any;
  animate?: any;
  exit?: any;
  transition?: any;
};

const MotionDiv = motion.div as React.FC<MotionDivProps>;

export const ResultsCard: React.FC<ResultsCardProps> = ({
  leadId,
  options,
  isLoading = false,
  error
}) => {
  const [clickedLinks, setClickedLinks] = useState<string[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [trackingError, setTrackingError] = useState<string | null>(null);

  const handleLinkClick = useCallback(async (link: string) => {
    if (!leadId || !link) {
      console.error('Missing required data:', { leadId, link });
      return;
    }

    if (clickedLinks.length >= 3 || clickedLinks.includes(link)) {
      window.open(`/api/redirect?leadId=${leadId}&link=${encodeURIComponent(link)}&to=${encodeURIComponent(link)}`, '_blank');
      return;
    }

    setIsTracking(true);
    setTrackingError(null);
    
    try {
      const response = await fetch('/api/track-click', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ leadId, link }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to track link');
      }

      if (data.wasTracked) {
        setClickedLinks(prev => [...prev, link]);
      }

      window.open(`/api/redirect?leadId=${leadId}&link=${encodeURIComponent(link)}&to=${encodeURIComponent(link)}`, '_blank');
    } catch (error) {
      console.error('Error tracking link click:', error);
      setTrackingError('Unable to track click, but opening link anyway');
      window.open(`/api/redirect?leadId=${leadId}&link=${encodeURIComponent(link)}&to=${encodeURIComponent(link)}`, '_blank');
    } finally {
      setIsTracking(false);
    }
  }, [leadId, clickedLinks]);

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
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Your Personalized Investment Ideas
      </h2>

      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {isTracking && (
            <MotionDiv
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-blue-50 p-4 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <LoadingSpinner size={20} />
                <p className="text-blue-800">Opening your investment idea...</p>
              </div>
            </MotionDiv>
          )}

          {trackingError && (
            <MotionDiv
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-yellow-50 p-4 rounded-lg"
            >
              <p className="text-yellow-800">{trackingError}</p>
            </MotionDiv>
          )}
        </AnimatePresence>

        {options.map((option, index) => (
          <MotionDiv
            key={option.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors relative"
          >
            {/* Best Match Badge - only show for first option */}
            {index === 0 && (
              <div className="absolute -top-2 -right-2 bg-green-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-md">
                Best Match
              </div>
            )}

            <div className="flex items-start space-x-4 mb-4">
              {/* Company Logo */}
              {option.logo_url && (
                <div className="w-16 h-16 flex-shrink-0">
                  <img 
                    src={option.logo_url} 
                    alt={`${option.company_name || 'Company'} logo`}
                    className="w-full h-full object-contain rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Title and Company Info */}
              <div className="flex-grow">
                <h3 className="text-xl font-semibold text-gray-800">
                  {option.title}
                </h3>
                {option.company_name && (
                  <p className="text-gray-600">{option.company_name}</p>
                )}
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {option.returns_text && (
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-600">Returns</p>
                  <p className="text-lg font-semibold text-gray-800">{option.returns_text}</p>
                </div>
              )}
              {option.minimum_investment_text && (
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-600">Minimum Investment</p>
                  <p className="text-lg font-semibold text-gray-800">{option.minimum_investment_text}</p>
                </div>
              )}
            </div>

            {/* Investment Type */}
            {option.investment_type && (
              <div className="mb-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {option.investment_type}
                </span>
              </div>
            )}

            {/* Description */}
            <p className="text-gray-600 mb-4">{option.description}</p>

            {/* Key Features */}
            {option.key_features && option.key_features.length > 0 && (
              <ul className="mb-4 space-y-1">
                {option.key_features.map((feature, idx) => (
                  <li key={idx} className="text-gray-600 flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    {feature}
                  </li>
                ))}
              </ul>
            )}

            {/* CTA Button */}
            <button
              onClick={() => handleLinkClick(option.link)}
              className={`w-full px-6 py-3 rounded-lg text-white font-medium transition-colors ${
                clickedLinks.includes(option.link)
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
              disabled={isTracking}
            >
              {clickedLinks.includes(option.link) ? 'Viewed' : 'Learn More'}
            </button>
          </MotionDiv>
        ))}
      </div>
    </MotionDiv>
  );
};

export default ResultsCard;