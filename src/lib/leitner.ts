import type { Box, CardProgress } from "./types";

const REVIEW_INTERVALS: Record<Box, number> = {
  1: 0,
  2: 1,
  3: 3,
};

export function todayString(): string {
  return new Date().toISOString().split("T")[0];
}

export function reviewCard(progress: CardProgress, knew: boolean): CardProgress {
  if (knew) {
    const newBox = Math.min(progress.box + 1, 3) as Box;
    const interval = REVIEW_INTERVALS[newBox];
    const next = new Date();
    next.setDate(next.getDate() + interval);
    return {
      termId: progress.termId,
      box: newBox,
      nextReview: next.toISOString().split("T")[0],
      correctStreak: progress.correctStreak + 1,
    };
  }

  return {
    termId: progress.termId,
    box: 1,
    nextReview: todayString(),
    correctStreak: 0,
  };
}

export function createInitialProgress(termId: string): CardProgress {
  return {
    termId,
    box: 1,
    nextReview: todayString(),
    correctStreak: 0,
  };
}

export function isDue(progress: CardProgress): boolean {
  return progress.nextReview <= todayString();
}

export function isLearned(progress: CardProgress): boolean {
  return progress.box === 3 && progress.correctStreak >= 3;
}
