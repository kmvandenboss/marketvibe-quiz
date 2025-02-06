import React, { useState } from 'react';
import type { InvestmentOption, PersonalityResult, QuizResultsConfig } from '@/types/quiz';
import ResultsCard from './ResultsCard';
import PersonalityResultsCard from './PersonalityResultsCard';

interface ResultsCardContainerProps {
  leadId: string;
  quizId: string;
  investmentOptions: InvestmentOption[];
  resultsConfig?: QuizResultsConfig;
  personalityResult?: PersonalityResult;
  isLoading?: boolean;
  error?: string;
}

const ResultsCardContainer: React.FC<ResultsCardContainerProps> = ({
  leadId,
  quizId,
  investmentOptions,
  resultsConfig,
  personalityResult,
  isLoading,
  error
}) => {
  const [clickedLinks, setClickedLinks] = useState<string[]>([]);

  const handleInvestmentClick = async (link: string) => {
    if (!leadId || !link || !quizId) {
      console.error('Missing required data:', { leadId, link, quizId });
      return;
    }

    if (clickedLinks.length >= 3 || clickedLinks.includes(link)) {
      window.open(`/api/redirect?leadId=${leadId}&quizId=${quizId}&link=${encodeURIComponent(link)}&to=${encodeURIComponent(link)}`, '_blank');
      return;
    }

    try {
      const response = await fetch('/api/track-click', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ leadId, link, quizId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to track link');
      }

      if (data.wasTracked) {
        setClickedLinks(prev => [...prev, link]);
      }

      window.open(`/api/redirect?leadId=${leadId}&quizId=${quizId}&link=${encodeURIComponent(link)}&to=${encodeURIComponent(link)}`, '_blank');
    } catch (error) {
      console.error('Error tracking link click:', error);
      window.open(`/api/redirect?leadId=${leadId}&quizId=${quizId}&link=${encodeURIComponent(link)}&to=${encodeURIComponent(link)}`, '_blank');
    }
  };

  if (resultsConfig?.layout === 'personality' && personalityResult) {
    return (
      <PersonalityResultsCard
        leadId={leadId}
        quizId={quizId}
        personalityResult={personalityResult}
        investmentOptions={investmentOptions}
        isLoading={isLoading}
        error={error}
        onInvestmentClick={handleInvestmentClick}
      />
    );
  }

  return (
    <ResultsCard
      leadId={leadId}
      quizId={quizId}
      options={investmentOptions}
      isLoading={isLoading}
      error={error}
    />
  );
};

export default ResultsCardContainer;
