import type { Term, Direction } from "../lib/types";
import { SearchBar } from "../components/SearchBar";
import { CategoryChips } from "../components/CategoryChips";
import { TermListItem } from "../components/TermListItem";
import { DirectionToggle } from "../components/DirectionToggle";
import { useSearch } from "../hooks/useSearch";

interface Props {
  terms: Term[];
  direction: Direction;
  onToggleDirection: () => void;
}

export function BrowseScreen({ terms, direction, onToggleDirection }: Props) {
  const { query, setQuery, category, setCategory, filtered } = useSearch(terms);

  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-center">
        <div className="flex-1">
          <SearchBar value={query} onChange={setQuery} />
        </div>
        <DirectionToggle direction={direction} onToggle={onToggleDirection} />
      </div>
      <CategoryChips selected={category} onSelect={setCategory} />
      <div>
        {filtered.length === 0 ? (
          <p className="text-center text-sm text-[#A8A29E] py-8">No terms found</p>
        ) : (
          filtered.map((term) => (
            <TermListItem key={term.id} term={term} direction={direction} />
          ))
        )}
      </div>
    </div>
  );
}
