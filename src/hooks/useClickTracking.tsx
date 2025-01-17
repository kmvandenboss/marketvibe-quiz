// src/hooks/useClickTracking.tsx
import { useState } from 'react';

interface UseClickTrackingProps {
  leadId: string;
  onError?: (error: string) => void;
}

export function useClickTracking({ leadId, onError }: UseClickTrackingProps) {
  const [isTracking, setIsTracking] = useState(false);

  const trackClick = async (link: string) => {
    if (!leadId) {
      console.error('No leadId provided for click tracking');
      onError?.('Unable to track click - missing lead ID');
      return;
    }

    setIsTracking(true);

    try {
      const response = await fetch('/api/track-click', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ leadId, link }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to track click');
      }

      // Open link in new tab after successful tracking
      window.open(link, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error tracking click:', error);
      onError?.(error instanceof Error ? error.message : 'Failed to track click');
    } finally {
      setIsTracking(false);
    }
  };

  return {
    trackClick,
    isTracking,
  };
}