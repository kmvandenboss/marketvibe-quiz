// src/components/quiz/ResultsCard.tsx
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence, MotionProps } from 'framer-motion';
import type { InvestmentOption } from '@/lib/quiz/types';
import LoadingSpinner from './LoadingSpinner';

interface ResultsCardProps {
  leadId: string;
  quizId: string;
  options: InvestmentOption[];
  isLoading?: boolean;
  error?: string;
}

// Motion component types
type MotionDivProps = MotionProps & React.ComponentProps<'div'>;
type MotionButtonProps = MotionProps & React.ComponentProps<'button'>;

// Motion components
const MotionDiv = motion.div as React.FC<MotionDivProps>;
const MotionButton = motion.button as React.FC<MotionButtonProps>;

export const ResultsCard: React.FC<ResultsCardProps> = ({
  leadId,
  quizId,
  options,
  isLoading = false,
  error
}) => {
  const [clickedLinks, setClickedLinks] = useState<string[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [trackingError, setTrackingError] = useState<string | null>(null);

  const handleLinkClick = useCallback(async (e: React.MouseEvent, link: string, requestInfo: boolean = false) => {
    e.preventDefault();
    
    if (!leadId || !link || !quizId) {
      console.error('Missing required data:', { leadId, link, quizId });
      return;
    }

    // If already clicked or max clicks reached, open in new tab immediately
    if (clickedLinks.length >= 3 || clickedLinks.includes(link)) {
      const url = `/api/redirect?leadId=${leadId}&quizId=${quizId}&link=${encodeURIComponent(link)}&to=${encodeURIComponent(link)}`;
      window.open(url, '_blank');
      return;
    }

    // Show tracking state
    setIsTracking(true);
    setTrackingError(null);

    try {
      // Track the click first
      const response = await fetch('/api/track-click', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          leadId, 
          link, 
          quizId,
          requestInfo // Add the requestInfo flag
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to track link');
      }

      if (data.wasTracked) {
        setClickedLinks(prev => [...prev, link]);
      }

      // Minimal delay to ensure tracking state is updated
      setTimeout(() => {
        const url = `/api/redirect?leadId=${leadId}&quizId=${quizId}&link=${encodeURIComponent(link)}&to=${encodeURIComponent(link)}`;
        window.open(url, '_blank');
      }, 50);
    } catch (error) {
      console.error('Error tracking link click:', error);
      setTrackingError('Unable to track click, but opening link anyway');
      
      // Navigate even if tracking fails
      setTimeout(() => {
        const url = `/api/redirect?leadId=${leadId}&quizId=${quizId}&link=${encodeURIComponent(link)}&to=${encodeURIComponent(link)}`;
        window.open(url, '_blank');
      }, 50);
    } finally {
      setIsTracking(false);
    }
  }, [leadId, clickedLinks, quizId]);

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
      <h2 
        className="text-2xl font-semibold text-gray-800 mb-6" 
        dangerouslySetInnerHTML={{
          __html: "<strong>Congratulations!</strong> You've been matched with investments that can be added to your portfolio today:"
        }} 
      />

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
              <MotionDiv
                className="absolute -top-2 -right-2 bg-green-600 text-white px-4 py-1.5 rounded-full text-base font-semibold shadow-md"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  delay: 2.5, // Time for user to read headline
                  duration: 0.5,
                  type: "spring",
                  stiffness: 200
                }}
                whileInView={{
                  scale: [1, 1.1, 1],
                  transition: {
                    delay: 3, // Pulse after appearing
                    duration: 1,
                    repeat: 1
                  }
                }}
              >
                Best Match
              </MotionDiv>
            )}

            <div className="flex items-start space-x-4 mb-4">
              {/* Company Logo */}
              {option.logoUrl && (
                <div className="w-16 h-16 flex-shrink-0">
                  <img 
                    src={option.logoUrl} 
                    alt={`${option.companyName || 'Company'} logo`}
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
                {option.companyName && (
                  <p className="text-gray-600">{option.companyName}</p>
                )}
              </div>
            </div>

            {/* Key Metrics - Hidden for specific quiz */}
            {quizId !== '20f7ad32-9621-4f9d-ba00-ad371f754f9c' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {option.returnsText && (
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-600">Returns</p>
                    <p className="text-lg font-semibold text-gray-800">{option.returnsText}</p>
                  </div>
                )}
                {option.minimumInvestmentText && (
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-600">Minimum Investment</p>
                    <p className="text-lg font-semibold text-gray-800">{option.minimumInvestmentText}</p>
                  </div>
                )}
              </div>
            )}

            {/* Investment Type */}
            {option.investmentType && (
              <div className="mb-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {option.investmentType}
                </span>
              </div>
            )}

            {/* Description */}
            <p className="text-gray-600 mb-4">{option.description}</p>

            {/* Key Features */}
            {option.keyFeatures && option.keyFeatures.length > 0 && (
              <ul className="mb-4 space-y-1">
                {option.keyFeatures.map((feature, idx) => (
                  <li key={idx} className="text-gray-600 flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    {feature}
                  </li>
                ))}
              </ul>
            )}

            {/* CTA Buttons - Split approach */}
            {clickedLinks.includes(option.link) ? (
              <button
                className="w-full px-6 py-3 rounded-lg text-white font-medium bg-green-600 hover:bg-green-700 cursor-pointer touch-manipulation"
                disabled={isTracking}
              >
                Viewed
              </button>
            ) : (
              <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
                {/* Start Investing Button */}
                <MotionButton
                  onClick={(e) => handleLinkClick(e, option.link, false)}
                  className="flex-1 px-6 py-3 rounded-lg text-[#0F2040] font-medium bg-[#FFBB00] cursor-pointer touch-manipulation relative overflow-hidden"
                  disabled={isTracking}
                  animate={{ 
                    scale: [1, 1.05, 1],
                    boxShadow: [
                      '0 0 10px rgba(255, 204, 51, 0.5)',
                      '0 0 20px rgba(255, 204, 51, 0.8)',
                      '0 0 10px rgba(255, 204, 51, 0.5)'
                    ]
                  }}
                  transition={{
                    duration: 1.75,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }}
                  whileHover={{
                    scale: 1.02,
                    backgroundColor: '#FFCC33',
                    transition: { duration: 0.2 }
                  }}
                >
                  Start Investing Now
                </MotionButton>
                
                {/* Get More Information Button */}
                <MotionButton
                  onClick={(e) => handleLinkClick(e, option.link, true)}
                  className="flex-1 px-6 py-3 rounded-lg text-white font-medium bg-blue-600 hover:bg-blue-700 cursor-pointer touch-manipulation"
                  disabled={isTracking}
                  whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                >
                  Get More Information
                </MotionButton>
              </div>
            )}
            
            {/* Disclaimer text */}
            {!clickedLinks.includes(option.link) && (
              <p className="mt-2 text-xs text-gray-500 text-center">
                By clicking "Get More Information", you agree to have {option.companyName} contact you with details about this investment opportunity.
              </p>
            )}
          </MotionDiv>
        ))}
      </div>
    </MotionDiv>
  );
};

export default ResultsCard;
