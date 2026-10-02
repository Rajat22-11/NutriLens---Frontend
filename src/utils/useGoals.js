import { useCallback, useEffect, useState } from "react";
import api from "../api/client";
import { DEFAULT_GOALS } from "./nutrition";

let cache = null;

export function useGoals() {
  const [goals, setGoals] = useState(cache || DEFAULT_GOALS);
  const [loading, setLoading] = useState(!cache);

  const reload = useCallback(async () => {
    try {
      const { data } = await api.get("/api/user/nutrition/goals");
      cache = { ...DEFAULT_GOALS, ...data };
      setGoals(cache);
    } catch {
      /* keep defaults */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const save = useCallback(async (next) => {
    const { data } = await api.put("/api/user/nutrition/goals", next);
    cache = { ...DEFAULT_GOALS, ...data.goals };
    setGoals(cache);
    return cache;
  }, []);

  return { goals, loading, reload, save };
}

export const clearGoalsCache = () => {
  cache = null;
};
