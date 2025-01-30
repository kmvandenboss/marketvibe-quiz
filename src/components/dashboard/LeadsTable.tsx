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

  const calculateTotalScore = (score: Record<string, number>) => {
    return Object.values(score).reduce((sum, value) => sum + value, 0);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Name</TableHead>
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
              <TableCell>{lead.name || 'N/A'}</TableCell>
              <TableCell>{lead.email}</TableCell>
              <TableCell>{calculateTotalScore(lead.score)}</TableCell>
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
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
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