import type { Term, CardProgress } from "../lib/types";
import { ProgressBar } from "../components/ProgressBar";
import { ReviewList } from "../components/ReviewList";

interface Props {
  terms: Term[];
  progress: Map<string, CardProgress>;
  learnedCount: number;
}

export function ProgressScreen({ terms, progress, learnedCount }: Props) {
  return (
    <div className="space-y-6">
      <ProgressBar learned={learnedCount} total={terms.length} />
      <ReviewList terms={terms} progress={progress} />
    </div>
  );
}
