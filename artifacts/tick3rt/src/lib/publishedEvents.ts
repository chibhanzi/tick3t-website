import type { TicketFeaturesConfig } from "@/components/TicketFeatures";

const PUBLISHED_EVENTS_KEY = "tick3t.published-events";

export interface PublishedEventRecord {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  fullAddress: string;
  description: string;
  image: string;
  attendees: number;
  category: string;
  available: number;
  total: number;
  organizer: string;
  organizerId: string;
  isVerifiedOrganizer: boolean;
  tags: string[];
  amenities: string[];
  price: number;
  currency: string;
  purchaseLimitPerAccount?: number;
  resaleAvailable?: number;
  resaleFromPrice?: number;
}

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

interface OrganizerIdentity {
  id: string;
  name: string;
  isVerified: boolean;
}

function readPublishedEvents(): PublishedEventRecord[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(PUBLISHED_EVENTS_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
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

export function publishEvent(
  eventData: PublishableEventData,
  organizer: OrganizerIdentity,
): PublishedEventRecord {
  const { date, time } = formatPublishedDate(eventData.date);
  const configuredTotal = Number.parseInt(eventData.totalTickets, 10);
  const fallbackTotal = eventData.generationConfig?.limitedQuantity ?? 100;
  const total = Number.isInteger(configuredTotal) && configuredTotal > 0 ? configuredTotal : fallbackTotal;
  const configuredPrice = Number.parseFloat(eventData.price);
  const purchaseLimit = eventData.ticketFeatures.hasCapacityLimit
    ? Math.max(1, Math.trunc(eventData.ticketFeatures.capacityLimit))
    : undefined;

  const record: PublishedEventRecord = {
    id: `created-${Date.now().toString(36)}`,
    title: eventData.title.trim() || "Untitled event",
    date,
    time,
    location: eventData.location.trim() || "Location to be announced",
    fullAddress: eventData.location.trim() || "Location to be announced",
    description: eventData.description.trim() || "More event details are coming soon.",
    image: eventData.ticketDesign?.backgroundImage
      || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&h=600&fit=crop",
    attendees: 0,
    category: eventData.category || "Event",
    available: total,
    total,
    organizer: organizer.name,
    organizerId: organizer.id,
    isVerifiedOrganizer: organizer.isVerified,
    tags: [],
    amenities: ["Secure digital ticket", "Vouch check-in"],
    price: Number.isFinite(configuredPrice) && configuredPrice >= 0 ? configuredPrice : 0,
    currency: eventData.currency || "USD",
    purchaseLimitPerAccount: purchaseLimit,
  };

  const existing = readPublishedEvents();
  localStorage.setItem(PUBLISHED_EVENTS_KEY, JSON.stringify([record, ...existing]));
  return record;
}

export function getPublishedEvents(): PublishedEventRecord[] {
  return readPublishedEvents();
}

export function getPublishedEvent(eventId: string): PublishedEventRecord | null {
  return readPublishedEvents().find((event) => event.id === eventId) ?? null;
}
