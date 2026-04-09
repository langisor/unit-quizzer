"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
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

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function shuffleQuiz(questions: QuizQuestion[]): QuizQuestion[] {
  return shuffleArray(questions).map((q) => ({
    ...q,
    answerOptions: shuffleArray(q.answerOptions),
  }));
}

export default function UnitQuizzer({
  quiz,
  unitTitle = "اختبار الوحدة",
}: UnitQuizzerProps) {
  const shuffledQuiz = useMemo(() => shuffleQuiz(quiz), [quiz]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerStates, setAnswerStates] = useState<AnswerState[]>(
    shuffledQuiz.map(() => ({
      selectedIndex: null,
      revealed: false,
      hintShown: false,
    })),
  );
  const [finished, setFinished] = useState(false);

  const current = shuffledQuiz[currentIndex];
  const currentState = answerStates[currentIndex];

  const totalAnswered = answerStates.filter((s) => s.revealed).length;
  const totalCorrect = answerStates.filter(
    (s, i) =>
      s.revealed &&
      s.selectedIndex !== null &&
      shuffledQuiz[i].answerOptions[s.selectedIndex].isCorrect,
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

  const handleSkip = useCallback(() => {
    if (currentState.revealed) return;
    const correctIndex = current.answerOptions.findIndex((opt) => opt.isCorrect);
    setAnswerStates((prev) =>
      prev.map((s, i) =>
        i === currentIndex
          ? { ...s, selectedIndex: correctIndex, revealed: true }
          : s,
      ),
    );
    setTimeout(() => {
      if (currentIndex < shuffledQuiz.length - 1) {
        setCurrentIndex((i) => i + 1);
      } else {
        setFinished(true);
      }
    }, 500);
  }, [currentIndex, currentState.revealed, current, shuffledQuiz.length]);

  const handleToggleHint = useCallback(() => {
    setAnswerStates((prev) =>
      prev.map((s, i) =>
        i === currentIndex ? { ...s, hintShown: !s.hintShown } : s,
      ),
    );
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < shuffledQuiz.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setFinished(true);
    }
  }, [currentIndex, shuffledQuiz.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  }, [currentIndex]);

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setAnswerStates(
      shuffledQuiz.map(() => ({
        selectedIndex: null,
        revealed: false,
        hintShown: false,
      })),
    );
    setFinished(false);
  }, [shuffledQuiz]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && currentState.revealed && !finished) {
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentState.revealed, handleNext, finished]);

  if (finished) {
    return (
      <QuizResults
        total={shuffledQuiz.length}
        correct={totalCorrect}
        onRestart={handleRestart}
        unitTitle={unitTitle}
        answerStates={answerStates}
        quiz={shuffledQuiz}
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
        total={shuffledQuiz.length}
        unitTitle={unitTitle}
        correctSoFar={totalCorrect}
        answeredSoFar={totalAnswered}
      />

      <div className="flex-1 flex items-start justify-center px-3 sm:px-4 py-4 sm:py-8">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="bg-gradient-to-b from-[#1e1c17] to-[#141210] border border-[#2e2c24] rounded-2xl p-4 sm:p-6 shadow-2xl shadow-black/30">
                <QuizQuestionCard
                  question={current}
                  state={currentState}
                  questionNumber={currentIndex + 1}
                  onSelect={handleSelect}
                  onSkip={handleSkip}
                  onToggleHint={handleToggleHint}
                  onNext={handleNext}
                  onPrev={handlePrev}
                  isFirst={currentIndex === 0}
                  isLast={currentIndex === shuffledQuiz.length - 1}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
