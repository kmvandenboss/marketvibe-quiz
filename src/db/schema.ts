import { pgTable, text, timestamp, uuid, integer, json, jsonb, boolean } from "drizzle-orm/pg-core";

// Quizzes table - stores quiz configurations
export const quizzes = pgTable("quizzes", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  heading_text: text("heading_text").notNull().default("high-yield investment"),
  emailCaptureMessage: text("email_capture_message").notNull(),
  results_layout: text("results_layout").notNull().default('standard'),
  personality_results: jsonb("personality_results"),
  active: boolean("active").notNull().default(true),
  navigationSettings: jsonb("navigation_settings").default({
    allowBack: true,
    showProgressBar: true,
    showQuestionCount: true
  }),
  seoMetadata: jsonb("seo_metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

// Questions table - stores quiz questions
export const questions = pgTable("questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  quizId: uuid("quiz_id").references(() => quizzes.id).notNull(),
  questionText: text("question_text").notNull(),
  questionType: text("question_type").notNull(),
  position: integer("position").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

// Question options table - stores answer options for questions
export const question_options = pgTable("question_options", {
  id: uuid("id").primaryKey().defaultRandom(),
  questionId: uuid("question_id").references(() => questions.id).notNull(),
  optionText: text("option_text").notNull(),
  tags: jsonb("tags"),
  weights: jsonb("weights"),
  position: integer("position").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

// Investment options table - stores available investment products/strategies
export const investmentOptions = pgTable("investment_options", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  link: text("link").notNull(),
  tags: jsonb("tags").notNull(),
  quizTags: jsonb("quiz_tags"),
  priority: integer("priority").notNull(),
  logoUrl: text("logo_url").notNull(),
  companyName: text("company_name").notNull(),
  returnsText: text("returns_text").notNull(),
  minimumInvestmentText: text("minimum_investment_text").notNull(),
  investmentType: text("investment_type").notNull(),
  keyFeatures: jsonb("key_features").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
});

// Leads table - stores user information and quiz responses
export const leads = pgTable("leads", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  quizId: uuid("quiz_id").references(() => quizzes.id),
  email: text("email").notNull(),
  name: text("name"),
  responses: jsonb("responses").notNull(),
  clickedLinks: jsonb("clicked_links").notNull(),
  score: jsonb("score").notNull(),
  personalityType: text("personality_type"),
  resultsConfig: jsonb("results_config"),
  isAccredited: boolean("is_accredited").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow()
});

// Analytics events table - tracks user interactions and quiz flow
export const analyticsEvents = pgTable("analytics_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  quizId: uuid("quiz_id").references(() => quizzes.id),
  eventType: text("event_type").notNull(),
  leadId: uuid("lead_id").references(() => leads.id),
  questionId: text("question_id"),
  questionIndex: integer("question_index"),
  data: json("data"),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
  sessionId: text("session_id"),
  timestamp: timestamp("timestamp", { withTimezone: true }).defaultNow().notNull()
});

// Analytics metrics table - stores aggregated metrics
export const analyticsMetrics = pgTable("analytics_metrics", {
  id: uuid("id").primaryKey().defaultRandom(),
  metricName: text("metric_name").notNull(),
  value: integer("value").notNull(),
  date: timestamp("date", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
});

// User management tables
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  email: text("email").notNull().unique(),
  hashedPassword: text("hashed_password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  lastLogin: timestamp("last_login", { withTimezone: true })
});

export const sessions = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
});
