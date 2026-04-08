import type { Term, CardProgress, Direction } from "../lib/types";
import { Flashcard } from "../components/Flashcard";
import { DirectionToggle } from "../components/DirectionToggle";
import { useDeck } from "../hooks/useDeck";

interface Props {
  terms: Term[];
  progress: Map<string, CardProgress>;
  updateCardProgress: (termId: string, knew: boolean) => void;
  direction: Direction;
  onToggleDirection: () => void;
  loaded: boolean;
}

export function LearnScreen({
  terms,
  progress,
  updateCardProgress,
  direction,
  onToggleDirection,
  loaded,
}: Props) {
  const { currentCard, remaining, isEmpty, advance } = useDeck(
    terms,
    progress,
    updateCardProgress,
    loaded
  );

  if (!loaded) {
    return <div className="text-center text-lg font-medium text-[#78716C] py-16">Loading...</div>;
  }

  if (isEmpty) {
    return (
      <div className="text-center py-16 space-y-3">
        <div className="text-4xl">✓</div>
        <div className="text-2xl font-bold text-[#1C1917]">All caught up!</div>
        <div className="text-lg font-medium text-[#78716C]">No cards due for review. Check back tomorrow.</div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <span className="text-lg font-bold text-[#1C1917]">
          {remaining} card{remaining !== 1 ? "s" : ""} left
        </span>
        <DirectionToggle direction={direction} onToggle={onToggleDirection} />
      </div>

      {currentCard && (
        <Flashcard
          key={currentCard.id}
          term={currentCard}
          direction={direction}
          onResponse={advance}
        />
      )}
    </div>
  );
}
