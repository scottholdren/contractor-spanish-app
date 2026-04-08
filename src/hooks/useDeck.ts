import { useState, useEffect, useCallback, useRef } from "react";
import type { Term, CardProgress } from "../lib/types";
import { isDue } from "../lib/leitner";

const CARDS_PER_BATCH = 5;

export function useDeck(
  terms: Term[],
  progress: Map<string, CardProgress>,
  updateCardProgress: (termId: string, knew: boolean) => void,
  loaded: boolean
) {
  const [queue, setQueue] = useState<Term[]>([]);
  const initialized = useRef(false);
  const introducedIds = useRef<Set<string>>(new Set());

  function getNewCards(): Term[] {
    const sorted = [...terms].sort((a, b) => a.difficulty - b.difficulty);
    return sorted.filter((t) => !progress.has(t.id) && !introducedIds.current.has(t.id));
  }

  // Build queue only once on first load
  useEffect(() => {
    if (!loaded || initialized.current) return;
    initialized.current = true;

    const dueCards: Term[] = [];
    const sorted = [...terms].sort((a, b) => a.difficulty - b.difficulty);

    for (const term of sorted) {
      const p = progress.get(term.id);
      if (p && isDue(p)) {
        dueCards.push(term);
      }
    }

    // Shuffle due cards
    for (let i = dueCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [dueCards[i], dueCards[j]] = [dueCards[j], dueCards[i]];
    }

    const newCards = getNewCards().slice(0, CARDS_PER_BATCH);
    newCards.forEach((t) => introducedIds.current.add(t.id));

    setQueue([...dueCards, ...newCards]);
  }, [terms, progress, loaded]);

  const currentCard = queue[0] ?? null;
  const remaining = queue.length;
  const hasMoreNew = getNewCards().length > 0;

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

  const loadMore = useCallback(() => {
    const newCards = getNewCards().slice(0, CARDS_PER_BATCH);
    newCards.forEach((t) => introducedIds.current.add(t.id));
    setQueue(newCards);
  }, [terms, progress]);

  const restart = useCallback(() => {
    introducedIds.current.clear();
    const shuffled = [...terms];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const batch = shuffled.slice(0, CARDS_PER_BATCH);
    batch.forEach((t) => introducedIds.current.add(t.id));
    setQueue(batch);
  }, [terms]);

  return {
    currentCard,
    remaining,
    isEmpty: queue.length === 0 && loaded,
    hasMoreNew,
    advance,
    loadMore,
    restart,
  };
}
