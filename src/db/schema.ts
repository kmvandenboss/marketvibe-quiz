import { pgTable, text, timestamp, uuid, integer, json, jsonb, boolean } from "drizzle-orm/pg-core";

// Questions table - matches existing database structure
export const questions = pgTable("questions", {
  id: uuid("id").primaryKey(),
  text: text("text").notNull(),
  type: text("type").notNull(),
  order: integer("order").notNull(),
  options: json("options").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow()
});

// Investment options table - stores available investment products/strategies
export const investmentOptions = pgTable("investment_options", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  link: text("link").notNull(),
  tags: jsonb("tags").notNull(),
  priority: integer("priority").notNull(),
 
  // New columns
  logo_url: text("logo_url").notNull(),
  company_name: text("company_name").notNull(),
  returns_text: text("returns_text").notNull(),
  minimum_investment_text: text("minimum_investment_text").notNull(),
  investment_type: text("investment_type").notNull(),
  key_features: jsonb("key_features").notNull(),
  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// Leads table - stores user information and quiz responses
export const leads = pgTable("leads", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	email: text("email").notNull(),
	name: text("name"),
	responses: jsonb("responses").notNull(),
	clickedLinks: jsonb("clicked_links").notNull(),
	score: jsonb("score").notNull(),
	isAccredited: boolean("is_accredited").default(false).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

// Analytics events table - tracks user interactions and quiz flow
export const analyticsEvents = pgTable("analytics_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventType: text("event_type").notNull(),
  leadId: uuid("lead_id").references(() => leads.id),
  questionId: text("question_id"),
  questionIndex: integer("question_index"),
  data: json("data"),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
  sessionId: text("session_id"),
  timestamp: timestamp("timestamp").defaultNow().notNull()
});

// Analytics metrics table - stores aggregated metrics
export const analyticsMetrics = pgTable("analytics_metrics", {
  id: uuid("id").primaryKey().defaultRandom(),
  metricName: text("metric_name").notNull(),
  value: integer("value").notNull(),
  date: timestamp("date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// New tables for user management
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  email: text("email").notNull().unique(),
  hashedPassword: text("hashed_password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("user"), // 'admin' or 'user'
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  lastLogin: timestamp("last_login", { withTimezone: true }),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});