import type { Tab } from "../lib/types";

interface Props {
  active: Tab;
  onSelect: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: "browse", label: "Browse", icon: "📖" },
  { id: "learn", label: "Learn", icon: "🧠" },
  { id: "progress", label: "Progress", icon: "📊" },
];

export function BottomNav({ active, onSelect }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#E7E5E4] flex justify-around items-center z-10 pb-[env(safe-area-inset-bottom)] h-20">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onSelect(tab.id)}
          className={`flex flex-col items-center justify-center w-24 min-h-[72px] rounded-lg ${
            active === tab.id
              ? "text-[#D97706] bg-[#FEF3C7]"
              : "text-[#78716C]"
          }`}
        >
          <span className="text-2xl">{tab.icon}</span>
          <span className="text-sm font-bold mt-1">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
