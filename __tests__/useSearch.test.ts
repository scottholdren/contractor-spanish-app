import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSearch } from "../src/hooks/useSearch";
import type { Term } from "../src/lib/types";

const mockTerms: Term[] = [
  {
    id: "roller",
    category: "tools",
    en: "Paint Roller",
    es: "Rodillo",
    variants: [{ term: "Rolo", regions: ["MX"] }],
    photo: "/photos/roller.webp",
    audioEs: "/audio/es/roller.mp3",
    audioEn: "/audio/en/roller.mp3",
    difficulty: 1,
  },
  {
    id: "brush",
    category: "tools",
    en: "Paint Brush",
    es: "Brocha",
    variants: [],
    photo: "/photos/brush.webp",
    audioEs: "/audio/es/brush.mp3",
    audioEn: "/audio/en/brush.mp3",
    difficulty: 1,
  },
  {
    id: "wall",
    category: "surfaces",
    en: "Wall",
    es: "Pared",
    variants: [{ term: "Muro", regions: ["MX"] }],
    photo: "/photos/wall.webp",
    audioEs: "/audio/es/wall.mp3",
    audioEn: "/audio/en/wall.mp3",
    difficulty: 1,
  },
];

describe("useSearch", () => {
  it("returns all terms with empty query", () => {
    const { result } = renderHook(() => useSearch(mockTerms));
    expect(result.current.filtered).toHaveLength(3);
  });

  it("filters by English name", () => {
    const { result } = renderHook(() => useSearch(mockTerms));
    act(() => result.current.setQuery("roller"));
    expect(result.current.filtered).toHaveLength(1);
    expect(result.current.filtered[0].id).toBe("roller");
  });

  it("filters by Spanish name", () => {
    const { result } = renderHook(() => useSearch(mockTerms));
    act(() => result.current.setQuery("brocha"));
    expect(result.current.filtered).toHaveLength(1);
    expect(result.current.filtered[0].id).toBe("brush");
  });

  it("filters by regional variant", () => {
    const { result } = renderHook(() => useSearch(mockTerms));
    act(() => result.current.setQuery("rolo"));
    expect(result.current.filtered).toHaveLength(1);
    expect(result.current.filtered[0].id).toBe("roller");
  });

  it("is case-insensitive", () => {
    const { result } = renderHook(() => useSearch(mockTerms));
    act(() => result.current.setQuery("PAINT"));
    expect(result.current.filtered).toHaveLength(2);
  });

  it("matches partial strings", () => {
    const { result } = renderHook(() => useSearch(mockTerms));
    act(() => result.current.setQuery("roll"));
    expect(result.current.filtered).toHaveLength(1);
  });

  it("filters by category", () => {
    const { result } = renderHook(() => useSearch(mockTerms));
    act(() => result.current.setCategory("surfaces"));
    expect(result.current.filtered).toHaveLength(1);
    expect(result.current.filtered[0].id).toBe("wall");
  });

  it("combines search query and category filter", () => {
    const { result } = renderHook(() => useSearch(mockTerms));
    act(() => {
      result.current.setQuery("paint");
      result.current.setCategory("tools");
    });
    expect(result.current.filtered).toHaveLength(2);
  });

  it("returns empty array when no matches", () => {
    const { result } = renderHook(() => useSearch(mockTerms));
    act(() => result.current.setQuery("zzzzz"));
    expect(result.current.filtered).toHaveLength(0);
  });

  it("resets to all when category set to null", () => {
    const { result } = renderHook(() => useSearch(mockTerms));
    act(() => result.current.setCategory("tools"));
    expect(result.current.filtered).toHaveLength(2);
    act(() => result.current.setCategory(null));
    expect(result.current.filtered).toHaveLength(3);
  });
});
