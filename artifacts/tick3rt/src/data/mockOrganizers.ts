// Shared organizer registry used by events, follow context, and the follow button

export interface MockOrganizer {
  id: string;
  name: string;
  /** Seed so the count looks real before anyone actually follows */
  followerSeed: number;
  category: string;
  verified: boolean;
}

export const MOCK_ORGANIZERS: Record<string, MockOrganizer> = {
  "org-bass": {
    id: "org-bass",
    name: "Bass Events Miami",
    followerSeed: 4821,
    category: "Music",
    verified: true,
  },
  "org-digitalart": {
    id: "org-digitalart",
    name: "Digital Art Collective",
    followerSeed: 1203,
    category: "Art & Culture",
    verified: false,
  },
  "org-techevents": {
    id: "org-techevents",
    name: "TechEvents Co",
    followerSeed: 8392,
    category: "Tech",
    verified: true,
  },
  "org-gaming": {
    id: "org-gaming",
    name: "ESL Gaming",
    followerSeed: 15420,
    category: "Gaming",
    verified: true,
  },
  "org-beach": {
    id: "org-beach",
    name: "Malibu Events",
    followerSeed: 672,
    category: "Beach",
    verified: false,
  },
  "org-fashion": {
    id: "org-fashion",
    name: "Fashion Week NYC",
    followerSeed: 3105,
    category: "Fashion",
    verified: true,
  },
};

export const getOrganizer = (id: string): MockOrganizer | undefined =>
  MOCK_ORGANIZERS[id];

/** Total real followers across all users for an organiser (reads all tick3t.follows.* keys) */
export const getRealFollowerCount = (orgId: string): number => {
  let count = 0;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key?.startsWith("tick3t.follows.")) continue;
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const data = JSON.parse(raw) as { following: string[] };
      if (data.following?.includes(orgId)) count++;
    }
  } catch { /* ignore */ }
  return count;
};
