import { useState } from "react";
import type { Tab, Term } from "./lib/types";
import termsData from "./data/terms.json";
import { useProgress } from "./hooks/useProgress";
import { BottomNav } from "./components/BottomNav";
import { BrowseScreen } from "./screens/BrowseScreen";
import { LearnScreen } from "./screens/LearnScreen";
import { ProgressScreen } from "./screens/ProgressScreen";

const terms = termsData.terms as Term[];

export function App() {
  const [activeTab, setActiveTab] = useState<Tab>("browse");
  const {
    progress,
    updateCardProgress,
    learnedCount,
    direction,
    toggleDirection,
    loaded,
  } = useProgress();

  return (
    <div className="max-w-[480px] mx-auto px-4 pt-5 pb-28 min-h-screen bg-white font-['DM_Sans']">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-[#D97706]">The Painting Deck</h1>
      </header>

      {activeTab === "browse" && (
        <BrowseScreen
          terms={terms}
          direction={direction}
          onToggleDirection={toggleDirection}
        />
      )}

      {activeTab === "learn" && (
        <LearnScreen
          terms={terms}
          progress={progress}
          updateCardProgress={updateCardProgress}
          direction={direction}
          onToggleDirection={toggleDirection}
          loaded={loaded}
        />
      )}

      {activeTab === "progress" && (
        <ProgressScreen
          terms={terms}
          progress={progress}
          learnedCount={learnedCount()}
        />
      )}

      <BottomNav active={activeTab} onSelect={setActiveTab} />
    </div>
  );
}

export default App;
