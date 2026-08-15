import React, {
  createContext, useContext, useEffect, useMemo, useState, ReactNode, useCallback,
} from "react";
import { useAuth } from "@/contexts/AuthContext";

interface FollowData {
  following: string[];           // orgIds this user follows
  followedAt: Record<string, number>; // orgId → epoch ms when followed
  hasUnread: boolean;            // true until the user visits the For You feed
}

interface FollowContextProps {
  following: string[];
  isFollowing: (orgId: string) => boolean;
  follow: (orgId: string) => void;
  unfollow: (orgId: string) => void;
  hasUnread: boolean;
  clearUnread: () => void;
}

const FollowContext = createContext<FollowContextProps | undefined>(undefined);

const storageKey = (userId: string) => `tick3t.follows.${userId}`;

const defaultData = (): FollowData => ({ following: [], followedAt: {}, hasUnread: false });

const loadData = (userId: string): FollowData => {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    return raw ? (JSON.parse(raw) as FollowData) : defaultData();
  } catch {
    return defaultData();
  }
};

export const FollowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [data, setData] = useState<FollowData>(defaultData);

  // Reload from localStorage whenever the logged-in user changes
  useEffect(() => {
    setData(user ? loadData(user.id) : defaultData());
  }, [user?.id]);

  const persist = useCallback(
    (next: FollowData) => {
      if (!user) return;
      localStorage.setItem(storageKey(user.id), JSON.stringify(next));
      setData(next);
    },
    [user?.id],
  );

  const follow = useCallback(
    (orgId: string) => {
      if (!user) return;
      setData((prev) => {
        if (prev.following.includes(orgId)) return prev;
        const next: FollowData = {
          following: [...prev.following, orgId],
          followedAt: { ...prev.followedAt, [orgId]: Date.now() },
          hasUnread: true, // simulate: organiser just posted something
        };
        localStorage.setItem(storageKey(user.id), JSON.stringify(next));
        return next;
      });
    },
    [user?.id],
  );

  const unfollow = useCallback(
    (orgId: string) => {
      if (!user) return;
      setData((prev) => {
        const following = prev.following.filter((id) => id !== orgId);
        const followedAt = { ...prev.followedAt };
        delete followedAt[orgId];
        const next: FollowData = {
          following,
          followedAt,
          hasUnread: following.length > 0 && prev.hasUnread,
        };
        localStorage.setItem(storageKey(user.id), JSON.stringify(next));
        return next;
      });
    },
    [user?.id],
  );

  const clearUnread = useCallback(() => {
    if (!user) return;
    setData((prev) => {
      if (!prev.hasUnread) return prev;
      const next = { ...prev, hasUnread: false };
      localStorage.setItem(storageKey(user.id), JSON.stringify(next));
      return next;
    });
  }, [user?.id]);

  const isFollowing = useCallback((orgId: string) => data.following.includes(orgId), [data.following]);

  const value = useMemo<FollowContextProps>(
    () => ({
      following: data.following,
      isFollowing,
      follow,
      unfollow,
      hasUnread: data.hasUnread,
      clearUnread,
    }),
    [data, isFollowing, follow, unfollow, clearUnread],
  );

  return <FollowContext.Provider value={value}>{children}</FollowContext.Provider>;
};

export const useFollow = (): FollowContextProps => {
  const ctx = useContext(FollowContext);
  if (!ctx) throw new Error("useFollow must be used within a FollowProvider");
  return ctx;
};
