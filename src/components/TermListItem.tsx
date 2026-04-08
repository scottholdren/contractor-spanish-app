import type { Term, Direction } from "../lib/types";
import { AudioButton } from "./AudioButton";

interface Props {
  term: Term;
  direction: Direction;
}

export function TermListItem({ term, direction }: Props) {
  const audioSrc = direction === "en-to-es" ? term.audioEs : term.audioEn;

  return (
    <div className="flex items-center py-4 border-b-2 border-[#E7E5E4] gap-4">
      <div className="w-14 h-14 bg-[#F5F3F0] rounded-xl border-2 border-[#E7E5E4] flex items-center justify-center text-2xl shrink-0 overflow-hidden">
        <img
          src={term.photo}
          alt={term.en}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-lg font-bold text-[#1C1917] truncate">{term.en}</div>
        <div className="text-base font-semibold text-[#D97706] truncate">{term.es}</div>
        {term.variants.length > 0 && (
          <div className="text-sm text-[#78716C] italic truncate">
            Also: {term.variants.map((v) => `${v.term} (${v.regions.join(", ")})`).join(", ")}
          </div>
        )}
      </div>
      <AudioButton src={audioSrc} size="sm" />
    </div>
  );
}
