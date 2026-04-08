import { describe, it, expect } from "vitest";
import termsData from "../src/data/terms.json";
import type { Category } from "../src/lib/types";

const validCategories: Category[] = ["tools", "materials", "surfaces", "actions"];

describe("terms.json", () => {
  it("has at least 50 terms", () => {
    expect(termsData.terms.length).toBeGreaterThanOrEqual(50);
  });

  it("has unique IDs", () => {
    const ids = termsData.terms.map((t) => t.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it("has valid categories for every term", () => {
    for (const term of termsData.terms) {
      expect(validCategories).toContain(term.category);
    }
  });

  it("has non-empty English and Spanish for every term", () => {
    for (const term of termsData.terms) {
      expect(term.en.length).toBeGreaterThan(0);
      expect(term.es.length).toBeGreaterThan(0);
    }
  });

  it("has valid difficulty (1-3) for every term", () => {
    for (const term of termsData.terms) {
      expect(term.difficulty).toBeGreaterThanOrEqual(1);
      expect(term.difficulty).toBeLessThanOrEqual(3);
    }
  });

  it("has photo, audioEs, and audioEn paths for every term", () => {
    for (const term of termsData.terms) {
      expect(term.photo).toMatch(/^\/photos\/.+\.webp$/);
      expect(term.audioEs).toMatch(/^\/audio\/es\/.+\.mp3$/);
      expect(term.audioEn).toMatch(/^\/audio\/en\/.+\.mp3$/);
    }
  });

  it("has valid variants structure", () => {
    for (const term of termsData.terms) {
      expect(Array.isArray(term.variants)).toBe(true);
      for (const v of term.variants) {
        expect(v.term.length).toBeGreaterThan(0);
        expect(Array.isArray(v.regions)).toBe(true);
        expect(v.regions.length).toBeGreaterThan(0);
      }
    }
  });

  it("has a kebab-case ID for every term", () => {
    for (const term of termsData.terms) {
      expect(term.id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});
