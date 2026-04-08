import type { Direction } from "../lib/types";

interface Props {
  direction: Direction;
  onToggle: () => void;
}

export function DirectionToggle({ direction, onToggle }: Props) {
  const label = direction === "en-to-es" ? "English → Spanish" : "Spanish → English";

  return (
    <button
      onClick={onToggle}
      className="px-5 min-h-[48px] rounded-xl border-2 border-[#E7E5E4] bg-[#F5F3F0] text-sm font-bold text-[#1C1917] active:bg-[#ECEAE6] whitespace-nowrap"
    >
      {label}
    </button>
  );
}
