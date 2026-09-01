import { randomUUID } from "node:crypto";
import { and, desc, eq, sql } from "drizzle-orm";
import { Router, type IRouter } from "express";
import {
  db,
  publishedEventsTable,
  ticketPurchasesTable,
  usersTable,
} from "@workspace/db";
import {
  CreateEventBody,
  CreateEventResponse,
  GetEventParams,
  GetEventPurchaseStatusParams,
  GetEventPurchaseStatusResponse,
  GetEventResponse,
  GetEventsResponse,
  PurchaseTicketsBody,
  PurchaseTicketsParams,
  PurchaseTicketsResponse,
} from "@workspace/api-zod";
import { requireAuthenticated, requireOrganizer } from "../lib/auth";

const router: IRouter = Router();

const publicEvent = (
  event: typeof publishedEventsTable.$inferSelect,
) => ({
  ...event,
  purchaseLimitPerAccount: event.purchaseLimitPerAccount ?? undefined,
});

const accountStatus = (
  eventId: string,
  purchasedQuantity: number,
  accountLimit: number | null,
  available: number,
  total: number,
) => ({
  eventId,
  purchasedQuantity,
  remainingAccountAllowance:
    accountLimit === null
      ? null
      : Math.max(0, accountLimit - purchasedQuantity),
  accountLimit,
  available,
  total,
});

router.get("/events", async (_req, res): Promise<void> => {
  const events = await db
    .select()
    .from(publishedEventsTable)
    .orderBy(desc(publishedEventsTable.createdAt));

  res.json(GetEventsResponse.parse(events.map(publicEvent)));
});

router.post("/events", async (req, res): Promise<void> => {
  const identity = requireOrganizer(req, res);
  if (!identity) return;

  const parsed = CreateEventBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  if (
    !Number.isInteger(parsed.data.total) ||
    (parsed.data.purchaseLimitPerAccount !== undefined &&
      !Number.isInteger(parsed.data.purchaseLimitPerAccount))
  ) {
    res.status(400).json({
      error: "Event totals and account limits must be whole numbers",
    });
    return;
  }

  const [organizer] = await db
    .select({ name: usersTable.name })
    .from(usersTable)
    .where(eq(usersTable.id, identity.userId));

  if (!organizer) {
    res.status(401).json({ error: "Account not found" });
    return;
  }

  const [event] = await db
    .insert(publishedEventsTable)
    .values({
      id: randomUUID(),
      ...parsed.data,
      attendees: 0,
      available: parsed.data.total,
      organizer: organizer.name,
      organizerId: identity.userId,
      isVerifiedOrganizer: true,
    })
    .returning();

  res.status(201).json(CreateEventResponse.parse(publicEvent(event)));
});

router.get("/events/:eventId", async (req, res): Promise<void> => {
  const parsedParams = GetEventParams.safeParse(req.params);
  if (!parsedParams.success) {
    res.status(400).json({ error: parsedParams.error.message });
    return;
  }

  const [event] = await db
    .select()
    .from(publishedEventsTable)
    .where(eq(publishedEventsTable.id, parsedParams.data.eventId));

  if (!event) {
    res.status(404).json({ error: "Event not found" });
    return;
  }

  res.json(GetEventResponse.parse(publicEvent(event)));
});

router.get(
  "/events/:eventId/purchase-status",
  async (req, res): Promise<void> => {
    const identity = requireAuthenticated(req, res);
    if (!identity) return;

    const parsedParams = GetEventPurchaseStatusParams.safeParse(req.params);
    if (!parsedParams.success) {
      res.status(400).json({ error: parsedParams.error.message });
      return;
    }

    const [event] = await db
      .select({
        id: publishedEventsTable.id,
        available: publishedEventsTable.available,
        total: publishedEventsTable.total,
        purchaseLimitPerAccount: publishedEventsTable.purchaseLimitPerAccount,
      })
      .from(publishedEventsTable)
      .where(eq(publishedEventsTable.id, parsedParams.data.eventId));

    if (!event) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    const [purchase] = await db
      .select({ quantity: ticketPurchasesTable.quantity })
      .from(ticketPurchasesTable)
      .where(
        and(
          eq(ticketPurchasesTable.accountId, identity.userId),
          eq(ticketPurchasesTable.eventId, event.id),
        ),
      );

    res.json(
      GetEventPurchaseStatusResponse.parse(
        accountStatus(
          event.id,
          purchase?.quantity ?? 0,
          event.purchaseLimitPerAccount,
          event.available,
          event.total,
        ),
      ),
    );
  },
);

router.post(
  "/events/:eventId/purchase",
  async (req, res): Promise<void> => {
    const identity = requireAuthenticated(req, res);
    if (!identity) return;

    const parsedParams = PurchaseTicketsParams.safeParse(req.params);
    if (!parsedParams.success) {
      res.status(400).json({ error: parsedParams.error.message });
      return;
    }

    const parsedBody = PurchaseTicketsBody.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json({ error: parsedBody.error.message });
      return;
    }
    if (!Number.isInteger(parsedBody.data.quantity)) {
      res.status(400).json({ error: "Ticket quantity must be a whole number" });
      return;
    }

    const result = await db.transaction(async (tx) => {
      const [event] = await tx
        .select()
        .from(publishedEventsTable)
        .where(eq(publishedEventsTable.id, parsedParams.data.eventId))
        .for("update");

      if (!event) return { kind: "not-found" as const };

      const [purchase] = await tx
        .select({ quantity: ticketPurchasesTable.quantity })
        .from(ticketPurchasesTable)
        .where(
          and(
            eq(ticketPurchasesTable.accountId, identity.userId),
            eq(ticketPurchasesTable.eventId, event.id),
          ),
        );

      const purchasedQuantity = purchase?.quantity ?? 0;
      const requestedQuantity = parsedBody.data.quantity;
      if (
        event.purchaseLimitPerAccount !== null &&
        purchasedQuantity + requestedQuantity > event.purchaseLimitPerAccount
      ) {
        return {
          kind: "limit" as const,
          purchasedQuantity,
          accountLimit: event.purchaseLimitPerAccount,
          available: event.available,
          total: event.total,
        };
      }

      if (requestedQuantity > event.available) {
        return {
          kind: "inventory" as const,
          purchasedQuantity,
          accountLimit: event.purchaseLimitPerAccount,
          available: event.available,
          total: event.total,
        };
      }

      const [updatedEvent] = await tx
        .update(publishedEventsTable)
        .set({
          available: event.available - requestedQuantity,
          attendees: event.attendees + requestedQuantity,
        })
        .where(eq(publishedEventsTable.id, event.id))
        .returning({
          available: publishedEventsTable.available,
          total: publishedEventsTable.total,
        });

      const [updatedPurchase] = await tx
        .insert(ticketPurchasesTable)
        .values({
          accountId: identity.userId,
          eventId: event.id,
          quantity: requestedQuantity,
        })
        .onConflictDoUpdate({
          target: [
            ticketPurchasesTable.accountId,
            ticketPurchasesTable.eventId,
          ],
          set: {
            quantity: sql`${ticketPurchasesTable.quantity} + ${requestedQuantity}`,
            updatedAt: new Date(),
          },
        })
        .returning({ quantity: ticketPurchasesTable.quantity });

      return {
        kind: "success" as const,
        status: accountStatus(
          event.id,
          updatedPurchase.quantity,
          event.purchaseLimitPerAccount,
          updatedEvent.available,
          updatedEvent.total,
        ),
      };
    });

    if (result.kind === "not-found") {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    if (result.kind === "limit") {
      res.status(409).json({
        error: `This event allows ${result.accountLimit} ticket${
          result.accountLimit === 1 ? "" : "s"
        } per account.`,
        ...accountStatus(
          parsedParams.data.eventId,
          result.purchasedQuantity,
          result.accountLimit,
          result.available,
          result.total,
        ),
      });
      return;
    }

    if (result.kind === "inventory") {
      res.status(409).json({
        error: "Not enough tickets remain for this event.",
        ...accountStatus(
          parsedParams.data.eventId,
          result.purchasedQuantity,
          result.accountLimit,
          result.available,
          result.total,
        ),
      });
      return;
    }

    res.json(PurchaseTicketsResponse.parse(result.status));
  },
);

export default router;