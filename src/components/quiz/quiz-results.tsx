"use client";

import { Trophy, RefreshCw, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { QuizQuestion } from "@/types/quiz";
import { AnswerState } from "@/components/unit-quizzer/unit-quizzer";

interface QuizResultsProps {
  total: number;
  correct: number;
  unitTitle: string;
  onRestart: () => void;
  answerStates: AnswerState[];
  quiz: QuizQuestion[];
  onReviewQuestion: (index: number) => void;
}

function ScoreRing({ correct, total }: { correct: number; total: number }) {
  const pct = correct / total;
  const r = 52;
  const circumference = 2 * Math.PI * r;
  const dash = circumference * pct;
  const gap = circumference - dash;

  return (
    <div className="relative w-36 h-36">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#2a2820" strokeWidth="8" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke={pct >= 0.8 ? "#10b981" : pct >= 0.6 ? "#f59e0b" : "#ef4444"}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${gap}`}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={cn(
            "text-3xl font-bold",
            pct >= 0.8 ? "text-emerald-400" : pct >= 0.6 ? "text-amber-400" : "text-red-400"
          )}
        >
          {correct}
        </span>
        <span className="text-stone-500 text-sm font-mono">/{total}</span>
      </div>
    </div>
  );
}

function getGradeLabel(pct: number) {
  if (pct >= 0.9) return { label: "ممتاز!", color: "text-emerald-400" };
  if (pct >= 0.8) return { label: "جيد جداً", color: "text-emerald-400" };
  if (pct >= 0.7) return { label: "جيد", color: "text-amber-400" };
  if (pct >= 0.6) return { label: "مقبول", color: "text-amber-400" };
  return { label: "يحتاج مراجعة", color: "text-red-400" };
}

export default function QuizResults({
  total,
  correct,
  unitTitle,
  onRestart,
  answerStates,
  quiz,
  onReviewQuestion,
}: QuizResultsProps) {
  const pct = correct / total;
  const grade = getGradeLabel(pct);
  const incorrect = answerStates.filter(
    (s, i) => s.revealed && s.selectedIndex !== null && !quiz[i].answerOptions[s.selectedIndex].isCorrect
  );
  const skipped = answerStates.filter((s) => !s.revealed).length;

  const decode = (str: string) =>
    str.replace(/&#39;/g, "'").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"');

  return (
    <div className="min-h-screen bg-[#0f0e0b] flex flex-col items-center px-4 py-12" dir="rtl">
      <div className="w-full max-w-2xl space-y-8">
        {/* Title */}
        <div className="text-center space-y-1">
          <p className="text-stone-500 font-arabic text-sm">{unitTitle}</p>
          <h1 className="text-2xl font-arabic text-white font-bold">نتائج الاختبار</h1>
        </div>

        {/* Score card */}
        <div className="bg-[#1a1813] border border-[#2e2c24] rounded-2xl p-8 flex flex-col items-center gap-5">
          <ScoreRing correct={correct} total={total} />

          <div className="text-center space-y-1">
            <p className={cn("text-xl font-arabic font-bold", grade.color)}>{grade.label}</p>
            <p className="text-stone-400 font-arabic text-sm">
              أجبت على {correct} من أصل {total} سؤال بشكل صحيح
            </p>
          </div>

          {/* Stats row */}
          <div className="flex gap-8 pt-2 border-t border-[#2e2c24] w-full justify-center">
            <div className="text-center">
              <p className="text-emerald-400 text-xl font-bold">{correct}</p>
              <p className="text-stone-500 text-xs font-arabic mt-0.5">صحيح</p>
            </div>
            <div className="text-center">
              <p className="text-red-400 text-xl font-bold">{total - correct - skipped}</p>
              <p className="text-stone-500 text-xs font-arabic mt-0.5">خطأ</p>
            </div>
            {skipped > 0 && (
              <div className="text-center">
                <p className="text-stone-400 text-xl font-bold">{skipped}</p>
                <p className="text-stone-500 text-xs font-arabic mt-0.5">لم يجب</p>
              </div>
            )}
            <div className="text-center">
              <p className="text-amber-400 text-xl font-bold">{Math.round(pct * 100)}%</p>
              <p className="text-stone-500 text-xs font-arabic mt-0.5">النسبة</p>
            </div>
          </div>
        </div>

        {/* Wrong answers review */}
        {incorrect.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-arabic text-stone-300 font-semibold text-sm px-1">
              الأسئلة التي تحتاج مراجعة ({incorrect.length})
            </h2>
            {answerStates.map((state, i) => {
              if (!state.revealed || state.selectedIndex === null) return null;
              if (quiz[i].answerOptions[state.selectedIndex].isCorrect) return null;
              const correctOption = quiz[i].answerOptions.find((o) => o.isCorrect)!;
              return (
                <div
                  key={i}
                  className="bg-[#1a1813] border border-red-900/30 rounded-xl p-4 space-y-3"
                >
                  <p className="font-arabic text-stone-200 text-sm leading-loose">
                    <span className="text-stone-500 ml-2 font-mono text-xs">{i + 1}.</span>
                    {decode(quiz[i].question)}
                  </p>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-400 text-xs mt-0.5 shrink-0">✓</span>
                    <p className="font-urdu text-emerald-300/80 text-sm leading-loose">
                      {decode(correctOption.text)}
                    </p>
                  </div>
                  <button
                    onClick={() => onReviewQuestion(i)}
                    className="flex items-center gap-1 text-xs font-arabic text-stone-500 hover:text-amber-400 transition-colors"
                  >
                    مراجعة السؤال
                    <ChevronLeft className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onRestart}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500 text-[#0f0e0b] font-arabic font-semibold hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
          >
            <RefreshCw className="w-4 h-4" />
            إعادة الاختبار
          </button>
        </div>
      </div>
    </div>
  );
}