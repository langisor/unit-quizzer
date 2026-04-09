"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { QuizQuestion } from "@/types/quiz";
import QuizHeader from "@/components/quiz/quiz-header";
import QuizQuestionCard from "@/components/quiz/quiz-question";
import QuizResults from "@/components/quiz/quiz-results";

interface UnitQuizzerProps {
  quiz: QuizQuestion[];
  unitTitle?: string;
}

export type AnswerState = {
  selectedIndex: number | null;
  revealed: boolean;
  hintShown: boolean;
};

export default function UnitQuizzer({
  quiz,
  unitTitle = "اختبار الوحدة",
}: UnitQuizzerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerStates, setAnswerStates] = useState<AnswerState[]>(
    quiz.map(() => ({
      selectedIndex: null,
      revealed: false,
      hintShown: false,
    })),
  );
  const [finished, setFinished] = useState(false);

  const current = quiz[currentIndex];
  const currentState = answerStates[currentIndex];

  const totalAnswered = answerStates.filter((s) => s.revealed).length;
  const totalCorrect = answerStates.filter(
    (s, i) =>
      s.revealed &&
      s.selectedIndex !== null &&
      quiz[i].answerOptions[s.selectedIndex].isCorrect,
  ).length;

  const handleSelect = useCallback(
    (optionIndex: number) => {
      if (currentState.revealed) return;
      setAnswerStates((prev) =>
        prev.map((s, i) =>
          i === currentIndex
            ? { ...s, selectedIndex: optionIndex, revealed: true }
            : s,
        ),
      );
    },
    [currentIndex, currentState.revealed],
  );

  const handleToggleHint = useCallback(() => {
    setAnswerStates((prev) =>
      prev.map((s, i) =>
        i === currentIndex ? { ...s, hintShown: !s.hintShown } : s,
      ),
    );
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < quiz.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setFinished(true);
    }
  }, [currentIndex, quiz.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  }, [currentIndex]);

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setAnswerStates(
      quiz.map(() => ({
        selectedIndex: null,
        revealed: false,
        hintShown: false,
      })),
    );
    setFinished(false);
  }, [quiz]);

  if (finished) {
    return (
      <QuizResults
        total={quiz.length}
        correct={totalCorrect}
        onRestart={handleRestart}
        unitTitle={unitTitle}
        answerStates={answerStates}
        quiz={quiz}
        onReviewQuestion={(i) => {
          setCurrentIndex(i);
          setFinished(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0e0b] flex flex-col">
      <QuizHeader
        currentIndex={currentIndex}
        total={quiz.length}
        unitTitle={unitTitle}
        correctSoFar={totalCorrect}
        answeredSoFar={totalAnswered}
      />

      <div className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="bg-linear-to-b from-[#1e1c17] to-[#141210] border border-[#2e2c24] rounded-2xl p-6 shadow-2xl shadow-black/30">
                <QuizQuestionCard
                  question={current}
                  state={currentState}
                  questionNumber={currentIndex + 1}
                  onSelect={handleSelect}
                  onToggleHint={handleToggleHint}
                  onNext={handleNext}
                  onPrev={handlePrev}
                  isFirst={currentIndex === 0}
                  isLast={currentIndex === quiz.length - 1}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
