import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const courses = sqliteTable("courses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  region: text("region").notNull(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  category: text("category").notNull(),
  audience: text("audience").notNull(),
  format: text("format").notNull(),
  status: text("status").notNull().default("planned"),
  applicationStart: text("application_start").notNull(),
  applicationEnd: text("application_end").notNull(),
  courseStart: text("course_start").notNull(),
  courseEnd: text("course_end").notNull(),
  capacity: integer("capacity").notNull().default(20),
  location: text("location").notNull(),
  platformUrl: text("platform_url").notNull().default(""),
  curriculum: text("curriculum").notNull().default("[]"),
  outcomes: text("outcomes").notNull().default("[]"),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const applications = sqliteTable("applications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  courseSlug: text("course_slug").notNull(),
  region: text("region").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  motivation: text("motivation").notNull().default(""),
  status: text("status").notNull().default("received"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const reviews = sqliteTable("reviews", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  courseSlug: text("course_slug").notNull(),
  region: text("region").notNull(),
  author: text("author").notNull(),
  role: text("role").notNull().default("수강생"),
  rating: integer("rating").notNull().default(5),
  title: text("title").notNull(),
  content: text("content").notNull(),
  published: integer("published", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const notices = sqliteTable("notices", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  category: text("category").notNull().default("공지"),
  content: text("content").notNull(),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const loginAttempts = sqliteTable("login_attempts", {
  attemptKey: text("attempt_key").primaryKey(),
  attempts: integer("attempts").notNull().default(0),
  windowStartedAt: integer("window_started_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export type CourseRecord = typeof courses.$inferSelect;
export type ApplicationRecord = typeof applications.$inferSelect;
export type ReviewRecord = typeof reviews.$inferSelect;
export type NoticeRecord = typeof notices.$inferSelect;
