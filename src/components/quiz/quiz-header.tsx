"use client";

import { BookOpen } from "lucide-react";

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
  const progress = ((currentIndex) / total) * 100;
  const accuracy = answeredSoFar > 0 ? Math.round((correctSoFar / answeredSoFar) * 100) : null;

  return (
    <header className="sticky top-0 z-50 bg-[#0f0e0b]/95 backdrop-blur border-b border-[#2a2820]">
      <div className="max-w-2xl mx-auto px-4 py-3">
        {/* Top row */}
        <div className="flex items-center justify-between mb-3" dir="rtl">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-amber-400 font-arabic text-sm font-semibold">{unitTitle}</span>
          </div>

          <div className="flex items-center gap-3">
            {accuracy !== null && (
              <span className="text-xs text-stone-400 font-arabic">
                الدقة:{" "}
                <span
                  className={`font-bold ${
                    accuracy >= 80
                      ? "text-emerald-400"
                      : accuracy >= 60
                      ? "text-amber-400"
                      : "text-red-400"
                  }`}
                >
                  {accuracy}%
                </span>
              </span>
            )}
            <span className="text-stone-300 text-sm font-mono tabular-nums">
              {currentIndex + 1}
              <span className="text-stone-600 mx-0.5">/</span>
              <span className="text-stone-500">{total}</span>
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-[#2a2820] rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </header>
  );
}