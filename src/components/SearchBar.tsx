interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: Props) {
  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#78716C] text-xl">🔍</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search tools, materials..."
        className="w-full h-14 pl-12 pr-12 bg-[#F5F3F0] rounded-xl border-2 border-[#E7E5E4] text-[#1C1917] placeholder-[#A8A29E] text-lg font-medium font-['DM_Sans'] focus:outline-none focus:border-[#D97706]"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#E7E5E4] flex items-center justify-center text-[#78716C] text-sm font-bold active:bg-[#D6D3D1]"
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
}
