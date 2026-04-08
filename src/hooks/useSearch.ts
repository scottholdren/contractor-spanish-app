import { useState, useMemo } from "react";
import type { Term, Category } from "../lib/types";

export function useSearch(terms: Term[]) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();

    return terms.filter((term) => {
      if (category && term.category !== category) return false;

      if (!q) return true;

      if (term.en.toLowerCase().includes(q)) return true;
      if (term.es.toLowerCase().includes(q)) return true;
      for (const v of term.variants) {
        if (v.term.toLowerCase().includes(q)) return true;
      }
      return false;
    });
  }, [terms, query, category]);

  return { query, setQuery, category, setCategory, filtered };
}
