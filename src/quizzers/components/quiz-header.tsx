"use client";

import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizHeaderProps {
  currentIndex: number;
  total: number;
  unitTitle: string;
  correctSoFar: number;
  answeredSoFar: number;
}

export default function QuizHeader({
  currentIndex,
  total,
  unitTitle,
  correctSoFar,
  answeredSoFar,
}: QuizHeaderProps) {
  const progress = (currentIndex / total) * 100;
  const accuracy = answeredSoFar > 0 ? Math.round((correctSoFar / answeredSoFar) * 100) : null;

  return (
    <header className="sticky top-0 z-50 bg-[#0f0e0b]/95 backdrop-blur-md border-b border-[#2a2820]">
      <div className="max-w-2xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md sm:rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            </div>
            <span className="text-amber-400 font-arabic text-xs sm:text-sm font-semibold truncate">{unitTitle}</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {accuracy !== null && (
              <span className="hidden xs:inline text-xs text-stone-400 font-arabic">
                الدقة:{" "}
                <span
                  className={cn(
                    "font-bold",
                    accuracy >= 80 ? "text-emerald-400" : accuracy >= 60 ? "text-amber-400" : "text-red-400"
                  )}
                >
                  {accuracy}%
                </span>
              </span>
            )}
            <span className="text-stone-300 text-xs sm:text-sm font-mono tabular-nums">
              <span className="text-stone-200 font-semibold">{currentIndex + 1}</span>
              <span className="text-stone-600 mx-0.5">/</span>
              <span className="text-stone-500">{total}</span>
            </span>
          </div>
        </div>

        <div className="h-1 bg-[#2a2820] rounded-full overflow-hidden mt-2.5">
          <div
            className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </header>
  );
}
