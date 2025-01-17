// db/migrations/0002_analytics_tables.ts
import { sql } from 'drizzle-orm';
import { pgTable, uuid, timestamp, text, jsonb, integer } from 'drizzle-orm/pg-core';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';

const analyticsEvents = pgTable('analytics_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  eventType: text('event_type').notNull(),
  leadId: uuid('lead_id'),
  questionId: uuid('question_id'),
  data: jsonb('data'),
  userAgent: text('user_agent'),
  ipAddress: text('ip_address'),
  sessionId: text('session_id'),
  timestamp: timestamp('timestamp').defaultNow().notNull()
});

const analyticsMetrics = pgTable('analytics_metrics', {
  id: uuid('id').defaultRandom().primaryKey(),
  metricDate: timestamp('metric_date').notNull(),
  quizStarts: integer('quiz_starts').notNull().default(0),
  quizCompletions: integer('quiz_completions').notNull().default(0),
  emailSubmissions: integer('email_submissions').notNull().default(0),
  linkClicks: integer('link_clicks').notNull().default(0),
  averageCompletionTime: integer('average_completion_time'),
  dropOffCounts: jsonb('drop_off_counts'),
  conversionRate: integer('conversion_rate'),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

async function migrate() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is required');
  }

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
  } catch (error) {
    console.error('Error creating analytics tables:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Execute the migration
migrate().catch(console.error);

export async function down() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  console.log('Dropping analytics tables...');
  const pool = new Pool({ connectionString });
  const db = drizzle(pool);

  try {
    await db.execute(sql`DROP TABLE IF EXISTS analytics_events;`);
    await db.execute(sql`DROP TABLE IF EXISTS analytics_metrics;`);
    console.log('Successfully dropped analytics tables');
  } catch (error) {
    console.error('Error dropping analytics tables:', error);
    throw error;
  } finally {
    await pool.end();
  }
}