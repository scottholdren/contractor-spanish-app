import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useProgress } from "../src/hooks/useProgress";

const mockStorage: Record<string, string> = {};

beforeEach(() => {
  Object.keys(mockStorage).forEach((k) => delete mockStorage[k]);
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => mockStorage[key] ?? null,
    setItem: (key: string, value: string) => { mockStorage[key] = value; },
    removeItem: (key: string) => { delete mockStorage[key]; },
  });
});

describe("useProgress", () => {
  it("starts with empty progress for new user", () => {
    const { result } = renderHook(() => useProgress());
    expect(result.current.progress.size).toBe(0);
    expect(result.current.learnedCount()).toBe(0);
  });

  it("defaults direction to en-to-es", () => {
    const { result } = renderHook(() => useProgress());
    expect(result.current.direction).toBe("en-to-es");
  });

  it("loads saved direction from localStorage", () => {
    mockStorage["painting-deck-direction"] = "es-to-en";
    const { result } = renderHook(() => useProgress());
    // Wait for useEffect
    expect(result.current.direction).toBe("es-to-en");
  });

  it("toggles direction and persists", () => {
    const { result } = renderHook(() => useProgress());
    act(() => result.current.toggleDirection());
    expect(result.current.direction).toBe("es-to-en");
    expect(mockStorage["painting-deck-direction"]).toBe("es-to-en");
  });

  it("updates card progress and persists to localStorage", () => {
    const { result } = renderHook(() => useProgress());
    act(() => result.current.updateCardProgress("roller", true));
    expect(result.current.progress.has("roller")).toBe(true);
    expect(mockStorage["painting-deck-progress"]).toBeDefined();
    const saved = JSON.parse(mockStorage["painting-deck-progress"]);
    expect(saved).toHaveLength(1);
    expect(saved[0].termId).toBe("roller");
  });

  it("handles corrupt localStorage gracefully", () => {
    mockStorage["painting-deck-progress"] = "not valid json {{{";
    const { result } = renderHook(() => useProgress());
    expect(result.current.progress.size).toBe(0);
  });

  it("handles non-array localStorage gracefully", () => {
    mockStorage["painting-deck-progress"] = JSON.stringify({ bad: "data" });
    const { result } = renderHook(() => useProgress());
    expect(result.current.progress.size).toBe(0);
  });

  it("resets progress and clears localStorage", () => {
    const { result } = renderHook(() => useProgress());
    act(() => result.current.updateCardProgress("roller", true));
    act(() => result.current.resetProgress());
    expect(result.current.progress.size).toBe(0);
    expect(mockStorage["painting-deck-progress"]).toBeUndefined();
  });
});
