import type { Category } from "../lib/types";

interface Props {
  selected: Category | null;
  onSelect: (category: Category | null) => void;
}

const categories: { id: Category | null; label: string }[] = [
  { id: null, label: "All" },
  { id: "tools", label: "Tools" },
  { id: "materials", label: "Materials" },
  { id: "surfaces", label: "Surfaces" },
  { id: "actions", label: "Actions" },
];

export function CategoryChips({ selected, onSelect }: Props) {
  return (
    <div className="flex gap-3 overflow-x-auto py-1">
      {categories.map((cat) => (
        <button
          key={cat.label}
          onClick={() => onSelect(cat.id)}
          className={`px-5 min-h-[48px] rounded-full text-base font-bold whitespace-nowrap border-2 ${
            selected === cat.id
              ? "bg-[#D97706] text-white border-[#D97706]"
              : "bg-[#F5F3F0] text-[#1C1917] border-[#E7E5E4]"
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
