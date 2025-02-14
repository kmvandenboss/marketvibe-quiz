import { pgTable, text, timestamp, uuid, integer, json, jsonb, boolean } from "drizzle-orm/pg-core";

// Quizzes table - stores quiz configurations
export const quizzes = pgTable("quizzes", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  heading_text: text("heading_text").notNull().default("high-yield investment"),
  email_capture_message: text("email_capture_message").notNull(),
  results_layout: text("results_layout").notNull().default('standard'),
  personality_results: jsonb("personality_results"),
  active: boolean("active").notNull().default(true),
  navigation_settings: jsonb("navigation_settings").default({
    allowBack: true,
    showProgressBar: true,
    showQuestionCount: true
  }),
  seo_metadata: jsonb("seo_metadata"),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

// Questions table - stores quiz questions
export const questions = pgTable("questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  quiz_id: uuid("quiz_id").references(() => quizzes.id).notNull(),
  question_text: text("question_text").notNull(),
  question_type: text("question_type").notNull(),
  position: integer("position").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

// Question options table - stores answer options for questions
export const question_options = pgTable("question_options", {
  id: uuid("id").primaryKey().defaultRandom(),
  question_id: uuid("question_id").references(() => questions.id).notNull(),
  option_text: text("option_text").notNull(),
  tags: jsonb("tags"),
  weights: jsonb("weights"),
  position: integer("position").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

// Investment options table - stores available investment products/strategies
export const investment_options = pgTable("investment_options", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  link: text("link").notNull(),
  tags: jsonb("tags").notNull(),
  quiz_tags: jsonb("quiz_tags"),
  priority: integer("priority").notNull(),
  logo_url: text("logo_url").notNull(),
  company_name: text("company_name").notNull(),
  returns_text: text("returns_text").notNull(),
  minimum_investment_text: text("minimum_investment_text").notNull(),
  investment_type: text("investment_type").notNull(),
  key_features: jsonb("key_features").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
});

// Leads table - stores user information and quiz responses
export const leads = pgTable("leads", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  quiz_id: uuid("quiz_id").references(() => quizzes.id),
  email: text("email").notNull(),
  name: text("name"),
  responses: jsonb("responses").notNull(),
  clicked_links: jsonb("clicked_links").notNull(),
  score: jsonb("score").notNull(),
  personality_type: text("personality_type"),
  results_config: jsonb("results_config"),
  is_accredited: boolean("is_accredited").default(false).notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow()
});

// Analytics events table - tracks user interactions and quiz flow
export const analytics_events = pgTable("analytics_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  quiz_id: uuid("quiz_id").references(() => quizzes.id),
  event_type: text("event_type").notNull(),
  lead_id: uuid("lead_id").references(() => leads.id),
  question_id: text("question_id"),
  question_index: integer("question_index"),
  data: json("data"),
  user_agent: text("user_agent"),
  ip_address: text("ip_address"),
  session_id: text("session_id"),
  timestamp: timestamp("timestamp", { withTimezone: true }).defaultNow().notNull()
});

// Analytics metrics table - stores aggregated metrics
export const analytics_metrics = pgTable("analytics_metrics", {
  id: uuid("id").primaryKey().defaultRandom(),
  metric_name: text("metric_name").notNull(),
  value: integer("value").notNull(),
  date: timestamp("date", { withTimezone: true }).notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
});

// User management tables
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  email: text("email").notNull().unique(),
  hashed_password: text("hashed_password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("user"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  last_login: timestamp("last_login", { withTimezone: true })
});

export const sessions = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  user_id: uuid("user_id").references(() => users.id).notNull(),
  token: text("token").notNull().unique(),
  expires_at: timestamp("expires_at", { withTimezone: true }).notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
});
