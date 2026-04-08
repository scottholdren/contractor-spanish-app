import type { Term, CardProgress } from "../lib/types";
import { isDue, isLearned, todayString } from "../lib/leitner";

interface Props {
  terms: Term[];
  progress: Map<string, CardProgress>;
}

export function ReviewList({ terms, progress }: Props) {
  const today = todayString();

  const dueTerms: Term[] = [];
  const learnedTerms: Term[] = [];

  for (const term of terms) {
    const p = progress.get(term.id);
    if (!p) continue;
    if (isLearned(p)) {
      learnedTerms.push(term);
    } else if (isDue(p)) {
      dueTerms.push(term);
    }
  }

  return (
    <div className="space-y-6">
      {dueTerms.length > 0 && (
        <div>
          <h3 className="text-base font-bold text-[#1C1917] uppercase tracking-wider mb-3">
            Due for Review ({dueTerms.length})
          </h3>
          {dueTerms.map((term) => {
            const p = progress.get(term.id)!;
            return (
              <div key={term.id} className="flex items-center justify-between py-3 border-b-2 border-[#E7E5E4]">
                <div>
                  <span className="text-base font-bold text-[#1C1917]">{term.en}</span>
                  <span className="text-base font-semibold text-[#D97706] ml-3">{term.es}</span>
                </div>
                <span className="text-sm font-bold text-[#D97706]">
                  {p.nextReview <= today ? "Due today" : `Due ${p.nextReview}`}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {learnedTerms.length > 0 && (
        <div>
          <h3 className="text-base font-bold text-[#1C1917] uppercase tracking-wider mb-3">
            Learned ({learnedTerms.length})
          </h3>
          {learnedTerms.map((term) => (
            <div key={term.id} className="flex items-center justify-between py-3 border-b-2 border-[#E7E5E4]">
              <div>
                <span className="text-base font-bold text-[#1C1917]">{term.en}</span>
                <span className="text-base font-semibold text-[#16A34A] ml-3">{term.es}</span>
              </div>
              <span className="text-lg font-bold text-[#16A34A]">✓</span>
            </div>
          ))}
        </div>
      )}

      {dueTerms.length === 0 && learnedTerms.length === 0 && (
        <p className="text-center text-lg font-medium text-[#78716C] py-8">
          Start learning to see your progress here
        </p>
      )}
    </div>
  );
}
