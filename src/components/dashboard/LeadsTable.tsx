import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Lead } from '@/types/dashboard';

export interface LeadsTableProps {
  leads: Lead[];
}

export const LeadsTable: React.FC<LeadsTableProps> = ({ leads }) => {
  const formatDate = (date: string | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateLeadQualityScore = (responses: Record<string, string>): number => {
    let score = 0;
    
    // Q1: Investment Goal (20 points)
    // 1a: Income focused (10pts)
    // 1b: Growth focused (20pts)
    // 1c: Both (18pts)
    if (responses["cc2cea25-7724-404d-bb37-a2937f2b98b2"]) {
      switch (responses["cc2cea25-7724-404d-bb37-a2937f2b98b2"]) {
        case "1a": score += 10; break;
        case "1b": score += 20; break;
        case "1c": score += 18; break;
      }
    }

    // Q2: Timeframe (20 points)
    // Progressive scale from shortest to longest
    if (responses["aff99dac-33c7-4049-901a-f1eb468fe0db"]) {
      switch (responses["aff99dac-33c7-4049-901a-f1eb468fe0db"]) {
        case "2a": score += 5; break;  // <1 year
        case "2b": score += 10; break; // 1-3 years
        case "2c": score += 15; break; // 3-5 years
        case "2d": score += 20; break; // 5+ years
      }
    }

    // Q3: Income Importance (20 points)
    // Higher score for growth focus
    if (responses["43d447cb-c9e8-4ef2-b5c6-1a93e968d076"]) {
      switch (responses["43d447cb-c9e8-4ef2-b5c6-1a93e968d076"]) {
        case "3a": score += 5; break;  // Extremely important
        case "3b": score += 12; break; // Somewhat important
        case "3c": score += 20; break; // Not important (growth focused)
      }
    }

    // Q4: Liquidity (20 points)
    // Higher score for comfort with illiquidity
    if (responses["224600cd-6f2d-43a8-9add-3195fc3a1ff8"]) {
      switch (responses["224600cd-6f2d-43a8-9add-3195fc3a1ff8"]) {
        case "4a": score += 5; break;  // Need access anytime
        case "4b": score += 12; break; // Few years lockup
        case "4c": score += 20; break; // Comfortable with illiquidity
      }
    }

    // Q5: Accredited Status (20 points)
    if (responses["a2d065b8-8ba4-4846-b46c-513ec19842c4"]) {
      switch (responses["a2d065b8-8ba4-4846-b46c-513ec19842c4"]) {
        case "5a": score += 20; break; // Yes
        case "5b": score += 5; break;  // No
        case "5c": score += 3; break;  // Not sure
      }
    }

    return score;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Accredited</TableHead>
            <TableHead>Clicked Investments</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell>{formatDate(lead.createdAt)}</TableCell>
              <TableCell>{lead.email}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    lead.responses ? 
                      calculateLeadQualityScore(lead.responses) >= 80 ? 'bg-green-100 text-green-800' :
                      calculateLeadQualityScore(lead.responses) >= 60 ? 'bg-blue-100 text-blue-800' :
                      calculateLeadQualityScore(lead.responses) >= 40 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                  }`}>
                    {lead.responses ? calculateLeadQualityScore(lead.responses) : 'N/A'}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  lead.isAccredited 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {lead.isAccredited ? 'Yes' : 'No'}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  {lead.clickedLinks.map((link, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center gap-2"
                    >
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        link.requestInfo 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {link.investmentName || 'Unknown Investment'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(link.clickedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};