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

  const handleLinkClick = useCallback(async (link: string) => {
    // Validate inputs before proceeding
    if (!leadId || !link) {
      console.error('Missing required data:', { leadId, link });
      return;
    }

    // If already tracked or at limit, redirect directly
    if (clickedLinks.length >= 3 || clickedLinks.includes(link)) {
      window.location.href = `/api/redirect?leadId=${leadId}&link=${encodeURIComponent(link)}&to=${encodeURIComponent(link)}`;
      return;
    }

    // Start tracking
    setIsTracking(true);
    
    try {
      // Track click first
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

      // Update UI state if tracking was successful
      if (data.wasTracked) {
        setClickedLinks(prev => [...prev, link]);
      }

      // Redirect through our endpoint
      window.location.href = `/api/redirect?leadId=${leadId}&link=${encodeURIComponent(link)}&to=${encodeURIComponent(link)}`;
    } catch (error) {
      console.error('Error tracking link click:', error);
      // Still redirect on error to ensure user reaches destination
      window.location.href = `/api/redirect?leadId=${leadId}&link=${encodeURIComponent(link)}&to=${encodeURIComponent(link)}`;
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
        Your Personalized Investment Recommendations
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
                <p className="text-blue-800">Tracking your selection...</p>
              </div>
            </MotionDiv>
          )}
        </AnimatePresence>

        {options.map((option, index) => (
          <MotionDiv
            key={option.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {option.title}
            </h3>
            <p className="text-gray-600 mb-4">{option.description}</p>
            <button
              onClick={() => handleLinkClick(option.link)}
              className={`px-6 py-2 rounded-lg text-white font-medium transition-colors ${
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