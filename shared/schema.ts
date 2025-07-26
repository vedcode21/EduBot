import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, real, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  color: text("color").notNull().default("#1976D2"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const responseTemplates = pgTable("response_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  categoryId: varchar("category_id").references(() => categories.id),
  keywords: text("keywords").array().default([]),
  usageCount: integer("usage_count").default(0),
  successRate: real("success_rate").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const inquiries = pgTable("inquiries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  message: text("message").notNull(),
  senderName: text("sender_name").notNull(),
  senderEmail: text("sender_email"),
  categoryId: varchar("category_id").references(() => categories.id),
  responseTemplateId: varchar("response_template_id").references(() => responseTemplates.id),
  responseMessage: text("response_message"),
  responseTime: real("response_time"), // in seconds
  isAutomated: boolean("is_automated").default(false),
  satisfactionScore: real("satisfaction_score"), // 1-5 rating
  status: text("status").notNull().default("pending"), // pending, responded, escalated
  createdAt: timestamp("created_at").defaultNow(),
  respondedAt: timestamp("responded_at"),
});

export const analytics = pgTable("analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: timestamp("date").notNull(),
  totalInquiries: integer("total_inquiries").default(0),
  automatedResponses: integer("automated_responses").default(0),
  avgResponseTime: real("avg_response_time").default(0),
  avgSatisfactionScore: real("avg_satisfaction_score").default(0),
});

// Insert schemas
export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
});

export const insertResponseTemplateSchema = createInsertSchema(responseTemplates).omit({
  id: true,
  usageCount: true,
  successRate: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInquirySchema = createInsertSchema(inquiries).omit({
  id: true,
  responseTemplateId: true,
  responseMessage: true,
  responseTime: true,
  isAutomated: true,
  satisfactionScore: true,
  status: true,
  createdAt: true,
  respondedAt: true,
});

export const insertAnalyticsSchema = createInsertSchema(analytics).omit({
  id: true,
});

// Types
export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type ResponseTemplate = typeof responseTemplates.$inferSelect;
export type InsertResponseTemplate = z.infer<typeof insertResponseTemplateSchema>;

export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;

export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
