import {
  getEventPurchaseStatus,
  purchaseTickets,
  type EventPurchaseStatus,
} from "@workspace/api-client-react";

export function getPurchasedTicketStatus(
  eventId: string,
): Promise<EventPurchaseStatus> {
  return getEventPurchaseStatus(eventId);
}

export function recordTicketPurchase(
  eventId: string,
  quantity: number,
): Promise<EventPurchaseStatus> {
  if (!eventId || !Number.isInteger(quantity) || quantity < 1) {
    return Promise.reject(
      new Error("A valid event and ticket quantity are required."),
    );
  }

  return purchaseTickets(eventId, { quantity });
}
