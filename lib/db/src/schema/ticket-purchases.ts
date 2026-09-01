import { integer, pgTable, text, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const ticketPurchasesTable = pgTable(
  "ticket_purchases",
  {
    accountId: text("account_id").notNull(),
    eventId: text("event_id").notNull(),
    quantity: integer("quantity").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [primaryKey({ columns: [table.accountId, table.eventId] })],
);

export const insertTicketPurchaseSchema = createInsertSchema(ticketPurchasesTable).omit({
  createdAt: true,
  updatedAt: true,
});

export type InsertTicketPurchase = z.infer<typeof insertTicketPurchaseSchema>;
export type TicketPurchase = typeof ticketPurchasesTable.$inferSelect;