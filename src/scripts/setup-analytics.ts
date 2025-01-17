// src/scripts/setup-analytics.ts
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { sql } from 'drizzle-orm';
import { subDays } from 'date-fns';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

async function createTables() {
  console.log('Creating analytics tables...');
  const pool = new Pool({ connectionString });
  const db = drizzle(pool);

  try {
    // Create analytics_events table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        event_type TEXT NOT NULL,
        lead_id UUID,
        question_id UUID,
        data JSONB,
        user_agent TEXT,
        ip_address TEXT,
        session_id TEXT,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `);

    // Create analytics_metrics table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS analytics_metrics (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        metric_date TIMESTAMP WITH TIME ZONE NOT NULL,
        quiz_starts INTEGER NOT NULL DEFAULT 0,
        quiz_completions INTEGER NOT NULL DEFAULT 0,
        email_submissions INTEGER NOT NULL DEFAULT 0,
        link_clicks INTEGER NOT NULL DEFAULT 0,
        average_completion_time INTEGER,
        drop_off_counts JSONB,
        conversion_rate INTEGER,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `);

    console.log('Successfully created analytics tables');
    return db;
  } catch (error) {
    console.error('Error creating analytics tables:', error);
    throw error;
  }
}

async function seedData(db: any) {
  try {
    console.log('Seeding analytics data...');
    
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

    // Insert test data using raw SQL to avoid any typing issues
    for (const data of testData) {
      await db.execute(sql`
        INSERT INTO analytics_metrics (
          metric_date,
          quiz_starts,
          quiz_completions,
          email_submissions,
          link_clicks,
          average_completion_time,
          drop_off_counts,
          conversion_rate,
          updated_at
        ) VALUES (
          ${data.metricDate},
          ${data.quizStarts},
          ${data.quizCompletions},
          ${data.emailSubmissions},
          ${data.linkClicks},
          ${data.averageCompletionTime},
          ${JSON.stringify(data.dropOffCounts)}::jsonb,
          ${data.conversionRate},
          ${data.updatedAt}
        );
      `);
    }
    
    console.log('Successfully seeded analytics data');
  } catch (error) {
    console.error('Error seeding analytics data:', error);
    throw error;
  }
}

async function setupAnalytics() {
  console.log('Starting analytics setup...');
  
  try {
    const db = await createTables();
    await seedData(db);
    console.log('Analytics setup completed successfully');
  } catch (error) {
    console.error('Error during analytics setup:', error);
  } finally {
    process.exit();
  }
}

// Run the setup
setupAnalytics();