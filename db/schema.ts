// db/schema.ts
import { 
  pgTable, 
  text, 
  timestamp, 
  uuid, 
  integer, 
  jsonb 
} from 'drizzle-orm/pg-core';

export const leads = pgTable('leads', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull(),
  name: text('name'),
  responses: jsonb('responses').notNull().$type<{
    questionId: string;
    selectedOptionIds: string[];
  }[]>(),
  clickedLinks: jsonb('clicked_links').notNull().$type<string[]>(),
  score: jsonb('score').notNull().$type<Record<string, number>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const questions = pgTable('questions', {
  id: uuid('id').defaultRandom().primaryKey(),
  text: text('text').notNull(),
  type: text('type').notNull(),
  order: integer('"order"').notNull(),
  options: jsonb('options').notNull().$type<{
    id: string;
    text: string;
    tags: string[];
    weight: number;
  }[]>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const investmentOptions = pgTable('investment_options', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  link: text('link').notNull(),
  tags: jsonb('tags').notNull().$type<string[]>(),
  priority: integer('priority').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const analyticsEvents = pgTable('analytics_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  eventType: text('event_type').notNull(),
  leadId: uuid('lead_id').references(() => leads.id),
  questionId: uuid('question_id').references(() => questions.id),
  data: jsonb('data').$type<Record<string, any>>(),
  userAgent: text('user_agent'),
  ipAddress: text('ip_address'),
  sessionId: text('session_id'),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});

export const analyticsMetrics = pgTable('analytics_metrics', {
  id: uuid('id').defaultRandom().primaryKey(),
  metricDate: timestamp('metric_date').notNull(),
  quizStarts: integer('quiz_starts').notNull().default(0),
  quizCompletions: integer('quiz_completions').notNull().default(0),
  emailSubmissions: integer('email_submissions').notNull().default(0),
  linkClicks: integer('link_clicks').notNull().default(0),
  averageCompletionTime: integer('average_completion_time'),
  dropOffCounts: jsonb('drop_off_counts').$type<Record<string, number>>(),
  conversionRate: integer('conversion_rate'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});