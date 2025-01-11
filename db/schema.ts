// db/schema.ts
import { pgTable, text, timestamp, uuid, integer, jsonb } from 'drizzle-orm/pg-core';

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
  order: integer('order').notNull(),
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