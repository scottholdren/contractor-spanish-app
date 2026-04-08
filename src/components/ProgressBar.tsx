interface Props {
  learned: number;
  total: number;
}

export function ProgressBar({ learned, total }: Props) {
  const pct = total > 0 ? Math.round((learned / total) * 100) : 0;

  return (
    <div className="bg-[#F5F3F0] rounded-2xl p-6 border-2 border-[#E7E5E4]">
      <div className="flex justify-between items-baseline mb-3">
        <span className="text-4xl font-bold text-[#1C1917]">
          {learned} <span className="text-xl font-bold text-[#78716C]">of {total}</span>
        </span>
        <span className="text-xl font-bold text-[#D97706]">{pct}%</span>
      </div>
      <div className="h-4 bg-[#E7E5E4] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#D97706] rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
