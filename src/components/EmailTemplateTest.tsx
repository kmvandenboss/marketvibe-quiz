// src/components/EmailTemplateTest.tsx
'use client';

import React from 'react';
import { AdminEmailTemplate } from '../../emails/admin-notification';
import { UserEmailTemplate } from '../../emails/user-autoresponder';

// Helper function for consistent date formatting
const formatDate = (date: string) => {
  const d = new Date(date);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'UTC'
  }).format(d);
};

const EmailTemplateTest = () => {
  // Use a fixed timestamp for testing
  const testTimestamp = '2025-01-14T18:11:28.000Z';

  // Sample data for testing
  const adminEmailData = {
    email: 'test@example.com',
    name: 'John Doe',
    responses: [
      {
        questionId: '1',
        selectedOptionIds: ['1a']
      },
      {
        questionId: '2',
        selectedOptionIds: ['2b']
      }
    ],
    score: {
      income_focused: 75,
      growth_focused: 25,
      balanced: 50
    },
    timestamp: testTimestamp
  };

  const userEmailData = {
    name: 'John',
    timestamp: testTimestamp
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Admin Email Template Preview</h2>
        <div className="border rounded-lg p-4 bg-white">
          <div className="font-sans max-w-[600px] mx-auto bg-white">
            <AdminEmailTemplate {...adminEmailData} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">User Email Template Preview</h2>
        <div className="border rounded-lg p-4 bg-white">
          <div className="font-sans max-w-[600px] mx-auto bg-white">
            <UserEmailTemplate {...userEmailData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailTemplateTest;