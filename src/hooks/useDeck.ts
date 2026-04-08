import { useState, useEffect, useCallback, useRef } from "react";
import type { Term, CardProgress } from "../lib/types";
import { isDue } from "../lib/leitner";

const MAX_NEW_PER_SESSION = 5;

export function useDeck(
  terms: Term[],
  progress: Map<string, CardProgress>,
  updateCardProgress: (termId: string, knew: boolean) => void,
  loaded: boolean
) {
  const [queue, setQueue] = useState<Term[]>([]);
  const initialized = useRef(false);

  // Build queue only once on first load
  useEffect(() => {
    if (!loaded || initialized.current) return;
    initialized.current = true;

    const dueCards: Term[] = [];
    const newCards: Term[] = [];

    const sorted = [...terms].sort((a, b) => a.difficulty - b.difficulty);

    for (const term of sorted) {
      const p = progress.get(term.id);
      if (!p) {
        newCards.push(term);
      } else if (isDue(p)) {
        dueCards.push(term);
      }
    }

    // Shuffle due cards
    for (let i = dueCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [dueCards[i], dueCards[j]] = [dueCards[j], dueCards[i]];
    }

    const newToIntroduce = newCards.slice(0, MAX_NEW_PER_SESSION);
    setQueue([...dueCards, ...newToIntroduce]);
  }, [terms, progress, loaded]);

  const currentCard = queue[0] ?? null;
  const remaining = queue.length;

  const advance = useCallback(
    (knew: boolean) => {
      if (!currentCard) return;
      updateCardProgress(currentCard.id, knew);

      setQueue((prev) => {
        const [answered, ...rest] = prev;
        if (!knew && answered) {
          return [...rest, answered];
        }
        return rest;
      });
    },
    [currentCard, updateCardProgress]
  );

  return {
    currentCard,
    remaining,
    isEmpty: queue.length === 0 && loaded,
    advance,
  };
}
