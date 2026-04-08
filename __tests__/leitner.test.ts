import { describe, it, expect, vi, beforeEach } from "vitest";
import { reviewCard, createInitialProgress, isDue, isLearned, todayString } from "../src/lib/leitner";
import type { CardProgress } from "../src/lib/types";

describe("todayString", () => {
  it("returns YYYY-MM-DD format", () => {
    const result = todayString();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("createInitialProgress", () => {
  it("creates box 1 progress due today", () => {
    const p = createInitialProgress("roller");
    expect(p.termId).toBe("roller");
    expect(p.box).toBe(1);
    expect(p.nextReview).toBe(todayString());
    expect(p.correctStreak).toBe(0);
  });
});

describe("reviewCard", () => {
  let progress: CardProgress;

  beforeEach(() => {
    progress = createInitialProgress("roller");
  });

  it("advances from box 1 to box 2 on correct answer", () => {
    const result = reviewCard(progress, true);
    expect(result.box).toBe(2);
    expect(result.correctStreak).toBe(1);
  });

  it("advances from box 2 to box 3 on correct answer", () => {
    progress = { ...progress, box: 2, correctStreak: 1 };
    const result = reviewCard(progress, true);
    expect(result.box).toBe(3);
    expect(result.correctStreak).toBe(2);
  });

  it("stays at box 3 when already at max", () => {
    progress = { ...progress, box: 3, correctStreak: 2 };
    const result = reviewCard(progress, true);
    expect(result.box).toBe(3);
    expect(result.correctStreak).toBe(3);
  });

  it("resets to box 1 on wrong answer from box 2", () => {
    progress = { ...progress, box: 2, correctStreak: 1 };
    const result = reviewCard(progress, false);
    expect(result.box).toBe(1);
    expect(result.correctStreak).toBe(0);
    expect(result.nextReview).toBe(todayString());
  });

  it("resets to box 1 on wrong answer from box 3", () => {
    progress = { ...progress, box: 3, correctStreak: 3 };
    const result = reviewCard(progress, false);
    expect(result.box).toBe(1);
    expect(result.correctStreak).toBe(0);
  });

  it("sets next review 1 day ahead for box 2", () => {
    const result = reviewCard(progress, true);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    expect(result.nextReview).toBe(tomorrow.toISOString().split("T")[0]);
  });

  it("sets next review 3 days ahead for box 3", () => {
    progress = { ...progress, box: 2, correctStreak: 1 };
    const result = reviewCard(progress, true);
    const threeDays = new Date();
    threeDays.setDate(threeDays.getDate() + 3);
    expect(result.nextReview).toBe(threeDays.toISOString().split("T")[0]);
  });
});

describe("isDue", () => {
  it("returns true when nextReview is today", () => {
    const p = createInitialProgress("roller");
    expect(isDue(p)).toBe(true);
  });

  it("returns true when nextReview is in the past", () => {
    const p: CardProgress = {
      termId: "roller",
      box: 2,
      nextReview: "2020-01-01",
      correctStreak: 1,
    };
    expect(isDue(p)).toBe(true);
  });

  it("returns false when nextReview is in the future", () => {
    const p: CardProgress = {
      termId: "roller",
      box: 2,
      nextReview: "2099-12-31",
      correctStreak: 1,
    };
    expect(isDue(p)).toBe(false);
  });
});

describe("isLearned", () => {
  it("returns true when box 3 and streak >= 3", () => {
    const p: CardProgress = {
      termId: "roller",
      box: 3,
      nextReview: todayString(),
      correctStreak: 3,
    };
    expect(isLearned(p)).toBe(true);
  });

  it("returns false when box 3 but streak < 3", () => {
    const p: CardProgress = {
      termId: "roller",
      box: 3,
      nextReview: todayString(),
      correctStreak: 2,
    };
    expect(isLearned(p)).toBe(false);
  });

  it("returns false when box 2 even with high streak", () => {
    const p: CardProgress = {
      termId: "roller",
      box: 2,
      nextReview: todayString(),
      correctStreak: 5,
    };
    expect(isLearned(p)).toBe(false);
  });
});
