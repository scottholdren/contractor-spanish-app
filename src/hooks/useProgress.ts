import { useState, useEffect, useCallback } from "react";
import type { CardProgress, Direction } from "../lib/types";
import { createInitialProgress, reviewCard, isLearned } from "../lib/leitner";

const PROGRESS_KEY = "painting-deck-progress";
const DIRECTION_KEY = "painting-deck-direction";

function loadProgress(): Map<string, CardProgress> {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return new Map();
    const parsed: CardProgress[] = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Map();
    return new Map(parsed.map((p) => [p.termId, p]));
  } catch {
    return new Map();
  }
}

function saveProgress(progress: Map<string, CardProgress>) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify([...progress.values()]));
}

function loadDirection(): Direction {
  const raw = localStorage.getItem(DIRECTION_KEY);
  return raw === "es-to-en" ? "es-to-en" : "en-to-es";
}

export function useProgress() {
  const [progress, setProgress] = useState<Map<string, CardProgress>>(new Map());
  const [direction, setDirection] = useState<Direction>("en-to-es");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setProgress(loadProgress());
    setDirection(loadDirection());
    setLoaded(true);
  }, []);

  const getCardProgress = useCallback(
    (termId: string): CardProgress | null => {
      return progress.get(termId) ?? null;
    },
    [progress]
  );

  const updateCardProgress = useCallback(
    (termId: string, knew: boolean) => {
      setProgress((prev) => {
        const existing = prev.get(termId) ?? createInitialProgress(termId);
        const updated = reviewCard(existing, knew);
        const next = new Map(prev);
        next.set(termId, updated);
        saveProgress(next);
        return next;
      });
    },
    []
  );

  const learnedCount = useCallback((): number => {
    let count = 0;
    for (const p of progress.values()) {
      if (isLearned(p)) count++;
    }
    return count;
  }, [progress]);

  const toggleDirection = useCallback(() => {
    setDirection((prev) => {
      const next = prev === "en-to-es" ? "es-to-en" : "en-to-es";
      localStorage.setItem(DIRECTION_KEY, next);
      return next;
    });
  }, []);

  const resetProgress = useCallback(() => {
    localStorage.removeItem(PROGRESS_KEY);
    setProgress(new Map());
  }, []);

  return {
    progress,
    getCardProgress,
    updateCardProgress,
    learnedCount,
    direction,
    toggleDirection,
    resetProgress,
    loaded,
  };
}
