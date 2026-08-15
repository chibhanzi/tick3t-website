import { useState, useCallback } from "react";

const STORAGE_KEY = "tick3rt:event-goals";

type GoalMap = Record<string, number>;

const readGoals = (): GoalMap => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as GoalMap) : {};
  } catch {
    return {};
  }
};

const writeGoals = (goals: GoalMap): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
  } catch {
    // storage quota exceeded — silently ignore
  }
};

export const useEventGoals = () => {
  const [goals, setGoals] = useState<GoalMap>(readGoals);

  const setGoal = useCallback((eventId: string, amount: number) => {
    setGoals((prev) => {
      const next = { ...prev, [eventId]: amount };
      writeGoals(next);
      return next;
    });
  }, []);

  const clearGoal = useCallback((eventId: string) => {
    setGoals((prev) => {
      const next = { ...prev };
      delete next[eventId];
      writeGoals(next);
      return next;
    });
  }, []);

  const getGoal = useCallback(
    (eventId: string): number | undefined => goals[eventId],
    [goals]
  );

  return { getGoal, setGoal, clearGoal };
};
