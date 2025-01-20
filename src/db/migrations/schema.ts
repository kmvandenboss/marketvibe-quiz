import { pgTable, uuid, text, jsonb, timestamp, integer } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"



export const leads = pgTable("leads", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	email: text("email").notNull(),
	name: text("name"),
	responses: jsonb("responses").notNull(),
	clickedLinks: jsonb("clicked_links").notNull(),
	score: jsonb("score").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const questions = pgTable("questions", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	text: text("text").notNull(),
	type: text("type").notNull(),
	order: integer("order").notNull(),
	options: jsonb("options").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const investmentOptions = pgTable("investment_options", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	title: text("title").notNull(),
	description: text("description").notNull(),
	link: text("link").notNull(),
	tags: jsonb("tags").notNull(),
	priority: integer("priority").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const analyticsEvents = pgTable("analytics_events", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	eventType: text("event_type").notNull(),
	leadId: uuid("lead_id"),
	questionId: uuid("question_id"),
	data: jsonb("data"),
	userAgent: text("user_agent"),
	ipAddress: text("ip_address"),
	sessionId: text("session_id"),
	timestamp: timestamp("timestamp", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const analyticsMetrics = pgTable("analytics_metrics", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	metricDate: timestamp("metric_date", { withTimezone: true, mode: 'string' }).notNull(),
	quizStarts: integer("quiz_starts").default(0).notNull(),
	quizCompletions: integer("quiz_completions").default(0).notNull(),
	emailSubmissions: integer("email_submissions").default(0).notNull(),
	linkClicks: integer("link_clicks").default(0).notNull(),
	averageCompletionTime: integer("average_completion_time"),
	dropOffCounts: jsonb("drop_off_counts"),
	conversionRate: integer("conversion_rate"),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});