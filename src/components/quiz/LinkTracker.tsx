// src/components/quiz/LinkTracker.tsx
import React from 'react';
import { ExternalLink } from 'lucide-react';

interface LinkTrackerProps {
  href: string;
  leadId: string;
  children: React.ReactNode;
  className?: string;
}

export function LinkTracker({ 
  href, 
  leadId, 
  children, 
  className = '' 
}: LinkTrackerProps) {
  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    try {
      // Track the click
      const response = await fetch('/api/track-click', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          leadId,
          link: href,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to track click');
      }

      // Open the link in a new tab
      window.open(href, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error tracking link click:', error);
      // Still open the link even if tracking fails
      window.open(href, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={`inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline ${className}`}
      rel="noopener noreferrer"
      target="_blank"
    >
      {children}
      <ExternalLink size={16} className="flex-shrink-0" />
    </a>
  );
}