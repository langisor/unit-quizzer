"use client";

import { Lightbulb, ChevronRight, ChevronLeft, CheckCircle2, XCircle, SkipForward } from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { QuizQuestion as QuizQuestionType } from "@/unit-quizzer/types/quiz.types";
import { AnswerState } from "@/unit-quizzer/components/unit-quizzer";

const OPTION_LABELS = ["أ", "ب", "ج", "د"];

interface QuizQuestionProps {
  question: QuizQuestionType;
  state: AnswerState;
  questionNumber: number;
  onSelect: (index: number) => void;
  onSkip: () => void;
  onToggleHint: () => void;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

const expandVariants: Variants = {
  hidden: { height: 0, opacity: 0, marginTop: 0 },
  visible: {
    height: "auto",
    opacity: 1,
    marginTop: 8,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

export default function QuizQuestionCard({
  question,
  state,
  questionNumber,
  onSelect,
  onSkip,
  onToggleHint,
  onNext,
  onPrev,
  isFirst,
  isLast,
}: QuizQuestionProps) {
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
    <div className="space-y-4 sm:space-y-6" dir="rtl">
      {/* Question card */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="bg-gradient-to-br from-[#1e1c17] to-[#161410] border border-[#3a3628] rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl shadow-black/20"
      >
        <p className="font-arabic text-white text-base sm:text-xl leading-relaxed">
          {decode(question.question)}
        </p>
      </motion.div>

      {/* Actions row: Hint + Skip */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {/* Hint button */}
        {question.hint && (
          <motion.button
            onClick={onToggleHint}
            className={cn(
              "flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl border transition-all duration-300",
              state.hintShown
                ? "bg-amber-500/15 border-amber-500/40 text-amber-400"
                : "bg-[#1a1813] border-[#2e2c24] text-stone-400 hover:text-amber-400 hover:border-amber-500/30"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Lightbulb className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="font-arabic">
              {state.hintShown ? "إخفاء" : "تلميح"}
            </span>
          </motion.button>
        )}

        {/* Skip button */}
        <motion.button
          onClick={onSkip}
          disabled={state.revealed}
          className={cn(
            "flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl border transition-all duration-300",
            state.revealed
              ? "bg-[#1a1813]/50 border-[#2e2c24]/50 text-stone-700 cursor-not-allowed"
              : "bg-[#1a1813] border-[#2e2c24] text-stone-400 hover:text-blue-400 hover:border-blue-500/30"
          )}
          whileHover={!state.revealed ? { scale: 1.02 } : {}}
          whileTap={!state.revealed ? { scale: 0.98 } : {}}
        >
          <SkipForward className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="font-arabic">تخطي</span>
        </motion.button>
      </div>

      {/* Hint content */}
      <AnimatePresence>
        {question.hint && state.hintShown && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 8 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-amber-500/10 border border-amber-500/25 rounded-lg sm:rounded-xl">
              <p className="font-arabic text-amber-300/90 text-xs sm:text-sm leading-relaxed">
                {decode(question.hint)}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Answer options */}
      <div className="space-y-2 sm:space-y-3">
        {question.answerOptions.map((option, index) => {
          const isSelected = state.selectedIndex === index;
          const isCorrect = option.isCorrect;
          const showResult = state.revealed;

          let cardBg = "bg-[#1a1813]";
          let cardBorder = "border-[#2e2c24]";
          let labelBg = "bg-[#2a2820]";
          let labelText = "text-stone-400";
          let textColor = "text-stone-200";
          let rationaleColor = "text-stone-500/70";

          if (showResult) {
            if (isCorrect) {
              cardBg = "bg-emerald-950/40";
              cardBorder = "border-emerald-500/50";
              labelBg = "bg-emerald-500/20";
              labelText = "text-emerald-400";
              textColor = "text-emerald-100";
              rationaleColor = "text-emerald-300/90";
            } else if (isSelected && !isCorrect) {
              cardBg = "bg-red-950/40";
              cardBorder = "border-red-500/50";
              labelBg = "bg-red-500/20";
              labelText = "text-red-400";
              textColor = "text-red-100";
              rationaleColor = "text-red-300/90";
            } else {
              cardBg = "bg-[#1a1813]/60";
              cardBorder = "border-[#2e2c24]/50";
              labelBg = "bg-[#2a2820]/50";
              labelText = "text-stone-600";
              textColor = "text-stone-500";
              rationaleColor = "text-stone-600";
            }
          }

          return (
            <motion.button
              key={index}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              onClick={() => onSelect(index)}
              disabled={showResult}
              className={cn(
                "w-full text-right flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-300",
                cardBg,
                cardBorder,
                !showResult && "hover:border-amber-500/40 hover:bg-[#201e18] cursor-pointer",
                !showResult && !isSelected && "hover:scale-[1.01]",
                showResult && "scale-[1.01]"
              )}
              whileHover={!showResult ? { scale: 1.01, y: -2 } : {}}
              whileTap={!showResult ? { scale: 0.99 } : {}}
            >
              {/* Label badge */}
              <motion.span
                className={cn(
                  "shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold mt-0.5 transition-colors",
                  labelBg,
                  labelText
                )}
                animate={showResult && (isCorrect || isSelected) ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                {OPTION_LABELS[index]}
              </motion.span>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className={cn("font-arabic leading-relaxed text-sm sm:text-base sm:text-lg", textColor)}>
                  {decode(option.text)}
                </p>

                {/* Rationale - animated expansion */}
                <AnimatePresence>
                  {showResult && (
                    <motion.div
                      variants={expandVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="overflow-hidden"
                    >
                      <div className="mt-2 sm:mt-3 flex items-start gap-1.5 sm:gap-2">
                        {isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 shrink-0 mt-0.5" />
                        )}
                        <p className={cn("font-arabic text-xs sm:text-sm leading-relaxed", rationaleColor)}>
                          {decode(option.rationale)}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Status icon */}
              <AnimatePresence>
                {showResult && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
                    ) : (
                      <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      {/* Feedback banner */}
      <AnimatePresence>
        {state.revealed && selectedOption && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-5 py-3 sm:py-4 rounded-lg sm:rounded-xl border-2 text-sm sm:text-base font-arabic font-medium",
              selectedOption.isCorrect
                ? "bg-emerald-950/50 border-emerald-500/40 text-emerald-300"
                : "bg-red-950/50 border-red-500/40 text-red-300"
            )}
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 500 }}
              className="text-xl sm:text-2xl"
            >
              {selectedOption.isCorrect ? "✓" : "✗"}
            </motion.span>
            <span className="hidden xs:inline">{selectedOption.isCorrect ? "إجابة صحيحة! أحسنت" : "ليست الإجابة الصحيحة"}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <motion.div
        className="flex items-center justify-between pt-2 sm:pt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <motion.button
          onClick={onPrev}
          disabled={isFirst}
          className={cn(
            "flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border text-xs sm:text-sm font-arabic transition-all duration-200",
            isFirst
              ? "border-[#2a2820] text-stone-700 cursor-not-allowed"
              : "border-[#2e2c24] text-stone-400 hover:text-white hover:border-[#3e3c32] hover:bg-[#201e18]"
          )}
          whileHover={!isFirst ? { scale: 1.05, x: 4 } : {}}
          whileTap={!isFirst ? { scale: 0.95 } : {}}
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">السابق</span>
        </motion.button>

        <motion.button
          onClick={onNext}
          disabled={!state.revealed}
          className={cn(
            "flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-arabic font-semibold transition-all duration-300",
            state.revealed
              ? "bg-gradient-to-r from-amber-500 to-amber-400 text-[#0f0e0b] shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:from-amber-400 hover:to-amber-300"
              : "bg-[#1a1813] border border-[#2e2c24] text-stone-600 cursor-not-allowed"
          )}
          whileHover={state.revealed ? { scale: 1.05 } : {}}
          whileTap={state.revealed ? { scale: 0.95 } : {}}
        >
          {isLast ? "النتائج" : "التالي"}
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.button>
      </motion.div>
    </div>
  );
}
