import type { Direction } from "../lib/types";

interface Props {
  direction: Direction;
  onToggle: () => void;
}

export function DirectionToggle({ direction, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 px-5 min-h-[48px] rounded-xl border-2 border-[#E7E5E4] bg-[#F5F3F0] text-base font-bold text-[#1C1917] active:bg-[#ECEAE6]"
    >
      <span className={direction === "en-to-es" ? "text-[#D97706]" : ""}>EN</span>
      <span className="text-[#A8A29E]">→</span>
      <span className={direction === "es-to-en" ? "text-[#D97706]" : ""}>ES</span>
    </button>
  );
}
