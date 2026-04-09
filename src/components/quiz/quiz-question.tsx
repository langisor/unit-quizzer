"use client";

import { Lightbulb, ChevronRight, ChevronLeft, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { QuizQuestion as QuizQuestionType } from "@/types/quiz";
import { AnswerState } from "@/components/unit-quizzer/unit-quizzer";

const OPTION_LABELS = ["أ", "ب", "ج", "د"];

interface QuizQuestionProps {
  question: QuizQuestionType;
  state: AnswerState;
  questionNumber: number;
  onSelect: (index: number) => void;
  onToggleHint: () => void;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export default function QuizQuestionCard({
  question,
  state,
  questionNumber,
  onSelect,
  onToggleHint,
  onNext,
  onPrev,
  isFirst,
  isLast,
}: QuizQuestionProps) {
  // Decode HTML entities
  const decode = (str: string) =>
    str
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"');

  const selectedOption =
    state.selectedIndex !== null ? question.answerOptions[state.selectedIndex] : null;

  return (
    <div className="space-y-5" dir="rtl">
      {/* Question card */}
      <div className=" border border-[#2e2c24] rounded-2xl p-6 shadow-xl">
        <p className="font-arabic text-white text-lg leading-loose">
          {decode(question.question)}
        </p>
      </div>

      {/* Hint */}
      {question.hint && (
        <div>
          <button
            onClick={onToggleHint}
            className={cn(
              "flex items-center gap-2 text-sm px-3 py-1.5 rounded-xl border transition-all duration-200",
              state.hintShown
                ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                : "bg-[#1a1813] border-[#2e2c24] text-stone-500 hover:text-amber-400 hover:border-amber-500/20"
            )}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span className="font-arabic">{state.hintShown ? "إخفاء التلميح" : "تلميح"}</span>
          </button>

          {state.hintShown && (
            <div className="mt-2 px-4 py-3 bg-amber-500/5 border border-amber-500/20 rounded-xl">
              <p className="font-arabic text-amber-300/90 text-sm leading-loose">
                {decode(question.hint!)}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Answer options */}
      <div className="space-y-3">
        {question.answerOptions.map((option, index) => {
          const isSelected = state.selectedIndex === index;
          const isCorrect = option.isCorrect;
          const showResult = state.revealed;

          let cardStyle = "border-[#2e2c24] hover:border-[#3e3c32] hover:bg-[#afafef]";

          if (showResult) {
            if (isCorrect) {
              cardStyle = "border-emerald-600/40";
            } else if (isSelected && !isCorrect) {
              cardStyle = "bg-red-900/20 border-red-600/40";
            } else {
              cardStyle = "border-[#2e2c24] opacity-50";
            }
          }

          return (
            <button
              key={index}
              onClick={() => onSelect(index)}
              disabled={showResult}
              className={cn(
                "w-full text-right flex items-start gap-3 p-4 rounded-xl border transition-all duration-200",
                cardStyle,
                !showResult && "cursor-pointer active:scale-[0.99]"
              )}
            >
              {/* Label badge */}
              <span
                className={cn(
                  "shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold mt-0.5 transition-colors",
                  showResult && isCorrect
                    ? "bg-emerald-200/20 text-emerald-400"
                    : showResult && isSelected && !isCorrect
                    ? "bg-red-500/20 text-red-400"
                    : "bg-[#2a2820] text-stone-400"
                )}
              >
                {OPTION_LABELS[index]}
              </span>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="font-arabic leading-loose text-blue-900 text-bold text-lg">
                  {decode(option.text)}
                </p>

                {/* Rationale - shown after reveal */}
                {showResult && (isCorrect || isSelected) && (
                  <div className="mt-2 flex items-start gap-1.5">
                    {isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    )}
                    <p
                      className={cn(
                        "font-arabic text-sm leading-loose",
                        isCorrect ? "text-emerald-300/80" : "text-red-300/80"
                      )}
                    >
                      {decode(option.rationale)}
                    </p>
                  </div>
                )}
              </div>

              {/* Correct answer icon */}
              {showResult && isCorrect && (
                <CheckCircle2 className="shrink-0 w-5 h-5 text-emerald-400 mt-0.5" />
              )}
              {showResult && isSelected && !isCorrect && (
                <XCircle className="shrink-0 w-5 h-5 text-red-400 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback banner */}
      {state.revealed && selectedOption && (
        <div
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-arabic",
            selectedOption.isCorrect
              ? "bg-emerald-900/20 border-emerald-600/30 text-emerald-300"
              : "bg-red-900/20 border-red-600/30 text-red-300"
          )}
        >
          {selectedOption.isCorrect ? (
            <>
              <span className="text-xl">✓</span>
              <span>إجابة صحيحة!</span>
            </>
          ) : (
            <>
              <span className="text-xl">✗</span>
              <span>ليست الإجابة الصحيحة</span>
            </>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onPrev}
          disabled={isFirst}
          className={cn(
            "flex items-center gap-1.5 px-4 py-2 rounded-xl border text-sm font-arabic transition-all",
            isFirst
              ? "border-[#2a2820] text-stone-700 cursor-not-allowed"
              : "border-[#2e2c24] text-stone-400 hover:text-stone-200 hover:border-[#3e3c32] hover:bg-[#1a1813]"
          )}
        >
          <ChevronRight className="w-4 h-4" />
          السابق
        </button>

        <button
          onClick={onNext}
          disabled={!state.revealed}
          className={cn(
            "flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-arabic font-semibold transition-all duration-200",
            state.revealed
              ? isLast
                ? "bg-amber-500 text-[#0f0e0b] hover:bg-amber-400 shadow-lg shadow-amber-500/20"
                : "bg-amber-500 text-[#0f0e0b] hover:bg-amber-400 shadow-lg shadow-amber-500/20"
              : "bg-[#1a1813] border border-[#2e2c24] text-stone-600 cursor-not-allowed"
          )}
        >
          {isLast ? "عرض النتائج" : "التالي"}
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}