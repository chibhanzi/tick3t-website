import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const organizerProfilesTable = pgTable("organizer_profiles", {
  userId: text("user_id").primaryKey(),
  bio: text("bio").notNull().default(""),
  instagram: text("instagram").notNull().default(""),
  twitter: text("twitter").notNull().default(""),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const insertOrganizerProfileSchema = createInsertSchema(
  organizerProfilesTable,
).omit({ updatedAt: true });

export type InsertOrganizerProfile = z.infer<
  typeof insertOrganizerProfileSchema
>;
export type OrganizerProfile = typeof organizerProfilesTable.$inferSelect;