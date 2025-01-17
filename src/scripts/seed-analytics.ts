// src/scripts/seed-analytics.ts
import { db } from '../../db';
import { analyticsMetrics } from '../../db/schema';
import { subDays } from 'date-fns';

async function seedAnalytics() {
  try {
    // Generate 30 days of test data
    const testData = Array.from({ length: 30 }, (_, i) => {
      const date = subDays(new Date(), i);
      return {
        metricDate: date,
        quizStarts: Math.floor(Math.random() * 100) + 50, // 50-150 starts
        quizCompletions: Math.floor(Math.random() * 70) + 30, // 30-100 completions
        emailSubmissions: Math.floor(Math.random() * 60) + 20, // 20-80 emails
        linkClicks: Math.floor(Math.random() * 40) + 10, // 10-50 clicks
        averageCompletionTime: Math.floor(Math.random() * 180) + 120, // 2-5 minutes
        dropOffCounts: {
          '1': Math.floor(Math.random() * 10) + 5,
          '2': Math.floor(Math.random() * 8) + 4,
          '3': Math.floor(Math.random() * 6) + 3,
          '4': Math.floor(Math.random() * 5) + 2,
          '5': Math.floor(Math.random() * 4) + 1
        },
        conversionRate: Math.floor(Math.random() * 30) + 40, // 40-70% conversion
        updatedAt: new Date()
      };
    });

    // Insert test data
    await db.insert(analyticsMetrics).values(testData);
    
    console.log('Successfully seeded analytics data');
  } catch (error) {
    console.error('Error seeding analytics data:', error);
    throw error;
  }
}

seedAnalytics().catch(console.error);