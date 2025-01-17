// src/components/quiz/ResultsCard.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { LoadingSpinner } from './LoadingSpinner';
import { InvestmentOption } from '@/types/quiz';
import { ExternalLink } from 'lucide-react';

interface ResultsCardProps {
  isLoading: boolean;
  results: { 
    recommendedInvestments: InvestmentOption[];
    score: Record<string, number>;
  } | null;  // Changed from undefined to null
  leadId: string;
  onLinkClick: (leadId: string, link: string) => Promise<void>;
  error: string | null;  // Changed from undefined to null
}

export function ResultsCard({
  isLoading,
  results,
  leadId,
  onLinkClick,
  error
}: ResultsCardProps) {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="large" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Error Loading Results</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!results) {
    return null;
  }

  const handleLinkClick = async (link: string) => {
    try {
      await onLinkClick(leadId, link);
      window.open(link, '_blank');
    } catch (error) {
      console.error('Error tracking link click:', error);
      // Still open the link even if tracking fails
      window.open(link, '_blank');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Personalized Investment Strategy</CardTitle>
        <CardDescription>
          Based on your responses, we've identified these opportunities that align
          with your investment goals and preferences.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {results.recommendedInvestments.map((investment, index) => (
          <div
            key={investment.id}
            className={`p-4 rounded-lg ${
              index === 0
                ? 'bg-blue-50 border border-blue-200'
                : 'bg-gray-50 border border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-lg">
                  {index === 0 && (
                    <span className="text-blue-600 text-sm font-medium mb-1 block">
                      Top Recommendation
                    </span>
                  )}
                  {investment.title}
                </h3>
                <p className="text-gray-600 mt-2">{investment.description}</p>
              </div>
            </div>
            <div className="mt-4">
              <Button
                onClick={() => handleLinkClick(investment.link)}
                variant="outline"
                className="w-full sm:w-auto"
              >
                Learn More
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Investment Profile Summary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(results.score)
              .sort(([, a], [, b]) => b - a)
              .map(([tag, score]) => (
                <div key={tag} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {tag.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </span>
                  <span className="text-sm font-medium">
                    {Math.round(score)}%
                  </span>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}