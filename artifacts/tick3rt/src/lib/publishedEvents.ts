import type { TicketFeaturesConfig } from "@/components/TicketFeatures";
import {
  createEvent,
  getEvent,
  getEvents,
  type PublishedEvent,
  type PublishedEventInput,
} from "@workspace/api-client-react";

export type PublishedEventRecord = PublishedEvent & {
  resaleAvailable?: number;
  resaleFromPrice?: number;
};

export interface PublishableEventData {
  title: string;
  date: string;
  location: string;
  description: string;
  price: string;
  totalTickets: string;
  category: string;
  currency?: string;
  ticketDesign?: {
    backgroundImage?: string;
  };
  generationConfig?: {
    limitedQuantity?: number;
  };
  ticketFeatures: TicketFeaturesConfig;
}

function formatPublishedDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return { date: "Date to be announced", time: "Time to be announced" };

  return {
    date: parsed.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    time: parsed.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    }),
  };
}

export async function publishEvent(
  eventData: PublishableEventData,
): Promise<PublishedEventRecord> {
  const { date, time } = formatPublishedDate(eventData.date);
  const configuredTotal = Number.parseInt(eventData.totalTickets, 10);
  const fallbackTotal = eventData.generationConfig?.limitedQuantity ?? 100;
  const total = Number.isInteger(configuredTotal) && configuredTotal > 0 ? configuredTotal : fallbackTotal;
  const configuredPrice = Number.parseFloat(eventData.price);
  const purchaseLimit = eventData.ticketFeatures.hasCapacityLimit
    ? Math.max(1, Math.trunc(eventData.ticketFeatures.capacityLimit))
    : undefined;

  const input: PublishedEventInput = {
    title: eventData.title.trim() || "Untitled event",
    date,
    time,
    location: eventData.location.trim() || "Location to be announced",
    fullAddress: eventData.location.trim() || "Location to be announced",
    description: eventData.description.trim() || "More event details are coming soon.",
    image: eventData.ticketDesign?.backgroundImage
      || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&h=600&fit=crop",
    category: eventData.category || "Event",
    total,
    tags: [],
    amenities: ["Secure digital ticket", "Vouch check-in"],
    price: Number.isFinite(configuredPrice) && configuredPrice >= 0 ? configuredPrice : 0,
    currency: eventData.currency || "USD",
    purchaseLimitPerAccount: purchaseLimit,
  };

  return createEvent(input);
}

export function getPublishedEvents(): Promise<PublishedEventRecord[]> {
  return getEvents();
}

export async function getPublishedEvent(
  eventId: string,
): Promise<PublishedEventRecord | null> {
  try {
    return await getEvent(eventId);
  } catch {
    return null;
  }
}
