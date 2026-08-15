import React, {
  createContext, useContext, useEffect, useMemo, useState, ReactNode, useCallback,
} from "react";
import { useAuth } from "@/contexts/AuthContext";

export interface WaitlistEntry {
  position: number;     // 1-indexed position in the waitlist
  joinedAt: number;     // epoch ms
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  eventImage?: string;
}

type WaitlistStore = Record<string, WaitlistEntry>; // eventId → entry

interface WaitlistContextProps {
  entries: WaitlistStore;
  isOnWaitlist: (eventId: string) => boolean;
  join: (eventId: string, meta: Omit<WaitlistEntry, "position" | "joinedAt">) => number;
  leave: (eventId: string) => void;
  /** User's 1-indexed position, or 0 if not on waitlist */
  position: (eventId: string) => number;
  /** Displayed total (seed + user position) — feels like real social proof */
  displayCount: (eventId: string) => number;
}

const WaitlistContext = createContext<WaitlistContextProps | undefined>(undefined);

/**
 * Deterministic seed so the first person to join still sees a realistic crowd.
 * Range: 15 – 299  (varies by event ID)
 */
export const waitlistSeed = (eventId: string): number => {
  let h = 0;
  for (let i = 0; i < eventId.length; i++) {
    h = (h * 31 + eventId.charCodeAt(i)) & 0x7fff;
  }
  return 15 + (h % 285);
};

const storageKey = (userId: string) => `tick3t.waitlist.${userId}`;

const load = (userId: string): WaitlistStore => {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    return raw ? (JSON.parse(raw) as WaitlistStore) : {};
  } catch {
    return {};
  }
};

const save = (userId: string, store: WaitlistStore) => {
  localStorage.setItem(storageKey(userId), JSON.stringify(store));
};

export const WaitlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<WaitlistStore>({});

  useEffect(() => {
    setEntries(user ? load(user.id) : {});
  }, [user?.id]);

  const join = useCallback(
    (eventId: string, meta: Omit<WaitlistEntry, "position" | "joinedAt">): number => {
      if (!user) return 0;
      if (entries[eventId]) return entries[eventId].position;
      const position = Object.keys(entries).length + 1;
      const next: WaitlistStore = {
        ...entries,
        [eventId]: { ...meta, position, joinedAt: Date.now() },
      };
      save(user.id, next);
      setEntries(next);
      return position;
    },
    [user?.id, entries],
  );

  const leave = useCallback(
    (eventId: string) => {
      if (!user) return;
      const next = { ...entries };
      delete next[eventId];
      save(user.id, next);
      setEntries(next);
    },
    [user?.id, entries],
  );

  const isOnWaitlist = useCallback((eventId: string) => !!entries[eventId], [entries]);
  const position = useCallback((eventId: string) => entries[eventId]?.position ?? 0, [entries]);
  const displayCount = useCallback(
    (eventId: string) => waitlistSeed(eventId) + (entries[eventId]?.position ?? 0),
    [entries],
  );

  const value = useMemo<WaitlistContextProps>(
    () => ({ entries, isOnWaitlist, join, leave, position, displayCount }),
    [entries, isOnWaitlist, join, leave, position, displayCount],
  );

  return <WaitlistContext.Provider value={value}>{children}</WaitlistContext.Provider>;
};

export const useWaitlist = (): WaitlistContextProps => {
  const ctx = useContext(WaitlistContext);
  if (!ctx) throw new Error("useWaitlist must be used within a WaitlistProvider");
  return ctx;
};
