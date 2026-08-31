const PURCHASES_KEY = "tick3t.ticket-purchases";

type PurchaseLedger = Record<string, Record<string, number>>;

function readLedger(): PurchaseLedger {
  try {
    const parsed = JSON.parse(localStorage.getItem(PURCHASES_KEY) ?? "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeLedger(ledger: PurchaseLedger) {
  localStorage.setItem(PURCHASES_KEY, JSON.stringify(ledger));
}

export function getPurchasedTicketQuantity(accountId: string, eventId: string): number {
  if (!accountId || !eventId) return 0;
  const quantity = readLedger()[accountId]?.[eventId];
  return Number.isInteger(quantity) && quantity > 0 ? quantity : 0;
}

export function recordTicketPurchase(accountId: string, eventId: string, quantity: number): number {
  if (!accountId || !eventId || !Number.isInteger(quantity) || quantity < 1) {
    throw new Error("A valid account, event, and ticket quantity are required.");
  }

  const ledger = readLedger();
  const accountPurchases = ledger[accountId] ?? {};
  const nextQuantity = (accountPurchases[eventId] ?? 0) + quantity;

  ledger[accountId] = {
    ...accountPurchases,
    [eventId]: nextQuantity,
  };
  writeLedger(ledger);

  return nextQuantity;
}
