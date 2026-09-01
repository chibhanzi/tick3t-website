import { boolean, integer, numeric, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const publishedEventsTable = pgTable("published_events", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  location: text("location").notNull(),
  fullAddress: text("full_address").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  attendees: integer("attendees").notNull().default(0),
  category: text("category").notNull(),
  available: integer("available").notNull(),
  total: integer("total").notNull(),
  organizer: text("organizer").notNull(),
  organizerId: text("organizer_id").notNull(),
  isVerifiedOrganizer: boolean("is_verified_organizer").notNull().default(false),
  tags: text("tags").array().notNull().default([]),
  amenities: text("amenities").array().notNull().default([]),
  price: numeric("price", { precision: 10, scale: 2, mode: "number" }).notNull().default(0),
  currency: text("currency").notNull().default("USD"),
  purchaseLimitPerAccount: integer("purchase_limit_per_account"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertPublishedEventSchema = createInsertSchema(publishedEventsTable).omit({
  createdAt: true,
});

export type InsertPublishedEvent = z.infer<typeof insertPublishedEventSchema>;
export type PublishedEvent = typeof publishedEventsTable.$inferSelect;