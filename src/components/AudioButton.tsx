import { useRef, useCallback } from "react";

interface Props {
  src: string;
  size?: "sm" | "md";
}

export function AudioButton({ src, size = "md" }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(src);
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  }, [src]);

  const sizeClass = size === "sm" ? "w-12 h-12 text-lg" : "w-14 h-14 text-2xl";

  return (
    <button
      onClick={play}
      className={`${sizeClass} rounded-full bg-[#D97706] text-white flex items-center justify-center shrink-0 active:bg-[#B45309]`}
      aria-label="Play pronunciation"
    >
      🔊
    </button>
  );
}
