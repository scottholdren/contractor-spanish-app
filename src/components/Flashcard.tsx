import { useState } from "react";
import type { Term, Direction } from "../lib/types";
import { AudioButton } from "./AudioButton";

interface Props {
  term: Term;
  direction: Direction;
  onResponse: (knew: boolean) => void;
}

export function Flashcard({ term, direction, onResponse }: Props) {
  const [flipped, setFlipped] = useState(false);

  const prompt = direction === "en-to-es" ? term.en : term.es;
  const answer = direction === "en-to-es" ? term.es : term.en;
  const audioSrc = direction === "en-to-es" ? term.audioEs : term.audioEn;

  const handleResponse = (knew: boolean) => {
    setFlipped(false);
    onResponse(knew);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <button
        onClick={() => !flipped && setFlipped(true)}
        className="w-full bg-[#F5F3F0] rounded-2xl border-2 border-[#E7E5E4] p-6 text-center active:bg-[#ECEAE6]"
      >
        <div className="w-[220px] h-[160px] bg-[#ECEAE6] rounded-xl mx-auto mb-5 border-2 border-[#E7E5E4] overflow-hidden">
          <img
            src={term.photo}
            alt={term.en}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>

        <div className="text-2xl font-bold text-[#1C1917] mb-2">{prompt}</div>

        {flipped ? (
          <>
            <div className="text-2xl font-bold text-[#D97706] mb-2">{answer}</div>
            {term.variants.length > 0 && (
              <div className="text-base text-[#78716C] italic mb-4">
                Also: {term.variants.map((v) => `${v.term} (${v.regions.join(", ")})`).join(", ")}
              </div>
            )}
            {term.notes && (
              <div className="text-sm font-medium text-[#78716C] mb-4">{term.notes}</div>
            )}
            <AudioButton src={audioSrc} />
          </>
        ) : (
          <div className="text-lg font-medium text-[#A8A29E] mt-3">Tap to reveal</div>
        )}
      </button>

      {flipped && (
        <div className="flex gap-4 w-full">
          <button
            onClick={() => handleResponse(false)}
            className="flex-1 min-h-[72px] rounded-xl border-3 border-[#D97706] text-[#D97706] font-bold text-lg active:bg-[#FEF3C7]"
          >
            Still Learning
          </button>
          <button
            onClick={() => handleResponse(true)}
            className="flex-1 min-h-[72px] rounded-xl border-3 border-[#16A34A] text-[#16A34A] font-bold text-lg active:bg-[#DCFCE7]"
          >
            Know It ✓
          </button>
        </div>
      )}
    </div>
  );
}
